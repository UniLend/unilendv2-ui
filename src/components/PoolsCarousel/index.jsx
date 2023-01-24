import React, { useState } from "react";
import Carousel from "react-simply-carousel";
import { FaChevronDown } from 'react-icons/fa'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import PoolCard from "../hallOfPools/poolCard";
import "./styles/index.scss";
import PoolCardSkeleton from "../Loader/PoolCardSkeleton";

export default function PoolCarousel({ pools, isLoading }) {
  const [activeSlide1, setActiveSlide1] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);

  return (
    <div className="pool_carousel_container">
      <div className="carousel_row">
        <div className="title_sort_container" >
            <h2>New Pools</h2>
            <div className='sortBy'>
            <p>Sort By</p>
            <FaChevronDown />
          </div>
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
            itemsToShow={2}
            speed={400}
          >
            {Object.values(pools).length > 0 && isLoading
              ? Object.values(pools).map((pool, i) => (
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
            <h2>New Pools</h2>
            <div className='sortBy'>
            <p>Sort By</p>
            <FaChevronDown />
          </div>
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
            itemsToShow={2}
            speed={400}
          >
            {Object.values(pools).length > 0 && isLoading
              ? Object.values(pools).map((pool, i) => (
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
