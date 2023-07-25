import React, { useState } from "react";
import { Popover } from "antd";
import {
  getAccount,
  getNetwork,
  getProvider,
  waitForTransaction,
} from "@wagmi/core";
import { Input, Button, message } from "antd";
import banner from "../../assets/dashboardbanner.svg";
import Vote from "../../assets/vote.svg";
import copyIcon from "../../assets/copyIcon.svg";
import uftIcon from "../../assets/uft.svg";
import infoIcon from "../../assets/info.svg";
import "./styles/index.scss";
import { shortenAddress } from "../../utils";
import { contractAddress } from "../../core/contractData/contracts";
import { useEffect } from "react";
import { ethers } from "ethers";
import { erc20Abi, uftgABI } from "../../core/contractData/abi";
import { decimal2Fixed, div, fromBigNumber } from "../../helpers/contracts";
import {
  checkAllowance,
  handleUnWrap,
  handleUpdateDelegate,
  handleWrapAndDelegate,
  setApproval,
} from "../../services/governance";
import { fetchUserAddressByDomain, fetchUserDomain } from "../../utils/axios";

const wrap = "wrap";
const unWrap = "unWrap";
const update = "update";

export default function VoteComponent() {
  const { address } = getAccount();
  const { chain } = getNetwork();
  const [userAddress, setUserAddress] = useState(address);
  const [tokenBalance, setTokenBalance] = useState({ uft: "", uftg: "" });
  const [activeTab, setActiveTab] = useState(wrap);
  const [allowanceValue, setAllowanceValue] = useState("");
  const [delegate, setDelegate] = useState("0x000000000000000");
  const [votingPower, setVotingPower] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkTxnStatus = (hash, data) => {
    waitForTransaction({
      hash,
    }).then((receipt) => {
      if (receipt.status == 1) {
        if (data?.fn == "approve") {
          setTimeout(() => {
            handleAllowance();
            message.success(`${data.message}`);
            setIsLoading(false);
          }, 6000);
        } else {
          setTimeout(() => {
            handleAllowance();
            message.success(`${data.message}`);
            setIsLoading(false);
          }, 2000);
        }
      } else {
        alert("Error Checked");
      }
    });
  };

  const checkTxnError = (error) => {
    setIsLoading(false);
    console.log("Error", { error });
    const errorText = String(error.reason);
    message.error(error?.message ? errorText : "Error: Transaction Error");
  };

  //
  const getTokenBal = async () => {
    const contractsAdd = contractAddress[chain?.id || "1"];
    const provider = getProvider();
    const UFT = new ethers.Contract(contractsAdd?.uftToken, erc20Abi, provider);
    const UFTG = new ethers.Contract(
      contractsAdd?.uftgToken,
      uftgABI,
      provider
    );
    const delegatesAddress = await UFTG.delegates(address);
    const isValid = ethers.utils.isAddress(delegatesAddress);

    delegatesAddress != 0 && isValid && setDelegate(delegatesAddress);
    const uftBalance_BigNumber = await UFT.balanceOf(address);
    const uftgBalance_BigNumber = await UFTG.balanceOf(address);
    const uftgVotes_BigNumber = await UFTG.getCurrentVotes(address);
    const uftBalance = fromBigNumber(uftBalance_BigNumber) / 10 ** 18;
    const uftgBalance = fromBigNumber(uftgBalance_BigNumber) / 10 ** 18;
    const uftgVotes = fromBigNumber(uftgVotes_BigNumber) / 10 ** 18;
    setVotingPower(uftgVotes);
    setTokenBalance({ uft: uftBalance, uftg: uftgBalance });
  };

  const handleAllowance = async () => {
    const contractsAdd = contractAddress[chain?.id || "1"];
    getTokenBal();
    const { allowance } = await checkAllowance(
      contractsAdd?.uftToken,
      erc20Abi,
      address,
      contractsAdd?.uftgToken
    );
    const valueFromBigNumber = fromBigNumber(allowance);

    setAllowanceValue(valueFromBigNumber);
  };

  const BalancePopover = () => {
    return (
      <div className="balance_popover_container">
        <div className="balance_popover_item">
          <img src={uftIcon} alt="uftLogo" />
          <p>
            <span className="uft_span">UFT:</span>{" "}
            <span>{Number(tokenBalance.uft).toFixed(2)}</span>{" "}
          </p>
        </div>
        <div className="balance_popover_item">
          <img src={uftIcon} alt="uftLogo" />
          <p>
            <span className="uftg_span">UFTG:</span>{" "}
            <span>{Number(tokenBalance.uftg).toFixed(2)}</span>{" "}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (address) {
      setDelegate(address);
      // getTokenBal();
      handleAllowance();
    }
  }, [address]);

  return (
    <div className="vote_container">
      <div className="vote_banner">
        <img src={banner} alt="banner" />
      </div>

      <div className="vote_content">
        {/* User Info */}
        <div className="user_info">
          <div>
            <h2>{Number(tokenBalance.uft + tokenBalance.uftg).toFixed(2)}</h2>
            <Popover
              content={<BalancePopover />}
              overlayClassName="total_balance_popover"
              open={true}
              placement="bottomRight"
              // placement="rightBottom"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 0,
                  height: "18px",
                  alignItems: "flex-start",
                }}
              >
                <p>Total Balance</p>
                <img src={infoIcon} alt="info" />
              </div>
            </Popover>
            {/* <span>(UFT + UFTG Balance)</span> */}
          </div>
          <div>
            <h2>{Number(votingPower).toFixed(2)}</h2>
            <p>Voting Power</p>
            {/* <span>(UFTG Balance)</span> */}
          </div>
          <div>
            <h2>{shortenAddress(String(delegate))}</h2>
            <p>Delegation address</p>
          </div>
        </div>
        {/* Operation Section */}
        <div className="operation">
          <div className="tabs">
            <div
              onClick={() => setActiveTab(wrap)}
              className={` ${activeTab === wrap ? "active_tab" : ""}`}
            >
              <span>Wrap & Delegate</span>
            </div>
            <div
              onClick={() => setActiveTab(unWrap)}
              className={` ${activeTab === unWrap ? "active_tab" : ""}`}
            >
              <span>Unwrap</span>
            </div>
            <div
              onClick={() => setActiveTab(update)}
              className={` ${activeTab === update ? "active_tab" : ""}`}
            >
              <span>Update delegation</span>
            </div>
          </div>

          {activeTab === wrap && (
            <WrapAndDelegate
              checkTxnStatus={checkTxnStatus}
              userAddress={delegate}
              tokenBalance={tokenBalance}
              allowanceValue={allowanceValue}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              checkTxnError={checkTxnError}
            />
          )}
          {activeTab === unWrap && (
            <UnWrap
              checkTxnStatus={checkTxnStatus}
              tokenBalance={tokenBalance}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              checkTxnError={checkTxnError}
            />
          )}
          {activeTab === update && (
            <UpdateDelegation
              checkTxnStatus={checkTxnStatus}
              tokenBalance={tokenBalance}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              checkTxnError={checkTxnError}
            />
          )}
        </div>
        <div className="vote_info">
          <div>
            <img src={Vote} alt="vote info" />
          </div>
          <div>
            <h2>Participate In Governance</h2>
            <p>
              You can either vote on each proposal yourself or delegate your
              votes to a third party. You can either vote on each proposal
              yourself or delegate your votes to a third party.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const WrapAndDelegate = ({
  checkTxnStatus,
  userAddress,
  tokenBalance,
  allowanceValue,
  isLoading,
  setIsLoading,
  checkTxnError,
}) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(userAddress);
  const [valid, setValid] = useState(true);
  const [domainDetail, setDomainDetail] = useState({
    value: "",
    isAddress: false,
  });
  const [debounceDomainInput, setDebounceDomainInput] = useState("");
  const key =
    "https://eth-mainnet.g.alchemy.com/v2/rKxeroDp_Tas9KMG_wFBveulFr14py7W";
  // "https://sepolia.infura.io/v3/0d48b35e22a0494d93e130aa133e9735";
  // "https://polygon-mumbai.g.alchemy.com/v2/NWRaRuKnQbi8M2HMuf44rZS8Tro6FIH8";

  // "https://eth-sepolia.g.alchemy.com/v2/VZuKJ8r8DNkp7-YEc8NNg51BQnuwdhXK";
  // "https://eth-mainnet.g.alchemy.com/v2/rKxeroDp_Tas9KMG_wFBveulFr14py7W";
  const provider = new ethers.providers.JsonRpcProvider(key);

  const [buttonText, setButtonText] = useState({
    text: "Enter Amount",
    disable: true,
  });

  useEffect(() => {
    setAddress(userAddress);
  }, [userAddress]);

  const handleAmount = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  useEffect(() => {
    const isValid = ethers.utils.isAddress(address);

    if (decimal2Fixed(amount, 18) > Number(allowanceValue)) {
      setButtonText({
        text: "Approve",
        disable: false,
      });
    } else if (amount > tokenBalance?.uft) {
      setButtonText({
        text: "Low Balance",
        disable: true,
      });
    } else if (!isValid) {
      setButtonText({
        text: "Enter Valid Address",
        disable: true,
      });
    } else if (!(amount > 0)) {
      setButtonText({
        text: "Enter Amount",
        disable: true,
      });
    } else {
      setButtonText({
        text: "Wrap & Delegate",
        disable: false,
      });
    }
  }, [address, amount, allowanceValue, tokenBalance]);

  const handleAddress = async (e) => {
    // setDomainDetail({
    //   value: "",
    //   isAddress: false,
    // });
    setAddress(e.target.value);
    const isValid = ethers.utils.isAddress(e.target.value);
    setValid(isValid);

    //testAdd : 0x88bc9b6c56743a38223335fac05825d9355e9f83
    //testDomain: jim-unstoppable.x

    // if (isValid) {
    //   const meta = await fetchUserDomain(e.target.value);
    //   const data = await provider.lookupAddress(e.target.value);
    //   setDomainDetail({
    //     value: meta.domain ? meta.domain : data,
    //     isAddress: false,
    //   });
    //   console.log("DOMAINDEATILS", domainDetail);
    // } else {
    //   const meta = await fetchUserAddressByDomain(e.target.value);
    //   const address = await provider.resolveName(e.target.value);
    //   setDomainDetail({
    //     value: meta.owner ? meta.owner : address,
    //     isAddress: true,
    //   });
    //   console.log("DOMAINDEATILS", domainDetail);
    // }

    // if (!isValid) {
    //   setButtonText({
    //     text: "Enter Valid Address",
    //     disable: true,
    //   });
    // } else if (amount > tokenBalance?.uft) {
    //   setButtonText({
    //     text: "Low Balance",
    //     disable: true,
    //   });
    // } else {
    //   setButtonText({
    //     text: "Wrap & Delegate",
    //     disable: false,
    //   });
    // }
  };

  const handleDomain = async (isValid, input) => {
    setDomainDetail({
      value: "",
      isAddress: false,
    });

    if (isValid) {
      const meta = await fetchUserDomain(input);
      const data = await provider.lookupAddress(input);
      setDomainDetail({
        value: meta.domain ? meta.domain : data,
        isAddress: false,
      });
      console.log("DOMAINDEATILS", domainDetail);
    } else {
      const meta = await fetchUserAddressByDomain(input);
      const address = await provider.resolveName(input);
      setDomainDetail({
        value: meta.owner ? meta.owner : address,
        isAddress: true,
      });
      console.log("DOMAINDEATILS", domainDetail);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleDomain(valid, address);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [address, 500]);

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleWrap = async () => {
    const { chain } = getNetwork();
    const fixedValue = decimal2Fixed(amount, 18);
    const contracts = contractAddress[chain?.id || "1"];

    if (Number(allowanceValue) >= Number(fixedValue)) {
      setIsLoading(true);
      handleWrapAndDelegate(
        contracts?.uftgToken,
        uftgABI,
        address,
        domainDetail.isAddress ? domainDetail.value : amount,
        checkTxnStatus,
        checkTxnError
      );
    } else {
      setIsLoading(true);
      setApproval(
        contracts?.uftToken,
        erc20Abi,
        contracts?.uftgToken,
        checkTxnStatus,
        checkTxnError
      );
    }
  };

  return (
    <div className="operation_content_container">
      <div className="info">
        <h2>Wrap And Delegate</h2>
        <p>
          You can either vote on each proposal yourself or delegate your votes
          to a third party. You can either vote on each proposal yourself or
          delegate your votes to a third party.
        </p>
      </div>
      <div className="action">
        <div className="amount_input_wraper">
          <Input
            type="number"
            placeholder="Amount"
            onChange={handleAmount}
            value={amount}
          />
          <button
            onClick={() => setAmount(tokenBalance?.uft)}
            className="max_btn"
          >
            MAX
          </button>
        </div>
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={handleAddress}
        />
        {!domainDetail.isAddress ? (
          <div className="domain-data">
            <p>{domainDetail.value ? domainDetail.value : ""}</p>
          </div>
        ) : (
          <div
            onClick={() => copyAddress(domainDetail.value)}
            className="domain-data"
          >
            <p>
              {domainDetail.value ? shortenAddress(domainDetail.value) : ""}
            </p>
            {domainDetail.value && <img src={copyIcon} alt="copy" />}
          </div>
        )}
        <Button
          loading={isLoading}
          onClick={handleWrap}
          disabled={buttonText.disable}
        >
          {buttonText.text}{" "}
        </Button>
      </div>
    </div>
  );
};

