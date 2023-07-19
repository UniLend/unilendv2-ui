import React, { useState, useEffect } from "react";
import { Button, Popover, Modal } from "antd";
import { FiLock } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { LockOutlined, WalletFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
  shortenAddress,
} from "../../utils";
import { connectWallet, handleDisconnect } from "../../services/wallet";

import logo from "../../assets/logo.svg";
import hamberger from "../../assets/hamburger.svg";
import gitbook from "../../assets/gitbook.svg";
import faq from "../../assets/faq.svg";
import copyIcon from "../../assets/copyIcon.svg";
import doc from "../../assets/document.svg";
import career from "../../assets/career.svg";
import eth from "../../assets/eth.svg";
import polygon from "../../assets/polygon.svg";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import metamaskicon from "../../assets/metamaskicon.svg";
import walletconnecticon from "../../assets/walletconnecticon.png";
import viewExplorer from "../../assets/viewExplorerIcon.svg";
import "./styles/index.scss";
import Sider from "antd/lib/layout/Sider";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setUser } from "../../store/Action";
import { changeNetwork } from "../../services/wallet";
import { fetchUserDomain } from "../../utils/axios";
import { getNetwork, switchNetwork } from "@wagmi/core";
import DropDown from "../Common/DropDown";

export default function Navbar(props) {
  const { user, theme } = useSelector((state) => state);
  const pathname = window.location.pathname;
  const [wrongNetworkModal, setWrongNetworkModal] = useState(false);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    ...user,
    domain: shortenAddress(user.address),
  });
  const [visible, setVisible] = useState(false);
  const [isNetworkVisible, setIsNetworkVisible] = useState(false);
  const [isPolygon, setIsPolygon] = useState(false);
  const dispatch = useDispatch();
  const [currentTheme , setCurrentTheme] = useState(theme)
  const {chain: networkchain} = getNetwork()
  const availableChain = [11155111,1442]

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleTheme = (theme) => {
    saveToLocalStorage("unilendV2Theme", theme);
    setCurrentTheme(theme);
    dispatch(setTheme(theme));
    document.body.className = theme;
  };

  const handleOpenWalletModal = () => {
    setIsWalletModalVisible(true);
  };

  const handleOpenSwitchNetwork = (visible) => {
    setIsNetworkVisible(visible);
  };

  const handleCloseModal = () => {
    setWrongNetworkModal(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", async (chainId) => {
        const user = await connectWallet();
        handleDomain(user);
        dispatch(setUser(user));
        window.location.href = window.location.origin;
      });
      window.ethereum.on("accountsChanged", async (account) => {
        const user = await connectWallet();
        handleDomain(user);
        dispatch(setUser(user));
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  }, []);

  useEffect(() => {
    const { chain } = getNetwork();
    if (user?.network?.id == undefined && user?.network?.id) {
      const wallet = localStorage.getItem("wallet");
      handleConnect(wallet);
    }
    if (user?.network?.id == 80001 || user?.network?.id == 137) {
      setIsPolygon(true);
    } else {
      setIsPolygon(false);
    }
    // user.network.id && user.network.id != '11155111' && user.network.id != '80001'
    if (user?.network?.id && !availableChain.includes(user?.network?.id)) {
      setWrongNetworkModal(true);
    } else {
      setWrongNetworkModal(false);
    }
    handleDomain(user);
  }, [user]);

  const handleConnect = async (action, recursion) => {
    setIsWalletModalVisible(false);
    const user = await connectWallet(action);
    //window.location.reload()
    setCurrentUser(user)
    handleDomain(user);
    dispatch(setUser(user));
  };

  const handleDomain = async (user) => {
    const meta = await fetchUserDomain(user.address);
    const domain = meta.reverse ? meta.domain : shortenAddress(user.address);
    const UserData = {
      ...user,
      domain,
    };
     setCurrentUser(UserData);
  };

  const WalletModalBody = () => {
    return (
      <div className="walletModel">
        <h1>Network Not Supported</h1>
        <p>
          UniLend V2 is in Testnet Phase. <br /> Please Connect to the Below
          Networks.
        </p>
        <div className="networks">
          <div onClick={() => handleSwitchNetwork(11155111)}>
            <img src={eth} alt="Etherium" />
            <p>Sepolia</p>
          </div>
          <div onClick={() => handleSwitchNetwork(1442)}>
            <img src={eth} alt="Etherium" />
            <p>zkEVM</p>
          </div>
        </div>
      </div>
    );
  };

  const handleSwitchNetwork = async (id) => {
    const network = await switchNetwork({
      chainId: id,
    });
    const connector = localStorage.getItem("wallet");
    if (connector == "walletConnect") {
      setTimeout(() => {
        window.location.reload();
        //removeFromLocalStorage('user')
      }, 1000);
    }
  };

  const SortContent = React.memo(() => {
    return (
      <div className="sort_popover">
        <p onClick={ async () => await handleSwitchNetwork(11155111)} > Sepolia Test Network</p>
        {/* <p onClick={() => handleSwitchNetwork(80001)} > Polygon Mumbai</p>
        <p onClick={() => handleSwitchNetwork(137)} > Polygon Mainnet</p> */}
        <p onClick={ async () => await handleSwitchNetwork(1442)} >  zkEVM Testnet</p>
      </div>
    );
  });

  const WalletConnectModal = () => {
    return (
      <div className="walletConnectModal">
        <div onClick={() => handleConnect("metamask", true)}>
          <img src={metamaskicon} alt="metamask icon" />
          <p>Connect to Metamask Wallet</p>
        </div>
        <div onClick={() => handleConnect("walletConnect", true)}>
          <img src={walletconnecticon} alt="walletconnect icon" />
          <p>Connect to WalletConnect Wallet</p>
        </div>
      </div>
    );
  };

  const PopoverContent = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
    };

    return (
      <div className="popover-content">
        <div className="disconnect">
          {/* Active green signal */}
          <div>
            <p></p>
          </div>
          <h4>{currentUser.domain}</h4>
          <Button className="btn_class" onClick={() => handleDisconnect()}>
            Disconnect
          </Button>
        </div>
        <div className="explorer">
          <div onClick={copyToClipboard} className={copied ? "copied" : ""}>
            <img src={copyIcon} alt="copyicon" />
            <p> {copied ? "Copied" : "Copy address"}</p>
          </div>
          <a
            href={`https://sepolia.etherscan.io/address/${user.address}`}
            target="_blank"
          >
            <div>
              <img src={viewExplorer} alt="viewExplorericon" />
              <p>TXN History</p>
            </div>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="nav_container">
      <div className="route_container">
        <div className="unilend_logo">
          <a href="/">
            {" "}
            <img src={logo} alt="unilend_logo" />
          </a>
        </div>
        <div className="nav_routes">
          <nav>
            <a
              href="/pools"
              className={`${pathname === "/pools" ? "active" : ""}`}
            >
              Pools
            </a>
            {isPolygon ? (
              <>
                <a
                  href="/dashboard"
                  className={`${pathname === "/dashboard" ? "active" : ""}`}
                >
                  Dashboard
                </a>
                <a
                  href="/governance"
                  className={`${pathname === "/governance" ? "active" : ""}`}
                >
                  Governance
                </a>
              </>
            ) : (
              <>
                <a href="#" className="disable_route">
                  Dashboard
                  <LockOutlined style={{ marginLeft: "5px" }} />
                </a>
                <a href="#" className="disable_route">
                  Governance
                  <LockOutlined style={{ marginLeft: "5px" }} />
                </a>
              </>
            )}

            <a href="#" className="disable_route">
              Rewards
              <LockOutlined style={{ marginLeft: "5px" }} />
            </a>
            {true && (
              <a
                href="/history"
                className={`${pathname === "/history" ? "active" : ""}`}
              >
                History
              </a>
            )}
            <a
              href="https://chaindrop.org/?chainid=11155111&token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
              target="_blank"
            >
              Faucet
            </a>
          </nav>
        </div>
      </div>
      <div className="last_container">
        {user?.isConnected ? (
          <>
            <div className="wallet_connection">
              <Popover
                content={<SortContent />}
                trigger="click"
                overlayClassName="sort_dropDown"
                placement="bottomLeft"
                open={isNetworkVisible}
                onOpenChange={handleOpenSwitchNetwork}
              >
                <div className="network_chamber">
                  <p>{currentUser?.network?.name}</p>
                  <FaChevronDown />
                </div>
              </Popover>
              <div>
                <p>{currentUser.balance}ETH</p>
                <Popover
                  content={<PopoverContent />}
                  trigger="click"
                  overlayClassName="antd-popover-classname"
                  placement="bottomLeft"
                  open={visible}
                  onOpenChange={handleVisibleChange}
                >
                  <div className="address">
                    <p>{currentUser.domain}</p>
                  </div>
                </Popover>
              </div>
            </div>
          </>
        ) : (
          <div className="connect_btn">
            <Button
              icon={<WalletFilled />}
              size="large"
              onClick={handleOpenWalletModal}
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
            <GiHamburgerMenu />
            {/* <img src={hamberger} alt='hamburger' /> */}
          </Popover>
        </div>
      </div>
      <div className="theme_toggle">
        {currentTheme == "dark" ? (
          <img src={sun} onClick={() => handleTheme("light")} alt="sun" />
        ) : (
          <img src={moon} onClick={() => handleTheme("dark")} alt="moon" />
        )}
      </div>

      <Modal
        className="antd_modal_overlay"
        visible={wrongNetworkModal}
        centered
        footer={null}
        closable={false}
      >
        <WalletModalBody />
      </Modal>
      <Modal
        className="antd_modal_overlay"
        visible={isWalletModalVisible}
        centered
        footer={null}
        onCancel={() => setIsWalletModalVisible(false)}
        closable={false}
      >
        <WalletConnectModal />
      </Modal>
    </div>
  );
}

const HamburgerContent = () => {
  return (
    <div className="hamburger_content">
      <div>
        <a href="https://unilend.gitbook.io/unilend-finance/" target="_blank">
          GitBook
        </a>
        <img src={gitbook} alt="" />
      </div>
      <div>
        <a
          href="https://unilend.gitbook.io/unilend-finance/whitepaper"
          target="_blank"
        >
          Documentation
        </a>
        <img src={doc} alt="" />
      </div>
      <div>
        <a href="https://twitter.com/UniLend_Finance" target="_blank">
          Career
        </a>
        <img src={career} alt="" />
      </div>
      <div>
        <a
          href="https://unilend.gitbook.io/unilend-finance/v/unilend-v1/the-protocol/faq"
          target="_blank"
        >
          FAQ
        </a>
        <img src={faq} alt="" />
      </div>
    </div>
  );
};
