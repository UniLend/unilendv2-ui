import React, { useState } from "react";
import "./styles/index.scss";
import banner from "../../assets/dashboardbanner.svg";
import walletIcon from "../../assets/wallet.svg";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { Input, Progress, Popover } from "antd";

export default function UserDashboardComponent(props) {
  const { contracts, user, web3, isLoading, isError, poolList } = props;
  const [lendingVisible, setLendingVisible] = useState(false);
  const [borrowingVisible, setBorrowingVisible] = useState(false);

  const handleLendingVisibleChange = (visible) => {
    setLendingVisible(visible);
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
            addonBefore={<SearchOutlined />}
            className="search_address"
            placeholder="Search address"
          />
        </div>

        {/* Lending / Borrowing Portfolio Section */}
        <div className="lend_borrow_portfolio_container">
          <div className="header">
            <h2>$13,00,500</h2>
            <div className="network_dropdown">
              <p>Etherium</p>
            </div>
          </div>
          <div className="content">
            <div className="lend_container">
              <h2>Lending Portfolio</h2>
              <h3>$130,000,500</h3>
              <h4>Top 3 Tokens</h4>
              <div className="top3_tokens">
                <div>
                  <span>ETH</span>
                  <Progress percent={80} showInfo={false} />
                </div>
                <div>
                  <span>ETH</span>
                  <Progress percent={60} showInfo={false} />
                </div>
                <div>
                  <span>ETH</span>
                  <Progress percent={70} showInfo={false} />
                </div>
              </div>
              <div className="interest_earned">
                <div>
                  <p>30 Days Interest Earned</p>
                  <h3>$130,000,500</h3>
                </div>
                <div>
                  <p>Last 24 Hr Interest Earned</p>
                  <h3>$130,000,500</h3>
                </div>
              </div>
            </div>
            <div className="borrow_container">
              <h2>Borrowing Portfolio</h2>
              <h3>$130,000,500</h3>
              <h4>Top 3 Tokens</h4>
              <div className="top3_tokens">
                <div>
                  <span>ETH</span>
                  <Progress
                    percent={90}
                    showInfo={false}
                    strokeColor={"var(--light-teal)"}
                  />
                </div>
                <div>
                  <span>ETH</span>
                  <Progress
                    percent={80}
                    showInfo={false}
                    strokeColor={"var(--light-teal)"}
                  />
                </div>
                <div>
                  <span>ETH</span>
                  <Progress
                    percent={70}
                    showInfo={false}
                    strokeColor={"var(--light-teal)"}
                  />
                </div>
              </div>
              <div className="interest_earned">
                <div>
                  <p>30 Days Interest Earned</p>
                  <h3>$130,000,500</h3>
                </div>
                <div>
                  <p>Last 24 Hr Interest Earned</p>
                  <h3>$130,000,500</h3>
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
              <img src={walletIcon} alt="wallet_icon" /> <h2>Wallet</h2>{" "}
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
                      <p>Unilend Finance / UFT</p>
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
              <h2>Lending</h2>
            </span>
          </div>
          <div className="lending_table">
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
              <span>Lend APY</span>
              <span>max LTV</span>
              <span>Liq.Price</span>
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
                      <p>UFT / USDC </p>
                    </span>
                    <span>UFT</span>
                    <span>200</span>
                    <span>00</span>
                    <span>74.99%</span>
                    <span>20.23</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Borrowing Table */}

        <div className="lending_container">
          <div className="title_div">
            <span>
              <h2> Borrowing </h2>
            </span>
          </div>
          <div className="lending_table">
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
              <span>Liq.Price</span>
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
                      <p>UFT / USDC </p>
                    </span>
                    <span>UFT</span>
                    <span>200</span>
                    <span>00</span>
                    <span>74.99%</span>
                    <span>20.23</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
