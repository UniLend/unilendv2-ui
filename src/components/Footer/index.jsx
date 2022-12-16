import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { LockOutlined } from '@ant-design/icons'
import './styles/index.scss';
import ChrismasFooter from './chrismasFooter';

export default function Footer() {
  return (
    <>
      <ChrismasFooter />
    <footer>
  
      <div className='poolFooter-copyright'>
        <p>©2022 UniLend. All Rights Reserved.</p>
      </div>
      <div className='poolFooter-content'>
          <a href='https://unilend.gitbook.io/unilend-finance/' target='_blank'>
            Gitbook
          </a>
          <a href='https://github.com/UniLend/unilendv2' target='_blank'>
            Github
          </a>
          <a
            href='https://www.youtube.com/channel/UCggNiVE5EGWGHh1YwIUW7Ug'
            target='_blank'
          >
            Tutorial
          </a>
      </div>
      <div className='poolFooter-socials'>
        <div>
            <a
              href='https://www.linkedin.com/company/unilend-finance/'
              target='_blank'
            >
              <FaLinkedinIn size={20} className='icon' color='#0045FF' />
            </a>
         
            <a href=' https://twitter.com/UniLend_Finance' target='_blank'>
              {' '}
              <FaTwitter size={20} color='#0045FF' />
            </a>
        
      
            <a href='https://www.instagram.com/unilendfinance/' target='_blank'>
              {' '}
              <FaInstagram size={20} color='#0045FF' />
            </a>
       
        
            <a href='https://t.me/UniLendFinance' target='_blank'>
              {' '}
              <FaTelegramPlane size={20} color='#0045FF' />
            </a>
            </div>
      </div>
    </footer>
    <nav className='footer_nav'>
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
        <a href="history">
          History
        </a>
      </nav>
    </>
  );
}
