import React, { useEffect } from "react";
import { Modal, Button, message, notification } from "antd";
import { WalletFilled } from "@ant-design/icons";
import downoutline from "../../assets/downoutline.svg";
import "./styles/index.scss";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../services/wallet";
import { setUser } from "../../store/Action";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import {
  // createCustomToken,
  // getCustomTokens,
  handleCreatePool,
} from "../../services/pool";
import { fetchCoinGeckoTokens, fetchGraphQlData } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { imgError } from "../../utils";
import { waitForBlockConfirmation } from "../../lib/fun/functions";
import Notification from "../Common/Notification";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { fromBigNumber } from "../../helpers/contracts";
import { useQuery } from "react-query";
import useWalletHook from "../../lib/hooks/useWallet";
import { getPoolCreatedGraphQuery, sortByKey } from "../../helpers/dashboard";

export default function NoPoolFound({ token1, token2, updateToken }) {
  const { user, contracts, tokenList, poolList } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const { address, isConnected, chain } = useWalletHook();
  const navigate = useNavigate();
  const query = getPoolCreatedGraphQuery(address);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isOpenTokenList, setIsOpenTokenList] = React.useState(false);
  const [currentToken, setCurrentToken] = React.useState("");
  const [token01, setToken01] = React.useState(token1);
  const [token02, setToken02] = React.useState(token2);
  const [coinGeckoToken, setCoinGeckoToken] = React.useState([]);
  const [tokenBackup, setTokenBackup] = React.useState([]);
  const [availableToken, setAvailableToken] = React.useState([
    ...Object.values(tokenList),
  ]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [serachTokenFromList, setSerachTokenFromList] = React.useState("");
  const [fetchFrom, setFetchFrom] = React.useState({
    coinGecko: true,
  });
  const [isPoolAvailable, seIsPoolAvailable] = React.useState([]);
  const [sameTokenError, setSameTokenError] = React.useState(false);
  const [isCreatePoolLoading, setIsCreatePoolLoading] = React.useState(false);
  const [isPoolCreated, setIsPoolCreated] = React.useState(false);
  const [recentlyCreatedPool, setRecentlyCreatedPool] = React.useState({});

  // only chainId included in array will show coinGicko tokens;
  const isMainNet = [1, 137].includes(user.network.id);

  // const { data, loading, error, refetch } = useQuery("pools", async () => {
  //   const fetchedDATA = await fetchGraphQlData(chain?.id || 1442, query);
  //   return fetchedDATA;
  // });
  // const sortBy = sortByKey(data.pools, "blockTimestamp", 1);
  // console.log("SORTED_POOL", sortBy[0]);
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    seIsPoolAvailable([]);
    updateToken(token01, token02);
  };

  const { data, loading, error, refetch } = useQuery("pools", async () => {
    const fetchedDATA = await fetchGraphQlData(chain?.id || 1442, query);
    return fetchedDATA;
  });
  const sortBy = sortByKey(data.pools, "blockTimestamp", 1);
  // const getCreatedPool = async () => {
  //   // refetch();
  //   const { data, loading, error, refetch } = useQuery("pools", async () => {
  //     const fetchedDATA = await fetchGraphQlData(chain?.id || 1442, query);
  //     return fetchedDATA;
  //   });
  //   const sortBy = sortByKey(data.pools, "blockTimestamp", 1);
  //   console.log("SORT_BY_1", sortBy[0]);
  //   return sortBy[0];
  //   // const res = await fetchGraphQlData(chain?.id || 1442, query);
  //   // const data = await res.JSON();
  //   // console.log("AWAITED_POOLS", data.pools);
  // };

  // useEffect(() => {
  //   console.log("IS_POOL_CREATED", isPoolCreated);
  //   if (isPoolCreated) {
  //     updateToken({}, {});
  //     console.log("CALL_REFETCH", recentlyCreatedPool);
  //   }
  // }, [isPoolCreated]);

  const openNotificationWithIcon = (result, msg) => {
    notification.open({
      mesage: { result },
      description: result === "success" ? msg : msg,
      onClick: () => {
        console.log("Notification Clicked!");
      },
      className: "notification_class",
      closeIcon: false,
      duration: 5,
      icon:
        result == "success" ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    });
  };
  // const checkTxnStatus = async (hash) => {
  //   console.log("HASH_DATA", hash);
  //   //0x9991eb2f84d79c39ee92274ccb2310e0d536a8d645b9549a87a7c8022da3a5f2
  //   try {
  //     const [receipt, currentBlockNumber] = await waitForBlockConfirmation(
  //       hash
  //     );
  //     const trasactionBlock = fromBigNumber(receipt.blockNumber);
  //     console.log("trasactionBlock", trasactionBlock);
  //     const currentblock = fromBigNumber(currentBlockNumber);
  //     console.log("currentblock", currentblock);
  //     if (receipt.status == "success" && currentblock > trasactionBlock) {
  //       console.log("STATUS");
  //       updateToken({}, {});
  //       setIsCreatePoolLoading(false);
  //       console.log("IS_POOL_CREATED_1", isPoolCreated);
  //       setIsPoolCreated(true);
  //       console.log("IS_POOL_CREATED_2", isPoolCreated);
  //       const msg = `Pool is created with ${token01.symbol} and ${token02.symbol}`;
  //       await getCreatedPool();
  //       console.log("CALL_REFETCH", recentlyCreatedPool);
  //       openNotificationWithIcon("success", msg);
  //     } else {
  //       setTimeout(function () {
  //         checkTxnStatus(hash);
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     setTimeout(function () {
  //       checkTxnStatus(hash);
  //     }, 1000);
  //   }
  // };

  const checkTxnStatus = (hash) => {
    console.log("HASH_DATA", hash);
    //0x9991eb2f84d79c39ee92274ccb2310e0d536a8d645b9549a87a7c8022da3a5f2
    waitForBlockConfirmation(hash)
      .then((res) => {
        console.log("RESPONSE_STATUS", res);
        const [receipt, currentBlockNumber] = res;
        console.log("receipt", receipt);
        console.log("currentBlockNumber", currentBlockNumber);
        const trasactionBlock = fromBigNumber(receipt.blockNumber);
        console.log("trasactionBlock", trasactionBlock);
        const currentblock = fromBigNumber(currentBlockNumber);
        console.log("currentblock", currentblock);

        if (receipt.status == "success" && currentblock > trasactionBlock) {
          console.log("STATUS");
          updateToken({}, {});
          // refetch();
          setIsCreatePoolLoading(false);
          console.log("IS_POOL_CREATED_1", isPoolCreated);
          setIsPoolCreated(true);
          console.log("IS_POOL_CREATED_2", isPoolCreated);
          const msg = `Pool is created with ${token01.symbol} and ${token02.symbol}`;
          // getCreatedPool();
          // setRecentlyCreatedPool(getCreatedPool());
          console.log("CALL_REFETCH", recentlyCreatedPool);
          openNotificationWithIcon("success", msg);
          // navigate(`/`);
          // setTimeout(function () {
          //   window.location.reload();
          // }, 3000);
        } else {
          setTimeout(function () {
            checkTxnStatus(hash);
          }, 1000);
        }
      })
      .catch((error) => {
        setTimeout(function () {
          checkTxnStatus(hash);
        }, 1000);
      });
  };

  const checkTxnError = (error) => {
    setIsCreatePoolLoading(false);
    setIsPoolCreated(false);

    const errorText = String(error.reason);
    const data = error?.message ? errorText : "Error: Transaction Error";
    const msg =
      error?.code === "ACTION_REJECTED"
        ? "Transaction Denied"
        : "Something went wrongssß";
    openNotificationWithIcon("error", msg); // Notification
    // Notification("error", msg); //
  };
  const handleCreate = async () => {
    handleCheckIspoolAvailable();
    if (token01.address === token02.address) {
      setSameTokenError(true);
      return;
    }
    if (isPoolAvailable.length === 0) {
      setIsCreatePoolLoading(true);
      // try {
      //   const hash = await handleCreatePool(
      //     contracts,
      //     token01.address,
      //     token02.address,
      //     checkTxnStatus,
      //     checkTxnError
      //   );
      //   checkTxnStatus(hash);
      // } catch (error) {
      //   console.log(error);
      // }
      checkTxnStatus(
        "0x9991eb2f84d79c39ee92274ccb2310e0d536a8d645b9549a87a7c8022da3a5f2"
      );
    }
  };

  const handleConnect = async () => {
    const user = await connectWallet();
    dispatch(setUser(user));
  };

  const handleOpenModal = () => {
    if (token1.symbol && token2.symbol) {
      setIsCreateModalOpen(true);
    } else {
      message.info("Please select two tokens");
    }
  };

  const handleToken = (token) => {
    setCurrentToken(token);
    setIsOpenTokenList(true);
    setSameTokenError(false);
  };

  const handleCloseModals = () => {
    setIsOpenTokenList(false);
    setCoinGeckoToken(tokenBackup);
    setSerachTokenFromList("");
  };

  const handleSearchToken = (e) => {
    setSerachTokenFromList(e.target.value);
    const filtered = tokenBackup.filter(
      (el) =>
        // el.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        el.symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
        el.address.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setAvailableToken(filtered);
  };

  const handleCheckIspoolAvailable = () => {
    const filtered = Object.values(poolList).filter(
      (item) =>
        (item.token0.symbol === token01.symbol &&
          item.token1.symbol === token02.symbol) ||
        (item.token0.symbol === token02.symbol &&
          item.token1.symbol === token01.symbol)
    );
    seIsPoolAvailable(filtered);
  };

  const handleViewPool = (poolAddress) => {
    navigate(`/pool/${poolAddress}`);
  };

  React.useEffect(() => {
    if (isMainNet) {
      if (fetchFrom.coinGecko) {
        setIsFetching(true);
        fetchCoinGeckoTokens()
          .then((data) => {
            setCoinGeckoToken(data.tokens);
            setTokenBackup(data.tokens); //
            setAvailableToken([...data.token, ...Object.values(tokenList)]);
          })
          .finally(() => setIsFetching(false));
      } else {
        setCoinGeckoToken([]);
      }
    } else {
      // TODO fetch tokens as per selected chain for non-mainnet
      setAvailableToken([...Object.values(tokenList)]);
      setTokenBackup([...Object.values(tokenList)]);
    }
  }, [fetchFrom, isMainNet]);

  const TokenCard = React.memo(({ token, index }) => {
    const handleTokensList = () => {
      seIsPoolAvailable([]);
      handleCloseModals();
      if (currentToken === "1") {
        setToken01(token);
        // handleTokens(token, "token1");
      } else if (currentToken === "2") {
        setToken02(token);
        // handleTokens(token, "token2");
      }
    };

    return (
      <div onClick={handleTokensList} className="token-card">
        <img src={token.logoURI || token.logo} alt="" />
        <div>
          <h3>{token.name}</h3>
          <span>{token.symbol}</span>
        </div>
      </div>
    );
  });

  const TokenListModalBody = React.memo(() => {
    const container = React.useRef(null);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
      container.current.addEventListener("scroll", () => {
        if (
          container.current.scrollTop + container.current.clientHeight >=
          container.current.scrollHeight
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    }, []);

    return (
      <div className="select_token_modal">
        <div className="search_token">
          <h3 className="paragraph02">Select Token {currentToken}</h3>
          <div className="input_container">
            <FaSearch />
            <input
              autoFocus
              type="text"
              placeholder="Search Tokens"
              value={serachTokenFromList}
              onChange={handleSearchToken}
            />
          </div>
        </div>
        <div ref={container} className="token_list">
          {isFetching && <h2>Fetching...</h2>}
          {!isFetching && availableToken.length === 0 && (
            <h2>Tokens not listed</h2>
          )}
          {isOpenTokenList &&
            availableToken.map(
              (token, i) =>
                i < page * 100 && <TokenCard key={i} token={token} index={i} />
            )}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="no_pool_container">
        <div className="no_pool_component">
          <h1>No Pool Found</h1>
          <p>
            With Market, you can maximize your yield, contribute to risk
            management and create unparalleled opportunities to make the most of
            DeFi.
          </p>

          {user.address == "0x" ? (
            <Button
              icon={<WalletFilled />}
              size="large"
              className="btn_class"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button onClick={handleOpenModal} className="btn_class">
              Create Pool
            </Button>
          )}
        </div>
      </div>
      {isCreateModalOpen && (
        <Modal
          className="antd_modal_overlay"
          open={isCreateModalOpen}
          centered
          onCancel={handleCloseModal}
          footer={null}
          closable={false}
        >
          <div className="create_pool_modal">
            <h1>Create New Pool</h1>

            {isPoolAvailable.length === 0 ? (
              <>
                <div className="selected_tokens">
                  <div onClick={() => handleToken("1")} className="token_div">
                    <div>
                      <img src={token01.logoURI || token01.logo} alt="logo" />
                      <h3>{token01.symbol}</h3>
                    </div>
                    <img src={downoutline} alt="" />
                  </div>
                  <div onClick={() => handleToken("2")} className="token_div">
                    <div>
                      <img src={token02.logoURI || token02.logo} alt="logo" />
                      <h3>{token02.symbol}</h3>
                    </div>
                    <img src={downoutline} alt="" />
                  </div>
                </div>
                {sameTokenError && (
                  <p className="paragraph05 same_token_error">
                    Both tokens should not be same
                  </p>
                )}
                <Button
                  loading={isCreatePoolLoading}
                  onClick={handleCreate}
                  className="btn_class"
                >
                  Create Pool
                </Button>
              </>
            ) : isPoolCreated ? (
              <>
                <div className="pool_icons">
                  <img
                    src={token01.logoURI || token01?.logo}
                    onError={imgError}
                    alt=""
                  />
                  <img
                    src={token02.logoURI || token02?.logo}
                    onError={imgError}
                    alt=""
                  />
                </div>
                <h3 className="paragraph05">Pool is created</h3>
                <Button
                  onClick={() =>
                    // handleViewPool(recentlyCreatedPool.poolAddress)
                    handleViewPool(sortBy[0].poolAddress)
                  }
                  className="btn_class"
                >
                  View Pool
                </Button>
              </>
            ) : (
              <>
                <div className="pool_icons">
                  <img
                    src={token01.logoURI || token01?.logo}
                    onError={imgError}
                    alt=""
                  />
                  <img
                    src={token02.logoURI || token02?.logo}
                    onError={imgError}
                    alt=""
                  />
                </div>
                <h3 className="paragraph05">Pool is already available</h3>
                <Button
                  onClick={() => handleViewPool(isPoolAvailable[0].poolAddress)}
                  className="btn_class"
                >
                  View Pool
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
      {isOpenTokenList && (
        <Modal
          className="antd_modal_overlay"
          open={isOpenTokenList}
          centered
          onCancel={handleCloseModals}
          footer={null}
          closable={false}
        >
          {<TokenListModalBody />}
        </Modal>
      )}
    </>
  );
}
