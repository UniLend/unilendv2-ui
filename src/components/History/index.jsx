import React, { useEffect, useMemo, useState } from "react";
import "./styles/index.scss";
import { Popover, Pagination } from "antd";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { shortenAddress, imgError } from "../../utils";
import { allTransaction } from "../../services/events";
import txIcon from "../../assets/tx.svg";
import noTxt from "../../assets/notxt.svg";
import { fixed2Decimals, fromBigNumber } from "../../helpers/contracts";
import HistorySkeleton from "../Loader/HistorySkeleton";
import { getHistoryGraphQuery, sortByKey } from "../../helpers/dashboard";
import { getAccount, getNetwork } from "@wagmi/core";
import DropDown from "../Common/DropDown";
import {ImArrowDown2, ImArrowUp2} from 'react-icons/im'
import loader from '../../assets/Eclipse-loader.gif'

 function HistoryComponent(props) {
  const { contracts, user, web3, poolList, tokenList } = props;
  const navigate = useNavigate();

  const { address } = getAccount();
  const newArray = new Array(50).fill(0).map((el, i) => i + 1);
  const [txtData, setTxtData] = useState([]);
  const [graphHistory, setGraphHistory] = useState([]);
  const [graphHistoryBackup, setGraphHistoryBackup] = useState([]);
  const [txtDataBackup, setTxtDataBackup] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(6);
  const [sortIndex, setSortIndex] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPolygon, setIsPolygon] = useState(false);
  const [search, setSearch] = useState("");
  const [poolsData, setPoolsData] = useState({});
  const query = getHistoryGraphQuery(address);
  const [called, setIsCalled] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
 
  const { data, loading, error } = useQuery(query);
 
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    if(!user.isConnected){
      navigate('/')
    }
    const { chain } = getNetwork();
    if (chain?.id == 80001) {
      const pools = {};
      for (const key in poolList) {
        const pool = poolList[key];
        pools[String(pool.poolAddress).toUpperCase()] = pool;
      }

      setPoolsData(pools);
      setIsPolygon(true);

      if (data && Object.values(pools).length > 0) {
        const newArray = [
          ...data.borrows,
          ...data.lends,
          ...data.redeems,
          ...data.repayBorrows,
        ];
        const sorted = sortByKey(newArray, "blockTimestamp", 1);
        setGraphHistory(sorted);
        setGraphHistoryBackup(sorted);
        setIsPageLoading(false);
        setHistoryLoading(false)
      }
    } else {
      setIsPolygon(false);
    }
  }, [data, poolList]);

  const handleSort = (index) => {
    const sortTo = isPolygon ? graphHistory : txtData;
    let sort = sortTo;
    setSortIndex(index);
    if (index === 1) {
      sort = sortTo.sort(function (a, b) {
        // Compare the 2 blocknumbers
        if (a.blockNumber < b.blockNumber) return 1;
        if (a.blockNumber > b.blockNumber) return -1;
        return 0;
      });
    } else if (index == 2) {
      sort = sortTo.sort(function (a, b) {
        // Compare the 2 blocknumbers
        if (a.blockNumber < b.blockNumber) return -1;
        if (a.blockNumber > b.blockNumber) return 1;
        return 0;
      });
    }
    setTxtData(sort);
    setTxtDataBackup(sort);
  };

  const handleSearch = (e) => {
    const value = String(e.target.value).toUpperCase().trim();
    setSearch(value);
    if (isPolygon) {
      let searched = graphHistoryBackup.filter(
        (txt) => 
          String(txt.pool).toUpperCase().includes(value) ||
          String(txt.tokenSymbol).toUpperCase().includes(value) ||
          String(txt.__typename).toUpperCase().includes(value)
      );
      if(value == ''){
        searched = graphHistoryBackup
      }
      setGraphHistory(searched)
    } else {
      const newData = txtDataBackup.filter((data) => String(data));
      //setTxtData(newData);
    }
  };

  const getTransactionData = async () => {
    if (!isPolygon && !called) {
      try {
        // setIsPageLoading(true);
        setHistoryLoading(true)
        const txtArray = await allTransaction(
          contracts.coreContract,
          contracts.positionContract,
          user.address,
          poolList,
          setTxtData,
          setIsPageLoading
        );
        if (txtArray.length > 0) {
          const sort = txtArray.sort(function (a, b) {
            // Compare the 2 dates
            if (a.blockNumber < b.blockNumber) return 1;
            if (a.blockNumber > b.blockNumber) return -1;
            return 0;
          });
          setTxtData(sort);
          setTxtDataBackup(sort);
          setHistoryLoading(false)
        }
        setIsPageLoading(false);
      } catch (error) {
        console.log("Error", {error});
        setIsPageLoading(false);
        setHistoryLoading(false)
      }
    }
  };

  
  useEffect(() => {
    // if(!user.isConnected){
    //   navigate('/')
    // }
    if (user.address && contracts?.coreContract?.address && !called) {
 
      getTransactionData();
      setIsCalled(true)
    }
  }, [contracts, user, web3]);

  const dropdownlist = [
 {
  text: 'Transaction',
  fun: () => handleSort(1),
  icon: <ImArrowUp2 />
 },
 {
  text: 'Transaction',
  fun: () => handleSort(2),
  icon: <ImArrowDown2 />
 }
  ]



  return (
    <div className="history_table_container">
      <div className="action_container">
        <div className="input_container">
          <input
            type="text"
            placeholder="Search Txt/Token/Type"
            value={search}
            onChange={handleSearch}
          />
        </div>
       { !historyLoading?  <DropDown list={dropdownlist}/>:
        <div className="gif_loader">
          
        <span>Loading</span>
        <img src={loader} alt="" />
        </div>
   }
      </div>
      <div className="table_header">
        <div>
          <p>Pools</p>
        </div>
        <div>
          <p>Token</p>
        </div>
        <div>
          <p>Type</p>
        </div>
        <div>
          <p>Amount</p>
        </div>
        <div className="hide_for_mobile">
          <p>Tx Status</p>
        </div>
        <div>
          <p>Tx ID</p>
        </div>
      </div>
      {isPolygon ? (
        <div className="table_list_container">
          {graphHistory.length > 0 &&
          Object.values(poolsData).length > 0 &&
          !isPageLoading &&
          user.isConnected ? (
            graphHistory
              .slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
              .map((txt, i) => (
                <div key={i} className="table_item">
                  <div>
                    <div>
                      <img
                        src={
                          poolsData[String(txt.pool).toUpperCase()].token0.logo
                        }
                        onError={imgError}
                        alt=""
                      />
                      <img
                        src={
                          poolsData[String(txt.pool).toUpperCase()].token1.logo
                        }
                        onError={imgError}
                        alt=""
                      />
                    </div>
                    <p className="hide_for_mobile hide_for_tab">
                      {poolsData[String(txt.pool).toUpperCase()].token0.symbol +
                        "/" +
                        poolsData[String(txt.pool).toUpperCase()].token1.symbol}
                    </p>
                  </div>
                  <div>
                    <p>{txt?.tokenSymbol}</p>
                  </div>
                  <div>
                    <p>
                      {txt?.__typename == "RepayBorrow"
                        ? "Repay"
                        : txt?.__typename}
                    </p>
                  </div>
                  <div>
                    <p>
                      {Number(fromBigNumber(txt?.amount) / 10 ** 18).toFixed(2)}
                      {/* {(Number(txt.returnValues._amount) / 10 ** 18).toFixed(4)} */}
                    </p>
                  </div>
                  <div className="hide_for_mobile">
                    <p className="success">Complete</p>
                  </div>
                  <div className="hide_for_mobile">
                    <p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txt?.transactionHash}`}
                        target="_blank"
                      >
                        {shortenAddress(txt?.transactionHash)}
                      </a>
                    </p>
                  </div>
                  <div className="tx_icon">
                    {" "}
                    <img src={txIcon} alt="" />{" "}
                  </div>
                </div>
              ))
          ) : isPageLoading && user.isConnected ? (
            <HistorySkeleton />
          ) : (
            <div className="no_transaction">
              <img src={noTxt} alt="" />
              <h1>No Transactions Found</h1>
            </div>
          )}
        </div>
      ) : (
        <div className="table_list_container">
          {txtData.length > 0 && !isPageLoading && user.isConnected ? (
            txtData
              .slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
              .map((txt, i) => (
                <div key={i} className="table_item">
                  <div>
                    <div>
                      <img
                        src={poolList[ txt.address]?.token0?.logo}
                        onError={imgError}
                        alt={poolList[txt.address]?.token0?.symbol}
                      />
                      <img
                        src={poolList[txt.address]?.token1?.logo}
                        onError={imgError}
                        alt={poolList[txt.address]?.token1?.symbol}
                      />
                    </div>
                    <p className="hide_for_mobile hide_for_tab">
                      {poolList[txt.address]?.token0?.symbol + "/" + poolList[txt.address]?.token1?.symbol}
                    </p>
                  </div>
                  <div>
                    <p>{tokenList[txt?.args?._asset]?.symbol}</p>
                  </div>
                  <div>
                    <p>{txt.event}</p>
                  </div>
                  <div>
                    <p>
                      {Number(
                        fromBigNumber(txt?.args?._amount) / 10 ** 18
                      ).toFixed(2)}
                      {/* {(Number(txt.returnValues._amount) / 10 ** 18).toFixed(4)} */}
                    </p>
                  </div>
                  <div className="hide_for_mobile">
                    <p className="success">Complete</p>
                  </div>
                  <div className="hide_for_mobile">
                    <p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txt.transactionHash}`}
                        target="_blank"
                      >
                        {shortenAddress(txt.transactionHash)}
                      </a>
                    </p>
                  </div>
                  <div className="tx_icon">
                    {" "}
                    <img src={txIcon} alt="" />{" "}
                  </div>
                </div>
              ))
          ) : isPageLoading && user.isConnected ? (
            <HistorySkeleton />
          ) : (
            <div className="no_transaction">
              <img src={noTxt} alt="" />
              <h1>No Transactions Found</h1>
            </div>
          )}
        </div>
      )}
      <div className="pagination">
        <Pagination
          current={currentPage}
          onChange={(el) => setCurrentPage(el)}
          pageSize={itemPerPage}
          size="small"
          total={isPolygon ? graphHistory.length : txtData.length}
          showSizeChanger={false}
          hideOnSinglePage={true}
        />
      </div>
    </div>
  );
}

export default HistoryComponent