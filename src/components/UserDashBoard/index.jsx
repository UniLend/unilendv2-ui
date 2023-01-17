import React, { useState } from "react";
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

export default function UserDashboardComponent(props) {
  const { contracts, user, web3, isLoading, isError, poolList } = props;
  const [lendingVisible, setLendingVisible] = useState(false);
  const [borrowingVisible, setBorrowingVisible] = useState(false);
  const [isLendTab, setIsLentab] = useState(true);
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
                <DonutChart />
              </div>
              <div>
                <div>
                  <p>Total Balance</p>
                  <h5>$123,000,152</h5>
                </div>
                <div>
                  {" "}
                  <p>Total Balance</p>
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
              <DonutChart />
              </div>
              <div>
                <div>
                  <p>Total Balance</p>
                  <h5>$123,000,152</h5>
                </div>
                <div>
                  {" "}
                  <p>Total Balance</p>
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
              {new Array(3).fill(0).map(() => {
                return (
                  <div className="tbody_row">
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
            <ImStack className="react_icons"/> <h2>Pool Positions</h2>{" "}
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
