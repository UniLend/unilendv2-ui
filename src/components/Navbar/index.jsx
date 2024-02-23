import React, { useState, useEffect } from 'react';
import { Button, Popover, Modal } from 'antd';
import { FiLock } from 'react-icons/fi';
import { FaChevronDown } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { LockOutlined, WalletFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FiCopy } from 'react-icons/fi';

import {
  getFromSessionStorage,
  removeFromSessionStorage,
  saveToSessionStorage,
  shortenAddress,
} from '../../utils';
import { connectWallet, handleDisconnect } from '../../services/wallet';

import logo from '../../assets/logo.svg';
import gitbook from '../../assets/gitbook.svg';
import faq from '../../assets/faq.svg';
import copyIcon from '../../assets/copyIcon.svg';
import doc from '../../assets/document.svg';
import career from '../../assets/career.svg';
import ethlogo from '../../assets/eth.svg';
import arblogo from '../../assets/arbitrum-logo.svg';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import metamaskicon from '../../assets/metamaskicon.svg';
import walletconnect from '../../assets/walletconnect.svg';
import polyMainlogo from '../../assets/polygon.svg';
import shardeumLogo from '../../assets/shardeumLogo.png';
import bscnew from '../../assets/bscnew.svg';
import coinbase from '../../assets/coinbase.svg';
import zengo from '../../assets/zengo.svg';
import viewExplorer from '../../assets/viewExplorerIcon.svg';
import viewExplorerLight from '../../assets/viewExplorerIconLight.svg';
import './styles/index.scss';
import Sider from 'antd/lib/layout/Sider';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setUser } from '../../store/Action';
import { fetchUserDomain, getGeoInfo } from '../../utils/axios';
import { useConnectModal, ConnectButton } from '@rainbow-me/rainbowkit';
import { ChangeNetwork, supportedNetworks } from '../../core/networks/networks';
import useWalletHook from '../../lib/hooks/useWallet';
import { switchNetworkLib } from '../../lib/fun/functions';

