import React, { useState, useEffect } from "react";
import { Button, Popover } from "antd";
import { FiLock } from "react-icons/fi";
import { LockOutlined, WalletFilled } from "@ant-design/icons";
import {  Link } from 'react-router-dom';

import { saveToLocalStorage, shortenAddress } from "../../utils";
import { connectWallet } from "../../services/wallet";
import logo from "../../assets/footerlogo.svg";
import hamberger from "../../assets/hamburger.svg";
import gitbook from "../../assets/gitbook.svg";
import copyIcon from '../../assets/copyIcon.svg';
import viewExplorer from '../../assets/viewExplorerIcon.svg';
import "./styles/index.scss";
import Sider from "antd/lib/layout/Sider";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/Action";

export default function Navbar(props) {
  const { user } = props;
  const [currentUser, setCurrentUser] = useState( {address: '0x',
  balance: null,
  network: {
    id: null,
    name: null
  },
  isConnected: false});
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch()

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleConnect = async () => {
    const user = await connectWallet();

    console.log("user", user);
    // setCurrentUser(user);
    dispatch(setUser(user));
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
       window.location.reload();
      });

      window.ethereum.on("chainChanged", async (chain) => {
        window.location.reload();
      });
    }
  }, []);



  const PopoverContent = () => {
    const [copied, setCopied] = useState(false);
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
    };
  
    return (
      <div className="popover-content">
        <div className="disconnect">
          <div>
            <p></p>
          </div>
          <h4>{shortenAddress(user.address)}</h4>
          <Button className="style-active" >
            Disconnect
          </Button>
        </div>
        <div className="explorer">
          <div onClick={copyToClipboard} className={copied && "copied"}>
            <img src={copyIcon} alt="copyicon" />
            <p> {copied ? "Copied" : "Copy address"}</p>
          </div>
          <Link to="/history">
            <div>
              <img src={viewExplorer} alt="viewExplorericon" />
              <p>TXN History</p>
            </div>
          </Link>
        </div>
      </div>
    );
  };


  return (
    <div className="nav_container">
      <div className="unilend_logo">
        <img src={logo} alt="unilend_logo" />
      </div>
      <div className="nav_routes">
        <nav>
          <a href="/">Pools</a>
          <a href="#" className="disable_route">
            Dashboard
            <LockOutlined style={{ marginLeft: "5px" }} />
          </a>
          <a href="#" className="disable_route">
            Vote
            <LockOutlined style={{ marginLeft: "5px" }} />
          </a>
          <a href="#" className="disable_route">
            Rewards
            <LockOutlined style={{ marginLeft: "5px" }} />
          </a>
          <a href="/history">History</a>
          <a href="#">Faucet</a>
        </nav>
      </div>
      <div className="last_container">
        {currentUser?.isConnected ? (
          <div className="wallet_connection">
            <div>
              <p>{currentUser?.network?.name}</p>
            </div>
            <div>
              <p>{currentUser.balance}ETH</p>
              <Popover
                content={<PopoverContent />}
                trigger="click"
                overlayClassName="antd-popover-classname"
                placement="bottomLeft"
                visible={visible}
                onVisibleChange={handleVisibleChange}
              >
                <div className="address">
                  {shortenAddress(currentUser.address)}
                </div>
              </Popover>
            </div>
          </div>
        ) : (
          <div className="connect_btn">
            <Button
              icon={<WalletFilled />}
              size="large"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          </div>
        )}
        <div className="hamberger">
          <Popover
            overlayClassName="hamburger_popover"
            placement="bottomRight"
            title=""
            content={<HamburgerContent />}
            trigger="click"
          >
            <img src={hamberger} alt="hamburger" />
          </Popover>
        </div>
      </div>
    </div>
  );
}

const HamburgerContent = () => {
  return (
    <div className="hamburger_content">
      <div>
        <a>GitBook</a>
        <img src={gitbook} alt="" />
      </div>
      <div>
        <a>Documentation</a>
        <img src={gitbook} alt="" />
      </div>
      <div>
        <a>GitBook</a>
        <img src={gitbook} alt="" />
      </div>
      <div>
        <a>GitBook</a>
        <img src={gitbook} alt="" />
      </div>
    </div>
  );
};


