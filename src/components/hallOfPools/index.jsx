import React from 'react'
import ManageToken from '../ManageTokens/ManageToken';
import { PoolsData } from '../../utils/constants';
import PoolCard from './poolCard';
import banner from '../../assets/banner.svg'
import './styles/index.scss'


export default function HallOfPoolsComponent(props) {

  return (
    <div className='hallofpools_container'>
       <div className='banner'>
        <img src={banner} alt="v2-banner" />
       </div>

       <ManageToken/>

       <div className='poolcard_container'>
         {
          PoolsData.map((pool) => <PoolCard pool={pool} />)
         }
       </div>
    </div>
  );
}