export default function Navbar() {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);
  const { openConnectModal } = useConnectModal();
  const pathname = window.location.pathname;
  const [wrongNetworkModal, setWrongNetworkModal] = useState(false);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    ...user,
    domain: shortenAddress(user?.address),
  });
  const [visible, setVisible] = useState(false);
  const [isHaveAccess, setIsHaveAccess] = useState(true);
  const [isNetworkVisible, setIsNetworkVisible] = useState(false);
  const [isNavigateAllow, setIsNavigateAllow] = useState(false);
  const dispatch = useDispatch();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const { chain, isConnected } = useWalletHook();
  const availableChain = Object.values(supportedNetworks).map(
    (net) => net.chainId,
  );

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleTheme = (theme) => {
    saveToSessionStorage('unilendV2Theme', theme);
    setCurrentTheme(theme);
    dispatch(setTheme(theme));
    document.body.className = theme;
  };

  const handleOpenWalletModal = () => {
    // setIsWalletModalVisible(true);
    openConnectModal();
  };

  const handleOpenSwitchNetwork = (visible) => {
    setIsNetworkVisible(visible);
  };

  const handleCloseModal = () => {
    setWrongNetworkModal(false);
  };

  const getLocation = async () => {
    const location = await getGeoInfo();

    // "+1"
    // "United States"
    if (
      location?.countryCode === '+1' &&
      location.countryName == 'United States'
    ) {
      setIsHaveAccess(false);
    } else {
      setIsHaveAccess(true);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async (chainId) => {
        const user = await connectWallet();
        handleDomain(user);
        dispatch(setUser(user));
        window.location.href = window.location.origin;
      });
      window.ethereum.on('accountsChanged', async (account) => {
        const user = await connectWallet();
        handleDomain(user);
        dispatch(setUser(user));
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    getLocation();
  }, []);

  useEffect(() => {
    if (chain?.id == undefined && chain?.id) {
      const wallet = localStorage.getItem('wallet');
      handleConnect(wallet);
    }
    if (
      chain?.id == 80001 ||
      chain?.id == 137 ||
      chain?.id == 1442 ||
      chain?.id == 1 ||
      chain?.id == 42161
    ) {
      setIsNavigateAllow(true);
    } else {
      setIsNavigateAllow(false);
    }
    // user.network.id && user.network.id != '11155111' && user.network.id != '80001'

    if (chain?.id && !availableChain.includes(chain?.id)) {
      setWrongNetworkModal(true);
    } else {
      setWrongNetworkModal(false);
    }
    handleDomain(user);
  }, [user]);

  const handleConnect = async (action, recursion) => {
    try {
      setIsWalletModalVisible(false);
      const user = await connectWallet(action);
      //window.location.reload()
      handleDomain(user);
      dispatch(setUser(user));
    } catch (error) {}
  };

  const handleDomain = async (user) => {
    const meta = await fetchUserDomain(user?.address);
    const domain = meta.reverse ? meta.domain : shortenAddress(user?.address);
    const UserData = {
      ...user,
      domain,
    };
    setCurrentUser(UserData);
  };

  const WalletModalBody = () => {
    return (
      <div className='walletModel'>
        <h1>Wrong Network</h1>
        <p>UniLend V2 is on Ethereum Mainnet only. Please Switch Network.</p>
        <div className='networks'>
          <div onClick={() => handleSwitchNetwork(1)}>
            <img src={ethlogo} alt='Etherium' />
            <p>Ethereum</p>
          </div>
          <div onClick={() => handleSwitchNetwork(42161)}>
            <img src={arblogo} alt='Etherium' />
            <p>Arbitrum</p>
          </div>
          {/* <div onClick={() => handleSwitchNetwork(1442)}>
            <img src={ethlogo} alt="Etherium" />
            <p>zkEVM</p>
          </div> */}
          {/* <div onClick={() => handleSwitchNetwork(8081)}>
            <img src={shardeumLogo} alt="Etherium" />
            <p>Shardeum</p>
          </div> */}
        </div>
      </div>
    );
  };
  const NoAccessModalBody = () => {
    return (
      <div className='walletModel'>
        <h1>Restricted</h1>
        <p>UnilendV2 dApp is not available in your country</p>
      </div>
    );
  };

  const handleSwitchNetwork = async (id) => {
    try {
      const network = await switchNetworkLib({
        chainId: id,
      });
      window.location.reload();
    } catch (error) {
      console.log('switchError', { error });
      await ChangeNetwork(id);
    }

    const connector = localStorage.getItem('wagmi.wallet');
    if (connector == 'walletConnect') {
      setTimeout(() => {
        window.location.reload();
        //removeFromSessionStorage('user')
      }, 1000);
    }
  };

  const SortContent = React.memo(() => {
    return (
      <div className='sort_popover'>
        <h3>Select a Network</h3>
        {Object.keys(supportedNetworks).map((chainId) => (
          <div
            key={chainId}
            className='network_box'
            onClick={() => handleSwitchNetwork(chainId)}
          >
            <div className={chain?.id == chainId ? 'activeChain' : ''}>
              <img
                src={supportedNetworks[chainId].logoUrl}
                alt={`${supportedNetworks[chainId].chainName} Logo`}
              />
              <p className='wallet-name'>
                {supportedNetworks[chainId].chainName}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  });

  const WalletConnectModal = () => {
    return (
      <div className='walletConnectModal'>
        <p className='head_text'>Connect to the Wallet</p>
        <div
          className='wallet-box'
          onClick={() => handleConnect('metamask', true)}
        >
          <div>
            <p className='wallet-name'>Metamask</p>
            <img src={metamaskicon} alt='metamask icon' />
          </div>
        </div>
        <div
          className='wallet-box'
          onClick={() => handleConnect('walletConnect', true)}
        >
          <div className='active'>
            <p>WalletConnect</p>
            <img src={walletconnect} alt='walletconnect icon' />
          </div>
        </div>
        <div
          className='wallet-box'
          onClick={() => handleConnect('Binance', true)}
        >
          <div>
            <p>Bsc Wallet</p>
            <img src={bscnew} alt='walletconnect icon' />
          </div>
        </div>

        <div
          className='wallet-box'
          onClick={() => handleConnect('Binance', true)}
        >
          <div>
            <p>Coinbase</p>
            <img src={coinbase} alt='walletconnect icon' />
          </div>
        </div>
        <div
          className='wallet-box'
          onClick={() => handleConnect('Binance', true)}
        >
          <div>
            <p>Zengo</p>
            <img src={zengo} alt='walletconnect icon' />
          </div>
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
            {/* <img src={copyIcon} alt="copyicon" /> */}
            <FiCopy />
            <p> {copied ? 'Copied' : 'Copy address'}</p>
          </div>
          <a
            href={`${
              supportedNetworks[chain?.id].blockExplorerUrls[0]
            }/address/${user.address}`}
            target='_blank'
          >
            <div>
              <img
                src={theme === 'dark' ? viewExplorer : viewExplorerLight}
                alt='viewExplorericon'
              />
              <p>TXN History</p>
            </div>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className='nav_container'>
      <div className='route_container'>
        <div className='unilend_logo'>
          <a href='/'>
            {' '}
            <img src={logo} alt='unilend_logo' />
          </a>
        </div>
        <div className='nav_routes'>
          <nav>
            <a
              href='/pools'
              className={`${pathname === '/pools' ? 'active' : ''}`}
            >
              Pools
            </a>
            {isNavigateAllow ? (
              <>
                <a href='#' className='disable_route'>
                  Dashboard
                  <LockOutlined style={{ marginLeft: '5px' }} />
                </a>
                <a
                  href='/governance'
                  className={`${pathname === '/governance' ? 'active' : ''}`}
                >
                  Governance
                </a>
              </>
            ) : (
              <>
                <a href='#' className='disable_route'>
                  Dashboard
                  <LockOutlined style={{ marginLeft: '5px' }} />
                </a>
                <a href='#' className='disable_route'>
                  Governance
                  <LockOutlined style={{ marginLeft: '5px' }} />
                </a>
              </>
            )}

            <a href='#' className='disable_route'>
              Rewards
              <LockOutlined style={{ marginLeft: '5px' }} />
            </a>
            {isNavigateAllow && (
              <a
                href='/history'
                className={`${pathname === '/history' ? 'active' : ''}`}
              >
                History
              </a>
            )}
            {/* <a
              href="https://chaindrop.org/?chainid=11155111&token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
              target="_blank"
            >
              Faucet
            </a> */}
          </nav>
        </div>
      </div>
      <div className='last_container'>
        {isConnected && currentUser?.balance ? (
          <>
            <div className='wallet_connection'>
              <Popover
                content={<SortContent />}
                trigger='click'
                overlayClassName='sort_dropDownnew'
                placement='bottomLeft'
                open={isNetworkVisible}
                onOpenChange={handleOpenSwitchNetwork}
              >
                <div className='network_chamber'>
                  <div>
                    <img
                      src={supportedNetworks[chain.id]?.logoUrl}
                      alt={`${supportedNetworks[chain?.id]?.chainName} Logo`}
                    />
                    <p>{currentUser?.network?.name}</p>
                    <FaChevronDown />
                  </div>
                </div>
              </Popover>
              <div className='network_address'>
                <p className='bal'>
                  {currentUser?.balance} {currentUser?.symbol}
                </p>
                <Popover
                  content={<PopoverContent />}
                  trigger='click'
                  overlayClassName='sort_dropDownnew'
                  placement='bottomLeft'
                  open={visible}
                  onOpenChange={handleVisibleChange}
                >
                  <div className='address'>
                    <p>{currentUser?.domain}</p>
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
              onClick={openConnectModal}
            >
              Connect Wallet
            </Button>
          </div>
        )}

        {/* <ConnectButton/> */}
        <div className='hamberger'>
          <Popover
            overlayClassName='hamburger_popover'
            placement='bottomRight'
            title=''
            content={<HamburgerContent />}
            trigger='click'
          >
            <GiHamburgerMenu />
            {/* <img src={hamberger} alt='hamburger' /> */}
          </Popover>
        </div>
      </div>
      <div className='theme_toggle'>
        {currentTheme == 'dark' ? (
          <img src={sun} onClick={() => handleTheme('light')} alt='sun' />
        ) : (
          <img src={moon} onClick={() => handleTheme('dark')} alt='moon' />
        )}
      </div>
      <Modal
        className='antd_modal_overlaywrong'
        open={!isHaveAccess}
        centered
        footer={null}
        closable={false}
      >
        <NoAccessModalBody />
      </Modal>
      <Modal
        className='antd_modal_overlaywrong'
        open={wrongNetworkModal}
        centered
        footer={null}
        closable={false}
      >
        <WalletModalBody />
      </Modal>
      <Modal
        className='antd_modal_overlaywallet'
        open={isWalletModalVisible}
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
    <div className='hamburger_content'>
      <div>
        <a href='https://unilend.gitbook.io/unilend-finance/' target='_blank'>
          GitBook
        </a>
        {/* <img src={gitbook} alt="" /> */}
        <svg
          width='10'
          height='11'
          viewBox='0 0 10 11'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1.53711 9.2006C1.53711 8.72957 1.65406 8.27782 1.86223 7.94475C2.0704 7.61168 2.35274 7.42456 2.64714 7.42456H8.64128'
            stroke='#7AA7FF'
            stroke-width='1.18403'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M2.64714 1.2085H8.64128V10.0887H2.64714C2.35274 10.0887 2.0704 9.97176 1.86223 9.76359C1.65406 9.55541 1.53711 9.27308 1.53711 8.97868V2.31852C1.53711 2.02412 1.65406 1.74179 1.86223 1.53362C2.0704 1.32544 2.35274 1.2085 2.64714 1.2085V1.2085Z'
            stroke='#7AA7FF'
            stroke-width='1.18403'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </div>
      <div>
        <a
          href='https://unilend.gitbook.io/unilend-finance/whitepaper'
          target='_blank'
        >
          Documentation
        </a>
        {/* <img src={doc} alt="" /> */}
        <svg
          width='9'
          height='11'
          viewBox='0 0 9 11'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4.97721 1.44092H1.42513C1.18961 1.44092 0.963741 1.53448 0.797205 1.70101C0.630668 1.86755 0.537109 2.09342 0.537109 2.32894V9.43311C0.537109 9.66862 0.630668 9.89449 0.797205 10.061C0.963741 10.2276 1.18961 10.3211 1.42513 10.3211H6.75326C6.98877 10.3211 7.21464 10.2276 7.38118 10.061C7.54772 9.89449 7.64128 9.66862 7.64128 9.43311V4.10498L4.97721 1.44092Z'
            stroke='#7AA7FF'
            stroke-width='0.888021'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M4.97656 1.44092V4.10498H7.64062'
            stroke='#7AA7FF'
            stroke-width='0.888021'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M5.86458 6.32495H2.3125'
            stroke='#7AA7FF'
            stroke-width='0.888021'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M5.86458 8.10107H2.3125'
            stroke='#7AA7FF'
            stroke-width='0.888021'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M3.20052 4.54907H2.75651H2.3125'
            stroke='#7AA7FF'
            stroke-width='0.888021'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </div>
      <div>
        <a href='https://twitter.com/UniLend_Finance' target='_blank'>
          Career
        </a>
        {/* <img src={career} alt="" /> */}
        <svg
          width='12'
          height='10'
          viewBox='0 0 12 10'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9.88047 2.56812H2.30269C1.77955 2.56812 1.35547 2.9922 1.35547 3.51534V8.25145C1.35547 8.77459 1.77955 9.19867 2.30269 9.19867H9.88047C10.4036 9.19867 10.8277 8.77459 10.8277 8.25145V3.51534C10.8277 2.9922 10.4036 2.56812 9.88047 2.56812Z'
            stroke='#7AA7FF'
            stroke-width='0.947222'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M7.98615 9.19858V1.62081C7.98615 1.36959 7.88636 1.12866 7.70872 0.951019C7.53108 0.77338 7.29015 0.673584 7.03893 0.673584H5.14449C4.89327 0.673584 4.65234 0.77338 4.4747 0.951019C4.29706 1.12866 4.19727 1.36959 4.19727 1.62081V9.19858'
            stroke='#7AA7FF'
            stroke-width='0.947222'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </div>
      <div>
        <a
          href='https://unilend.gitbook.io/unilend-finance/v/unilend-v1/the-protocol/faq'
          target='_blank'
        >
          FAQ
        </a>
        {/* <img src={faq} alt="" /> */}
        <svg
          width='12'
          height='11'
          viewBox='0 0 12 11'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M6.09158 10.1944C8.70726 10.1944 10.8277 8.07396 10.8277 5.45828C10.8277 2.8426 8.70726 0.722168 6.09158 0.722168C3.4759 0.722168 1.35547 2.8426 1.35547 5.45828C1.35547 8.07396 3.4759 10.1944 6.09158 10.1944Z'
            stroke='#7AA7FF'
            stroke-width='0.947222'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M4.9082 4.03967C5.01955 3.72314 5.23933 3.45624 5.52861 3.28622C5.8179 3.11621 6.15801 3.05406 6.48873 3.11079C6.81944 3.16751 7.11941 3.33945 7.3355 3.59615C7.55159 3.85285 7.66986 4.17774 7.66936 4.51329C7.66936 5.46051 6.24852 5.93412 6.24852 5.93412'
            stroke='#7AA7FF'
            stroke-width='0.947222'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M6.28516 7.82837H6.28916'
            stroke='#7AA7FF'
            stroke-width='0.947222'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </div>
    </div>
  );
};
