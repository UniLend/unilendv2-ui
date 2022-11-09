import React, { useState } from 'react';
import { Slider, Button } from 'antd';
import './styles/index.scss';
import { useEffect } from 'react';
import { useFetcher, useParams } from 'react-router-dom';
import { contractAddress } from '../../core/contractData/contracts_sepolia';
import {
  getPoolBasicData,
  getPoolAllData,
  getTokenPrice,
  getOracleData,
} from '../../services/pool';
import { useSelector } from 'react-redux';

const lend = 'lend';
const borrow = 'borrow';
const redeem = 'redeem';
const repay = 'repay';

export default function PoolComponent(props) {
  const { contracts, user } = props;
  const [activeToken, setActiveToken] = useState(0);
  const [selectedToken, setSelectedToken] = useState({});
  const [collateralToken, setCollaterralToken] = useState({});
  const [activeOperation, setActiveOperation] = useState(lend);
  const [selectLTV, setSelectLTV] = useState(5);
  const [poolData, setPoolData] = useState({});
  const [max, setMax] = useState(false);
  const [methodLoaded, setMethodLoaded] = useState({
    getPoolData: false,
    getPoolFullData: false,
    getOraclePrice: false,
    getPoolTokensData: false,
  });
  const { poolAddress } = useParams();
  const state = useSelector((state) => state);


  const toggleToken = (token) => {
    setActiveToken(token);
    if (token === 0) {
      setSelectedToken(poolData.token0);
      setCollaterralToken(poolData.token1);
    } else {
      setSelectedToken(poolData.token1);
      setCollaterralToken(poolData.token0);
    }
  };

  const toggleOperation = (operation) => {
    setActiveOperation(operation);
  };

  const handleLTVSlider = (value) => {
    setSelectLTV(value);
  };

  useEffect(() => {
    if (contracts.helperContract && contracts.coreContract) {
      (async function () {
        if (!methodLoaded.getPoolData) {
          const pool = await getPoolBasicData(contracts, poolAddress, poolData);
          setPoolData(pool);
          setMethodLoaded({ ...methodLoaded, getPoolData: true });
        } else if (methodLoaded.getPoolData && !methodLoaded.getPoolFullData) {
          const pool = await getPoolAllData(
            contracts,
            poolData,
            contractAddress.positionAddress,
            poolAddress,
            user.address
          );
          setMethodLoaded({ ...methodLoaded, getPoolFullData: true });
          setPoolData(pool);
        } else if (
          methodLoaded.getPoolData &&
          methodLoaded.getPoolFullData &&
          !methodLoaded.getOraclePrice
        ) {
          const pool = await getOracleData(contracts, poolData);
          setPoolData(pool);
          setMethodLoaded({ ...methodLoaded, getOraclePrice: true });
        } else if (
          methodLoaded.getPoolData &&
          methodLoaded.getPoolFullData &&
          methodLoaded.getOraclePrice &&
          !methodLoaded.getPoolTokensData
        ) {
          const poolTokensPrice = await getTokenPrice(
            contracts,
            poolData,
            poolAddress,
            user.address
          );
          setPoolData(poolTokensPrice);
          setMethodLoaded({ ...methodLoaded, getPoolTokensData: true });
          setSelectedToken(poolData.token0);
          setCollaterralToken(poolData.token1);
        }
      })();
    }
  }, [contracts, methodLoaded]);

  // max trigger for sending max values in redeem, lend, borrow, repay;
  const maxTrigger = () => {
    setMax(true);
    handleMax(true);
    if (activeOperation === lend) {
      setAmount(selectedToken.balanceFixed);
    } else if (activeOperation === borrow) {
      const maxBorrow = getBorrowMax(selectedToken, poolData);
      setAmount(maxBorrow);
      setValueLTV(poolData.ltv);
    } else if (activeOperation === redeem) {
      if (
        greaterThan(
          selectedToken.tokenLiquidityFixed,
          selectedToken.redeemBalanceFixed
        )
      ) {
        setAmount(selectedToken.redeemBalanceFixed);
      } else {
        setAmount(selectedToken.tokenLiquidityFixed);
      }
    } else if (activeOperation == repay) {
      setAmount(selectedToken.borrowBalanceFixed);
    }
  };

  return (
    <div className='pool_container'>
      <div className='token_container'>
        <div
          onClick={() => toggleToken(0)}
          className={activeToken === 0 ? 'active' : ''}
        >
          <img
            src='https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658'
            alt=''
          />
          <h2>UFT</h2>
        </div>
        <div
          onClick={() => toggleToken(1)}
          className={activeToken === 1 ? 'active' : ''}
        >
          <img
            src='https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389'
            alt=''
          />
          <h2>USDC</h2>
        </div>
      </div>
      <div className='content'>
        <div className='oparation_tab'>
          <div
            onClick={() => toggleOperation(lend)}
            className={activeOperation === lend ? 'active' : ''}
          >
            Lend
          </div>
          <div
            onClick={() => toggleOperation(redeem)}
            className={activeOperation === redeem ? 'active' : ''}
          >
            Redeem
          </div>
        </div>

        <div className='user_liquidity'>
          <p>Your Liquidity</p>
          <h1>100,00</h1>
        </div>

        <div className='token_balance_container'>
          <div className='lable'>
            <p>{activeOperation}</p>
          </div>
          <div className='token_balance'>
            <div>
              <img
                src='https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658'
                alt=''
              />
              <p>UFT</p>
            </div>
            <p>Balance: 165</p>
          </div>
        </div>

        <div className='input_container'>
          <input type='text' placeholder='0.0' />
          <button className='max_btn'>MAX</button>
        </div>

        {activeOperation === redeem && (
          <div className='ltv_container'>
            <p>
              <span>Current LTV</span>
              <span>68%</span>
            </p>
            <p>
              <span>Select LTV</span>
              <span>
                {' '}
                <span>{selectLTV}%/</span>75%{' '}
              </span>
            </p>
            <Slider
              value={Number(selectLTV)}
              defaultValue={Number(selectLTV)}
              onChange={handleLTVSlider}
              min={5}
              max={75}
              tooltipVisible={false}
              className='ltv_slider'
            />
          </div>
        )}

        {activeOperation === lend && (
          <div className='analytics'>
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
          <div className='liquidity_factors'>
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
        <div className='operation_btn'>
          <Button>Lend</Button>
        </div>
      </div>
    </div>
  );
}
