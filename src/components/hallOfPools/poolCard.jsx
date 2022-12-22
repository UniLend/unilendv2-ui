import React, {useState, useEffect} from 'react'
import { Avatar, message } from 'antd';
import Lottie from 'react-lottie';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTokenLogo, imgError  } from '../../utils';
import './styles/poolCard.scss';
import grass from "../../assets/poolGrass.svg"
import hat from "../../assets/christmashat.json"
import { useSelector } from 'react-redux';

export default function PoolCard({pool, index}) {
  const { poolAddress, token0, token1 } = pool;
  const {user} = useSelector((state)=> state );
  const [isNewPool, setIsNewPool] = useState(false)
  const navigate = useNavigate();

   const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: hat,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const handleNavigate = () => {
    if(user.isConnected){
      navigate(`/pool/${poolAddress}`)
    } else {
      message.info("Please Connect to the Wallet")
    }
  }

  useEffect(() => {
 if (token0?.symbol == "SANTA" && token1?.symbol == "GIFT"){
  setIsNewPool(true)
 } 
  }, [])


  return (
    <div onClick={handleNavigate} className={` ${isNewPool ? "new_pool": ""} poolcard`}>
      { isNewPool &&  <div className='christmas_hat' >
        <Lottie  options={defaultOptions}  />
         </div> }
      <div className='pool_icons'>
          <div>
          <img
            src={token0?.logo}
            onError={imgError}
            alt="token0"
          />
          <h5>{token0?.symbol}</h5>
          </div>
          <div>
          <img
            src={token1?.logo}
            onError={imgError}
            alt="token1"
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
     { isNewPool && <img src={grass} className="grass" alt="" /> }
    </div>
  )
}