const UnWrap = ({
  checkTxnStatus,
  tokenBalance,
  isLoading,
  setIsLoading,
  checkTxnError,
}) => {
  const [amount, setAmount] = useState("");
  const [buttonText, setButtonText] = useState({
    text: "Enter Amount",
    disable: true,
  });

  const handleAmount = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (value > tokenBalance?.uftg) {
      setButtonText({
        text: "Low Balance",
        disable: true,
      });
    } else if (!(value > 0)) {
      setButtonText({
        text: "Enter Amount",
        disable: true,
      });
    } else {
      setButtonText({
        text: "Unwrap",
        disable: false,
      });
    }
  };

  const handleUnWrapOperation = async () => {
    const { chain } = getNetwork();
    const contracts = contractAddress[chain?.id || "1"];
    setIsLoading(true);
    handleUnWrap(
      contracts?.uftgToken,
      uftgABI,
      amount,
      checkTxnStatus,
      checkTxnError
    );
  };

  useEffect(() => {
    if (amount > tokenBalance?.uftg) {
      setButtonText({
        text: "Low Balance",
        disable: true,
      });
    } else if (!(amount > 0)) {
      setButtonText({
        text: "Enter Amount",
        disable: true,
      });
    } else {
      setButtonText({
        text: "Unwrap",
        disable: false,
      });
    }
  }, [amount]);

  return (
    <div className="operation_content_container">
      <div className="info">
        <h2>Unwrap</h2>
        <p>
          You can either vote on each proposal yourself or delegate your votes
          to a third party. You can either vote on each proposal yourself or
          delegate your votes to a third party.
        </p>
      </div>
      <div className="action">
        <div className="amount_input_wraper">
          <Input
            type="number"
            placeholder="Amount"
            onChange={handleAmount}
            value={amount}
          />
          <button
            onClick={() => setAmount(tokenBalance?.uftg)}
            className="max_btn"
          >
            MAX
          </button>
        </div>
        <Button
          loading={isLoading}
          onClick={handleUnWrapOperation}
          disabled={buttonText?.disable}
        >
          {" "}
          {buttonText?.text}
        </Button>
      </div>
    </div>
  );
};

