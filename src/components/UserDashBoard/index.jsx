import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import "./styles/index.scss";
import { FiPercent } from "react-icons/fi";
import { ImStack } from 'react-icons/im'
import { FaWallet} from 'react-icons/fa'
import banner from "../../assets/dashboardbanner.svg";
import walletIcon from "../../assets/wallet.svg";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { Input, Progress, Popover, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DonutChart from "../Common/DonutChart";
import { getChartData, getPositionData } from "../../helpers/dashboard";


//const endpoint = "https://api.spacex.land/graphql/";



export default function UserDashboardComponent(props) {
  const { contracts, user, web3, isError, poolList, tokenList } = props;
  const FILMS_QUERY = gql`
  {
    
    positions(where: {owner: "0x84c6d5Df8a5e3ab9859708dA7645cC58176a26C0"}) {
      borrowBalance0
      borrowBalance1
      healthFactor0
      healthFactor1
      id
      borrowApy0
      interestEarned1
      borrowApy1
      lendBalance0
      lendBalance1
      interestEarned0
      owner
      poolData {
        id
        interest0
        interest1
        ltv
        pool
        token0Liquidity
        token1Liquidity
      }
      token0
      token1
      token0Symbol
      token1Symbol
    }

    lends(where: {sender: "0x84c6d5Df8a5e3ab9859708dA7645cC58176a26C0"}, orderBy: tokenSymbol) {
      id
      amount
      tokenAmount
      pool
      positionId
      sender
      tokenSymbol
      token
      transactionHash
      blockTimestamp
      blockNumber
    }
    redeems(where: {sender: "0x84c6d5Df8a5e3ab9859708dA7645cC58176a26C0"}, orderBy: id) {
      id
      sender
      amount
      pool
      tokenSymbol
      positionId
      token
      transactionHash
      blockTimestamp
      blockNumber
    }
    borrows(where: {sender: "0x84c6d5Df8a5e3ab9859708dA7645cC58176a26C0"}, orderBy: id) {
      id
      sender
      amount
      pool
      positionId
      tokenSymbol
      token
      transactionHash
      blockTimestamp
      blockNumber
    }
    repayBorrows(where: {payer: "0x84c6d5Df8a5e3ab9859708dA7645cC58176a26C0"}, orderBy: id) {
      id
      payer
      amount
      pool
      positionId
      token
      transactionHash
      tokenSymbol
      blockTimestamp
      blockNumber
    }
  }
`;


  const [lendingVisible, setLendingVisible] = useState(false);
  const [borrowingVisible, setBorrowingVisible] = useState(false);
  const [isLendTab, setIsLentab] = useState(true);
  const [pieChartInputs, setPieChartInputs] = useState({})
  const [positionData, setPositionData] = useState({})
  const { data, loading, error } = useQuery(FILMS_QUERY);

  const navigate = useNavigate();
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
 console.log("userData", data);
 if(data) {
  const position = getPositionData(data, poolList, tokenList)
  setPositionData(position)
  const pieChart = getChartData(data);
  setPieChartInputs(pieChart)
 }
  }, [data])

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
          />
        </div>

        {/* Lending / Borrowing Portfolio Section */}
        <div className="lend_borrow_portfolio_container">

          <div className="header">
            <div className="analytics_tabs">
              <div className="analytic_box">
                <div className="icon_box">
                  {" "}
                  <FiPercent />{" "}
                </div>
                <div className="values">
                  <p>Net Worth</p>
                  <h5>$1520635</h5>
                </div>
              </div>
              <div className="analytic_box">
                <div className="icon_box">
                  {" "}
                  <FiPercent />{" "}
                </div>
                <div className="values">
                  <p>Lend APY</p>
                  <h5>63.02%</h5>
                </div>
              </div>
              <div className="analytic_box">
                <div className="icon_box">
                  {" "}
                  <FiPercent />{" "}
                </div>
                <div className="values">
                  <p>Borrow APY</p>
                  <h5>52.04%</h5>
                </div>
              </div>
              <div className="analytic_box heath_factor">
                <div className="icon_box">
                  {" "}
                  <FiPercent />{" "}
                </div>
                <div className="values">
                  <p>Health Factor</p>
                  <h5>$1520635</h5>
                </div>
              </div>
            </div>
            <div className="network_dropdown">
              <p>Etherium</p>
            </div>
          </div>

          <div className="content">
            <div className="lend_container">
              <div>
              { pieChartInputs?.donutLends && <DonutChart data={pieChartInputs?.donutLends} /> }
              </div>
              <div>
                <div>
                  <p>Total Lend</p>
                  <h5>{(pieChartInputs?.lendValues?.total)}</h5>
                </div>
                <div>
                  {" "}
                  <p>Lend APY</p>
                  <h5>$123,000,152</h5>
                </div>
                <div>
                  {" "}
                  <p>Total Balance</p>
                  <h5>$123,000,152</h5>
                </div>
              </div>
            </div>
            <div className="borrow_container">
              <div>
               { pieChartInputs?.donutBorrows && <DonutChart data={pieChartInputs?.donutBorrows} /> }
              </div>
              <div>
                <div>
                  <p>Total Borrow</p>
                  <h5>{pieChartInputs?.borrowValues?.total}</h5>
                </div>
                <div>
                  {" "}
                  <p>Borrow APY</p>
                  <h5>$123,000,152</h5>
                </div>
                <div>
                  {" "}
                  <p>Total Balance</p>
                  <h5>$123,000,152</h5>
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
              <FaWallet className="react_icons"/> <h2>Wallet</h2>{" "}
            </span>
            <h2>$130,000,500</h2>
          </div>

          <div className="wallet_table">
            <div className="thead">
              <span>Token</span>
              <span>Price</span>
              <span>Balance</span>
              <span>Value</span>
            </div>
            <div className="tbody">
              {new Array(3).fill(0).map((_, i) => {
                return (
                  <div key={i} className="tbody_row">
                    <span>
                      <img
                        src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                        alt="uft"
                      />
                      <p className="hide_for_mobile" > Unilend Finance / UFT</p>
                      <p className="hide_for_monitor" >UFT</p>
                    </span>
                    <span>$0.23</span>
                    <span>140,003,500</span>
                    <span>350,000,654</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lending Table */}

        <div className="lending_container">
          <div className="title_div">
            <span>
            <ImStack className="react_icons"/> <h2>Open Positions</h2>{" "}
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
                  <span >Pool</span>
                  <span >Token</span>
                  <span >Amount</span>
                  <span >APY</span>
                  <span >Max LTV</span>
                  <span > Interest Earned </span>
                  <span>Pool</span>
                  <span>Token</span>
                  <span>APY</span>
                  <span>Max LTV</span>
                </div>
                <div className="tbody">
                  { positionData?.lendArray && positionData?.lendArray.map((pool) => {
                    return (
                      <div className="tbody_row">
                        <span>
                          <img
                            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                            alt="uft"
                          />
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                            alt="uft"
                          />
                          <p className="hide_for_mobile"> UFT / USDC </p>
                        </span>
                        <span >{pool?.tokenSymbol}</span>
                        <span >{Number(pool?.LendBalance).toFixed(2)}</span>
                        <span >{pool?.apy}</span>
                        <span >{pool.pool.ltv}%</span>
                        <span >{ Number(pool?.interestEarned).toFixed(8)}</span>
                        <span>
                          <img
                            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                            alt="uft"
                          />
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                            alt="uft"
                          />
                          
                        </span>
                        <span>{pool?.tokenSymbol}</span>
                        <span>{Number(pool?.LendBalance).toFixed(2)}</span>
                        <span>{pool?.apy}</span>
                      </div>
                    );
                  })}
                </div>
                {/* <div className="tbody hide_for_monitor">
                  {new Array(6).fill(0).map(() => {
                    return (
                      <div className="tbody_row">
                        <span>
                          <img
                            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                            alt="uft"
                          />
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                            alt="uft"
                          />
                          
                        </span>
                        <span>UFT</span>
                        <span>00</span>
                        <span>74.99%</span>
                      </div>
                    );
                  })}
                </div> */}
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
                  <span >Pool</span>
                  <span >Token</span>
                  <span >Amount</span>
                  <span >APY</span>
                  <span >Current LTV</span>
                  <span > Liq. Price </span>
                  <span>Pool</span>
                  <span>Token</span>
                  <span>APY</span>
                  <span>Current LTV</span>
                </div>
                <div className="tbody">
                  {new Array(6).fill(0).map(() => {
                    return (
                      <div className="tbody_row">
                        <span>
                          <img
                            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                            alt="uft"
                          />
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                            alt="uft"
                          />
                          <p className="hide_for_mobile">UFT / USDC </p>
                        </span>
                        <span >UFT</span>
                        <span >00</span>
                        <span >74.99%</span>
                        <span >74.99%</span>
                        <span >20.23</span>
                        <span>
                          <img
                            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                            alt="uft"
                          />
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                            alt="uft"
                          />
                          
                        </span>
                        <span>UFT</span>
                        <span>00</span>
                        <span>74.99%</span>
                      </div>
                    );
                  })}
                </div>
                {/* <div className="tbody hide_for_monitor">
                  {new Array(6).fill(0).map(() => {
                    return (
                      <div className="tbody_row">
                        <span>
                          <img
                            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                            alt="uft"
                          />
                          <img
                            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
                            alt="uft"
                          />
                          
                        </span>
                        <span>UFT</span>
                        <span>00</span>
                        <span>74.99%</span>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            )}
          </div>
        </div>

        {/* Borrowing Table */}
      </div>
    </div>
  );
}
