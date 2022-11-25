import React from 'react';
import './styles/poolList.scss';

export default function PoolListSkeleton() {
  return (
    <div className='pool_list_skeleton_container'>
      {
        new Array(9).fill(9).map((el) => <div className='skeleton_card skeleton'></div>)
      }
    </div>
  )
}
