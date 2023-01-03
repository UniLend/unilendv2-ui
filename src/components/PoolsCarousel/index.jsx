import React, {useState} from 'react';
import Carousel from 'react-simply-carousel';
import {LeftOutlined, RightOutlined } from '@ant-design/icons'
import PoolCard from '../hallOfPools/poolCard';
import './styles/index.scss'

export default function PoolCarousel({pools}) {
    const [activeSlide, setActiveSlide] = useState(0);
  return (
    <div className='pool_carousel_container' >
    <div className='carousel_row' >
    
    <div>
    <Carousel
        containerProps={{
            className:'containerProps'
        }}
        activeSlideIndex={activeSlide}
        onRequestChange={setActiveSlide}
        innerProps={{
            className:'innerclass'
        }}
        forwardBtnProps={{
          children: <RightOutlined style={{fontSize: '15px', fontWeight: 700}} />,
          className: "forwardBtnProps"
        }}
        backwardBtnProps={{
          children: <LeftOutlined style={{fontSize: '15px', fontWeight: 700}} />,
          className: 'backwardBtnProps'
 
        }}
        itemsToShow={3}
        speed={400}
      >
        {/* {Array.from({ length: 10 }).map((item, index) => (
          <div
            style={{
              background: "yellow",
              width: 300,
              height: 300,
              border: "30px solid white",
              textAlign: "center",
              lineHeight: "240px",
              boxSizing: "border-box"
            }}
            key={index}
          >
            {index}
          </div>
        ))} */}
         { Object.values(pools).map((pool, i) => (
           <PoolCard pool={pool} key={i} />
           ))}
      </Carousel>
      {/* { Object.values(pools).map((pool, i) => (
           <PoolCard pool={pool} key={i} />
           ))} */}
    </div>


    </div>
    </div>
  )
}
