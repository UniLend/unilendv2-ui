import React, { useEffect } from 'react'
import { Avatar, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { imgError  } from '../../utils';
import './styles/poolCard.scss';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import bunnytheme from '../../assets/bunnytheme.svg'
import cap from '../../assets/cap.svg'
import useWalletHook from '../../lib/hooks/useWallet';


 function PoolCard({pool, slider=false}) {
  const { poolAddress, token0, token1, totalLiquidity, totalBorrowed  } = pool;
  // const user = useSelector((state)=> state.user)
  const [poolTheme, setPoolTheme] = useState(false)
  const { address, isConnected} = useWalletHook()
  const navigate = useNavigate();

  const handleNavigate = () => {
    if(address && isConnected){
      navigate(`/pool/${poolAddress}`)
    } else {
      message.info("Please Connect to the Wallet");
    }
  };

  useEffect(() => {
    if (token0?.symbol == "SANTA" && token1?.symbol == "SNOW" && !slider) {
      setPoolTheme(true);
    }
  }, []);

  return (
    <div
      onClick={handleNavigate}
      className={`${poolTheme ? "pool_theme" : ""} poolcard`}
    >
      {poolTheme && <img src={cap} className='cap_img' alt='cap'/>}
      <div className="pool_icons">
        <div>
          <img src={token0?.logo} onError={imgError} alt="" />
          <img src={token1?.logo} onError={imgError} alt="" />
        </div>
        <p className="paragraph03">{`${token0?.symbol} / ${token1?.symbol}`}</p>
      </div>
      <div className="pool_data">
        <div>
          <p className="paragraph06">Total Supply</p>
          <h5 className="paragraph06">
            {totalLiquidity !== undefined
              ? "$" + Number(totalLiquidity).toFixed(2)
              : "$162,000"}{" "}
          </h5>
        </div>
        <div>
          <p className="paragraph06">Total Borrowed</p>
          <h5 className="paragraph06">
            {totalBorrowed !== undefined
              ? "$" + Number(totalBorrowed).toFixed(2)
              : "$102,000"}
          </h5>
        </div>
      </div>
      <div className="pool_footer">
        <p className="paragraph06">More Details</p>
      </div>
      {poolTheme && (
        <div className="footer_img">
          <img src={bunnytheme} alt="" />
        </div>
      )}
    </div>
  );
}

export default PoolCard