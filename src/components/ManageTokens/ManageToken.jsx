import React, { useEffect, useState } from "react";
import { Switch, Modal } from "antd";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import viewExplorer from "../../assets/viewExplorerIcon.svg";
import viewExplorerLight from "../../assets/viewExplorerIconLight.svg";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import deleteIcon from "../../assets/deleteicon.svg";
import deleteiconLight from "../../assets/deleteiconLight.svg";
import downoutline from "../../assets/downoutline.svg";
import coinGeckoLogo from "../../assets/CoinGecko_Logo.svg";
import BSC from "../../assets/bsc.svg";
import { fetchCoinGeckoTokens } from "../../utils/axios";
//import Modal from "../Modal";
import "./ManageToken.scss";
import { getFromLocalStorage, saveToLocalStorage } from "../../utils";
import { createCustomToken } from "../../services/pool";
import { supportedNetworks } from "../../core/networks/networks";

const ManageToken = ({ handleTokens, tokens, pools }) => {
  const { user, tokenList } = useSelector((state) => state);
  const theme = useSelector((state) => state.theme);
  const [isOpenTokenList, setIsOpenTokenList] = React.useState(false);
  const [isOpenMangeToken, setIsOpenMangeToken] = React.useState(false);
  const [currentToken, setCurrentToken] = React.useState("");
  const [token1, setToken1] = React.useState("");
  const [token2, setToken2] = React.useState("");
  const [coinGeckoToken, setCoinGeckoToken] = React.useState([]);
  const [tokenBackup, setTokenBackup] = React.useState([]);
  const [availableToken, setAvailableToken] = React.useState(
    Object.values(tokenList)
  );
  const [isFetching, setIsFetching] = React.useState(false);
  const [serachTokenFromList, setSerachTokenFromList] = React.useState("");
  const [fetchFrom, setFetchFrom] = React.useState({
    coinGecko: true,
  });

  // only chainId included in array will show coinGicko tokens;
  const isMainNet = [1, 137].includes(user.network.id);

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

  const handleToken = (token) => {
    setCurrentToken(token);
    setIsOpenTokenList(true);
  };

  const clearTokens = () => {
    setToken1("");
    setToken2("");
    handleTokens({}, "clear");
  };

  const handleCloseModals = () => {
    setIsOpenTokenList(false);
    setIsOpenMangeToken(false);
    // setCoinGeckoToken(coinGeckoTokenBackup);//setAvailableToken
    setAvailableToken(tokenBackup);
    setSerachTokenFromList("");
  };

  useEffect(() => {
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
  }, [fetchFrom, isMainNet, tokenList]);

  const TokenCard = React.memo(
    ({ token, render, index, handleDeleteToken }) => {
      const handleTokensList = () => {
        handleCloseModals();
        if (currentToken === "1") {
          setToken1(token);
          handleTokens(token, "token1");
        } else if (currentToken === "2") {
          setToken2(token);
          handleTokens(token, "token2");
        }
      };

      return (
        <>
          {render === "tokenlist" && (
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
          )}
          {render === "apiTokenList" && (
            <div
              className={`token-card apitokenlist 
              ${fetchFrom.coinGecko && "active_apiToken"}
              `}
            >
              <div className="token_info">
                <img src={token.logoURI} alt="" />
                <div>
                  <h3>{token.name}</h3>
                  <span>{token.total} Tokens</span>
                </div>
              </div>
              <div className="radio_Button">
                <Switch
                  loading={isFetching}
                  className="switch"
                  size="small"
                  checked={fetchFrom.coinGecko}
                  onChange={() =>
                    setFetchFrom({
                      ...fetchFrom,
                      coinGecko: !fetchFrom.coinGecko,
                    })
                  }
                />
              </div>
            </div>
          )}
          {render === "customTokens" && (
            <div onClick={handleTokensList} className="token-card customtokens">
              <div className="token_info">
                <img src={token.logoURI} alt="" />
                <div className="center_content">
                  <h3>{token.name}</h3>
                </div>
              </div>
              <div className="actionButtons">
                <div>
                  <img
                    src={supportedNetworks[token.chainId].logoUrl}
                    alt={`${supportedNetworks[token.chainId].chainName} Logo`}
                  />
                  <p>{supportedNetworks[token.chainId].chainName}</p>
                </div>
                <div>
                  <button className="style-active">Add</button>
                </div>
              </div>
            </div>
          )}
          {render === "addedCustomTokens" && (
            <div onClick={handleTokensList} className="token-card customtokens">
              <div className="token_info">
                <img src={token.logo} alt="" />
                <div className="center_content">
                  <h3>{token.name}</h3>
                  {/* <span>{token.balance} Tokens</span> */}
                </div>
              </div>
              <div className="actionButtons">
                <div>
                  <img
                    src={supportedNetworks[token.chainId]?.logoUrl}
                    alt={`${supportedNetworks[token.chainId].chainName} Logo`}
                  />
                  <p>{supportedNetworks[token.chainId].chainName}</p>
                </div>
                <div className="space_between">
                  <img
                    onClick={(event) => handleDeleteToken(event, index)}
                    src={theme === "dark" ? deleteIcon : deleteiconLight}
                    alt=""
                  />
                  <a
                    href={`${
                      supportedNetworks[user?.network?.id].blockExplorerUrls[0]
                    }/address/${user.address}`}
                    target="_blank"
                  >
                    <img
                      src={theme === "dark" ? viewExplorer : viewExplorerLight}
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  );

  const TokenListModalBody = React.memo(() => {
    const container = React.useRef(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
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
            availableToken?.map(
              (token, i) =>
                i < page * 100 && (
                  <TokenCard
                    key={i}
                    token={token}
                    render="tokenlist"
                    index={i}
                  />
                )
            )}
        </div>
      </div>
    );
  });

  const ManageTokenModalBody = () => {
    const [active, setActive] = useState("list");
    const [tokenAddress, setTokenAddress] = useState("");
    const customTokensList = getFromLocalStorage("customTokensList");
    const [addedCustomTokens, setAddedCustomtokens] =
      React.useState(customTokensList);

    const handleAddToken = async (event) => {
      const inputValue = event.target.value;
      setTokenAddress(inputValue);
      const isValid = ethers.utils.isAddress(inputValue);
      if (isValid) {
        await createCustomToken(
          inputValue,
          user.address,
          user.network.id,
          setAddedCustomtokens,
          setTokenAddress
        );
      } else {
        const customTokenList = getFromLocalStorage("customTokensList");
        const filtered = customTokenList?.filter(
          (item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.tokenAddress.toLowerCase().includes(inputValue.toLowerCase())
        );
        setAddedCustomtokens(filtered);
      }
    };

    const handleDeleteToken = (event, index) => {
      event.stopPropagation();
      const tokens = [...customTokensList];
      tokens.splice(index, 1);
      setAddedCustomtokens(tokens);
      saveToLocalStorage("customTokensList", tokens);
    };

    const coingecko = {
      logoURI: coinGeckoLogo,
      name: "CoinGecko",
      total: 4000,
    };
    return (
      <div className="manage_token_modal">
        <div className="token_tabs">
          <h3
            onClick={() => setActive("list")}
            className={active == "list" && "active"}
          >
            List
          </h3>
          <h3
            onClick={() => setActive("customTokens")}
            className={active == "customTokens" && "active"}
          >
            Tokens
          </h3>
        </div>
        {active == "customTokens" && (
          <div className="search_token">
            <FaSearch />
            <input
              onChange={handleAddToken}
              value={tokenAddress}
              type="text"
              placeholder="Search Tokens"
            />
          </div>
        )}
        {active == "list" && (
          <div className="api_token_list">
            <TokenCard token={coingecko} render="apiTokenList" />
          </div>
        )}
        {active == "customTokens" && (
          <div className="customTokens_list">
            {/* <TokenCard token={coingecko} render="customTokens" /> */}
            <h3 className="custom_token_title">Custom Tokens</h3>
            {addedCustomTokens?.map((item, idx) => (
              <TokenCard
                key={idx}
                token={item}
                index={idx}
                render="addedCustomTokens"
                handleDeleteToken={handleDeleteToken}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="manage_token_container">
        <div className="manage_token_component">
          <div onClick={() => handleToken("1")} className="selector section">
            {token1 ? (
              <div className="token_div">
                <img src={token1.logoURI || token1.logo} alt="" />
                <h3>{token1.symbol}</h3>
              </div>
            ) : (
              <h3>Select Tokens</h3>
            )}
            <FaChevronDown />
            {/* <img src={downoutline} alt="" /> */}
          </div>
          <div onClick={() => handleToken("2")} className="selector section">
            {token2 ? (
              <div className="token_div">
                <img src={token2.logoURI || token2.logo} alt="" />
                <h3>{token2.symbol}</h3>
              </div>
            ) : (
              <h3>Select Tokens</h3>
            )}
            <FaChevronDown />
            {/* <img src={downoutline} alt="" /> */}
          </div>
          <div className="section">
            {tokens.token1?.symbol ||
            tokens.token2?.symbol ||
            pools.length === 0 ? (
              <h5 onClick={clearTokens}> Clear Tokens</h5>
            ) : (
              <h5 onClick={() => setIsOpenMangeToken(true)}> Manage Tokens</h5>
            )}
          </div>
        </div>
      </div>
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
      <Modal
        className="antd_modal_overlay"
        centered
        onCancel={handleCloseModals}
        open={isOpenMangeToken}
        footer={null}
        closable={false}
      >
        {<ManageTokenModalBody />}
      </Modal>
    </>
  );
};

export default ManageToken;
