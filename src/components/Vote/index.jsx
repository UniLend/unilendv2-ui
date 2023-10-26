import React, { useState } from "react";
import { Popover } from "antd";
import { Input, Button, message } from "antd";
import banner from "../../assets/dashboardbanner.svg";
import Vote from "../../assets/vote.svg";
import uftIcon from "../../assets/uft.svg";
import { FiCopy, FiInfo } from "react-icons/fi";
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
import { Link } from "react-router-dom";
import { getEtherContract } from "../../lib/fun/wagmi";
import useWalletHook from "../../lib/hooks/useWallet";
import { waitForTransactionLib } from "../../lib/fun/functions";

const wrap = "wrap";
const unWrap = "unWrap";
const update = "update";
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;

export default function VoteComponent() {
  const { address, chain } = useWalletHook();
  const [userAddress, setUserAddress] = useState(address);
  const [tokenBalance, setTokenBalance] = useState({ uft: "", uftg: "" });
  const [activeTab, setActiveTab] = useState(wrap);
  const [allowanceValue, setAllowanceValue] = useState("");
  const [delegate, setDelegate] = useState("0x000000000000000");
  const [votingPower, setVotingPower] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [domainDetail, setDomainDetail] = useState("");

  const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
  const provider = new ethers.providers.JsonRpcProvider(key);

  const checkTxnStatus = (hash, data) => {
    waitForTransactionLib({
      hash,
    })
      .then((receipt) => {
        if (receipt.status == "success") {
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
            }, 3000);
          }
        } else {
          setTimeout(() => {
            checkTxnStatus(hash, data);
          }, 1000);
        }
      })
      .catch(() => {
        setTimeout(() => {
          checkTxnStatus(hash, data);
        }, 1000);
      });
  };

  const checkTxnError = (error) => {
    setIsLoading(false);
    const errorText = String(error.reason);
    message.error(error?.message ? errorText : "Error: Transaction Error");
  };

  //
  const getTokenBal = async () => {
    const contractsAdd = contractAddress[chain?.id || "1"];
    // const provider = getProvider();
    const UFT = await getEtherContract(contractsAdd.uftToken, erc20Abi);
    const UFTG = await getEtherContract(contractsAdd?.uftgToken, uftgABI);
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
    console.log("allowance", valueFromBigNumber);
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

  const handleDomain = async (address) => {
    setDomainDetail("");
    const meta = await fetchUserDomain(address);
    const data = await provider.lookupAddress(address);
    setDomainDetail(meta.domain ? meta.domain : data);
  };

  useEffect(() => {
    const isValid = ethers.utils.isAddress(delegate);
    if (isValid) {
      handleDomain(delegate);
    }
  }, [delegate]);

  useEffect(() => {
    if (address) {
      setDelegate(address);
      // getTokenBal();
      handleAllowance();
    }
  }, [address]);

  return (
    <div className="vote_container">
      {/* <div className="vote_banner">
        <img src={banner} alt="banner" />
      </div> */}

      <div className="vote_content">
        {/* User Info */}
        <div className="user_info">
          <div>
            <h2 className="heading05">
              {Number(tokenBalance.uft + tokenBalance.uftg).toFixed(2)}
            </h2>
            <div className="total_balance">
              <p className="paragraph03">Total Balance</p>
              <Popover
                content={<BalancePopover />}
                overlayClassName="total_balance_popover"
                // placement="rightTop"
                placement="bottomLeft"
              >
                <FiInfo />
              </Popover>
            </div>
          </div>
          <div>
            <h2 className="heading05">{Number(votingPower).toFixed(2)}</h2>
            <p className="paragraph03">Voting Power</p>
          </div>
          <div>
            <div
              onClick={() => {
                navigator.clipboard.writeText(delegate);
              }}
              className="address_with_copy"
            >
              <h2 className="heading05">
                {domainDetail ? domainDetail : shortenAddress(String(delegate))}
              </h2>
              <Popover
                content="copied"
                overlayClassName="copy_popover"
                placement="top"
                trigger="click"
              >
                <FiCopy />
              </Popover>
            </div>
            <p className="paragraph03">Delegation address</p>
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
            <h2 className="heading04">Participate In Governance</h2>
            <p className="paragraph06">
              You can either vote on each proposal yourself or delegate your
              votes to a third party. You can either vote on each proposal
              yourself or delegate your votes to a third party.
            </p>
            <Button
              onClick={() =>
                window.open(
                  "https://commonwealth.im/unilend-finance/discussions",
                  "_blank"
                )
              }
            >
              Join Now
            </Button>
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
  const { chain } = useWalletHook();
  const [address, setAddress] = useState(userAddress);
  const [valid, setValid] = useState(true);
  const [domainDetail, setDomainDetail] = useState({
    value: "",
    isAddress: false,
  });
  const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
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
    const isValid = ethers.utils.isAddress(
      domainDetail.isAddress ? domainDetail.value : address
    );

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
  }, [address, domainDetail.value, amount, allowanceValue, tokenBalance]);

  const handleAddress = async (e) => {
    setAddress(e.target.value);
    const isValid = ethers.utils.isAddress(e.target.value);
    setValid(isValid);

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
    } else {
      const meta = await fetchUserAddressByDomain(input);
      const address = await provider.resolveName(input);
      setDomainDetail({
        value: meta.owner ? meta.owner : address,
        isAddress: true,
      });
    }
  };

  useEffect(() => {
    let timeoutId;
    if (address) {
      timeoutId = setTimeout(() => {
        handleDomain(valid, address);
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [address, 500]);

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleWrap = async () => {
    const fixedValue = decimal2Fixed(amount, 18);
    const contracts = contractAddress[chain?.id || "1"];

    if (Number(allowanceValue) >= Number(fixedValue)) {
      setIsLoading(true);
      handleWrapAndDelegate(
        contracts?.uftgToken,
        uftgABI,
        domainDetail.isAddress ? domainDetail.value : address,
        amount,
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
        <h2 className="heading03">Wrap And Delegate</h2>
        <p className="paragraph06">
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
          <div className="domain_data">
            <p className="domain_value">
              {domainDetail.value ? domainDetail.value : ""}
            </p>
          </div>
        ) : (
          <div
            onClick={() => copyAddress(domainDetail.value)}
            className="domain_data"
          >
            <p className="domain_value paragraph05">
              {domainDetail.value ? shortenAddress(domainDetail.value) : ""}
            </p>
            <Popover
              content={"copied"}
              overlayClassName="copy_popover"
              placement="right"
              trigger="click"
            >
              {domainDetail.value && <FiCopy />}
            </Popover>
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
  const { chain } = useWalletHook();
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
        <h2 className="heading03">Unwrap</h2>
        <p className="paragraph06">
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
  const { chain } = useWalletHook();
  const [buttonText, setButtonText] = useState({
    text: "Enter Address",
    disable: true,
  });
  const [valid, setValid] = useState(false);
  const [domainDetail, setDomainDetail] = useState({
    value: "",
    isAddress: false,
  });
  const [popoverVisible, setPopoverVisible] = useState(false);
  const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
  const provider = new ethers.providers.JsonRpcProvider(key);

  const handleCopyClick = () => {
    setPopoverVisible(true);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const handleAddress = (e) => {
    const userAddr = e.target.value;
    const isValid = ethers.utils.isAddress(userAddr);
    setValid(isValid);

    setAddress(userAddr);
    // if (!isValid || userAddr == "") {
    //   setButtonText({
    //     text: "Enter Valid Address",
    //     disable: true,
    //   });
    // } else {
    //   setButtonText({
    //     text: "Update Delegation",
    //     disable: false,
    //   });
    // }
  };

  useEffect(() => {
    const isValid = ethers.utils.isAddress(
      domainDetail.isAddress ? domainDetail.value : address
    );

    if (!isValid) {
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
  }, [address, domainDetail.value]);

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
    } else {
      const meta = await fetchUserAddressByDomain(input);
      const address = await provider.resolveName(input);
      setDomainDetail({
        value: meta.owner ? meta.owner : address,
        isAddress: true,
      });
      setValid(true);
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

  const handleUpdate = () => {
    const contracts = contractAddress[chain?.id || "1"];
    setIsLoading(true);
    handleUpdateDelegate(
      contracts?.uftgToken,
      uftgABI,
      domainDetail.isAddress ? domainDetail.value : address,
      checkTxnStatus,
      checkTxnError
    );
  };

  return (
    <div className="operation_content_container">
      <div className="info">
        <h2 className="heading03">Update Delegation</h2>
        <p className="paragraph06">
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
        {!domainDetail.isAddress ? (
          <div className="domain_data">
            <p className="domain_value">
              {domainDetail.value ? domainDetail.value : ""}
            </p>
          </div>
        ) : (
          <div
            onClick={() => copyAddress(domainDetail.value)}
            className="domain_data"
          >
            <p className="domain_value">
              {domainDetail.value ? shortenAddress(domainDetail.value) : ""}
            </p>
            <Popover
              content={"copied"}
              overlayClassName="copy_popover"
              placement="right"
              trigger="click"
            >
              {domainDetail.value && <FiCopy />}
            </Popover>
          </div>
        )}
        <Button
          loading={isLoading}
          onClick={handleUpdate}
          disabled={buttonText?.disable}
        >
          {buttonText?.text}
        </Button>
      </div>
    </div>
  );
};
