import React, { useState, useEffect } from "react";
import ManageToken from "../ManageTokens/ManageToken";
import { PoolsData } from "../../utils/constants";
import PoolCard from "./poolCard";
import banner from "../../assets/banner.svg";
import { FaChevronDown } from "react-icons/fa";
import "./styles/index.scss";
import { useSelector } from "react-redux";
import { getAllEvents } from "../../services/events";
import { erc20Abi } from "../../core/contractData/abi";
import { getContract, getERC20Logo } from "../../services/contracts";
import NoPoolFound from "../NoPoolFound";
import { fetchCoinLogo } from "../../utils/axios";
import PoolListSkeleton from "../Loader/PoolListSkeleton";
import PoolCarousel from "../PoolsCarousel";
import { Button } from "antd";

export default function HallOfPoolsComponent(props) {
  const state = useSelector((state) => state);
  const [token1, setToken1] = useState({});
  const [token2, setToken2] = useState({});
  const [pools, setPools] = useState({});
  // const [user, setUser] = useState({});
  const [poolBackup, setPoolBackup] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { contracts, web3, poolList, isLoadingPoolData, user } = state;

  useEffect(() => {
    if (Object.values(poolList).length > 0) {
      setPools(poolList);
      setPoolBackup(poolList);
    }
  }, [poolList]);

  useEffect(() => {}, []);

  useEffect(() => {
    let filtredData;

  }, [token1, token2]);

  const handleTokens = (token, selectedToken) => {
    if (selectedToken === "token1") {
      setToken1(token);
    } else if (selectedToken === "token2") {
      setToken2(token);
    } else {
      setToken1({});
      setToken2({});
    }
  };

  const createPool = () => {};

  return (
    <div className="hallofpools_container">
      <div className="analytics_container">
        <div className="analytics"></div>
        <div className="managepool_container">
          <ManageToken
            handleTokens={handleTokens}
            tokens={{ token1, token2 }}
            pools={pools}
          />
        </div>
      </div>

      <div className="pool_filter_container">
        <div className="pool_tans">
          <Button className="pool_btn active_btn" >All Pools</Button>
          <Button className="pool_btn" >My Pools</Button>
        </div>
        <div className="sortBy">
          <p>Sort By</p>
          <FaChevronDown />
        </div>
      </div>

      {Object.values(pools).length > 0 && !isLoadingPoolData ? (
        <div className="poolcard_container">
          {Object.values(pools).map((pool, i) => (
            <PoolCard pool={pool} key={i} />
          ))}
        </div>
      ) : (
        <PoolListSkeleton />
      )}
      {/* <PoolCarousel pools={pools} isLoading={!isLoadingPoolData}/> */}

      {/* 
      {
        !user.isConnected &&  Object.values(pools).length == 0 && <div className="no_pool_container">
               <NoPoolFound
                 token1={token1}
                 token2={token2}
                 createPool={createPool}
               />
            </div>
      } */}
    </div>
  );
}

// : (!isLoadingPoolData && user.address == '0x')?
//       (<div className="no_pool_container">
//       <NoPoolFound
//         token1={token1}
//         token2={token2}
//         createPool={createPool}
//       />
//     </div>): <PoolListSkeleton/>}
