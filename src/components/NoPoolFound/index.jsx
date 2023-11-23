import React from "react";
import { Modal, Button, message } from "antd";
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
import { fetchCoinGeckoTokens } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { imgError } from "../../utils";

export default function NoPoolFound({
  token1,
  token2,
  setToken1,
  setToken2,
  createPool,
}) {
  const { user, contracts, tokenList, poolList } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // only chainId included in array will show coinGicko tokens;
  const isMainNet = [1, 137].includes(user.network.id);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    seIsPoolAvailable([]);
  };

  const handleCreate = async () => {
    handleCheckIspoolAvailable();
    console.log(token01, token02);
    if (token01.address === token02.address) {
      setSameTokenError(true);
      return;
    }
    if (isPoolAvailable.length === 0) {
     const hash = await handleCreatePool(contracts, token01.address, token02.address);

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
          <h3>{token.symbol}</h3>
          {token.name && (
            <span>
              {token.name} {index}
            </span>
          )}
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
            // coinGeckoToken.map(
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
                <Button onClick={handleCreate} className="btn_class">
                  Create Pool
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
