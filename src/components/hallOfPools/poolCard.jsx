import React from 'react'
import './styles/poolCard.scss';

export default function PoolCard() {
  return (
    <div className='poolcard'>
      <div className='pool_icons'>
          <div>
          <img
            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
            alt=""
          />
          <h5>UFT</h5>
          </div>
          <div>
          <img
            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
            alt=""
          />
          <h5>USDC</h5>
          </div>
      </div>

      <div className='pool_data'>
       <div>
        <p>Total Supply</p>
        <h5>00.00</h5>
       </div>
       <div>
       <p>Total Borrowed</p>
        <h5>00.00</h5>
       </div>
      </div>
      <div className='pool_footer'>
       <p>More Details</p>
      </div>
    </div>
  )
}
