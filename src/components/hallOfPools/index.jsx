import React, { useState } from "react";
import { Slider, Button } from "antd";
import "./styles/index.scss";

const lend = "lend";
const borrow = "borrow";
const redeem = "redeem";
const repay = "repay";

export default function HallOfPoolsComponent(props) {
  const [activeToken, setActiveToken] = useState(1);
  const [activeOperation, setActiveOperation] = useState(lend);
  const [selectLTV, setSelectLTV] = useState(5);

  const toggleToken = (token) => {
    setActiveToken(token);
  };

  const toggleOperation = (operation) => {
    setActiveOperation(operation);
  };

  const handleLTVSlider = (value) => {
    setSelectLTV(value);
  };

  return (
    <div className="pool_container">
      <div className="token_container">
        <div
          onClick={() => toggleToken(1)}
          className={activeToken === 1 && "active"}
        >
          <img
            src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
            alt=""
          />
          <h2>UFT</h2>
        </div>
        <div
          onClick={() => toggleToken(2)}
          className={activeToken === 2 && "active"}
        >
          <img
            src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
            alt=""
          />
          <h2>USDC</h2>
        </div>
      </div>
      <div className="content">
        <div className="oparation_tab">
          <div
            onClick={() => toggleOperation("lend")}
            className={activeOperation === "lend" && "active"}
          >
            Lend
          </div>
          <div
            onClick={() => toggleOperation("redeem")}
            className={activeOperation === "redeem" && "active"}
          >
            Redeem
          </div>
        </div>

        <div className="user_liquidity">
          <p>Your Liquidity</p>
          <h1>100,00</h1>
        </div>

        <div className="token_balance_container">
          <div className="lable">
            <p>{activeOperation}</p>
          </div>
          <div className="token_balance">
            <div>
              <img
                src="https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
                alt=""
              />
              <p>UFT</p>
            </div>
            <p>Balance: 165</p>
          </div>
        </div>

        <div className="input_container">
          <input type="text" placeholder="0.0" />
          <button className="max_btn">MAX</button>
        </div>

        {activeOperation === redeem && (
          <div className="ltv_container">
            <p>
              <span>Current LTV</span>
              <span>68%</span>
            </p>
            <p>
              <span>Select LTV</span>
              <span>
                {" "}
                <span>{selectLTV}%/</span>75%{" "}
              </span>
            </p>
            <Slider
              value={Number(selectLTV)}
              defaultValue={Number(selectLTV)}
              onChange={handleLTVSlider}
              min={5}
              max={75}
              tooltipVisible={false}
              className="ltv_slider"
            />
          </div>
        )}

        {activeOperation === lend && (
          <div className="analytics">
            <div>
              <span>Lend APY</span>
              <h3>12.25%</h3>
            </div>
            <div>
              <span>Utilization rate</span>
              <h3>85.00%</h3>
            </div>
            <div>
              <span>Health Factor</span>
              <h3>1</h3>
            </div>
          </div>
        )}

        {activeOperation === redeem && (
          <div className="liquidity_factors">
            <p>
              <span>Liquidity</span>
              <span>91.967 OMATIC</span>
            </p>
            <p>
              <span>Utilization</span>
              <span>0.000 </span>
            </p>
            <p>
              <span>Oracle</span>
              <span>1 OMATIC = 1 UFT </span>
            </p>
          </div>
        )}
        <div className="operation_btn">      
          <Button >Lend</Button>
        </div>

      </div>
    </div>
  );
}
