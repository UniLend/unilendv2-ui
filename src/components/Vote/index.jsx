import React, { useState } from "react";
import {
  getAccount,
  getNetwork,
  getProvider,
  waitForTransaction,
} from "@wagmi/core";
import { Input, Button, message } from "antd";
import banner from "../../assets/dashboardbanner.svg";
import Vote from "../../assets/vote.svg";
import "./styles/index.scss";
import { shortenAddress } from "../../utils";
import { contractAddress } from "../../core/contractData/contracts";
import { useEffect } from "react";
import { ethers } from "ethers";
import { erc20Abi, uftgABI } from "../../core/contractData/abi";
import { decimal2Fixed, fromBigNumber } from "../../helpers/contracts";
import {
  checkAllowance,
  handleUnWrap,
  handleUpdateDelegate,
  handleWrapAndDelegate,
  setApproval,
} from "../../services/governance";

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
  const [delegate, setDelegate] = useState('0x000000000000000');
  const [isLoading, setIsLoading] = useState(false);

  const checkTxnStatus = (hash, data) => {
    waitForTransaction({
      hash,
    }).then((receipt) => {
      
      if (receipt.status == 1) {   
        setTimeout(() => {
           handleAllowance()
           message.success(`${data.message}`);
           setIsLoading(false);
        }, 1000);
      } else {
        alert('Error Checked')
      }
    });
  };

  const checkTxnError = (error) => {
    setIsLoading(false);
    console.log("Error", { error });
    const errorText = String(error.reason);
    message.error(error?.message ? errorText : "Error: Transaction Error");
  };

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
    console.log("validation", isValid, delegatesAddress !=0);
    delegatesAddress != 0 && isValid && setDelegate(delegatesAddress);
    const uftBalance_BigNumber = await UFT.balanceOf(address);
    const uftgBalance_BigNumber = await UFTG.balanceOf(address);
    const uftBalance = fromBigNumber(uftBalance_BigNumber) / 10 ** 18;
    const uftgBalance = fromBigNumber(uftgBalance_BigNumber) / 10 ** 18;

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

  useEffect(() => {
    if(address){
      setDelegate(address)
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
            <h2> {Number(tokenBalance.uft + tokenBalance.uftg).toFixed(2)}</h2>
            <p>Total Balance</p>
            <span>(UFT + UFTG Balance)</span>
          </div>
          <div>
            <h2>{Number(tokenBalance.uftg).toFixed(2)}</h2>
            <p>Voting Power</p>
            <span>(UFTG Balance)</span>
          </div>
          <div>
            <h2>{ shortenAddress(String(delegate))}</h2>
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
  if (amount > tokenBalance?.uft) {
    setButtonText({
      text: "Low Balance",
      disable: true,
    });
  } else if (!isValid) {
    setButtonText({
      text: "Enter Valid Address",
      disable: true,
    });
  } else if (decimal2Fixed(amount, 18) > Number(allowanceValue)) {
    setButtonText({
      text: "Approve",
      disable: false,
    });
  } else if(!(amount > 0)) {
    setButtonText({
      text: "Enter Amount",
      disable: true,
    });
  }else {
    setButtonText({
      text: "Wrap & Delegate",
      disable: false,
    });
  }
}, [address, amount, allowanceValue, tokenBalance])

  const handleAddress = (e) => {
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

  const handleWrap = async () => {
    const { chain } = getNetwork();
    const fixedValue = decimal2Fixed(amount, 18);
    const contracts = contractAddress[chain?.id || "1"];
console.log("handleWrap", Number(allowanceValue) , Number(fixedValue));
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
      setApproval(contracts?.uftToken, erc20Abi, contracts?.uftgToken, checkTxnStatus,
        checkTxnError);
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
        <Input
          type="number"
          placeholder="Amount"
          onChange={handleAmount}
          value={amount}
        />
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={handleAddress}
        />
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
    console.log("Handle Amount", value , tokenBalance?.uftg, value > tokenBalance?.uftg);
    if (value > tokenBalance?.uftg) {
      setButtonText({
        text: "Low Balance",
        disable: true,
      });
    } else
    if(!(value > 0)) {
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
        <Input
          type="number"
          placeholder="Amount"
          onChange={handleAmount}
          value={amount}
        />
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
    setIsLoading(true)
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
        <Button loading={isLoading} onClick={handleUpdate} disabled={buttonText?.disable}>
          {" "}
          {buttonText?.text}
        </Button>
      </div>
    </div>
  );
};
