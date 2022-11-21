import React from 'react';
import './styles/ring.scss';
import ring from '../../assets/Eclipse-loader.gif';
export default function Ring() {
  return (
    <div className='ring_loader'>
    <img src={ring} alt="" />
    </div>
  )
}
