import React from 'react'
import { Button, Popover } from 'antd'
import { FiLock } from "react-icons/fi";
import { LockOutlined, WalletFilled } from '@ant-design/icons'
import logo from '../../assets/footerlogo.svg'
import hamberger from '../../assets/hamburger.svg'
import gitbook from '../../assets/gitbook.svg'
import './styles/index.scss'
import Sider from 'antd/lib/layout/Sider';

export default function Navbar() {

  return (
    <div className='nav_container'>
      <div className='unilend_logo'>
         <img src={logo} alt="unilend_logo" />
      </div>
      <div className='nav_routes'>
      <nav >
        <a href="/">
          Pools
        </a>
        <a href="#" className='disable_route'>
          Dashboard
          <LockOutlined style={{marginLeft: '5px'}}/>
        </a>
        <a href="#" className='disable_route'>
          Vote
          <LockOutlined style={{marginLeft: '5px'}}/>
        </a>
        <a href="#" className='disable_route'>
          Rewards
          <LockOutlined style={{marginLeft: '5px'}}/>
        </a>
        <a href="/history">
          History
        </a>
        <a href="#">
          Faucet
        </a>
      </nav>
      </div>
      <div className='last_container'>
      {/* <div className='wallet_connection'>
        <div>
           <p>Sepolia Test Network</p>
        </div>
        <div>
        <p>0.002535 ETH</p>
        <div className='address'>
        0x12524..1254
        </div>
        </div>
      </div> */}
      <div className='connect_btn'>
        <Button icon={<WalletFilled />} size='large'>Connect Wallet</Button>
      </div>
      <div className='hamberger'>
        <Popover overlayClassName='hamburger_popover'  placement="bottomRight" title='' content={<HamburgerContent/>} trigger="click">
        <img src={hamberger} alt="hamburger" />
        </Popover>
      </div>
      </div>
    </div>
  )
}


const HamburgerContent = () => {
  return(
    <div className='hamburger_content'>
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
  )
}
