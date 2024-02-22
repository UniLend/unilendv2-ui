import React, { useState } from "react";
import Lottie from "react-lottie";
import "./styles/index.scss";
import { FiPercent } from "react-icons/fi";
import { VscGraph } from "react-icons/vsc";
import { GiReceiveMoney } from "react-icons/gi";
import { ImStack } from "react-icons/im";
import { FaWallet, FaSearch } from "react-icons/fa";
import { ImArrowDown2, ImArrowUp2 } from "react-icons/im";
import userIcon from "../../assets/userIcon.png";
import { Tooltip } from "antd";
import { truncateToDecimals } from "../../helpers/contracts";
import { Input, Button, Pagination } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DonutChart from "../Common/DonutChart";
import { useQuery } from "react-query";
import {
  getPoolCreatedGraphQuery,
  getUserData,
  sortByKey,
  userDashBoardQuery0,
} from "../../helpers/dashboard";
import DropDown from "../Common/DropDown";
import { imgError } from "../../utils";
import { fetchGraphQlData } from "../../utils/axios";
import empty from "../../assets/searchEmpty.json";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import useWalletHook from "../../lib/hooks/useWallet";

//const endpoint = "https://api.spacex.land/graphql/";
const mumbai = import.meta.env.VITE_ALCHEMY_Mumbai;
const polygon = import.meta.env.VITE_ALCHEMY_Mumbai;

