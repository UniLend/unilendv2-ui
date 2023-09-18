import React, { useState, useEffect } from "react";
import ManageToken from "../ManageTokens/ManageToken";
import PoolCard from "./poolCard";
import banner from "../../assets/banner.svg";
import { FaChevronDown } from "react-icons/fa";
import "./styles/index.scss";
import { ImArrowDown2, ImArrowUp2 } from "react-icons/im";
import { useSelector } from "react-redux";
import { erc20Abi } from "../../core/contractData/abi";
import NoPoolFound from "../NoPoolFound";
import { fetchCoinLogo } from "../../utils/axios";
import PoolListSkeleton from "../Loader/PoolListSkeleton";
import PoolCarousel from "../PoolsCarousel";
import { Button } from "antd";
import DropDown from "../Common/DropDown";
import { sortByKey } from "../../helpers/dashboard";
import { handleCreatePool } from "../../services/pool";

export default function HallOfPoolsComponent() {
  const poolList = useSelector((state) => state.poolList);
  const isLoadingPoolData = useSelector((state) => state.isLoadingPoolData);
  const [token1, setToken1] = useState({});
  const [token2, setToken2] = useState({});
  const [pools, setPools] = useState([]);
  const [myPoolTab, setMyPoolTab] = useState(false);
  const [poolBackup, setPoolBackup] = useState({});

  useEffect(() => {
    if (Object.values(poolList).length > 0) {
      const toArray = Object.values(poolList).filter(
        (pool) => pool.hide == false
      );

      setPools(toArray);
      setPoolBackup(toArray);
    }
  }, [poolList]);

  const handleSort = (key, order) => {
    const sorted = sortByKey(pools, key, order);
    setPools([...sorted]);
  };

  const sortList = [
    {
      text: "TimeStamp",
      fun: () => handleSort("blockTimestamp", 1),
      icon: <ImArrowUp2 />,
    },
    {
      text: "TimeStamp",
      fun: () => handleSort("blockTimestamp", 2),
      icon: <ImArrowDown2 />,
    },
  ];

  const handleTokens = (token, selectedToken) => {
    if (selectedToken === "token1") {
      setToken1(token);
    } else if (selectedToken === "token2") {
      setToken2(token);
    } else if (selectedToken == "clear") {
      setToken1({});
      setToken2({});
    }
  };

  useEffect(() => {
    if (token1?.symbol && !token2?.symbol) {
      const filtered =
        Array.isArray(poolBackup) &&
        poolBackup.filter(
          (pool) =>
            String(pool?.token0.symbol)
              .toUpperCase()
              .includes(String(token1.symbol)) ||
            String(pool?.token1.symbol)
              .toUpperCase()
              .includes(String(token1.symbol))
        );
      setPools(filtered);
    } else if (token2?.symbol && !token1?.symbol) {
      const filtered =
        Array.isArray(poolBackup) &&
        poolBackup.filter(
          (pool) =>
            String(pool?.token0.symbol)
              .toUpperCase()
              .includes(String(token2.symbol)) ||
            String(pool?.token1.symbol)
              .toUpperCase()
              .includes(String(token2.symbol))
        );
      setPools(filtered);
    } else if (token1?.symbol && token2?.symbol) {
      const filtered =
        Array.isArray(poolBackup) &&
        poolBackup
          .filter(
            (pool) =>
              String(pool?.token0.symbol)
                .toUpperCase()
                .includes(String(token1.symbol)) ||
              String(pool?.token1.symbol)
                .toUpperCase()
                .includes(String(token1.symbol))
          )
          .filter(
            (pool) =>
              String(pool?.token0.symbol)
                .toUpperCase()
                .includes(String(token2.symbol)) ||
              String(pool?.token1.symbol)
                .toUpperCase()
                .includes(String(token2.symbol))
          );
      setPools(filtered);
    } else {
      setPools(poolBackup);
    }
  }, [token1, token2, poolBackup]);

  const createPool = () => {
    handleCreatePool();
  };

  return (
    <div className="hallofpools_container">
      {/* <div className="banner">
        <img src={banner} alt="v2-banner" />
      </div> */}
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
          <Button
            onClick={() => setMyPoolTab(false)}
            className={`pool_btn  ${!myPoolTab ? "active_btn" : ""}`}
          >
            All Pools
          </Button>
          {/* <Button
            onClick={() => setMyPoolTab(true)}
            className={`pool_btn ${myPoolTab ? "active_btn" : ""}`}
          >
            My Pools
          </Button> */}
        </div>
        <DropDown list={sortList} />
      </div>

      {pools.length > 0 && !isLoadingPoolData ? (
        <div className="poolcard_container">
          {myPoolTab
            ? pools
                .filter((pool) => pool.openPosition == true)
                .map((pool, i) => <PoolCard pool={pool} key={i} />)
            : pools.map((pool, i) => <PoolCard pool={pool} key={i} />)}
        </div>
      ) : isLoadingPoolData ? (
        <PoolListSkeleton />
      ) : (
        <NoPoolFound
          token1={token1}
          token2={token2}
          createPool={handleCreatePool}
        />
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
