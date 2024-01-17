import React, { useState, useEffect } from "react";
import {
  Slider,
  Button,
  message,
  Modal,
  Popover,
  Tooltip,
  notification,
} from "antd";
import { FaChevronDown } from "react-icons/fa";
import "./styles/index.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

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
import { fixFormatNumber, imgError } from "../../utils";
import {
  shortNumber,
  getBorrowMax,
  getCurrentLTV,
  getSelectLTV,
  getActionBtn,
  fromBigNumber,
  truncateToDecimals
} from "../../helpers/contracts";
import PoolSkeleton from "../Loader/PoolSkeleton";
import TwitterModal from "../Common/TwitterModal";
import { tokensBYSymbol } from "../../utils/constants";
import TokenListMoadal from "../ManageTokens/TokenListMoadal";
import { useSelector } from "react-redux";
import useWalletHook from "../../lib/hooks/useWallet";
import { waitForBlockConfirmation } from "../../lib/fun/functions";
import NotificationMessage from "../Common/NotificationMessage";

const lend = "lend";
const borrow = "borrow";
const redeem = "redeem";
const repay = "repay";

export default function PoolComponent() {
  const contracts = useSelector((state) => state?.contracts);
  const user = useSelector((state) => state?.user);
  const web3 = useSelector((state) => state?.web3);
  const poolList = useSelector((state) => state?.poolList);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeToken, setActiveToken] = useState(0);
  const [selectedToken, setSelectedToken] = useState(null);
  const [collateralToken, setCollaterralToken] = useState(null);
  const [activeOperation, setActiveOperation] = useState(lend);
  const [selectLTV, setSelectLTV] = useState(5);
  const [poolData, setPoolData] = useState({});
  const [amount, setAmount] = useState(null);
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
  const [reFetching, setReFetching] = useState(false);
  const [openToken0, setOpenToken0] = useState(false);
  const [openToken1, setOpenToken1] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState({
    token0: "",
    token1: "",
  });
  const [tokensWithCreatedPools, setTokensWithCreatedPools] = useState([]);
  const { poolAddress } = useParams();
  const [selectedPool, setSelectedPool] = useState(poolAddress);
  const navigate = useNavigate();
  const { isConnected } = useWalletHook();
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
    colleteral,
    reFetching
  );

  // reload page after creating new pool from create pool method
  useEffect(() => {
    const reloadParam = searchParams.get("reload");
    if (reloadParam) {
      window.location.reload();
      setSearchParams((params) => params.set("reload", false));
    }
  }, [searchParams]);

  const handleAmount = (e) => {
    if (e.target.value === "") {
      setAmount(null);
    } else {
      setAmount(parseFloat(e.target.value));
    }
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
    if (!isConnected) {
      navigate("/");
    }
    if (selectedToken && collateralToken) {
      getCollateral();
    }
  }, [amount, selectLTV]);

  const checkTxnStatus = (hash, txnData) => {
    waitForBlockConfirmation(hash)
      .then((res) => {
        const [receipt, currentBlockNumber] = res;
        const trasactionBlock = fromBigNumber(receipt.blockNumber);
        const currentblock = fromBigNumber(currentBlockNumber);

        if (receipt.status == "success" && currentblock - trasactionBlock > 1) {
          setReFetching(true);
          if (txnData.method !== "approval") {
            const msg = `Transaction for ${txnData.method} of ${Number(
              txnData.amount
            ).toFixed(4)} for token ${txnData.tokenSymbol}`;
            NotificationMessage("success", msg);
            setAmount("");
            //setShowTwitterModal(true)
            setTimeout(() => {
              setMethodLoaded({
                getPoolData: false,
                getPoolFullData: false,
                getOraclePrice: false,
                getPoolTokensData: false,
              });
            }, 8000);
          } else {
            NotificationMessage("success", 'Approval Successfull');
            setTimeout(() => {
              setMethodLoaded({
                getPoolData: true,
                getPoolFullData: true,
                getOraclePrice: true,
                getPoolTokensData: false,
              });
            }, 5000);
            // window.location.reload();
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
        setTimeout(function () {
          checkTxnStatus(hash, txnData);
        }, 1000);
      });
  };

  const checkTxnError = (error) => {
    setAmount("");
    setMax(false);
    setIsOperationLoading(false);

    const errorText = String(error.reason);
    const data = error?.message ? errorText : "Error: Transaction Error";
    const msg =
      error?.code === "ACTION_REJECTED"
        ? "Transaction Denied"
        : "Something went wrong";
    NotificationMessage("error", msg);
  };

  const handleOperation = () => {
    try {
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
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedToken && collateralToken) {
      const ltv = getCurrentLTV(selectedToken, collateralToken);
      setSelectLTV(ltv);
    }
  }, [selectedToken, collateralToken]);

  const toggleToken = (token) => {
    setActiveToken(token);
    setAmount("");
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
      setAmount("");
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

  const fetchPoolDATA = async () => {
    try {
      if (!methodLoaded.getPoolData) {
        const pool = await getPoolBasicData(
          contracts,
          selectedPool,
          poolData,
          poolList[selectedPool]
        );
        if (pool?.token0 && pool?.token1) {
          setPoolData(pool);
          setMethodLoaded({ ...methodLoaded, getPoolData: true });
        }
      } else if (methodLoaded.getPoolData && !methodLoaded.getPoolFullData) {
        const pool = await getPoolAllData(
          contracts,
          poolData,
          selectedPool,
          user.address
        );
        if (pool?.token0 && pool?.token1) {
          setMethodLoaded({ ...methodLoaded, getPoolFullData: true });
          setPoolData(pool);
        }
      } else if (
        methodLoaded.getPoolData &&
        methodLoaded.getPoolFullData &&
        !methodLoaded.getOraclePrice
      ) {
        const pool = await getOracleData(contracts, poolData);
        if (pool?.token0 && pool?.token1) {
          setPoolData(pool);
          setMethodLoaded({ ...methodLoaded, getOraclePrice: true });
        }
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
        if (poolTokensPrice?.token0 && poolTokensPrice?.token1) {
          setPoolData(poolTokensPrice);
          setMethodLoaded({ ...methodLoaded, getPoolTokensData: true });
        }
      }
    } catch (error) {
      console.log("error on fetch", {error});
      if(error.code == "CALL_EXCEPTION"){
        console.log("error.code1", error.code);
        fetchPoolDATA()
       }
      throw error;
    }
  };

  useEffect(() => {
    if (selectedToken === null) setIsPageLoading(true);

    const isAllTrue =
      Object.values(methodLoaded).find((el) => el === false) === undefined
        ? true
        : false;

    if (
      contracts.helperContract &&
      contracts.coreContract &&
      Object.values(poolList).length > 0 &&
      isAllTrue == false
    ) {
      try {
        fetchPoolDATA();
      } catch (error) {
        fetchPoolDATA();
      }
    }

    if (
      isAllTrue &&
      selectedToken !== null &&
      selectedToken?._symbol === poolData?.token0?._symbol
    ) {
      setSelectedToken(poolData?.token0);
      setCollaterralToken(poolData?.token1);
      setReFetching(false);
      setActiveToken(0);
      setIsPageLoading(false);
      setSelectedTokens({
        token0: poolData?.token0?.symbol,
        token1: poolData?.token1?.symbol,
      });
    } else if (isAllTrue && selectedToken !== null) {
      setSelectedToken(poolData?.token1);
      setCollaterralToken(poolData?.token0);
      setIsPageLoading(false);
      setReFetching(false);
      setSelectedTokens({
        token0: poolData?.token0?.symbol,
        token1: poolData?.token1?.symbol,
      });
    } else if (isAllTrue) {
      setSelectedToken(poolData?.token0);
      setCollaterralToken(poolData?.token1);
      setActiveToken(0);
      setIsPageLoading(false);
      setReFetching(false);
      setSelectedTokens({
        token0: poolData?.token0?.symbol,
        token1: poolData?.token1?.symbol,
      });
    }
  }, [contracts, methodLoaded, user, poolList, selectedPool, poolData]);

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
    setSelectedTokens(tokens);
    setShowSelectTokenModal(false);
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
          navigate(`/pool/${pool.poolAddress}`);
          setMethodLoaded({
            getPoolData: false,
            getPoolFullData: false,
            getOraclePrice: false,
            getPoolTokensData: false,
          });
          setSelectedPool(pool.poolAddress);
          setIsPageLoading(true);
          setSelectedToken(null);
          // setVisible0(false);
          // setVisible1(false);
          break;
        }
      }

      if (poolAddress == undefined) {
        setSelectedTokens({
          token0: poolData?.token0?.symbol,
          token1: poolData?.token1?.symbol,
        });
      }
    }
  };
  const handleSelectTokens = (key, symbol) => {
    // setVisible0(bool);
    const token = {
      ...selectedToken,
    };
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

  const handleOpenSelectTokenMoadal = (bool, token) => {
    setAmount("");
    if (token === "token0") {
      setOpenToken0(true);
      setOpenToken1(false);
    } else if (token === "token1") {
      setOpenToken1(true);
      setOpenToken0(false);
    }
    setShowSelectTokenModal(bool);
  };

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
              <div
                onClick={() => handleOpenSelectTokenMoadal(true, "token0")}
                className="dropdown"
              >
                <FaChevronDown className="dropicon" />
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
              <div
                onClick={() => handleOpenSelectTokenMoadal(true, "token1")}
                className="dropdown"
              >
                <FaChevronDown className="dropicon" />
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
              <Tooltip
                title={
                  selectedToken?.tabs?.includes("borrow")
                    ? ""
                    : "Oracle is not set"
                }
                defaultOpen
              >
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
              </Tooltip>
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
              <p className="paragraph06">{liquidityText[activeOperation]}</p>
              <Tooltip
                title={getLiquidityAmount[activeOperation]}
                trigger="hover"
              >
                <h1 className="heading02">
                  {selectedToken
                    ? truncateToDecimals(getLiquidityAmount[activeOperation],6)
                    : 0}
                </h1>
              </Tooltip>
            </div>

            <div className="token_balance_container">
              <div className="lable">
                <p className="paragraph05">{activeOperation}</p>
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
                  <p className="paragraph04">{selectedToken?._symbol}</p>
                </div>
                <Tooltip title={selectedToken?.balanceFixed}>
                  <p className="paragraph06">
                    Balance: {Number(truncateToDecimals(selectedToken?.balanceFixed,6))}
                  </p>
                </Tooltip>
              </div>
            </div>

            <div className="input_container">
              <input
                value={amount !== null ? amount : ""}
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
                  //tooltipVisible={false}

                  className="ltv_slider"
                />
              </div>
            )}

            {(activeOperation === redeem || activeOperation === borrow) && (
              <div className="liquidity_factors">
                <p>
                  <span>Liquidity</span>
                  <Tooltip title={selectedToken?.liquidityFixed}>
                  <span>
                    {isNaN(Number(selectedToken?.liquidityFixed).toFixed(6))
                      ? 0
                      : Number(truncateToDecimals(selectedToken?.liquidityFixed,6))}  {selectedToken?._symbol}
                  </span>
                  </Tooltip>
                </p>
                <p>
                  <span>Utilization</span>
                  <span>
                    {isNaN(selectedToken?.utilRate)
                      ? 0
                      : selectedToken?.utilRate}%{" "}
                  </span>
                </p>
                <p>
                  <span>Oracle</span>
                  <span>
                    1 {poolData.token0._symbol} ={" "}
                    {Number(poolData.token0.price)} {poolData.token1._symbol}{" "}
                  </span>
                </p>
              </div>
            )}

            {(activeOperation === lend || activeOperation === borrow) && (
              <div className="analytics">
                <div>
                  <span>{activeOperation} APY</span>
                  <h3 className="paragraph04">
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
                  <h3 className="paragraph04">
                    {isNaN(selectedToken?.utilRate)
                      ? 0
                      : selectedToken?.utilRate}
                    %
                  </h3>
                </div>
                <div>
                  <span>Health Factor</span>
                  <h3 className="paragraph04">
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
                loading={isOperationLoading || reFetching}
                disabled={buttonAction.disable}
              >
                {buttonAction.text}
              </Button>
            </div>
          </div>
          <Modal
            className="antd_modal_overlay"
            open={isOpenConfirmModal}
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
            open={showSelectTokenModal}
            centered
            onCancel={() => setShowSelectTokenModal(false)}
            footer={null}
            closable={false}
          >
            <TokenListMoadal
              openToken={{ token0: openToken0, token1: openToken1 }}
              handlePoolAndTokenSelect={handlePoolAndTokenSelect}
              selectedTokens={selectedTokens}
            />
          </Modal>
        </div>
      )}
    </>
  );
}
