import React, { useState, useEffect } from 'react';
import ManageToken from '../ManageTokens/ManageToken';
import { PoolsData } from '../../utils/constants';
import PoolCard from './poolCard';
import banner from '../../assets/banner.svg';
import './styles/index.scss';
import { useSelector } from 'react-redux';
import { getAllEvents } from '../../services/events';
import { erc20Abi } from '../../core/contractData/abi';

export default function HallOfPoolsComponent(props) {
  const state = useSelector((state) => state);
  const [pools, setPools] = useState([]);
  const { contracts, web3 } = state;

  useEffect(() => {
    if (contracts.coreContract) {
      (async () => {
        const result = await getAllEvents(
          contracts.coreContract,
          'PoolCreated'
        );
        console.log(result);
        // tokenData();
        setPools(result);
      })();
    }
  }, [contracts]);

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

  return (
    <div className='hallofpools_container'>
      <div className='banner'>
        <img src={banner} alt='v2-banner' />
      </div>

      <ManageToken />

      <div className='poolcard_container'>
        {PoolsData.map((pool, i) => (
          <PoolCard pool={pool} key={i} />
        ))}
      </div>
    </div>
  );
}
