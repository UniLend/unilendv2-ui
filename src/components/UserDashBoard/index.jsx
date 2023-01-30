import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import "./styles/index.scss";
import { FiPercent, FiHeart } from "react-icons/fi";
import { VscGraph } from "react-icons/vsc"
import { GiReceiveMoney } from "react-icons/gi"
import { ImStack } from "react-icons/im";
import { Alchemy, Network } from "alchemy-sdk";
import { FaWallet } from "react-icons/fa";
import banner from "../../assets/dashboardbanner.svg";
import walletIcon from "../../assets/wallet.svg";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { Input, Progress, Popover, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DonutChart from "../Common/DonutChart";
import {
  getAverage,
  getBorrowedPowerUsed,
  getChartData,
  getNetHealthFactor,
  getPositionData,
  getTokensFromUserWallet,
  userDashBoardQuery,
} from "../../helpers/dashboard";
import { getAccount, getNetwork } from "@wagmi/core";

//const endpoint = "https://api.spacex.land/graphql/";
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
const config = {
  apiKey: alchemyId,
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(config);

export default function UserDashboardComponent(props) {
  const { contracts, user, web3, isError, poolList, tokenList } = props;
  const {chain} = getNetwork();
  const navigate = useNavigate();
  if(chain.id !== 80001 ){
    navigate('/')
  }
  const { address } = getAccount()
  const [userAddress, setUserAddress] = useState();
  const query = userDashBoardQuery(userAddress || address);
  const [lendingVisible, setLendingVisible] = useState(false);
  const [borrowingVisible, setBorrowingVisible] = useState(false);
  const [isLendTab, setIsLentab] = useState(true);
  const [pieChartInputs, setPieChartInputs] = useState({});
  const [positionData, setPositionData] = useState({});
  const { data, loading, error } = useQuery(query);
  const [headerAnalytics, setHeaderAnalytics] = useState({
    healthFactor: 0,
    powerUsed: 0,
    borrowAPY: 0,
    lendAPY:0
  });
  const [walletTokens, setWalletTokens] = useState([]);
  const [walletTokenLoading, setWalletTokenLoading] = useState(false)
  const [positionLoading, setPositionLoading] = useState(false)


  const handleLendingVisibleChange = (visible) => {
    setLendingVisible(visible);
  };

  const handleLendBorrowTabs = (action) => {
    setIsLentab(action);
  };

  const SortContent = () => {
    return (
      <div className="sort_popover">
        <p> NEW TO OLD </p>
        <p> OLD TO NEW</p>
      </div>
    );
  };

  useEffect(() => {
    setUserAddress(address);
  }, [user]);

  useEffect(() => {
    console.log("userData", data);
    if (data) {
      const position = getPositionData(data, poolList, tokenList);
      setPositionData(position);
      const pieChart = getChartData(data);
      setPieChartInputs(pieChart);
      const analytics = {};
      if (position?.borrowArray.length > 0) {
        const borrowAPY = getAverage(
          position.borrowArray,
          "apy",
          "borrowBalance"
        );
        analytics.borrowAPY = borrowAPY;
      }
      if (position?.lendArray.length > 0) {
        const earned = position.lendArray
          .map((el) => el.interestEarned)
          .reduce((ac, el) => ac + el);
        analytics.interestEarned = earned;
        const lendAPY = getAverage(position.lendArray, "apy", "LendBalance");
        analytics.lendAPY = lendAPY;
        const powerUsed = getBorrowedPowerUsed(position.lendArray);
        analytics.powerUsed = powerUsed;
      }
      if (data?.positions) {
        const HF = getNetHealthFactor(data.positions);
        console.log("health", HF, isNaN(HF));
        analytics.healthFactor = isNaN(HF) ? 0: HF;
      }
      setHeaderAnalytics(analytics);
    }
  }, [data]);

  const getUserTokens = async (address) => {
    setWalletTokenLoading(true)
  
    console.log("getUserTokens", address);
    alchemy.core
      .getTokenBalances(`${address}`)
      .then(async (bal) => {
        const tokens = await getTokensFromUserWallet(bal);
        setWalletTokens(tokens);
        setWalletTokenLoading(false)
      });
  };

  useEffect(() => {
    if (userAddress || user?.address) {
      setWalletTokens([]);
      const account = getAccount()
      getUserTokens(userAddress || account.address);
    }
  }, [userAddress, user]);

  return (
    <div className="user_dashboard_component">
      <div className="dashboardbanner">
        <img src={banner} alt="" />
      </div>
      <div className="user_portfolio">
        <div className="user_tittle">
          <h1>User Overview</h1>
          <Input
            addonBefore={<SearchOutlined className="search_icon" />}
            className="search_address"
            placeholder="Search address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </div>

        {/* Lending / Borrowing Portfolio Section */}
        <div className="lend_borrow_portfolio_container">
          <div className="header">
            <div className="analytics_tabs">
              <div className="analytic_box">
                <div className="icon_box">
                  {" "}
                  <GiReceiveMoney />{" "}
                </div>
                <div className="values">
                  <p>Net Worth</p>
                  <h5>
                    {Number(
                      pieChartInputs?.lendValues?.total -
                        pieChartInputs?.borrowValues?.total
                    ).toFixed(2) || 0}
                  </h5>
                </div>
              </div>
              <div className="analytic_box">
                <div className="icon_box">
                  {" "}
                  <VscGraph />{" "}
                </div>
                <div className="values">
                  <p>Lend APY</p>
                  <h5>
                    {Number(headerAnalytics?.lendAPY || 0).toFixed(2) || 0}%
                  </h5>
                </div>
              </div>
              <div className="analytic_box">
                <div className="icon_box">
                  {" "}
                  <FiPercent />{" "}
                </div>
                <div className="values">
                  <p>Borrow APY</p>
                  <h5>
                    {Number(headerAnalytics?.borrowAPY || 0).toFixed(2) || 0}%
                  </h5>
                </div>
              </div>
              <div className="analytic_box heath_factor">
                <div className="icon_box">
                  {" "}
                  <FiHeart />{" "}
                </div>
                <div className="values">
                  <p>Health Factor</p>
                  <h5>
                    {Number(headerAnalytics?.healthFactor || 0).toFixed(2) || 0}
                  </h5>
                </div>
              </div>
            </div>
            {/* <div className="network_dropdown">
              <p>Etherium</p>
            </div> */}
          </div>

          <div className="content">
            <div className="lend_container">
              <div>
                {pieChartInputs?.donutLends && (
                  <DonutChart data={pieChartInputs?.donutLends} />
                )}
              </div>
              <div>
                <div>
                  <p>Total Lend</p>
                  <h5>{pieChartInputs?.lendValues?.total || 0}</h5>
                </div>
                <div>
                  {" "}
                  <p>Lend APY</p>
                  <h5>{Number(headerAnalytics?.lendAPY || 0).toFixed(2)}%</h5>
                </div>
                <div>
                  {" "}
                  <p> Interest Earned </p>
                  <h5>
                    {Number(headerAnalytics.interestEarned || 0).toFixed(8)}
                  </h5>
                </div>
              </div>
            </div>
            <div className="borrow_container">
              <div>
                {pieChartInputs?.donutBorrows && (
                  <DonutChart data={pieChartInputs?.donutBorrows} />
                )}
              </div>
              <div>
                <div>
                  <p>Total Borrow</p>
                  <h5>{pieChartInputs?.borrowValues?.total || 0}</h5>
                </div>
                <div>
                  {" "}
                  <p>Borrow APY</p>
                  <h5>{Number(headerAnalytics?.borrowAPY || 0).toFixed(2)}%</h5>
                </div>
                <div>
                  {" "}
                  <p> Borrowed Power Used </p>
                  <h5>{headerAnalytics?.powerUsed || 0}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="wallet_container">
          <div className="title_div">
            <span>
              {" "}
              <FaWallet className="react_icons" /> <h2>Wallet</h2>{" "}
            </span>
            {/* <h2>$130,000,500</h2> */}
          </div>

          <div className="wallet_table">
            <div className="thead">
              <span>Token</span>
              <span>Price</span>
              <span>Balance</span>
              <span>Value</span>
            </div>
            <div className="tbody">
              { !walletTokenLoading && walletTokens.map((token, i) => {
                return (
                  <div key={i} className="tbody_row">
                    <span>
                      <img src={token?.logo} alt="uft" />
                      <p className="hide_for_mobile">
                        {" "}
                        {token?.name} / {token?.symbol}
                      </p>
                      <p className="hide_for_monitor">{token?.symbol}</p>
                    </span>
                    <span>-</span>
                    <span>{token?.balance}</span>
                    <span>-</span>
                  </div>
                );
              })}
              {
               walletTokenLoading && new Array(3).fill(0).map((_,i) => {
                return(
                  <div className="tbody_row row_skeleton skeleton" ></div>
                )
               })
              }
            </div>
          </div>
        </div>

        {/* Lending Table */}

        <div className="lending_container">
          <div className="title_div">
            <span>
              <ImStack className="react_icons" /> <h2>Open Positions</h2>{" "}
            </span>
          </div>
          <div className="lending_table">
            <div className="toggle_tabs">
              <Button
                onClick={() => handleLendBorrowTabs(true)}
                className={`tab_btn ${isLendTab ? "active_tab" : ""} `}
              >
                Lending
              </Button>
              <Button
                onClick={() => handleLendBorrowTabs(false)}
                className={`tab_btn ${!isLendTab ? "active_tab" : ""} `}
              >
                Borrowing
              </Button>
            </div>
            {isLendTab ? (
              <div>
                <div className="action_container">
                  <div className="input_container">
                    <input type="text" placeholder="Search Txt/Token/Type" />
                  </div>
                  <Popover
                    content={<SortContent />}
                    trigger="click"
                    overlayClassName="sort_dropDown"
                    placement="bottomLeft"
                    open={lendingVisible}
                    onOpenChange={handleLendingVisibleChange}
                  >
                    <div className={`sortBy`}>
                      <p>Sort By</p>
                      <DownOutlined />
                    </div>
                  </Popover>
                </div>
                <div className="thead">
                  <span>Pool</span>
                  <span>Token</span>
                  <span>Amount</span>
                  <span>APY</span>
                  <span>Max LTV</span>
                  <span> Interest Earned </span>
                  <span>Pool</span>
                  <span>Token / <br/> Amount</span>
                  <span>APY / <br/> Interest </span>
                  <span>Max LTV</span>
                </div>
                <div className="tbody">
                  {positionData?.lendArray &&
                    positionData?.lendArray.map((pool) => {
                      return (
                        <div className="tbody_row">
                          <span>
                            <img src={pool.poolInfo.token0Logo} alt="uft" />
                            <img src={pool.poolInfo.token1Logo} alt="uft" />
                            <p className="hide_for_mobile">
                              {" "}
                              {pool.poolInfo.token0Symbol} /{" "}
                              {pool.poolInfo.token1Symbol}{" "}
                            </p>
                          </span>
                          <span>{pool?.tokenSymbol}</span>
                          <span>{Number(pool?.LendBalance).toFixed(2)}</span>
                          <span>{Number(pool?.apy).toFixed(2)}%</span>
                          <span>{pool.pool.ltv}%</span>
                          <span>{Number(pool?.interestEarned).toFixed(8)}</span>
                          <span>
                            <img src={pool.poolInfo.token0Logo} alt="uft" />
                            <img src={pool.poolInfo.token1Logo} alt="uft" />
                          </span>
                          <span>{pool?.tokenSymbol}  <br/> {Number(pool?.LendBalance).toFixed(2)} </span>
                          <span>{Number(pool?.apy).toFixed(2)}%  <br/> {Number(pool?.interestEarned).toFixed(6)} </span>
                          <span>{pool.pool.ltv}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div>
                <div className="action_container">
                  <div className="input_container">
                    <input type="text" placeholder="Search Txt/Token/Type" />
                  </div>
                  <Popover
                    content={<SortContent />}
                    trigger="click"
                    overlayClassName="sort_dropDown"
                    placement="bottomLeft"
                    open={lendingVisible}
                    onOpenChange={handleLendingVisibleChange}
                  >
                    <div className={`sortBy`}>
                      <p>Sort By</p>
                      <DownOutlined />
                    </div>
                  </Popover>
                </div>
                <div className="thead">
                  <span>Pool</span>
                  <span>Token</span>
                  <span>Amount</span>
                  <span>APY</span>
                  <span>Current LTV</span>
                  <span> Health Factor </span>
                  <span>Pool</span>
                  <span>Token / <br/> Amount</span>
                  <span>APY / <br/> HF</span>
                  <span>Current LTV</span>
                </div>
                <div className="tbody">
                  {positionData?.borrowArray &&
                    positionData?.borrowArray.map((pool) => {
                      return (
                        <div className="tbody_row">
                          <span>
                            <img src={pool.poolInfo.token0Logo} alt="uft" />
                            <img src={pool.poolInfo.token1Logo} alt="uft" />
                            <p className="hide_for_mobile">
                              {" "}
                              {pool.poolInfo.token0Symbol} /{" "}
                              {pool.poolInfo.token1Symbol}
                            </p>
                          </span>
                          <span>{pool?.tokenSymbol}</span>
                          <span>{Number(pool?.borrowBalance).toFixed(2)}</span>
                          <span>{Number(pool?.apy).toFixed(3)}%</span>
                          <span>
                            {(Number(pool?.currentLTV) * 100).toFixed(2)}
                          </span>
                          <span>
                            {Number(pool?.healthFactor / 10 ** 18).toFixed(2)}
                          </span>
                          <span>
                            <img src={pool.poolInfo.token0Logo} alt="uft" />
                            <img src={pool.poolInfo.token1Logo} alt="uft" />
                          </span>
                          <span>{pool?.tokenSymbol} <br/> {Number(pool?.borrowBalance).toFixed(2)} </span>
                          <span>{Number(pool?.apy).toFixed(3)}% <br/>  {Number(pool?.healthFactor / 10 ** 18).toFixed(2)} </span>
                          <span>
                          {(Number(pool?.currentLTV) * 100).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Borrowing Table */}
      </div>
    </div>
  );
}
