import React from 'react'
import { Avatar, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTokenLogo, imgError  } from '../../utils';
import './styles/poolCard.scss';
import { useSelector } from 'react-redux';

export default function PoolCard({pool}) {
  const { poolAddress, token0, token1 } = pool;
  const {user} = useSelector((state)=> state )
  const navigate = useNavigate();

  const handleNavigate = () => {
    if(user.isConnected){
      navigate(`/pool/${poolAddress}`)
    } else {
      message.info("Please Connect to the Wallet")
    }
  }


  return (
    <div onClick={handleNavigate} className='poolcard'>
      <div className='pool_icons'>
          <div>
          <img
            src={token0?.logo}
            onError={imgError}
            alt=""
          />
          <h5>{token0?.symbol}</h5>
          </div>
          <div>
          <img
            src={token1?.logo}
            onError={imgError}
            alt=""
          />
          <h5>{token1?.symbol}</h5>
          </div>
      </div>

      <div className='pool_data'>
       <div>
        <p>Total Supply</p>
        <h5>$1,25,000</h5>
       </div>
       <div>
       <p>Total Borrowed</p>
        <h5>$30,000</h5>
       </div>
      </div>
      <div className='pool_footer'>
       <p>More Details</p>
      </div>
    </div>
  )
}
