import React from 'react';
import './styles/poolcard.scss'

export default function PoolCardSkeleton() {
  return (
    <div className='skeleton_card'>
               <div className='pool_icons'>
          <div className='div'>
            <div className='skeleton'></div>
          </div>
          <div className='div'>
           <div className='skeleton'></div>
          </div>
      </div>

      <div className='pool_data'>
       <div className='div1'>
        <div className='skeleton' ></div>
       </div>
       <div className='div1'>
        <div className='skeleton' ></div>
       </div>
      </div>
      <div className='pool_footer'>
      <div className='skeleton' ></div>
      </div>
        </div>
  )
}
