import React, { useState }  from "react";
import { getAccount } from "@wagmi/core";
import { Input, Button } from "antd";
import banner from "../../assets/dashboardbanner.svg";
import "./styles/index.scss";
import { shortenAddress } from "../../utils";
const wrap = 'wrap';
const unWrap = 'unWrap'
const update = 'update'
export default function VoteComponent() {
  const [activeTab, setActiveTab] = useState(wrap)
  const { address } = getAccount();
  return (
    <div className="vote_container">
      <div className="vote_banner">
        <img src={banner} alt="banner" />
      </div>

      <div className="vote_content">
        {/* User Info */}
        <div className="user_info">
          <div>
            <h2>15865132</h2>
            <p>Total Balance</p>
            <span>(UFT + UFTG Balance)</span>
          </div>
          <div>
            <h2>15865132</h2>
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
            <div onClick={() => setActiveTab(wrap)} className={` ${activeTab === wrap? 'active_tab': '' }`}>
              <span>Wrap & Delegate</span>
            </div>
            <div onClick={() => setActiveTab(unWrap)} className={` ${activeTab === unWrap? 'active_tab': '' }`}>
              <span>Unwrap</span>
            </div>
            <div onClick={() => setActiveTab(update)} className={` ${activeTab === update? 'active_tab': '' }`}>
              <span>Update delegation</span>
            </div>
          </div>

        { activeTab === wrap  && <WrapAndDelegate />}
        { activeTab === unWrap  && <UnWrap />}
        { activeTab === update  && <UpdateDelegation />}
        </div>
      </div>
    </div>
  );
}

const WrapAndDelegate = () => {
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
        <Input type="number" placeholder="Amount" />
        <Input type="text" placeholder="Address" />
        <Button> Wrap & Delegate</Button>
      </div>
    </div>
  );
};

const UnWrap = () => {
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
        <Input type="number" placeholder="Amount" />
        <Button> Unwrap</Button>
      </div>
    </div>
  );
};

const UpdateDelegation = () => {
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
        <Input type="number" placeholder="Amount" />
        <Button> Update Delegation</Button>
      </div>
    </div>
  );
};