export default function UserDashboardComponent() {
  const user = useSelector((state) => state.user);
  const tokenList = useSelector((state) => state.tokenList);
  const { chain, address } = useWalletHook();
  const navigate = useNavigate();
  // if (chain?.id !== 80001) {
  //   navigate("/");
  // }

  const [userAddress, setUserAddress] = useState();
  const [verifiedAddress, setVerifiedAddress] = useState(
    address || user?.address
  );
  const query = userDashBoardQuery0(verifiedAddress || address);
  const [isLendTab, setIsLentab] = useState(true);
  const [pieChartInputs, setPieChartInputs] = useState({});
  const [positionData, setPositionData] = useState({});
  const [positionDataBackup, setPositionDataBackup] = useState();

  const [headerAnalytics, setHeaderAnalytics] = useState({
    healthFactor: 0,
    powerUsed: 0,
    borrowAPY: 0,
    lendAPY: 0,
  });
  const [walletTokens, setWalletTokens] = useState([]);
  const [walletTokenLoading, setWalletTokenLoading] = useState(false);
  const [positionLoading, setPositionLoading] = useState(true);
  const [walletCurrentPage, setWalletCurrentPage] = useState(1);
  const [positionCurrentPage, setPositionCurrentPage] = useState({
    lending: 1,
    borrowing: 1,
  });

  const handleSearchAddress = (addr) => {
    setUserAddress(addr);
    setVerifiedAddress("");
    const isVerified = ethers.utils.isAddress(addr);
    isVerified && setVerifiedAddress(addr);
  };

  const navigateToPool = (addr) => {
    navigate(`/pool/${addr}`);
  };

  const handleLendBorrowTabs = (action) => {
    setIsLentab(action);
  };

  const positionSorting = (operation, key, order) => {
    if (operation == "lend") {
      const sorted = sortByKey(positionData.lendArray, key, order);
      setPositionData({ ...positionData, lendArray: sorted });
    } else if (operation == "borrow") {
      const sorted = sortByKey(positionData.borrowArray, key, order);
      setPositionData({ ...positionData, borrowArray: sorted });
    }
  };

  const handleOpenPosition = (e) => {
    const searched = String(e.target.value).toUpperCase();
    const lendPosition = positionDataBackup.lendArray;
    const BorrowPosition = positionDataBackup.borrowArray;

    const afterSearchedLend = lendPosition.filter(
      (position) =>
        String(position.poolInfo.tokenSymbol)
          .toUpperCase()
          .includes(searched) ||
        String(position.poolInfo.token0Symbol)
          .toUpperCase()
          .includes(searched) ||
        String(position.poolInfo.token1Symbol)
          .toUpperCase()
          .includes(searched) ||
        String(position.pool.pool).toUpperCase().includes(searched)
    );
    const afterSearchedBorrow = BorrowPosition.filter(
      (position) =>
        String(position.poolInfo.tokenSymbol)
          .toUpperCase()
          .includes(searched) ||
        String(position.poolInfo.token0Symbol)
          .toUpperCase()
          .includes(searched) ||
        String(position.poolInfo.token1Symbol)
          .toUpperCase()
          .includes(searched) ||
        String(position.pool.pool).toUpperCase().includes(searched)
    );

    setPositionData({
      positionData,
      lendArray: afterSearchedLend,
      borrowArray: afterSearchedBorrow,
    });
  };

  const defaultOptionsLotti = {
    loop: true,
    autoplay: true,
    animationData: empty,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lendDropdownList = [
    {
      text: "Amount",
      fun: () => positionSorting("lend", "LendBalance", 1),
      icon: <ImArrowUp2 />,
    },
    {
      text: "Amount",
      fun: () => positionSorting("lend", "LendBalance", 2),
      icon: <ImArrowDown2 />,
    },
    {
      text: "APY",
      fun: () => positionSorting("lend", "apy", 1),
      icon: <ImArrowUp2 />,
    },
    {
      text: "APY",
      fun: () => positionSorting("lend", "apy", 2),
      icon: <ImArrowDown2 />,
    },
  ];

  const BorrowDropdownList = [
    {
      text: "Amount",
      fun: () => positionSorting("borrow", "borrowBalance", 1),
      icon: <ImArrowUp2 />,
    },
    {
      text: "Amount",
      fun: () => positionSorting("borrow", "borrowBalance", 2),
      icon: <ImArrowDown2 />,
    },
    {
      text: "APY",
      fun: () => positionSorting("borrow", "apy", 1),
      icon: <ImArrowUp2 />,
    },
    {
      text: "APY",
      fun: () => positionSorting("borrow", "apy", 2),
      icon: <ImArrowDown2 />,
    },
  ];

  useEffect(() => {
    setUserAddress(address);
    handleSearchAddress(address);
  }, [address]);

  const getDashBoardData = async (chainId) => {
    try {
      setPositionLoading(true);
      setWalletTokenLoading(true);
      const ValidAddress = verifiedAddress || address;
      // query,
      // tokenList,
      // ValidAddress);
      const { position, pieChart, analytics, tokens } = await getUserData(
        chainId,
        query,
        tokenList,
        ValidAddress
      );
      console.log(tokens);
      console.log(pieChart);
      console.log("position", position);
      setPositionLoading(false);
      setWalletTokens(tokens);
      setPositionData(position);
      setPositionDataBackup(position);
      setPieChartInputs(pieChart);
      setHeaderAnalytics(analytics);

      return position, pieChart, analytics, tokens;
    } catch (error) {
      console.log("getDashboard error", error);
    }
  };

  useEffect(() => {
    if (address) {
      getDashBoardData(chain?.id);
    }
  }, [query, tokenList]);

  useEffect(() => {
    if (walletTokens.length !== 0) setWalletTokenLoading(false);
  }, [walletTokens]);

  const checkNaN = (value) => {
    return isNaN(value) ? 0 : value;
  };

  return (
    <div className="user_dashboard_component">
      {/* <div className="dashboardbanner">
        <img src={banner} alt="" />
      </div> */}
      <div className="user_portfolio">
        <img src={userIcon} alt="icon" className="usericon" />
        <div className="user_tittle">
          <h1>User Overview</h1>
          <Input
            addonBefore={<FaSearch className="search_icon" />}
            className={`search_address ${
              userAddress
                ? verifiedAddress
                  ? "verified_address"
                  : "not_verified"
                : ""
            }`}
            placeholder="Search address"
            value={userAddress}
            onChange={(e) => handleSearchAddress(e.target.value)}
          />
        </div>

        {/* Lending / Borrowing Portfolio Section */}
        <div className="lend_borrow_portfolio_container">
          <div className="header">
            <div className="analytics_tabs">
              <div className="analytic_box">
                <div className="icon_box">
                  <GiReceiveMoney />
                </div>
                <div className="values">
                  <p>Net Worth</p>
                  {/* {isNaN(pieChartInputs?.lendValues?.total) ? (
                    <h5 className="skeleton loader"></h5>
                  ) : (
                    <h5>
                      $
                      {checkNaN(
                        Number(
                          pieChartInputs?.lendValues?.total -
                            pieChartInputs?.borrowValues?.total
                        ).toFixed(2)
                      ) || 0}
                    </h5>
                  )} */}
                  <h5>
                    $
                    {checkNaN(
                      Number(
                        pieChartInputs?.lendValues?.total -
                          pieChartInputs?.borrowValues?.total
                      ).toFixed(2)
                    ) || 0}
                  </h5>
                </div>
              </div>
              <div className="analytic_box">
                <div className="icon_box">
                  <VscGraph />
                </div>
                <div className="values">
                  <p>Lend APY</p>
                  {/* {isNaN(headerAnalytics?.lendAPY || 0) ? (
                    <h5 className="skeleton loader"></h5>
                  ) : (
                    <h5>
                    {Number(headerAnalytics?.lendAPY || 0).toFixed(2) || 0}%
                  </h5>
                  )} */}
                  <h5>
                    {Number(headerAnalytics?.lendAPY || 0).toFixed(2) || 0}%
                  </h5>
                </div>
              </div>
              <div className="analytic_box">
                <div className="icon_box">
                  <FiPercent />
                </div>
                <div className="values">
                  <p>Borrow APY</p>
                  <h5>
                    {Number(headerAnalytics?.borrowAPY || 0).toFixed(2) || 0}%
                  </h5>
                </div>
              </div>
              {/* <div className="analytic_box heath_factor">
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
              </div> */}
            </div>
            {/* <div className="network_dropdown">
              <p>Etherium</p>
            </div> */}
          </div>

          <div className="content">
            <div className="lend_container">
            {!positionLoading ? (
                <div>
                  {pieChartInputs?.donutLends?.length > 0 ? (
                    <DonutChart data={pieChartInputs?.donutLends} />
                  ) : (
                    <Lottie
                      options={defaultOptionsLotti}
                      height={300}
                      width={300}
                    />
                  )}
                </div>
              ) : (
                <div className="pieChart_loader">
                  <p className="circle skeleton"></p>
                </div>
              )}

{/* 
              {!positionLoading  ? (
                pieChartInputs?.donutLends?.length > 0 ? (
                  <div>
                    <DonutChart data={pieChartInputs?.donutLends} />
                  </div>
                ) : (
                  <Lottie
                    options={defaultOptionsLotti}
                    height={300}
                    width={300}
                  />
                )
                
              ) : pieChartInputs?.donutLends != NaN && pieChartInputs?.donutLends!= null ? (
                <div>
                  <Lottie
                    options={defaultOptionsLotti}
                    height={300}
                    width={300}
                  />
                </div>
              ) : (
                <div className="pieChart_loader">
                  <p className="circle skeleton"></p>
                </div>
              )} */}

              
              

              <div>
                <div>
                  <p>Total Lend</p>
                  <h5>
                    $
                    {checkNaN(
                      Number(pieChartInputs?.lendValues?.total).toFixed(4)
                    ) || 0}
                  </h5>
                </div>
                {/* <div>
                  {" "}
                  <p>Lend APY</p>
                  <h5>{Number(headerAnalytics?.lendAPY || 0).toFixed(2)}%</h5>
                </div> */}
                <div>
                  {" "}
                  <p> Interest Earned </p>
                  <h5>
                    $ {Number(headerAnalytics.interestEarned || 0).toFixed(8)}
                  </h5>
                </div>
              </div>
            </div>
            <div className="borrow_container">
              {/* {!positionLoading && pieChartInputs?.donutBorrows?.length > 0 ? (
                <div>
                  {pieChartInputs?.donutBorrows?.length > 0 ? (
                    <DonutChart data={pieChartInputs?.donutBorrows} />
                  ) : (
                    <Lottie
                      options={defaultOptionsLotti}
                      height={300}
                      width={300}
                    />
                  )}
                </div>
              ) : (
                <div className="pieChart_loader">
                  <p className="circle skeleton"></p>
                </div>
              )} */}
              {!positionLoading && pieChartInputs?.donutBorrows?.length > 0 ? (
                pieChartInputs?.donutBorrows?.length > 0 ? (
                  <div>
                    <DonutChart data={pieChartInputs?.donutBorrows} />
                  </div>
                ) : (
                  <Lottie
                    options={defaultOptionsLotti}
                    height={300}
                    width={300}
                  />
                )
              ) : pieChartInputs?.donutBorrows?.length < 0 ? (
                <div>
                  <Lottie
                    options={defaultOptionsLotti}
                    height={300}
                    width={300}
                  />
                </div>
              ) : (
                <div className="pieChart_loader">
                  <p className="circle skeleton"></p>
                </div>
              )}

              <div>
                <div>
                  <p>Total Borrow</p>
                  <h5>
                    ${" "}
                    {checkNaN(
                      Number(pieChartInputs?.borrowValues?.total).toFixed(4)
                    ) || 0}
                  </h5>
                </div>
                {/* <div>
                  {" "}
                  <p>Borrow APY</p>
                  <h5>{Number(headerAnalytics?.borrowAPY || 0).toFixed(2)}%</h5>
                </div> */}
                <div>
                  {" "}
                  <p> Borrowed Power Used </p>
                  <h5>{headerAnalytics?.powerUsed || 0}%</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        {/* <div className="wallet_container">
          <div className="title_div">
            <span>
              {" "}
              <FaWallet className="react_icons" /> <h2>Wallet</h2>{" "}
            </span> */}
        {/* <h2>$130,000,500</h2> */}
        {/* </div>

          <div className="wallet_table">
            <div className="thead">
              <span>Token</span>
              <span>Price</span>
              <span>Balance</span>
              <span>Value</span>
            </div>
            <div className="tbody">
              {!walletTokenLoading &&
                (walletTokens?.length > 0
                  ? walletTokens
                      .slice((walletCurrentPage - 1) * 7, walletCurrentPage * 7)
                      .map((token, i) => {
                        return (
                          <div key={i} className="tbody_row">
                            <span>
                              <img
                                onError={imgError}
                                src={token?.logo}
                                alt="uft"
                              />
                              <p className="hide_for_mobile"> */}
        {/* {token?.name} / {token?.symbol} */}
        {/* {token?.name}
                              </p>
                              <p className="hide_for_monitor">
                                {token?.symbol}
                              </p>
                            </span>
                            <span>{token?.pricePerToken}</span>
                            <span>{token?.balance}</span>
                            <span>{token?.value}</span>
                          </div>
                        );
                      })
                  : walletTokens?.length == 0 && (
                      <Lottie
                        options={defaultOptionsLotti}
                        height={350}
                        width={350}
                      />
                    ))}
              {walletTokenLoading &&
                new Array(7).fill(0).map((_, i) => {
                  return (
                    <div
                      key={i}
                      className="tbody_row row_skeleton skeleton"
                    ></div>
                  );
                })}
            </div>
            <div className="pagination">
              <Pagination
                current={walletCurrentPage}
                onChange={(el) => setWalletCurrentPage(el)}
                pageSize={7}
                size="small"
                total={walletTokens.length}
                showSizeChanger={false}
                hideOnSinglePage={true}
              />
            </div>
          </div>
        </div> */}

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
                    <FaSearch />
                    <input
                      onChange={handleOpenPosition}
                      type="text"
                      placeholder="Search Txt/Token/Type"
                    />
                  </div>
                  <DropDown list={lendDropdownList} />
                </div>
                <div className="thead">
                  <span>Pool</span>
                  <span>Token</span>
                  <span>Amount</span>
                  <span>APY</span>
                  <span>Max LTV</span>
                  <span> Interest Earned </span>
                  <span>Pool</span>
                  <span>
                    Token / <br /> Amount
                  </span>
                  <span>
                    APY / <br /> Interest{" "}
                  </span>
                  <span>Max LTV</span>
                </div>
                <div className="tbody">
                  {!positionLoading &&
                    (positionData?.lendArray?.length > 0
                      ? positionData?.lendArray
                          .slice(
                            (positionCurrentPage.lending - 1) * 5,
                            positionCurrentPage.lending * 5
                          )
                          .map((pool, i) => {
                            return (
                              <div key={i} className="tbody_row">
                                <span
                                  onClick={() =>
                                    navigateToPool(pool?.pool?.pool)
                                  }
                                >
                                  <div>
                                    <img
                                      onError={imgError}
                                      src={pool.poolInfo.token0Logo}
                                      alt="uft"
                                    />
                                    <img
                                      onError={imgError}
                                      src={pool.poolInfo.token1Logo}
                                      alt="uft"
                                    />
                                  </div>
                                  <p className="hide_for_mobile">
                                    {" "}
                                    {pool.poolInfo.token0Symbol} /{" "}
                                    {pool.poolInfo.token1Symbol}{" "}
                                  </p>
                                </span>
                                <span>{pool?.tokenSymbol}</span>
                                <Tooltip title={Number(pool?.LendBalance)}>
                                  <span>
                                    {truncateToDecimals(
                                      Number(pool?.LendBalance),
                                      6
                                    )}
                                  </span>
                                </Tooltip>
                                <span>{Number(pool?.apy).toFixed(2)}%</span>
                                <span>{pool.pool.maxLTV}%</span>
                                <span>
                                  {Number(pool?.interestEarned).toFixed(8)}
                                </span>
                                <span>
                                  <img
                                    onError={imgError}
                                    src={pool.poolInfo.token0Logo}
                                    alt="uft"
                                  />
                                  <img
                                    onError={imgError}
                                    src={pool.poolInfo.token1Logo}
                                    alt="uft"
                                  />
                                </span>
                                <span>
                                  <strong>{pool?.tokenSymbol}</strong>
                                  <br /> {Number(pool?.LendBalance).toFixed(
                                    2
                                  )}{" "}
                                </span>
                                <span>
                                  <strong>
                                    {Number(pool?.apy).toFixed(2)}%
                                  </strong>
                                  <br />{" "}
                                  {Number(pool?.interestEarned).toFixed(6)}{" "}
                                </span>
                                <span>
                                  <strong>{pool.pool.maxLTV}%</strong>
                                </span>
                              </div>
                            );
                          })
                      : !positionLoading && (
                          <Lottie
                            options={defaultOptionsLotti}
                            height={350}
                            width={350}
                          />
                        ))}
                  {positionLoading &&
                    new Array(5).fill(0).map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="tbody_skelton_row row_skeleton skeleton"
                        ></div>
                      );
                    })}
                </div>
                {positionData?.lendArray?.length > 0 && !positionLoading && (
                  <div className="pagination">
                    <Pagination
                      current={positionCurrentPage.lending}
                      onChange={(el) =>
                        setPositionCurrentPage({
                          ...positionCurrentPage,
                          lending: el,
                        })
                      }
                      pageSize={5}
                      size="small"
                      total={positionData?.lendArray?.length}
                      showSizeChanger={false}
                      hideOnSinglePage={true}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="action_container">
                  <div className="input_container">
                    <FaSearch />
                    <input
                      onChange={handleOpenPosition}
                      type="text"
                      placeholder="Search Txt/Token/Type"
                    />
                  </div>
                  <DropDown list={BorrowDropdownList} />
                </div>
                <div className="thead">
                  <span>Pool</span>
                  <span>Token</span>
                  <span>Amount</span>
                  <span>APY</span>
                  <span>Current LTV</span>
                  <span> Health Factor </span>
                  <span>Pool</span>
                  <span>
                    Token / <br /> Amount
                  </span>
                  <span>
                    APY / <br /> HF
                  </span>
                  <span>Current LTV</span>
                </div>
                <div className="tbody">
                  {positionData?.borrowArray?.length > 0 && !positionLoading
                    ? positionData?.borrowArray
                        .slice(
                          (positionCurrentPage.borrowing - 1) * 5,
                          positionCurrentPage.borrowing * 5
                        )
                        .map((pool, i) => {
                          return (
                            <div key={i} className="tbody_row">
                              <span
                                onClick={() => navigateToPool(pool?.pool?.pool)}
                              >
                                <div>
                                  <img
                                    onError={imgError}
                                    src={pool.poolInfo.token0Logo}
                                    alt="uft"
                                  />
                                  <img
                                    onError={imgError}
                                    src={pool.poolInfo.token1Logo}
                                    alt="uft"
                                  />
                                </div>
                                <p className="hide_for_mobile">
                                  {" "}
                                  {pool.poolInfo.token0Symbol} /{" "}
                                  {pool.poolInfo.token1Symbol}
                                </p>
                              </span>
                              <span>{pool?.tokenSymbol}</span>
                              <Tooltip title={Number(pool?.borrowBalance)}>
                                  <span>
                                    {truncateToDecimals(
                                      Number(pool?.borrowBalance),
                                      6
                                    )}
                                  </span>
                                </Tooltip>
                            
                              <span>{Number(pool?.apy).toFixed(3)}%</span>
                              <span>
                                {Number(pool?.currentLTV).toFixed(2)}%
                              </span>
                              <span>{Number(pool?.healthFactor)}</span>
                              <span>
                                <img
                                  onError={imgError}
                                  src={pool.poolInfo.token0Logo}
                                  alt="uft"
                                />
                                <img
                                  onError={imgError}
                                  src={pool.poolInfo.token1Logo}
                                  alt="uft"
                                />
                              </span>
                              <span>
                                <strong>{pool?.tokenSymbol}</strong> <br />{" "}
                                {Number(pool?.borrowBalance).toFixed(2)}{" "}
                              </span>
                              <span>
                                <strong>{Number(pool?.apy).toFixed(3)}%</strong>
                                <br /> {Number(pool?.healthFactor)}
                              </span>
                              <span>
                                <strong>
                                  {Number(pool?.currentLTV).toFixed(2)}%
                                </strong>
                              </span>
                            </div>
                          );
                        })
                    : !positionLoading && (
                        <Lottie
                          options={defaultOptionsLotti}
                          height={350}
                          width={350}
                        />
                      )}
                  {positionLoading &&
                    new Array(5).fill(0).map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="tbody_skelton_row row_skeleton skeleton"
                        ></div>
                      );
                    })}
                </div>
                {positionData?.borrowArray?.length > 0 && !positionLoading && (
                  <div className="pagination">
                    <Pagination
                      current={positionCurrentPage.borrowing}
                      onChange={(el) =>
                        setPositionCurrentPage({
                          ...positionCurrentPage,
                          borrowing: el,
                        })
                      }
                      pageSize={5}
                      size="small"
                      total={positionData?.borrowArray?.length}
                      showSizeChanger={false}
                      hideOnSinglePage={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Borrowing Table */}
      </div>
    </div>
  );
}
