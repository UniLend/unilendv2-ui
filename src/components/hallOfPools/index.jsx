import React, { useState } from 'react'
import './styles/index.scss'


export default function HallOfPoolsComponent(props) {
  const [activeToken, setActiveToken] = useState(1)

  const toggleToken = (token) => {
     setActiveToken(token)
  }
  
  return (
    <div className='pool_container'>
        <div className='token_container'>
         <div onClick={() => toggleToken(1)} className={activeToken === 1 && 'active'} >
           <img src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658" alt="" />
           <h2>UFT</h2>
         </div>
         <div onClick={() => toggleToken(2)} className={activeToken === 2 && 'active'} >
           <img src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389" alt="" />
           <h2>USDC</h2>
         </div>
        </div>
        <div className='content'></div>
    </div>
  )
}