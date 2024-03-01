import React, { useState, useEffect } from 'react';
import ManageToken from '../ManageTokens/ManageToken';
import banner from '../../assets/bannermainnet.svg';
import darkbanner from '../../assets/darkBanner.svg';
import './styles/index.scss';
import { useSelector } from 'react-redux';
import PoolCarousel from '../PoolsCarousel';
import PoolCard from '../hallOfPools/poolCard';
import PoolListSkeleton from '../Loader/PoolListSkeleton';
import NoPoolFound from '../NoPoolFound';

export default function HeroComponent() {
  const theme = useSelector((state) => state.theme);
  const poolList = useSelector((state) => state.poolList);
  const isLoadingPoolData = useSelector((state) => state.isLoadingPoolData);
  const [token1, setToken1] = useState({});
  const [token2, setToken2] = useState({});
  const [pools, setPools] = useState({});
  const [filteredPools, setFilteredPools] = useState([]);
  const [poolBackup, setPoolBackup] = useState({});

  useEffect(() => {
    if (Object.values(poolList).length > 0) {
      setPools(Object.values(poolList));
      setPoolBackup(Object.values(poolList));
    }
  }, [poolList]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (token1?.symbol && !token2?.symbol) {
      const filtered =
        Array.isArray(poolBackup) &&
        poolBackup.filter(
          (pool) =>
            String(pool?.token0.symbol)
              .toUpperCase()
              .includes(String(token1.symbol).toUpperCase()) ||
            String(pool?.token1.symbol)
              .toUpperCase()
              .includes(String(token1.symbol).toUpperCase()),
        );
      setFilteredPools(filtered);
    } else if (token2?.symbol && !token1?.symbol) {
      const filtered =
        Array.isArray(poolBackup) &&
        poolBackup.filter(
          (pool) =>
            String(pool?.token0.symbol)
              .toUpperCase()
              .includes(String(token2.symbol).toUpperCase()) ||
            String(pool?.token1.symbol)
              .toUpperCase()
              .includes(String(token2.symbol).toUpperCase()),
        );
      setFilteredPools(filtered);
    } else if (token1?.symbol && token2?.symbol) {
      const filtered =
        Array.isArray(poolBackup) &&
        poolBackup
          .filter(
            (pool) =>
              String(pool?.token0.symbol)
                .toUpperCase()
                .includes(String(token1.symbol).toUpperCase()) ||
              String(pool?.token1.symbol)
                .toUpperCase()
                .includes(String(token1.symbol).toUpperCase()),
          )
          .filter(
            (pool) =>
              String(pool?.token0.symbol)
                .toUpperCase()
                .includes(String(token2.symbol).toUpperCase()) ||
              String(pool?.token1.symbol)
                .toUpperCase()
                .includes(String(token2.symbol).toUpperCase()),
          );
      setFilteredPools(filtered);
    } else {
      setFilteredPools([]);
    }
  }, [token1, token2]);

  const handleTokens = (token, selectedToken) => {
    if (selectedToken === 'token1') {
      setToken1(token);
    } else if (selectedToken === 'token2') {
      setToken2(token);
    } else {
      setToken1({});
      setToken2({});
    }
  };

  const updateToken = (token1, token2) => {
    setToken1(token1);
    setToken2(token2);
  };

  const createPool = () => {};

  return (
    <div className='hallofpools_container'>
      <div className='banner'>
        {/* { theme == 'dark' ? <img src={darkbanner} alt="v2-banner" /> : <img src={banner} alt="v2-banner" /> }  */}
        {<img src={banner} alt='v2-banner' />}
      </div>

      <ManageToken
        handleTokens={handleTokens}
        tokens={{ token1, token2 }}
        pools={pools}
      />

      {/* {(Object.values(pools).length > 0 && !isLoadingPoolData )? (
        <div className="poolcard_container">
          { Object.values(pools).map((pool, i) => (
            <PoolCard pool={pool} key={i} />
          ))}
        </div>
      ) : ( <PoolListSkeleton/>)} */}
      {filteredPools.length > 0 ? (
        <div className='poolcard_container'>
          {filteredPools.map((pool, i) => (
            <PoolCard pool={pool} key={i} />
          ))}
        </div>
      ) : token1.symbol || token2.symbol ? (
        <div className='no_pool_container'>
          <NoPoolFound
            token1={token1}
            token2={token2}
            updateToken={updateToken}
          />
        </div>
      ) : (
        <PoolCarousel pools={pools} isLoading={!isLoadingPoolData} />
      )}

      {/* 
      {
        !user.isConnected &&  Object.values(pools).length == 0 && <div className="no_pool_container">
               <NoPoolFound
                 token1={token1}
                 token2={token2}
                 createPool={createPool}
               />
            </div>
      } */}
    </div>
  );
}

// : (!isLoadingPoolData && user.address == '0x')?
//       (<div className="no_pool_container">
//       <NoPoolFound
//         token1={token1}
//         token2={token2}
//         createPool={createPool}
//       />
//     </div>): <PoolListSkeleton/>}