const UpdateDelegation = ({
  checkTxnStatus,
  tokenBalance,
  isLoading,
  setIsLoading,
  checkTxnError,
}) => {
  const [address, setAddress] = useState("");
  const [buttonText, setButtonText] = useState({
    text: "Enter Address",
    disable: true,
  });

  const handleAddress = (e) => {
    const userAddr = e.target.value;
    const isValid = ethers.utils.isAddress(userAddr);

    setAddress(userAddr);
    if (!isValid || userAddr == "") {
      setButtonText({
        text: "Enter Valid Address",
        disable: true,
      });
    } else {
      setButtonText({
        text: "Update Delegation",
        disable: false,
      });
    }
  };

  const handleUpdate = () => {
    const { chain } = getNetwork();
    const contracts = contractAddress[chain?.id || "1"];
    setIsLoading(true);
    handleUpdateDelegate(
      contracts?.uftgToken,
      uftgABI,
      address,
      checkTxnStatus,
      checkTxnError
    );
  };

  return (
    <div className="operation_content_container">
      <div className="info">
        <h2>Update Delegation</h2>
        <p>
          You can either vote on each proposal yourself or delegate your votes
          to a third party. You can either vote on each proposal yourself or
          delegate your votes to a third party.
        </p>
      </div>
      <div className="action">
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={handleAddress}
        />
        <Button
          loading={isLoading}
          onClick={handleUpdate}
          disabled={buttonText?.disable}
        >
          {" "}
          {buttonText?.text}
        </Button>
      </div>
    </div>
  );
};
