import React, { useMemo, useState } from "react";
import { Popover } from "antd";
import { Input, Button } from "antd";
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
import { waitForBlockConfirmation, waitForTransactionLib } from "../../lib/fun/functions";
import NotificationMessage from "../Common/NotificationMessage";
import useDomainHandling from "./useDomainHandling";

const wrap = "wrap";
const unWrap = "unWrap";
const update = "update";

export default function VoteComponent() {
  const { address, chain, isConnected } = useWalletHook();
  const [userAddress, setUserAddress] = useState(address);
  const [tokenBalance, setTokenBalance] = useState({ uft: "", uftg: "" });
  const [activeTab, setActiveTab] = useState(wrap);
  const [allowanceValue, setAllowanceValue] = useState("");
  const [delegate, setDelegate] = useState(address);
  const [votingPower, setVotingPower] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false)

  const provider = useMemo(() => {
    const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
    const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    return new ethers.providers.JsonRpcProvider(key);
  }, [chain?.id]);


  const handleTabs = (tab)=>{
    if(address && isConnected){

      setActiveTab(tab)
    }
  }

  const checkTxnStatus = (hash, data) => {
    waitForBlockConfirmation(hash)
      .then((res) => {
        const [receipt, currentBlockNumber] = res;
        const trasactionBlock = fromBigNumber(receipt.blockNumber);
        const currentblock = fromBigNumber(currentBlockNumber);
        if (receipt.status == "success" && currentblock - trasactionBlock > 2) {
          if (data?.fn == "approve") {
            setTimeout(() => {
              handleAllowance();
              NotificationMessage("success", `${data.message}`);
              setIsLoading(false);
            }, 6000);
          } else {
            setTimeout(() => {
              handleAllowance();
              NotificationMessage("success", `${data.message}`);
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
    NotificationMessage(
      "error",
      error?.message ? errorText : "Error: Transaction Error"
    );
  };

  //
  const getTokenBal = async () => {
    try {
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
    } catch (error) {
      throw error
    }

  };

  const handleAllowance = async () => {
    try {
      setIsDataLoading(true)
      const contractsAdd = contractAddress[chain?.id || "1"];
     await getTokenBal();
      const { allowance } = await checkAllowance(
        contractsAdd?.uftToken,
        erc20Abi,
        address,
        contractsAdd?.uftgToken
      );
  
      const valueFromBigNumber = fromBigNumber(allowance);
      setAllowanceValue(valueFromBigNumber);
       setIsDataLoading(false)
    } catch (error) {
       console.log("error Gov:", error);
       setIsDataLoading(false)
    }

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

  const { domainDetail, handleDomain } = useDomainHandling(delegate, provider);

  useEffect(() => {
    if(delegate){

      handleDomain(delegate);
    }
  }, [delegate]);

  useEffect(() => {
    if (address && window.navigator.onLine) {
      setDelegate(address);
      setIsDataLoading(true)
      // getTokenBal();
      setTimeout(() => {
        handleAllowance();
      }, 1000);
    
    }


  }, [address]);

  useEffect(()=> {
    if(!window.navigator.onLine){
      NotificationMessage(
        "error",
        "Please check internet connection"
      );
     } 
  
  }, [])

  return (
    <div className="vote_container">
      {/* <div className="vote_banner">
        <img src={banner} alt="banner" />
      </div> */}

      <div className="vote_content">
        {/* User Info */}
        <div className="user_info">
          <div>
            {
              isDataLoading ? <h2 className="heading_loader skeleton"></h2> :  <h2 className="heading05">
              {Number(tokenBalance.uft + tokenBalance.uftg).toFixed(2)}
            </h2>
            }
        
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
          <div >
           {isDataLoading ? <h2 className="heading_loader skeleton"></h2>: <h2 className="heading05">{Number(votingPower).toFixed(2)}</h2>} 
            <p className="paragraph03">Voting Power</p>
          </div>
          <div>
            {
              isDataLoading ?  <h2 className="heading_loader skeleton"></h2>:       <div
              onClick={() => {
                navigator.clipboard.writeText(delegate);
              }}
              className="address_with_copy"
            >
              
              <h2 className="heading05">
                {domainDetail.value
                  ? domainDetail.value
                  : shortenAddress(String(delegate == undefined ? '0x0000000000': delegate))}
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
            }
      
            <p className="paragraph03">Delegation address</p>
          </div>
        </div>
        {/* Operation Section */}
        <div className="operation">
          <div className="tabs">
            <div
              onClick={() => handleTabs(wrap)}
              className={` ${activeTab === wrap ? "active_tab" : ""}`}
            >
              <span>Wrap & Delegate</span>
            </div>
            <div
              onClick={() => handleTabs(unWrap)}
              className={` ${activeTab === unWrap ? "active_tab" : ""}`}
            >
              <span>Unwrap</span>
            </div>
            <div
              onClick={() => handleTabs(update)}
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
              userAddress={delegate}
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
  const provider = useMemo(() => {
    const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
    const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    return new ethers.providers.JsonRpcProvider(key);
  }, [chain?.id]);

  const { domainDetail } = useDomainHandling(address, provider);

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
   if(!address){
    setButtonText({
      text: "Please Connect",
      disable: true,
    });
   } else
    
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
    if(userAddress){

      setAddress(e.target.value);
    }
  };

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
        address,
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
  userAddress,
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
    if(!userAddress){
      setButtonText({
        text: "Please Connect",
        disable: true,
      });
     } else
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
    if(!userAddress){
      setButtonText({
        text: "Please Connect",
        disable: true,
      });
     } else
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
  const [popoverVisible, setPopoverVisible] = useState(false);

  const provider = useMemo(() => {
    const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
    const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    return new ethers.providers.JsonRpcProvider(key);
  }, [chain?.id]);
  const { domainDetail } = useDomainHandling(address, provider);

  const handleCopyClick = () => {
    setPopoverVisible(true);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
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
