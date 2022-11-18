import React from 'react';
import './styles/historySkeleton.scss'

export default function HistorySkeleton() {
  return (
    <div className='history_skeleton'>
      {
        new Array(6).fill(0).map(() => <div className='row skeleton'></div>)
      }
    </div>
  )
}
