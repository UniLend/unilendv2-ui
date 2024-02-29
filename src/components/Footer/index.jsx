import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import {
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { LockOutlined } from '@ant-design/icons'
import './styles/index.scss';
import { useSelector } from 'react-redux';
import useWalletHook from '../../lib/hooks/useWallet';

export default function Footer() {
  const [isPolygon, setIsPolygon] = useState(false)
  const pathname = window.location.pathname;
  const {chain} = useWalletHook()

  useEffect(() => {
 
    if(chain?.id == 80001){
      setIsPolygon(true)
    } else {
      setIsPolygon(false)
    }
  }, [chain?.id]);

  return (
    <>
    <footer>
      {/* <div className='poolFooter-copyright'>
        <p>©2022 UniLend. All Rights Reserved.</p>
      </div> */}
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
              <FaLinkedinIn size={20} className='icon'  />
            </a>
         
            <a href=' https://twitter.com/UniLend_Finance' target='_blank'>
              {' '}
              <FaTwitter size={20}  />
            </a>
        
      
            <a href='https://www.instagram.com/unilendfinance/' target='_blank'>
              {' '}
              <FaInstagram size={20}  />
            </a>
       
        
            <a href='https://t.me/UniLendFinance' target='_blank'>
              {' '}
              <FaTelegramPlane size={20} />
            </a>
            </div>
      </div>
    </footer>
    <nav className='footer_nav'>
        <a href="/pools"
        className={`${pathname === '/pools' ? 'active' : ''}`}
        >
          Pools
        </a>
        { isPolygon ? 
        <>
        <a href='/dashboard'
         className={`${pathname === '/dashboard' ? 'active' : ''}`}
         >
            Dashboard
          </a>
          <a href='/governance'
         className={`${pathname === '/governance' ? 'active' : ''}`}
         >
            Vote
          </a>
          </>
           :
           <>
           <a href='#' className='disable_route'>
           Dashboard
           <FiLock style={{ marginLeft: '5px' }} />
         </a> 
         <a href="#" className='disable_route'>
         Vote
          <FiLock style={{marginLeft: '5px'}}/>
        </a>
           </>

        }
        <a href="#" className='disable_route'>
          Rewards
          <FiLock style={{marginLeft: '5px'}}/>
        </a>
        { chain?.id != 195 && (
              <a
                href="/history"
                className={`${pathname === "/history" ? "active" : ""}`}
              >
                History
              </a>
            )}
        {/* <a href="/history"
        className={`${pathname === '/history' ? 'active' : ''}`}
        >
          History
        </a> */}
      </nav>
    </>
  );
}
