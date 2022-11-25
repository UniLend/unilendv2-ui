import React from 'react'
import { Avatar } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTokenLogo, imgError  } from '../../utils';
import './styles/poolCard.scss';

export default function PoolCard({pool}) {
  const { poolAddress, token0, token1 } = pool;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/pool/${poolAddress}`)
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
        <h5>$1,88,558</h5>
       </div>
      </div>
      <div className='pool_footer'>
       <p>More Details</p>
      </div>
    </div>
  )
}
