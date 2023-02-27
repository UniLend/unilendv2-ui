import React, { useState } from "react";
import { getAccount, getNetwork, getProvider } from "@wagmi/core";
import { Input, Button } from "antd";
import banner from "../../assets/dashboardbanner.svg";
import Vote from "../../assets/vote.svg";
import "./styles/index.scss";
import { shortenAddress } from "../../utils";
import { contractAddress } from "../../core/contractData/contracts";
import { useEffect } from "react";
import { ethers } from "ethers";
import { erc20Abi } from "../../core/contractData/abi";
import { fromBigNumber } from "../../helpers/contracts";
const wrap = "wrap";
const unWrap = "unWrap";
const update = "update";
export default function VoteComponent() {
  const { address } = getAccount();
  const { chain } = getNetwork();
  const [userAddress, setUserAddress] = useState(address);
  const [tokenBalance, setTokenBalance] = useState({ uft: "", uftg: "" });
  const [activeTab, setActiveTab] = useState(wrap);

  const handleAmount = () => {};

  const getTokenBal = async () => {
    const contractsAdd = contractAddress[chain?.id || "1"];
    const provider = getProvider();
    const UFT = new ethers.Contract(contractsAdd?.uftToken, erc20Abi, provider);
    const UFTG = new ethers.Contract(
      contractsAdd?.uftgToken,
      erc20Abi,
      provider
    );

    const uftBalance_BigNumber = await UFT.balanceOf(address);
    const uftgBalance_BigNumber = await UFTG.balanceOf(address);
    const uftBalance = fromBigNumber(uftBalance_BigNumber) / 10 ** 18;
    const uftgBalance = fromBigNumber(uftgBalance_BigNumber) / 10 ** 18;

    setTokenBalance({ uft: uftBalance, uftg: uftgBalance });

    console.log("UFT", UFT, uftBalance, uftgBalance);
  };

  useEffect(() => {
    getTokenBal();
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
            <h2>{shortenAddress(address)}</h2>
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

          {activeTab === wrap && <WrapAndDelegate userAddress={userAddress} tokenBalance={tokenBalance} />}
          {activeTab === unWrap && <UnWrap tokenBalance={tokenBalance} />}
          {activeTab === update && <UpdateDelegation tokenBalance={tokenBalance} />}
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

const WrapAndDelegate = ({ userAddress, tokenBalance }) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(userAddress);
  const [valid, setValid] = useState(true)
  const [buttonText, setButtonText] = useState({
    text:'Wrap & Delegate',
    disable: false
  })


  const handleAmount = (e) => {
    const value = e.target.value
    setAmount(value);
    const isValid = ethers.utils.isAddress(address)
    if(value > tokenBalance?.uft){
      setButtonText({
        text: 'Low Balance',
        disable: true
      })
    }else if(!valid){
      setButtonText({
        text:'Enter Valid Address',
        disable: true
      })
    } else {
      setButtonText({
        text:'Wrap & Delegate',
        disable: false
      })
    }

  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
   const isValid = ethers.utils.isAddress(e.target.value)
   setValid(isValid)
   if(!isValid){
    setButtonText({
      text:'Enter Valid Address',
      disable: true
    })
   } else if (amount > tokenBalance?.uft){
    setButtonText({
      text: 'Low Balance',
      disable: true
    })
   } else {
    setButtonText({
      text:'Wrap & Delegate',
      disable: false
    })
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
        <Button disabled={buttonText.disable} >{buttonText.text} </Button>
      </div>
    </div>
  );
};

const UnWrap = ({tokenBalance}) => {
  const [amount, setAmount] = useState("");
  const [buttonText, setButtonText] = useState({
    text:'Unwrap',
    disable: false
  })

  const handleAmount = (e) => {
    const value = e.target.value
    setAmount(value);
    if (value > tokenBalance?.uftg){
      setButtonText({
        text: 'Low Balance',
        disable: true
      })
     } else {
      setButtonText({
        text:'Unwrap',
        disable: false
      })
     }
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
        <Button disabled={buttonText?.disable} > {buttonText?.text}</Button>
      </div>
    </div>
  );
};

const UpdateDelegation = ({tokenBalance}) => {
  const [amount, setAmount] = useState("");
  const [buttonText, setButtonText] = useState({
    text:'Update Delegation',
    disable: false
  })

  const handleAmount = (e) => {
    const value = e.target.value
    setAmount(value);
    if (value > tokenBalance?.uft){
      setButtonText({
        text: 'Low Balance',
        disable: true
      })
     } else {
      setButtonText({
        text:'Update Delegation',
        disable: false
      })
     }
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
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={handleAmount}
        />
           <Button disabled={buttonText?.disable} > {buttonText?.text}</Button>
      </div>
    </div>
  );
};
