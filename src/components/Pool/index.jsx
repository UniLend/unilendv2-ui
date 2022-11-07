
import React, { useState } from "react";
import { Slider, Button } from "antd";
import "./styles/index.scss";
import { useEffect } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { contractAddress } from "../../core/contractData/contracts_sepolia";
import { fixed2Decimals , greaterThan, decimal2Fixed, add, sub, mul, div} from "../../helpers/contracts";
const lend = "lend";
const borrow = "borrow";
const redeem = "redeem";
const repay = "repay";

export default function PoolComponent(props) {
  const { contracts, user } = props;
  const [activeToken, setActiveToken] = useState(1);
  const [activeOperation, setActiveOperation] = useState(lend);
  const [selectLTV, setSelectLTV] = useState(5);
  const [poolData, setPoolData] = useState({});
  const [methodLoaded, setMethodLoaded] = useState({
  getPoolData: false,
  getPoolFullData: false,
  getOraclePrice: false
  })
  const { poolAddress } = useParams();

  const toggleToken = (token) => {
    setActiveToken(token);
  };

  const toggleOperation = (operation) => {
    setActiveOperation(operation);
  };

  const handleLTVSlider = (value) => {
    setSelectLTV(value);
  };

  const methodArray = [
    {
      contractInstance: contracts.helperContract,
      method: contracts.helperContract?.methods?.getPoolData,
      arguments: [poolAddress]
    },
    {
      contractInstance: contracts.helperContract,
      method: contracts.helperContract?.methods?.getPoolFullData,
      arguments: [contractAddress.positionAddress, poolAddress, user.address]
    }
  ]

  const getPoolBasicData = async () => {
    if(contracts.helperContract && contracts.coreContract) {
       contracts.helperContract.methods.getPoolData(poolAddress).call((error, data) => {
        const pool = {
          ...poolData,
          _address: poolAddress,
          ltv : data.ltv,
          lb : data.lb,
          rf : data.rf,
          token0: {
            _symbol: data._symbol0,
            _address: data._token0,
            _decimals: data._decimals0,
            _liquidity: data._token0Liquidity
          },
          token1: {
            _symbol: data._symbol1,
            _address: data._token1,
            _decimals: data._decimals1,
            _liquidity: data._token1Liquidity
          },
        };
        console.log(pool);
        setPoolData(pool);
        setMethodLoaded({ ...methodLoaded, getPoolData: true})
        return pool;
      })
  }
}

const getPoolAllData = async () => {
  if(contracts.helperContract && contracts.coreContract) {
     contracts.helperContract.methods.getPoolFullData(contractAddress.positionAddress, poolAddress, user.address).call((error, data) => {
     const pool = {
      ...poolData,
      token0: {
        ...poolData?.token0,
        borrowBalance: data._borrowBalance0,
        borrowBalanceFixed: fixed2Decimals(data._borrowBalance0, poolData.token0._decimals),

        borrowShare: data._borrowShare0,
        borrowShare: fixed2Decimals(data._borrowShare0, poolData.token0._decimals),

        healthFactor18: data._healthFactor0,
        healthFactorFixed: fixed2Decimals(data._healthFactor0, poolData.token0._decimals),
        healthFactor: greaterThan(fixed2Decimals(data._healthFactor0, poolData.token0._decimals), 100) ? '100': Number(fixed2Decimals(data._healthFactor0, poolData.token0._decimals)).toFixed(2),

        interest: data._interest0,
        interestFixed: fixed2Decimals(data._interest0, poolData.token0._decimals),

        lendBalance: data._lendBalance0,
        lendBalanceFixed: fixed2Decimals(data._lendBalance0, poolData.token0._decimals),

        lendShare: data._lendShare0,
        lendShareFixed: fixed2Decimals(data._lendShare0, poolData.token0._decimals),

        totalBorrow: data._totalBorrow0,
        totalBorrowFixed: fixed2Decimals(data._totalBorrow0, poolData.token0._decimals),

        totalBorrowShare: data._totalBorrowShare0,
        totalBorrowShareFixed: fixed2Decimals(data._totalBorrowShare0, poolData.token0._decimals),

        totalLendShare: data._totalLendShare0,
        totalLendShareFixed: fixed2Decimals(data._totalLendShare0, poolData.token0._decimals),
      },
      token1:{
        ...poolData?.token1,
        borrowBalance: data._borrowBalance1,
        borrowBalanceFixed: fixed2Decimals(data._borrowBalance1, poolData.token1._decimals),

        borrowShare: data._borrowShare1,
        borrowShare: fixed2Decimals(data._borrowShare1, poolData.token1._decimals),

        healthFactor18: data._healthFactor1,
        healthFactorFixed: fixed2Decimals(data._healthFactor1, poolData.token1._decimals),
        healthFactor: greaterThan(fixed2Decimals(data._healthFactor1, poolData.token1._decimals), 100) ? '100': Number(fixed2Decimals(data._healthFactor1, poolData.token1._decimals)).toFixed(2),

        interest: data._interest1,
        interestFixed: fixed2Decimals(data._interest0, poolData.token0._decimals),

        lendBalance: data._lendBalance1,
        lendBalanceFixed: fixed2Decimals(data._lendBalance1, poolData.token1._decimals),

        lendShare: data._lendShare1,
        lendShareFixed: fixed2Decimals(data._lendShare1, poolData.token1._decimals),

        totalBorrow: data._totalBorrow1,
        totalBorrowFixed: fixed2Decimals(data._totalBorrow1, poolData.token1._decimals),

        totalBorrowShare: data._totalBorrowShare1,
        totalBorrowShareFixed: fixed2Decimals(data._totalBorrowShare1, poolData.token1._decimals),

        totalLendShare: data._totalLendShare1,
        totalLendShareFixed: fixed2Decimals(data._totalLendShare1, poolData.token1._decimals),
      }
     };
      console.log("getPoolAllData", pool);
      setMethodLoaded({ ...methodLoaded, getPoolFullData: true})
      setPoolData(pool);
    })
}
}

const getOracleData = () => {
  if(contracts.helperContract && contracts.coreContract) {
    contracts.coreContract.methods.getOraclePrice(
      poolData.token0._address,
      poolData.token1._address,
      decimal2Fixed(1, poolData.token0._decimals)
    ).call((err, data) => {
      const tmpPrice = fixed2Decimals(data, poolData.token0._decimals);
      const pool = {...poolData};
      pool.token0.price = tmpPrice;
      pool.token1.price = (1/tmpPrice).toString();
      pool.token0.collateralBalance = mul(mul(pool.token1.borrowBalance,  pool.token1.price / pool.ltv  ), 100)
      pool.token0.collateralBalanceFixed = fixed2Decimals(pool.token0.collatoralBalance, pool.token0._decimals)
      pool.token1.collateralBalance = mul(mul(pool.token0.borrowBalance,  pool.token0.price / pool.ltv  ), 100)
      pool.token1.collateralBalanceFixed = fixed2Decimals(pool.token1.collatoralBalance, pool.token1._decimals)

      let redeem0 = sub(
        poolData.token0.lendBalance,
        poolData.token0.collateralBalance
      );
      poolData.token0.redeemBalance = redeem0 >= 0 ? redeem0 : 0;

      poolData.token0.redeemBalanceFixed =  fixed2Decimals(
        poolData.token0.redeemBalance,
        poolData.token0._decimals
      ) ;

      let redeem1 = sub(
        poolData.token1.lendBalance ,
        poolData.token1.collateralBalance 
      )
  
      console.log("redeem", redeem1, poolData.token1.lendBalance, poolData.token1.collateralBalance);
      poolData.token1.redeemBalance = redeem1 >= 0 ? redeem1 : 0;
      poolData.token1.redeemBalanceFixed = fixed2Decimals(
        poolData.token1.redeemBalance,
        poolData.token1._decimals
      );

      setPoolData(pool);

      console.log("getOracle", pool, tmpPrice);
    })
  }
  
}

  useEffect(() => {
    if(!methodLoaded.getPoolData){
    getPoolBasicData();    
    }
  }, [contracts])

  useEffect(() => {
    if(methodLoaded.getPoolData && !methodLoaded.getPoolFullData){
    getPoolAllData();
    }
  }, [methodLoaded])


  useEffect(() => {
    if(methodLoaded.getPoolData && methodLoaded.getPoolFullData && !methodLoaded.getOraclePrice){
      getOracleData();
    }
  }, [methodLoaded])


  return (
    <div className="pool_container">
      <div className="token_container">
        <div
          onClick={() => toggleToken(1)}
          className={activeToken === 1 ? "active": ''}
        >
          <img
            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
            alt=""
          />
          <h2>UFT</h2>
        </div>
        <div
          onClick={() => toggleToken(2)}
          className={activeToken === 2 ? "active": ''}
        >
          <img
            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
            alt=""
          />
          <h2>USDC</h2>
        </div>
      </div>
      <div className="content">
        <div className="oparation_tab">
          <div
            onClick={() => toggleOperation(lend)}
            className={activeOperation === lend ? "active" : ''}
          >
            Lend
          </div>
          <div
            onClick={() => toggleOperation(redeem)}
            className={activeOperation === redeem ? "active": ''}
          >
            Redeem
          </div>
        </div>

        <div className="user_liquidity">
          <p>Your Liquidity</p>
          <h1>100,00</h1>
        </div>

        <div className="token_balance_container">
          <div className="lable">
            <p>{activeOperation}</p>
          </div>
          <div className="token_balance">
            <div>
              <img
                src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                alt=""
              />
              <p>UFT</p>
            </div>
            <p>Balance: 165</p>
          </div>
        </div>

        <div className="input_container">
          <input type="text" placeholder="0.0" />
          <button className="max_btn">MAX</button>
        </div>

        {activeOperation === redeem && (
          <div className="ltv_container">
            <p>
              <span>Current LTV</span>
              <span>68%</span>
            </p>
            <p>
              <span>Select LTV</span>
              <span>
                {" "}
                <span>{selectLTV}%/</span>75%{" "}
              </span>
            </p>
            <Slider
              value={Number(selectLTV)}
              defaultValue={Number(selectLTV)}
              onChange={handleLTVSlider}
              min={5}
              max={75}
              tooltipVisible={false}
              className="ltv_slider"
            />
          </div>
        )}

        {activeOperation === lend && (
          <div className="analytics">
            <div>
              <span>Lend APY</span>
              <h3>12.25%</h3>
            </div>
            <div>
              <span>Utilization rate</span>
              <h3>85.00%</h3>
            </div>
            <div>
              <span>Health Factor</span>
              <h3>1</h3>
            </div>
          </div>
        )}

        {activeOperation === redeem && (
          <div className="liquidity_factors">
            <p>
              <span>Liquidity</span>
              <span>91.967 OMATIC</span>
            </p>
            <p>
              <span>Utilization</span>
              <span>0.000 </span>
            </p>
            <p>
              <span>Oracle</span>
              <span>1 OMATIC = 1 UFT </span>
            </p>
          </div>
        )}
        <div className="operation_btn">      
          <Button >Lend</Button>
        </div>

      </div>
    </div>
  );
}
