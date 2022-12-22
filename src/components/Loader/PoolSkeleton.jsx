import React from 'react';
import './styles/poolSkeleton.scss'

export default function PoolSkeleton() {
  return (
    <>
    <div className='pool_skeleton_container'>
      <div className='token_header'>
        <div className='skeleton'></div>
        <div className='skeleton'></div>
      </div>
      <div className='content_container'>
        <div className='tabs skeleton'></div>
        <div className='input skeleton'></div>
        <div className='info skeleton'></div>
        <div className='button skeleton'></div>
      </div>
    </div>
    </>
  )
}
