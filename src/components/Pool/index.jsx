import React, { useState, useEffect } from "react";
import { Slider, Button, message, Modal, Popover } from "antd";
import {FaChevronDown} from 'react-icons/fa'
import { waitForTransaction } from "@wagmi/core";
import "./styles/index.scss";
import { useNavigate, useParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import {
  getPoolBasicData,
  getPoolAllData,
  getTokenPrice,
  getOracleData,
  handleLend,
  handleRedeem,
  handleBorrow,
  handleRepay,
} from "../../services/pool";
import { imgError } from "../../utils";
import {
  shortNumber,
  getBorrowMax,
  getCurrentLTV,
  getSelectLTV,
  getActionBtn,
} from "../../helpers/contracts";
import PoolSkeleton from "../Loader/PoolSkeleton";
import TwitterModal from "../Common/TwitterModal";
import { tokensBYSymbol } from "../../utils/constants";
import TokenListMoadal from "../ManageTokens/TokenListMoadal";

const lend = "lend";
const borrow = "borrow";
const redeem = "redeem";
const repay = "repay";

export default function PoolComponent(props) {
  const { contracts, user, web3, isLoading, isError, poolList } = props;
  const [activeToken, setActiveToken] = useState(0);
  const [selectedToken, setSelectedToken] = useState(null);
  const [collateralToken, setCollaterralToken] = useState(null);
  const [activeOperation, setActiveOperation] = useState(lend);
  const [selectLTV, setSelectLTV] = useState(5);
  const [poolData, setPoolData] = useState({});
  const [amount, setAmount] = useState(0);
  const [max, setMax] = useState(false);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
  const [isMoreThanPoolLTV, setIsMoreThanPoolLTV] = useState(false);
  const [colleteral, setColleteral] = useState(0);
  const [methodLoaded, setMethodLoaded] = useState({
    getPoolData: false,
    getPoolFullData: false,
    getOraclePrice: false,
    getPoolTokensData: false,
  });
  const [openToken0, setOpenToken0] = useState(false);
  const [openToken1, setOpenToken1] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState({
    token0: "UFT",
    token1: "",
  });
  const [tokensWithCreatedPools, setTokensWithCreatedPools] = useState([]);
  const { poolAddress } = useParams();
  const [selectedPool, setSelectedPool] = useState(poolAddress);
  const navigate = useNavigate();

  const liquidityText = {
    lend: "Your Liquidity",
    redeem: "Redeemable Amount",
    borrow: "Borrowed Amount",
    repay: "Repay Amount",
  };

  const getLiquidityAmount = {
    lend: selectedToken?.lendBalanceFixed,
    borrow: selectedToken?.borrowBalanceFixed,
    redeem: selectedToken?.redeemBalanceFixed,
    repay: selectedToken?.borrowBalanceFixed,
  };

  // Operation Button Text based on values;
  const buttonAction = getActionBtn(
    activeOperation,
    amount,
    selectedToken,
    collateralToken,
    colleteral
  );

  const handleAmount = (e) => {
    setAmount(e.target.value);
    setMax(false);
    const LtvBasedOnAmount = getSelectLTV(
      selectedToken,
      collateralToken,
      e.target.value,
      poolData
    );

    if (LtvBasedOnAmount > poolData.ltv) {
      setIsMoreThanPoolLTV(true);
    } else {
      setIsMoreThanPoolLTV(false);
    }

    const LTV =
      LtvBasedOnAmount > poolData.ltv ? poolData.ltv : LtvBasedOnAmount;
    setSelectLTV(LTV);
  };

  const getCollateral = () => {
    let colleteral;
    if (amount > 0) {
      colleteral =
        ((Number(amount) + Number(selectedToken.borrowBalanceFixed)) *
          Number(selectedToken.price)) /
          (selectLTV / 100) -
        Number(collateralToken.lendBalanceFixed);
      colleteral =
        colleteral > 1 * 10 * -10 && isMoreThanPoolLTV ? colleteral : 0;
      setColleteral(colleteral);
    } else {
      setColleteral(0);
    }
    //  colleteral = isNaN(colleteral) ? 0 :  colleteral > 3 * 10 ** - 4 ? colleteral :0
  };

  useEffect(() => {
    if (!user.isConnected) {
      navigate("/");
    }
    if (selectedToken && collateralToken) {
      getCollateral();
    }
  }, [amount, selectLTV]);

  const checkTxnStatus = (hash, txnData) => {
    waitForTransaction({
      hash,
    })
      .then((receipt) => {
        if (receipt.status == 1) {
          message.success(
            `Transaction for ${txnData.method} of ${Number(
              txnData.amount
            ).toFixed(4)} for token ${txnData.tokenSymbol}`,
            5
          );
          setMethodLoaded({
            ...methodLoaded,
            getPoolFullData: false,
            getOraclePrice: false,
            getPoolTokensData: false,
          });
          if (txnData.method !== "approval") {
            setAmount(0);
            //setShowTwitterModal(true)
          }
          setMax(false);
          setIsOperationLoading(false);
        } else {
          setTimeout(function () {
            checkTxnStatus(hash, txnData);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("status:", error);
        console.log({ error });
        setTimeout(function () {
          checkTxnStatus(hash, txnData);
        }, 1000);
      });
  };

  const checkTxnError = (error) => {
    setAmount(0);
    setMax(false);
    setIsOperationLoading(false);
    console.log("Error", { error });
    const errorText = String(error.reason);
    message.error(error?.message ? errorText : "Error: Transaction Error");
  };

  const handleOperation = () => {
    (async () => {
      setIsOperationLoading(true);
      if (contracts.coreContract) {
        if (activeOperation === lend) {
          handleLend(
            amount,
            selectedToken,
            poolData,
            contracts,
            user.address,
            selectedPool,
            web3,
            checkTxnStatus,
            checkTxnError
          );
        } else if (activeOperation === redeem) {
          handleRedeem(
            amount,
            selectedToken,
            max,
            poolData,
            selectedPool,
            user.address,
            contracts,
            checkTxnStatus,
            checkTxnError
          );
        } else if (activeOperation === borrow) {
          handleBorrow(
            selectedToken,
            user.address,
            collateralToken,
            poolData,
            contracts,
            colleteral,
            amount,
            web3,
            checkTxnStatus,
            checkTxnError
          );
        } else if (activeOperation === repay) {
          handleRepay(
            amount,
            selectedToken,
            poolData,
            max,
            contracts,
            selectedPool,
            user.address,
            web3,
            checkTxnStatus,
            checkTxnError
          );
        }
      }
    })();
  };

  const toggleToken = (token) => {
    setActiveToken(token);
    setAmount(0);
    setSelectLTV(5);
    if (token === 0) {
      setSelectedToken(poolData.token0);
      //setActiveOperation(poolData.token0.tabs[0]);
      setCollaterralToken(poolData.token1);
    } else {
      setSelectedToken(poolData.token1);
      //setActiveOperation(poolData.token1.tabs[0]);
      setCollaterralToken(poolData.token0);
    }
  };

  const toggleOperation = (operation) => {
    if (selectedToken?.tabs?.includes(operation)) {
      setActiveOperation(operation);
      setAmount(0);
      setSelectLTV(5);
    }
  };

  const handleLTVSlider = (value) => {
    setSelectLTV(value);
    if (colleteral <= 0) {
      const amountBasedOnLtv = getBorrowMax(
        selectedToken,
        collateralToken,
        value
      );
      setAmount(amountBasedOnLtv);
    }
  };

  // useEffect(() => {
  //   setMethodLoaded({
  //     getPoolData: false,
  //     getPoolFullData: false,
  //     getOraclePrice: false,
  //     getPoolTokensData: false,
  //   })
  // }, [user])

  // get contract data
  useEffect(() => {
    if (selectedToken === null) setIsPageLoading(true);
    if (
      contracts.helperContract &&
      contracts.coreContract &&
      Object.values(poolList).length > 0
    ) {
      (async function () {
        if (!methodLoaded.getPoolData) {
          const pool = await getPoolBasicData(
            contracts,
            selectedPool,
            poolData,
            poolList[selectedPool]
          );
          setPoolData(pool);
          setMethodLoaded({ ...methodLoaded, getPoolData: true });
        } else if (methodLoaded.getPoolData && !methodLoaded.getPoolFullData) {
          const pool = await getPoolAllData(
            contracts,
            poolData,
            selectedPool,
            user.address
          );

          setMethodLoaded({ ...methodLoaded, getPoolFullData: true });
          setPoolData(pool);
        } else if (
          methodLoaded.getPoolData &&
          methodLoaded.getPoolFullData &&
          !methodLoaded.getOraclePrice
        ) {
          const pool = await getOracleData(contracts, poolData);
          setPoolData(pool);
          setMethodLoaded({ ...methodLoaded, getOraclePrice: true });
        } else if (
          methodLoaded.getPoolData &&
          methodLoaded.getPoolFullData &&
          methodLoaded.getOraclePrice &&
          !methodLoaded.getPoolTokensData
        ) {
          const poolTokensPrice = await getTokenPrice(
            contracts,
            poolData,
            selectedPool,
            user.address
          );

          setPoolData(poolTokensPrice);
          setMethodLoaded({ ...methodLoaded, getPoolTokensData: true });
        }
      })();

      const isAllTrue = Object.values(methodLoaded).find((el) => el === false);
      if (
        isAllTrue === undefined &&
        selectedToken !== null &&
        selectedToken?._symbol === poolData?.token0?._symbol
      ) {
        setSelectedToken(poolData?.token0);
        setCollaterralToken(poolData?.token1);

        setActiveToken(0);
        setIsPageLoading(false);
        // setSelectedTokens({
        //   token0: poolData?.token0?.symbol,
        //   token1: poolData?.token1?.symbol
        // })
      } else if (isAllTrue === undefined && selectedToken !== null) {
        setSelectedToken(poolData?.token1);
        setCollaterralToken(poolData?.token0);
        setIsPageLoading(false);
        // setSelectedTokens({
        //   token0: poolData?.token0?.symbol,
        //   token1: poolData?.token1?.symbol
        // })
      } else if (isAllTrue === undefined) {
        setSelectedToken(poolData?.token0);
        setCollaterralToken(poolData?.token1);
        setActiveToken(0);
        setIsPageLoading(false);
        // setSelectedTokens({
        //   token0: poolData?.token0?.symbol,
        //   token1: poolData?.token1?.symbol
        // })
      }
    }
  }, [contracts, methodLoaded, user, poolList, selectedPool]);

  // max trigger for sending max values in redeem, lend, borrow, repay;
  const maxTrigger = () => {
    setMax(true);
    if (activeOperation === lend) {
      setAmount(selectedToken.balanceFixed);
    } else if (activeOperation === borrow) {
      const maxBorrow = getBorrowMax(
        selectedToken,
        collateralToken,
        poolData.ltv
      );
      setAmount(maxBorrow);
      setSelectLTV(poolData.ltv);
    } else if (activeOperation === redeem) {
      if (
        Number(selectedToken.liquidityFixed) >
        Number(selectedToken.redeemBalanceFixed)
      ) {
        setAmount(selectedToken.redeemBalanceFixed);
      } else {
        setAmount(selectedToken.liquidityFixed);
      }
    } else if (activeOperation == repay) {
      setAmount(selectedToken.borrowBalanceFixed);
    }
  };

  const handleCloseModals = () => {
    setIsOpenConfirmModal(false);
  };
  const handleOperationWithConfirmation = () => {
    if (
      colleteral > 0 &&
      activeOperation === borrow &&
      !isOpenConfirmModal &&
      !buttonAction.text.includes("Approve")
    ) {
      setIsOpenConfirmModal(true);
    } else {
      handleOperation();
      handleCloseModals();
    }
  };

  const ConfirmationModal = () => {
    return (
      <div className="ConfirmModel">
        <div className="collateral_icon">
          <img className="ticker_img" src={collateralToken?.logo} />
          {collateralToken?._symbol}
        </div>
        <h1> {Number(colleteral).toFixed(4)}</h1>
        <p>
          Additional Collateral Required <br /> From Wallet
        </p>
        <div className="buttons">
          <button onClick={handleCloseModals}>Cancel</button>
          <button onClick={handleOperationWithConfirmation}>Confirm</button>
        </div>
      </div>
    );
  };

  const handlePoolAndTokenSelect = (key, token) => {
    const tokens = {
      ...selectedTokens,
      [key]: token,
    };

    if (tokens.token0 && tokens.token1) {
      let poolAddress;
      const poolsArray = Object.values(poolList);
      for (let i = 0; i < poolsArray.length; i++) {
        const pool = poolsArray[i];
        if (
          (poolsArray[i].token0.symbol == tokens.token0 &&
            poolsArray[i].token1.symbol == tokens.token1) ||
          (poolsArray[i].token0.symbol == tokens.token1 &&
            poolsArray[i].token1.symbol == tokens.token0)
        ) {
          poolAddress = pool.poolAddress;
          setMethodLoaded({
            getPoolData: false,
            getPoolFullData: false,
            getOraclePrice: false,
            getPoolTokensData: false,
          });
          setSelectedPool(poolAddress);
          setIsPageLoading(true);
          setSelectedToken(null);
          // setVisible0(false);
          // setVisible1(false);
          break;
        }
      }
      console.log("poolAddress", poolAddress);
    }

    console.log("handlePoolAndTokenSelect", tokens);
    setSelectedTokens(tokens);
    setShowSelectTokenModal(false)
  };
  const handleSelectTokens = (key, symbol) => {
    // setVisible0(bool);
    const token = {
      ...selectedToken
    }
  };

  const SortContent = () => {
    return (
      <div
        style={{ height: "200px", overflow: "scroll" }}
        className="sort_popover"
      >
        {Object.keys(tokensBYSymbol).map((symbol, i) => (
          <p key={i} onClick={handlePoolAndTokenSelect}>
            {symbol}
          </p>
        ))}
      </div>
    );
  };

  const SortContent1 = () => {
    return (
      <div
        style={{ height: "200px", overflow: "scroll" }}
        className="sort_popover"
      >
        {tokensWithCreatedPools.map((token) => (
          <p
            onClick={() =>
              handlePoolAndTokenSelect("token1", token.token.symbol)
            }
          >
            {token.token.symbol}
          </p>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const poolsArray = Object.values(poolList);
    if (poolsArray.length) {
      const filtered = poolsArray
        .filter(
          (pool) =>
            pool.token0.symbol === selectedTokens.token0 ||
            pool.token1.symbol === selectedTokens.token0
        )
        .map((pool) => {
          if (pool.token0.symbol === selectedTokens.token0) {
            return { token: pool.token1 };
          } else if (pool.token1.symbol === selectedTokens.token0) {
            return { token: pool.token0 };
          }
        });
      setTokensWithCreatedPools(filtered);
      console.log("PoolArray", poolsArray, filtered);
    }
  }, [poolList]);


  const handleOpenSelectTokenMoadal = (bool, token) => {
    if(token === 'token0'){
      setOpenToken0(true)
    } else if (token === 'token1'){
      setOpenToken1(true)
    }
    setShowSelectTokenModal(bool)
  }

  return (
    <>
      {isPageLoading && selectedToken == null ? (
        <PoolSkeleton />
      ) : (
        <div className="pool_container">
          {/* <div className="token_container">
            <Popover
              content={<SortContent />}
              trigger="click"
              overlayClassName="sort_dropDown"
              placement="bottomLeft"
              open={visible0}
              onOpenChange={(bool) => setVisible0(bool)}
            >
              <div className={`sortBy`}>
                <p>List</p>
              </div>
            </Popover>
            <Popover
              content={<SortContent1 />}
              trigger="click"
              overlayClassName="sort_dropDown"
              placement="bottomLeft"
              open={visible1}
              onOpenChange={(bool) => setVisible1(bool)}
            >
              <div className={`sortBy`}>
                <p>List</p>
              </div>
            </Popover>
          </div> */}
          <div className="token_container">
            <div>
              <div
                onClick={() => toggleToken(0)}
                className={`token_tab ${activeToken === 0 ? " active" : ""}`}
              >
                <img src={poolData?.token0?.logo} onError={imgError} alt="" />
                <h2>{poolData?.token0?._symbol}</h2>
              </div>
              <div onClick={() => handleOpenSelectTokenMoadal(true, 'token0')} className="dropdown">
              <FaChevronDown className="dropicon"/>
              </div>
            </div>
            <div>
              <div
                onClick={() => toggleToken(1)}
                className={`token_tab ${activeToken === 1 ? " active" : ""}`}
              >
                <img src={poolData?.token1?.logo} onError={imgError} alt="" />
                <h2>{poolData?.token1?._symbol}</h2>
              </div>
              <div onClick={() => handleOpenSelectTokenMoadal(true, 'token1')} className="dropdown">
                <FaChevronDown className="dropicon"/>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="oparation_tab">
              <div
                onClick={() => toggleOperation(lend)}
                className={
                  activeOperation === lend
                    ? "active"
                    : selectedToken?.tabs?.includes("lend")
                    ? ""
                    : "disable_tab"
                }
              >
                Lend
              </div>
              <div
                onClick={() => toggleOperation(redeem)}
                className={
                  activeOperation === redeem
                    ? "active"
                    : selectedToken?.tabs?.includes("redeem")
                    ? ""
                    : "disable_tab"
                }
              >
                Redeem
              </div>
              <div
                onClick={() => toggleOperation(borrow)}
                className={
                  activeOperation === borrow
                    ? "active"
                    : selectedToken?.tabs?.includes("borrow")
                    ? ""
                    : "disable_tab"
                }
              >
                Borrow
              </div>
              <div
                onClick={() => toggleOperation(repay)}
                className={
                  activeOperation === repay
                    ? "active"
                    : selectedToken?.tabs?.includes("repay")
                    ? ""
                    : "disable_tab"
                }
              >
                Repay
              </div>
            </div>

            <div className="user_liquidity">
              <p>{liquidityText[activeOperation]}</p>
              <h1>
                {selectedToken
                  ? shortNumber(getLiquidityAmount[activeOperation])
                  : 0}
              </h1>
            </div>

            <div className="token_balance_container">
              <div className="lable">
                <p>{activeOperation}</p>
                <div>
                  {" "}
                  <a
                    href={`https://chaindrop.org/?chainid=${user?.network?.id}&token=${selectedToken?._address}`}
                    target="_blank"
                  >
                    {" "}
                    {/* <img src={faucet} alt='faucet icon' />{' '} */}
                  </a>
                </div>
              </div>
              <div className="token_balance">
                <div>
                  <img src={selectedToken?.logo} alt="" />
                  <p>{selectedToken?._symbol}</p>
                </div>
                <p>Balance: {Number(selectedToken?.balanceFixed).toFixed(2)}</p>
              </div>
            </div>

            <div className="input_container">
              <input
                value={amount}
                onChange={handleAmount}
                type="number"
                placeholder="0.0"
              />
              <button onClick={maxTrigger} className="max_btn">
                MAX
              </button>
            </div>
            {
              <div
                className={`colleteral_req ${
                  activeOperation === borrow && colleteral > 0
                    ? "show_colleteral_req"
                    : "hide_colleteral_req"
                }`}
              >
                <p>Additional Collateral Required From Wallet</p>

                <div>
                  <h5>{Number(colleteral).toFixed(5)}</h5>
                  <img src={collateralToken?.logo} alt="" />
                  <p>{collateralToken?._symbol}</p>
                </div>
              </div>
            }

            {activeOperation === borrow && (
              <div className="ltv_container">
                <p>
                  <span>Current LTV</span>
                  <span>{getCurrentLTV(selectedToken, collateralToken)}%</span>
                </p>
                <p>
                  <span>Select LTV</span>
                  <span>
                    {" "}
                    <span>{selectLTV}%/</span>
                    {poolData.ltv}%{" "}
                  </span>
                </p>
                <Slider
                  value={Number(selectLTV)}
                  defaultValue={Number(selectLTV)}
                  onChange={handleLTVSlider}
                  min={5}
                  max={Number(poolData.ltv)}
                  tooltipVisible={false}
                  className="ltv_slider"
                />
              </div>
            )}

            {(activeOperation === redeem || activeOperation === borrow) && (
              <div className="liquidity_factors">
                <p>
                  <span>Liquidity</span>
                  <span>
                    {isNaN(Number(selectedToken?.liquidityFixed).toFixed(2))
                      ? 0
                      : Number(selectedToken?.liquidityFixed).toFixed(2)}{" "}
                    {selectedToken?._symbol}
                  </span>
                </p>
                <p>
                  <span>Utilization</span>
                  <span>
                    {isNaN(selectedToken?.utilRate)
                      ? 0
                      : selectedToken?.utilRate}{" "}
                  </span>
                </p>
                <p>
                  <span>Oracle</span>
                  <span>
                    1 {poolData.token0._symbol} ={" "}
                    {Number(poolData.token0.price).toFixed(2)}{" "}
                    {poolData.token1._symbol}{" "}
                  </span>
                </p>
              </div>
            )}

            {(activeOperation === lend || activeOperation === borrow) && (
              <div className="analytics">
                <div>
                  <span>{activeOperation} APY</span>
                  <h3>
                    {activeOperation === lend
                      ? isNaN(Number(selectedToken?.lendAPY).toFixed(4))
                        ? 0
                        : Number(selectedToken?.lendAPY).toFixed(4)
                      : isNaN(Number(selectedToken?.borrowAPY).toFixed(4))
                      ? 0
                      : Number(selectedToken?.borrowAPY).toFixed(4)}
                    %
                  </h3>
                </div>
                <div>
                  <span>Utilization rate</span>
                  <h3>
                    {isNaN(selectedToken?.utilRate)
                      ? 0
                      : selectedToken?.utilRate}
                    %
                  </h3>
                </div>
                <div>
                  <span>Health Factor</span>
                  <h3>
                    {selectedToken?.healthFactorFixed > 100
                      ? 100
                      : Number(selectedToken?.healthFactorFixed).toFixed(2)}
                  </h3>
                </div>
              </div>
            )}
            <div className="operation_btn">
              <Button
                onClick={handleOperationWithConfirmation}
                loading={isOperationLoading}
                disabled={buttonAction.disable}
              >
                {buttonAction.text}
              </Button>
            </div>
          </div>
          <Modal
            className="antd_modal_overlay"
            visible={isOpenConfirmModal}
            centered
            onCancel={handleCloseModals}
            footer={null}
            closable={false}
          >
            {<ConfirmationModal />}
          </Modal>
          {/* <Modal
            className="antd_modal_overlay"
            visible={showTwitterModal}
            centered
            onCancel={() => setShowTwitterModal(false)}
            footer={null}
            closable={false}
          >
            {<TwitterModal />}
          </Modal> */}
          <Modal
            className="antd_modal_overlay"
            visible={showSelectTokenModal}
            centered
            onCancel={() => setShowSelectTokenModal(false)}
            footer={null}
            closable={false}
          >
            <TokenListMoadal openToken={{token0: openToken0, token1: openToken1}}  handlePoolAndTokenSelect={handlePoolAndTokenSelect} />
          </Modal>
        </div>
      )}
    </>
  );
}
