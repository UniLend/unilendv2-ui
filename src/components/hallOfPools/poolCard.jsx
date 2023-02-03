import React from 'react'
import { Avatar, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { imgError  } from '../../utils';
import './styles/poolCard.scss';
import { useSelector } from 'react-redux';

const ignoredPools = ['0xd786cA0e5901384F5f8CD6C64dcC10679354bb98','0x170128193e519421608eD7B52ad9B64F46732429', '0xae9db1103Bd58Af62eEecEdf7a4dA66999D7E881','0xF605595EB60cb1365688515d7b29b3deBE1CFa64','0x3C2bde3279f6EDE0666C632FF3a5013C82291802','0xe21340de05A77179F0B2A55394bB3e479865061d', '0x0367B8fBc7ef37FCFda55a74e62a9e439CcB6Af1', '0x04D3eF50171b7B74E2921519A397C2Cf215De3e1']

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

  // if(ignoredPools.includes(poolAddress)){
  //   return null
  // }


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
