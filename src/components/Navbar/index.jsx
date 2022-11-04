import React from 'react'
import { FiLock } from "react-icons/fi";
import { LockOutlined } from '@ant-design/icons'
import logo from '../../assets/footerlogo.svg'
import hamberger from '../../assets/hamburger.svg'
import './styles/index.scss'

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
      <div className='wallet_connection'>
        <div>
           <p>Sepolia Test Network</p>
        </div>
        <div>
        <p>0.002535 ETH</p>
        <div className='address'>
        0x12524..1254
        </div>
        </div>
      </div>
      <div className='hamberger'>
        <img src={hamberger} alt="hamburger" />
      </div>
      </div>
    </div>
  )
}
