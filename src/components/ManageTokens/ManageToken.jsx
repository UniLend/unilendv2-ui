import React, { useEffect, useState } from "react";
import { Switch, Modal } from "antd";
import viewExplorer from "../../assets/viewExplorerIcon.svg";
import { FaChevronDown } from 'react-icons/fa'
import deleteIcon from "../../assets/deleteicon.svg";
import downoutline from "../../assets/downoutline.svg";
import BSC from "../../assets/bsc.svg"
import { fetchCoinGeckoTokens } from "../../utils/axios";
//import Modal from "../Modal";
import "./ManageToken.scss";

const ManageToken = ({handleTokens, tokens, pools}) => {
  const [isOpenTokenList, setIsOpenTokenList] = React.useState(false);
  const [isOpenMangeToken, setIsOpenMangeToken] = React.useState(false);
  const [currentToken, setCurrentToken] = React.useState("");
  const [token1, setToken1] = React.useState("");
  const [token2, setToken2] = React.useState("");
  const [coinGeckoToken, setCoinGeckoToken] = React.useState([]);
  const [coinGeckoTokenBackup, setCoinGeckoTokenBackup] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [serachTokenFromList, setSerachTokenFromList] = React.useState("");
  const [fetchFrom, setFetchFrom] = React.useState({
    coinGecko: true,
  });

  const handleSearchToken = (e) => {
    setSerachTokenFromList(e.target.value);
    const filtered = coinGeckoTokenBackup.filter(
      (el) =>
        el.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        el.symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
        el.address.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setCoinGeckoToken(filtered);
  };

  const handleToken = (token) => {
    setCurrentToken(token);
    setIsOpenTokenList(true);
  };

  const clearTokens = () => {
    setToken1("")
    setToken2("")
    handleTokens({}, 'clear')
  }

  const handleCloseModals = () => {
    setIsOpenTokenList(false);
    setIsOpenMangeToken(false);
    setCoinGeckoToken(coinGeckoTokenBackup);
    setSerachTokenFromList("");
  };

  useEffect(() => {
    if (fetchFrom.coinGecko) {
      setIsFetching(true);
      fetchCoinGeckoTokens()
        .then((data) => {
          setCoinGeckoToken(data.tokens);
          setCoinGeckoTokenBackup(data.tokens);
          console.log("coingeko", data);
        })
        .finally(() => setIsFetching(false));
    } else {
      setCoinGeckoToken([]);
    }
  }, [fetchFrom]);

  const TokenCard = React.memo(({ token, render, index }) => {
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
            <img src={token.logoURI} alt="" />
            <div>
              <h3>{token.symbol}</h3>
              <span>
                {token.name} {index}
              </span>
            </div>
          </div>
        )}
        {render === "apiTokenList" && (
          <div className={`token-card apitokenlist ${fetchFrom.coinGecko && 'active_apiToken'}`}>
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
                <img src={BSC} alt="bsc" />
                <p>BSC</p>
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
              <img src={token.logoURI} alt="" />
              <div className="center_content">
                <h3>{token.name}</h3>
              </div>
            </div>
            <div className="actionButtons">
              <div>
                <img src={BSC} alt="bsc" />
                <p>BSC</p>
              </div>
              <div className="space_between">
                <img src={deleteIcon} alt="" />
                <img src={viewExplorer} alt="" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  });

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
          <h3>Select Token {currentToken}</h3>
          <input
            autoFocus
            type="text"
            placeholder="Search Tokens"
            value={serachTokenFromList}
            onChange={handleSearchToken}
          />
        </div>
        <div ref={container} className="token_list">
          {isFetching && <h2>Fetching...</h2>}
          {!isFetching && coinGeckoToken.length === 0 && (
            <h2>Tokens not listed</h2>
          )}
          {isOpenTokenList &&
            coinGeckoToken.map(
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
    const coingecko = {
      logoURI:
        "https://www.coingecko.com/assets/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
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
            <input type="text" placeholder="Search Tokens" />
          </div>
        )}
        {active == "list" && (
          <div className="api_token_list">
            <TokenCard token={coingecko} render="apiTokenList" />
          </div>
        )}
        {active == "customTokens" && (
          <div className="customTokens_list">
            <TokenCard token={coingecko} render="customTokens" />
            <h3 className="custom_token_title">Custom Tokens</h3>
            <TokenCard token={coingecko} render="addedCustomTokens" />
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
                <img src={token1.logoURI} alt="" />
                <h3>{token1.symbol}</h3>
              </div>
            ) : (
              <h3>Select Tokens</h3>
            )}
           <FaChevronDown/>
            {/* <img src={downoutline} alt="" /> */}
          </div>
          <div onClick={() => handleToken("2")} className="selector section">
            {token2 ? (
              <div className="token_div">
                <img src={token2.logoURI} alt="" />
                <h3>{token2.symbol}</h3>
              </div>
            ) : (
              <h3>Select Tokens</h3>
            )}
            <FaChevronDown/>
            {/* <img src={downoutline} alt="" /> */}
          </div>
          <div className="section">
            {
              (tokens.token1?.symbol || tokens.token2?.symbol) || pools.length === 0 ?  <h5 onClick={clearTokens}> Clear Tokens</h5>:  <h5 onClick={() => setIsOpenMangeToken(true)}> Manage Tokens</h5>
            }
           
          </div>
        </div>
      </div>
      {isOpenTokenList && (
        <Modal
          className="antd_modal_overlay"
          visible={isOpenTokenList}
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
        visible={isOpenMangeToken}
        footer={null}
        closable={false}
      >
        {<ManageTokenModalBody />}
      </Modal>
    </>
  );
};

export default ManageToken;
