import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getTokenLogo } from '../../utils';
import './styles/poolCard.scss';

export default function PoolCard({pool}) {
  const { poolAddress, tokens,supply, borrowed } = pool;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/pool/${poolAddress}`)
  }

  return (
    <div onClick={handleNavigate} className='poolcard'>
      <div className='pool_icons'>
          <div>
          <img
            src={getTokenLogo(tokens[0])}
            alt=""
          />
          <h5>UFT</h5>
          </div>
          <div>
          <img
            src={getTokenLogo(tokens[1])}
            alt=""
          />
          <h5>USDC</h5>
          </div>
      </div>

      <div className='pool_data'>
       <div>
        <p>Total Supply</p>
        <h5>{supply}</h5>
       </div>
       <div>
       <p>Total Borrowed</p>
        <h5>{borrowed}</h5>
       </div>
      </div>
      <div className='pool_footer'>
       <p>More Details</p>
      </div>
    </div>
  )
}
