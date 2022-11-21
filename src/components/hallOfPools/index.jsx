import React, { useState, useEffect } from 'react';
import ManageToken from '../ManageTokens/ManageToken';
import { PoolsData } from '../../utils/constants';
import PoolCard from './poolCard';
import banner from '../../assets/banner.svg';
import './styles/index.scss';
import { useSelector } from 'react-redux';
import { getAllEvents } from '../../services/events';
import { erc20Abi } from '../../core/contractData/abi';
import NoPoolFound from '../NoPoolFound';

export default function HallOfPoolsComponent(props) {
  const state = useSelector((state) => state);
  const [token1, setToken1] = useState({});
  const [token2, setToken2] = useState({});
  const [pools, setPools] = useState(PoolsData);
  const { contracts, web3 } = state;

  useEffect(() => {
    if (contracts.coreContract) {
      (async () => {
        const result = await getAllEvents(
          contracts.coreContract,
          'PoolCreated'
        );
        console.log("createdPools", result);
        // tokenData();
        //setPools(result);
      })();
    }
  }, [contracts]);

  useEffect(() => {
    let filtredData;
    if (token1.symbol && token2.symbol) {
      filtredData = pools.filter(
        (item) =>
          item.tokens
            .map((sy) => sy.toLowerCase())
            .includes(token1.symbol.toLowerCase()) &&
          item.tokens
            .map((sy) => sy.toLowerCase())
            .includes(token2.symbol.toLowerCase())
      );
    } else if (token1.symbol && !token2.symbol) {
      filtredData = pools.filter((item) =>
        item.tokens
          .map((sy) => sy.toLowerCase())
          .includes(token1.symbol.toLowerCase())
      );
    } else if (!token1.symbol && token2.symbol) {
      filtredData = pools.filter((item) =>
        item.tokens
          .map((sy) => sy.toLowerCase())
          .includes(token2.symbol.toLowerCase())
      );
    } else if (!token1.symbol && !token2.symbol) {
      filtredData = PoolsData;
    }
    setPools(filtredData);
  }, [token1, token2]);

  // const tokenData = async (address) => {
  //   const tokenContract = new web3.eth.Contract(
  //     erc20Abi,
  //     '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5'
  //   );
  //   const symbol = await tokenContract.methods.symbol().call();
  //   const decimals = await tokenContract.methods.decimals().call();
  //   const name = await tokenContract.methods.name().call();
  //   console.log({ symbol, decimals, name });
  // };
  const handleTokens = (token, selectedToken) => {
    if (selectedToken === 'token1') {
      setToken1(token);
    } else if (selectedToken === 'token2') {
      setToken2(token);
    } else {
      setToken1({})
      setToken2({})
    }
  };

  const createPool = () => {

  }

  return (
    <div className="hallofpools_container">
      <div className="banner">
        <img src={banner} alt="v2-banner" />
      </div>

      <ManageToken
        handleTokens={handleTokens}
        tokens={{ token1, token2 }}
        pools={pools}
      />

      {pools.length > 0 ? (
        <div className="poolcard_container">
          {pools.map((pool, i) => (
            <PoolCard pool={pool} key={i} />
          ))}
        </div>
      ) : (
        <div className="no_pool_container">
          <NoPoolFound
            token1={token1}
            token2={token2}
            createPool={createPool}
          />
        </div>
      )}
    </div>
  );
}
