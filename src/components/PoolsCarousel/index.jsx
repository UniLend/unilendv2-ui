import React, { useState } from "react";
import Carousel from "react-simply-carousel";
import { FaChevronDown } from 'react-icons/fa'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {ImArrowDown2, ImArrowUp2} from 'react-icons/im'
import PoolCard from "../hallOfPools/poolCard";
import "./styles/index.scss";
import PoolCardSkeleton from "../Loader/PoolCardSkeleton";
import DropDown from "../Common/DropDown";
import { useEffect } from "react";
import { sortByKey } from "../../helpers/dashboard";

export default function PoolCarousel({ pools, isLoading }) {
  const [activeSlide1, setActiveSlide1] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);
  const [poolDataByTime, setPoolDataByTime] = useState([])
  const [poolDataByLiquidity, setPoolDataByLiquidity] = useState([])


  const handleSort = (key, order) => {
    const poolsObjectArray = Object.values(pools).filter((pool)=> pool.hide == false)
    const sortBy = sortByKey(poolsObjectArray, key, order)
  
    if(key == 'blockTimestamp'){
      setPoolDataByTime(sortBy)
    } else if (key == 'totalLiquidity'){
      setPoolDataByLiquidity(sortBy)
    }
  }

  const blocktimeSortList = [
    {
      text: 'Created',
      fun: () => handleSort('blockTimestamp', 1),
      icon: <ImArrowUp2/>
    },
    {
      text: 'Created',
      fun: () => handleSort('blockTimestamp', 2),
      icon: <ImArrowDown2/>
    }
  ]

  const liquiditySortList = [
    {
      text: 'Liquidity',
      fun: () => handleSort('totalLiquidity', 1),
      icon: <ImArrowUp2/>
    },
    {
      text: 'Liquidity',
      fun: () => handleSort('totalLiquidity', 2),
      icon: <ImArrowDown2/>
    }
  ]

  useEffect(() => {
    handleSort('blockTimestamp', 1)
    handleSort('totalLiquidity', 1)
  },[pools])

  return (
    <div className="pool_carousel_container">
      <div className="carousel_row">
        <div className="title_sort_container" >
            <h2>New Pools</h2>
           <DropDown list={blocktimeSortList}/>
        </div>
        <div className="carousel_container ">
          <Carousel
            containerProps={{
              className: "containerProps",
            }}
            activeSlideIndex={activeSlide1}
            onRequestChange={setActiveSlide1}
            infinite={false}
            innerProps={{
              className: "innerclass",
            }}
            forwardBtnProps={{
              children: (
                <RightOutlined style={{ fontSize: "15px", fontWeight: 700 }} />
              ),
              className: "forwardBtnProps",
            }}
            backwardBtnProps={{
              children: (
                <LeftOutlined style={{ fontSize: "15px", fontWeight: 700 }} />
              ),
              className: "backwardBtnProps",
            }}
            itemsToShow={1}
            speed={400}
          >
            {poolDataByTime.length > 0 && isLoading
              ? poolDataByTime.map((pool, i) => (
                  <div className="poolcard_div">
                    {" "}
                    <PoolCard pool={pool} key={i} />{" "}
                  </div>
                ))
              : new Array(5).fill(0).map((pool, i) => (
                  <div className="poolcard_div">
                    {" "}
                    <PoolCardSkeleton />{" "}
                  </div>
                ))}
          </Carousel>
        </div>
        <br />
        <div className="title_sort_container" >
            <h2>High Liquidity Pools</h2>
            <DropDown list={liquiditySortList}/>
        </div>
        <div className="carousel_container" >
          <Carousel
            containerProps={{
              className: "containerProps",
            }}
            activeSlideIndex={activeSlide2}
            onRequestChange={setActiveSlide2}
            infinite={false}
            innerProps={{
              className: "innerclass",
            }}
            forwardBtnProps={{
              children: (
                <RightOutlined style={{ fontSize: "15px", fontWeight: 700 }} />
              ),
              className: "forwardBtnProps",
            }}
            backwardBtnProps={{
              children: (
                <LeftOutlined style={{ fontSize: "15px", fontWeight: 700 }} />
              ),
              className: "backwardBtnProps",
            }}
            itemsToShow={3}
            speed={400}
          >
            {poolDataByLiquidity.length > 0 && isLoading
              ? poolDataByLiquidity.map((pool, i) => (
                  <div className="poolcard_div">
                    {" "}
                    <PoolCard pool={pool} key={i} />{" "}
                  </div>
                ))
              : new Array(5).fill(0).map((pool, i) => (
                  <div className="poolcard_div">
                    {" "}
                    <PoolCardSkeleton />{" "}
                  </div>
                ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
