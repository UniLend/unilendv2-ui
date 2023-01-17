import React, { useState, useEffect } from 'react';
import { Button, Popover, Modal } from 'antd';
import { FiLock } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi'
import { LockOutlined, WalletFilled } from '@ant-design/icons';
import { Link  } from 'react-router-dom';

import {
  getFromLocalStorage,
  saveToLocalStorage,
  shortenAddress,
} from '../../utils';
import { connectWallet, getProvider, handleDisconnect, } from '../../services/wallet';

import logo from '../../assets/logo.svg';
import hamberger from '../../assets/hamburger.svg';
import gitbook from '../../assets/gitbook.svg';
import faq from '../../assets/faq.svg'
import copyIcon from '../../assets/copyIcon.svg';
import doc from '../../assets/document.svg';
import career from '../../assets/career.svg';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import viewExplorer from '../../assets/viewExplorerIcon.svg';
import './styles/index.scss';
import Sider from 'antd/lib/layout/Sider';
import { useDispatch } from 'react-redux';
import { setTheme, setUser } from '../../store/Action';
import { changeNetwork } from '../../services/wallet';
import { fetchUserDomain } from '../../utils/axios';

export default function Navbar(props) {
  const { user, theme } = props;
  const pathname = window.location.pathname;
  const [wrongNetworkModal, setWrongNetworkModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({...user, domain: shortenAddress(user.address)});
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleTheme = () => {
    const changeTo = theme == "dark" ? "light" : "dark"
    dispatch(setTheme(theme == "dark" ? "light" : "dark"));
    document.body.className = changeTo;
    saveToLocalStorage("unilendV2Theme", changeTo)
  };



  const handleCloseModal = () => {
    setWrongNetworkModal(false);
  };

  useEffect(() => {
    // console.log("my current chain",chain)
    if (user.network.id && user.network.id != '11155111') {
      setWrongNetworkModal(true);
    } else {
      setWrongNetworkModal(false);
    }
    handleDomain(user)
  }, [user]);

  const handleConnect = async () => {
    const user = await connectWallet();
    handleDomain(user)
    dispatch(setUser(user));
  };

  const handleDomain = async (user) => {
    const meta = await fetchUserDomain(user.address);
    const domain = meta.reverse ? meta.domain : shortenAddress(user.address)
    const UserData = {
      ...user, domain
    }
    setCurrentUser(UserData)
  }


  const WalletModalBody = () => {
    return (
      <div className='walletModel'>
        <h1>Wrong Network</h1>
        <p>
          UniLend V2 is in testnet phase. <br /> Please connect to the SEPOLIA
          network.
        </p>
        <div>
          <button onClick={() => changeNetwork(11155111)}>
            Switch Network
          </button>
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
      <div className='popover-content'>
        <div className='disconnect'>
          {/* Active green signal */}
          <div>
            <p></p>
          </div>
          <h4>{currentUser.domain}</h4>
          <Button className='btn_class' onClick={() => handleDisconnect()}>
            Disconnect
          </Button>
        </div>
        <div className='explorer'>
          <div onClick={copyToClipboard} className={copied ? 'copied' : ''}>
            <img src={copyIcon} alt='copyicon' />
            <p> {copied ? 'Copied' : 'Copy address'}</p>
          </div>
          <a
            href={`https://sepolia.etherscan.io/address/${user.address}`}
            target='_blank'
          >
            <div>
              <img src={viewExplorer} alt='viewExplorericon' />
              <p>TXN History</p>
            </div>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className='nav_container'>
      <div className='unilend_logo'>
       <a href="/"> <img src={logo} alt='unilend_logo' /></a>
      </div>
      <div className='nav_routes'>
        <nav>
          <a href='/' className={`${pathname === '/' ? 'active' : ''}`}>
            Pools
          </a>
          <a href='/dashboard' className='disable_route'>
            Dashboard
            <LockOutlined style={{ marginLeft: '5px' }} />
          </a>
          <a href='#' className='disable_route'>
            Vote
            <LockOutlined style={{ marginLeft: '5px' }} />
          </a>
          <a href='#' className='disable_route'>
            Rewards
            <LockOutlined style={{ marginLeft: '5px' }} />
          </a>
          { true && <a
            href='/history'
            className={`${pathname === '/history' ? 'active' : ''}`}
          >
            History
          </a>}
          <a href='https://chaindrop.org/?chainid=11155111&token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' target='_blank'>Faucet</a>
        </nav>
      </div>
      <div className='last_container'>
        {user?.isConnected ? (
          <>
          <div className='wallet_connection'>
            <div>
              <p>{currentUser?.network?.name}</p>
            </div>
            <div>
              <p>{currentUser.balance}ETH</p>
              <Popover
                content={<PopoverContent />}
                trigger='click'
                overlayClassName='antd-popover-classname'
                placement='bottomLeft'
                open={visible}
                onOpenChange={handleVisibleChange}
              >
                <div className='address'>
                  <p>{currentUser.domain}</p>
                </div>
              </Popover>
            </div>
          </div>
      
     </>
          
        ) : (
          <div className='connect_btn'>
            <Button
              icon={<WalletFilled />}
              size='large'
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          </div>
        )}
        <div className='hamberger'>
          <Popover
            overlayClassName='hamburger_popover'
            placement='bottomRight'
            title=''
            content={<HamburgerContent />}
            trigger='click'
          >
            <GiHamburgerMenu/>
            {/* <img src={hamberger} alt='hamburger' /> */}
          </Popover>
        </div>
   
      </div>
      <div className='theme_toggle'>
       {
        theme == 'dark' ? <img src={sun} onClick={handleTheme} alt="sun" /> : <img src={moon} onClick={handleTheme}  alt="moon"/>
       }
      </div>
   
      <Modal
        className='antd_modal_overlay'
        visible={wrongNetworkModal}
        centered
        footer={null}
        closable={false}
      >
        <WalletModalBody />
      </Modal>
    </div>
  );
}

const HamburgerContent = () => {
  return (
    <div className='hamburger_content'>
      <div>
        <a  href='https://unilend.gitbook.io/unilend-finance/'
              target='_blank'
              >GitBook</a>
        <img src={gitbook} alt='' />
      </div>
      <div>
        <a href='https://unilend.gitbook.io/unilend-finance/whitepaper'
              target='_blank' >Documentation</a>
        <img src={doc} alt='' />
      </div>
      <div>
        <a  href='https://twitter.com/UniLend_Finance'
              target='_blank'>Career</a>
        <img src={career} alt='' />
      </div>
      <div>
        <a href='https://unilend.gitbook.io/unilend-finance/v/unilend-v1/the-protocol/faq'  target='_blank'>FAQ</a>
        <img src={faq} alt='' />
      </div>
    </div>
  );
};
