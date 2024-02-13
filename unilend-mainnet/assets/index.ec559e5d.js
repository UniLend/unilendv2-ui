import { b4 as useSelector, b5 as React, a$ as react, b6 as fetchCoinGeckoTokens, b0 as jsxs, b7 as Fragment, b1 as jsx, b8 as supportedNetworks, b9 as viewExplorer, ba as viewExplorerLight, bb as FaSearch, bc as FaChevronDown, bd as Modal, be as getFromLocalStorage, bf as isAddress, bg as saveToLocalStorage, bh as useWalletHook, bi as useNavigate, bj as imgError, bk as message, bl as useDispatch, bm as getPoolsGraphQuery, bn as Button, bo as WalletFilled, bp as fetchGraphQlData, b3 as sortByKey, bq as connectWallet, br as setUser, bs as waitForBlockConfirmation, bt as fromBigNumber } from "./index.a9e8707a.js";
import { c as createCustomToken, h as handleCreatePool } from "./pool.3ee9169e.js";
import { S as Switch } from "./index.aa1badc2.js";
import { N as NotificationMessage } from "./NotificationMessage.c0aa2d2d.js";
const deleteIcon = "/assets/deleteicon.8af019c4.svg";
const deleteiconLight = "/assets/deleteiconLight.2f9016da.svg";
const downoutline = "/assets/downoutline.0cc6cf38.svg";
const coinGeckoLogo = "/assets/CoinGecko_Logo.cf315b41.svg";
const ManageToken = ({
  handleTokens,
  tokens,
  pools
}) => {
  const user = useSelector((state) => state?.user);
  const tokenList = useSelector((state) => state?.tokenList);
  const theme = useSelector((state) => state.theme);
  const [isOpenTokenList, setIsOpenTokenList] = React.useState(false);
  const [isOpenMangeToken, setIsOpenMangeToken] = React.useState(false);
  const [token1, setToken1] = React.useState("");
  const [token2, setToken2] = React.useState("");
  const [currentToken, setCurrentToken] = React.useState("");
  const [coinGeckoToken, setCoinGeckoToken] = React.useState([]);
  const [tokenBackup, setTokenBackup] = React.useState([]);
  const [availableToken, setAvailableToken] = React.useState(Object.values(tokenList));
  const [isFetching, setIsFetching] = React.useState(false);
  const [serachTokenFromList, setSerachTokenFromList] = React.useState("");
  const [fetchFrom, setFetchFrom] = React.useState({
    coinGecko: true
  });
  const isMainNet = [1].includes(user.network.id);
  const handleSearchToken = (e) => {
    setSerachTokenFromList(e.target.value);
    const filtered = tokenBackup.filter((el) => el.symbol.toLowerCase().includes(e.target.value.toLowerCase()) || el.address.toLowerCase().includes(e.target.value.toLowerCase()));
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
    setAvailableToken(tokenBackup);
    setSerachTokenFromList("");
  };
  react.exports.useEffect(() => {
    if (Object.entries(tokens.token1).length > 0) {
      setToken1(tokens.token1);
    }
    if (Object.entries(tokens.token2).length > 0) {
      setToken2(tokens.token2);
    }
  }, [tokens]);
  react.exports.useEffect(() => {
    {
      if (fetchFrom.coinGecko) {
        setIsFetching(true);
        fetchCoinGeckoTokens().then((data) => {
          const tokensArray = Array.isArray(data?.tokens) && data?.tokens;
          setCoinGeckoToken(tokensArray.concat(Object.values(tokenList)));
          setTokenBackup(tokensArray.concat(Object.values(tokenList)));
          setAvailableToken(tokensArray.concat(Object.values(tokenList)));
        }).finally(() => setIsFetching(false));
      } else {
        setCoinGeckoToken([]);
      }
    }
  }, [fetchFrom, isMainNet, tokenList]);
  const TokenCard = React.memo(({
    token,
    render,
    index: index2,
    handleDeleteToken
  }) => {
    const handleTokensList = () => {
      handleCloseModals();
      if (currentToken === "1") {
        setToken1(token);
        handleTokens(token, "token1");
      } else if (currentToken === "2") {
        setToken2(token);
        handleTokens(token, "token2");
      } else {
        setToken1(token);
        handleTokens(token, "token1");
      }
    };
    return /* @__PURE__ */ jsxs(Fragment, {
      children: [render === "tokenlist" && /* @__PURE__ */ jsxs("div", {
        onClick: handleTokensList,
        className: "token-card",
        children: [/* @__PURE__ */ jsx("img", {
          src: token.logoURI || token.logo,
          alt: ""
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h3", {
            children: token.name
          }), /* @__PURE__ */ jsx("span", {
            children: token.symbol
          })]
        })]
      }), render === "apiTokenList" && /* @__PURE__ */ jsxs("div", {
        className: `token-card apitokenlist 
              ${fetchFrom.coinGecko && "active_apiToken"}
              `,
        children: [/* @__PURE__ */ jsxs("div", {
          className: "token_info",
          children: [/* @__PURE__ */ jsx("img", {
            src: token.logoURI,
            alt: ""
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h3", {
              children: token.name
            }), /* @__PURE__ */ jsxs("span", {
              children: [token.total, " Tokens"]
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "radio_Button",
          children: /* @__PURE__ */ jsx(Switch, {
            loading: isFetching,
            className: "switch",
            size: "small",
            checked: fetchFrom.coinGecko,
            onChange: () => setFetchFrom({
              ...fetchFrom,
              coinGecko: !fetchFrom.coinGecko
            })
          })
        })]
      }), render === "customTokens" && /* @__PURE__ */ jsxs("div", {
        onClick: handleTokensList,
        className: "token-card customtokens",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "token_info",
          children: [/* @__PURE__ */ jsx("img", {
            src: token.logoURI,
            alt: ""
          }), /* @__PURE__ */ jsx("div", {
            className: "center_content",
            children: /* @__PURE__ */ jsx("h3", {
              children: token.name
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "actionButtons",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("img", {
              src: supportedNetworks[token.chainId].logoUrl,
              alt: `${supportedNetworks[token.chainId].chainName} Logo`
            }), /* @__PURE__ */ jsx("p", {
              children: supportedNetworks[token.chainId].chainName
            })]
          }), /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("button", {
              className: "style-active",
              children: "Add"
            })
          })]
        })]
      }), render === "addedCustomTokens" && /* @__PURE__ */ jsxs("div", {
        onClick: handleTokensList,
        className: "token-card customtokens",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "token_info",
          children: [/* @__PURE__ */ jsx("img", {
            src: token.logo,
            alt: ""
          }), /* @__PURE__ */ jsx("div", {
            className: "center_content",
            children: /* @__PURE__ */ jsx("h3", {
              children: token.name
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "actionButtons",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("img", {
              src: supportedNetworks[token.chainId]?.logoUrl,
              alt: `${supportedNetworks[token.chainId].chainName} Logo`
            }), /* @__PURE__ */ jsx("p", {
              children: supportedNetworks[token.chainId].chainName
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space_between",
            children: [/* @__PURE__ */ jsx("img", {
              onClick: (event) => handleDeleteToken(event, index2),
              src: theme === "dark" ? deleteIcon : deleteiconLight,
              alt: ""
            }), /* @__PURE__ */ jsx("a", {
              href: `${supportedNetworks[user?.network?.id].blockExplorerUrls[0]}/address/${user.address}`,
              target: "_blank",
              children: /* @__PURE__ */ jsx("img", {
                src: theme === "dark" ? viewExplorer : viewExplorerLight,
                alt: ""
              })
            })]
          })]
        })]
      })]
    });
  });
  const TokenListModalBody = React.memo(() => {
    const container = React.useRef(null);
    const [page, setPage] = react.exports.useState(1);
    const handleGoToMangeToken = () => {
      setIsOpenTokenList(false);
      setIsOpenMangeToken(true);
    };
    react.exports.useEffect(() => {
      container.current.addEventListener("scroll", () => {
        if (container.current.scrollTop + container.current.clientHeight >= container.current.scrollHeight) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    }, []);
    return /* @__PURE__ */ jsxs("div", {
      className: "select_token_modal",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "search_token",
        children: [/* @__PURE__ */ jsxs("h3", {
          className: "paragraph02",
          children: ["Select Token ", currentToken]
        }), /* @__PURE__ */ jsxs("div", {
          className: "input_container",
          children: [/* @__PURE__ */ jsx(FaSearch, {}), /* @__PURE__ */ jsx("input", {
            autoFocus: true,
            type: "text",
            placeholder: "Search Tokens",
            value: serachTokenFromList,
            onChange: handleSearchToken
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        ref: container,
        className: "token_list",
        children: [isFetching && /* @__PURE__ */ jsx("h2", {
          children: "Fetching..."
        }), !isFetching && availableToken?.length === 0 && /* @__PURE__ */ jsx("h2", {
          children: "Tokens not listed"
        }), isOpenTokenList && availableToken?.map((token, i) => i < page * 100 && /* @__PURE__ */ jsx(TokenCard, {
          token,
          render: "tokenlist",
          index: i
        }, i))]
      }), /* @__PURE__ */ jsx("p", {
        onClick: handleGoToMangeToken,
        className: "paragraph04 go_to_manage_token",
        children: "Manage Token"
      })]
    });
  });
  const ManageTokenModalBody = () => {
    const [active, setActive] = react.exports.useState("list");
    const [tokenAddress, setTokenAddress] = react.exports.useState("");
    const [isTokenAvailable, setIsTokenAvailable] = react.exports.useState(false);
    const customTokensList = getFromLocalStorage("customTokensList");
    const [addedCustomTokens, setAddedCustomtokens] = React.useState(customTokensList);
    const handleAddToken = async (event) => {
      const inputValue = event.target.value;
      setTokenAddress(inputValue);
      const isValid = isAddress(inputValue);
      if (isValid) {
        const isTokenAvailable2 = availableToken?.some((item) => item.address.toLowerCase() === inputValue.toLowerCase());
        if (isTokenAvailable2) {
          setIsTokenAvailable(true);
        } else {
          await createCustomToken(inputValue, user.address, user.network.id, setAddedCustomtokens, setTokenAddress);
        }
      } else {
        const customTokenList = getFromLocalStorage("customTokensList");
        const filtered = customTokenList?.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()) || item.symbol.toLowerCase().includes(inputValue.toLowerCase()) || item.tokenAddress.toLowerCase().includes(inputValue.toLowerCase()));
        setAddedCustomtokens(filtered);
        setIsTokenAvailable(false);
      }
    };
    const handleDeleteToken = (event, index2) => {
      event.stopPropagation();
      const tokens2 = [...customTokensList];
      tokens2.splice(index2, 1);
      setAddedCustomtokens(tokens2);
      saveToLocalStorage("customTokensList", tokens2);
    };
    const coingecko = {
      logoURI: coinGeckoLogo,
      name: "CoinGecko",
      total: 4e3
    };
    return /* @__PURE__ */ jsxs("div", {
      className: "manage_token_modal",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "token_tabs",
        children: [/* @__PURE__ */ jsx("h3", {
          onClick: () => setActive("list"),
          className: active == "list" && "active",
          children: "List"
        }), /* @__PURE__ */ jsx("h3", {
          onClick: () => setActive("customTokens"),
          className: active == "customTokens" && "active",
          children: "Tokens"
        })]
      }), active == "customTokens" && /* @__PURE__ */ jsxs("div", {
        className: "search_token",
        children: [/* @__PURE__ */ jsx(FaSearch, {}), /* @__PURE__ */ jsx("input", {
          onChange: handleAddToken,
          value: tokenAddress,
          type: "text",
          placeholder: "Search Tokens"
        })]
      }), active == "list" && /* @__PURE__ */ jsx("div", {
        className: "api_token_list",
        children: /* @__PURE__ */ jsx(TokenCard, {
          token: coingecko,
          render: "apiTokenList"
        })
      }), active == "customTokens" && /* @__PURE__ */ jsxs("div", {
        className: "customTokens_list",
        children: [/* @__PURE__ */ jsx("p", {
          className: "paragraph05",
          children: isTokenAvailable && "token name is available in select token list"
        }), /* @__PURE__ */ jsx("h3", {
          className: "custom_token_title",
          children: "Custom Tokens"
        }), addedCustomTokens?.map((item, idx) => /* @__PURE__ */ jsx(TokenCard, {
          token: item,
          index: idx,
          render: "addedCustomTokens",
          handleDeleteToken
        }, idx))]
      })]
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "manage_token_container",
      children: /* @__PURE__ */ jsxs("div", {
        className: "manage_token_component",
        children: [/* @__PURE__ */ jsxs("div", {
          onClick: () => handleToken("1"),
          className: "selector section",
          children: [token1 ? /* @__PURE__ */ jsxs("div", {
            className: "token_div",
            children: [/* @__PURE__ */ jsx("img", {
              src: token1.logoURI || token1.logo,
              alt: ""
            }), /* @__PURE__ */ jsx("h3", {
              children: token1.symbol
            })]
          }) : /* @__PURE__ */ jsx("h3", {
            children: "Select Tokens"
          }), /* @__PURE__ */ jsx(FaChevronDown, {})]
        }), /* @__PURE__ */ jsxs("div", {
          onClick: () => handleToken("2"),
          className: "selector section",
          children: [token2 ? /* @__PURE__ */ jsxs("div", {
            className: "token_div",
            children: [/* @__PURE__ */ jsx("img", {
              src: token2.logoURI || token2.logo,
              alt: ""
            }), /* @__PURE__ */ jsx("h3", {
              children: token2.symbol
            })]
          }) : /* @__PURE__ */ jsx("h3", {
            children: "Select Tokens"
          }), /* @__PURE__ */ jsx(FaChevronDown, {})]
        }), /* @__PURE__ */ jsx("div", {
          className: "section",
          children: tokens.token1?.symbol || tokens.token2?.symbol || pools.length === 0 ? /* @__PURE__ */ jsx("h5", {
            onClick: clearTokens,
            children: " Clear Tokens"
          }) : /* @__PURE__ */ jsx("h5", {
            onClick: () => setIsOpenMangeToken(true),
            children: " Manage Tokens"
          })
        })]
      })
    }), isOpenTokenList && /* @__PURE__ */ jsx(Modal, {
      className: "antd_modal_overlay",
      open: isOpenTokenList,
      centered: true,
      onCancel: handleCloseModals,
      footer: null,
      closable: false,
      children: /* @__PURE__ */ jsx(TokenListModalBody, {})
    }), /* @__PURE__ */ jsx(Modal, {
      className: "antd_modal_overlay",
      centered: true,
      onCancel: handleCloseModals,
      open: isOpenMangeToken,
      footer: null,
      closable: false,
      children: /* @__PURE__ */ jsx(ManageTokenModalBody, {})
    })]
  });
};
const ManageToken$1 = ManageToken;
const poolCard = "";
const bunnytheme = "/assets/bunnytheme.e8d50cdd.svg";
function PoolCard({
  pool
}) {
  const {
    poolAddress,
    token0,
    token1,
    totalLiquidity,
    totalBorrowed
  } = pool;
  const [poolTheme, setPoolTheme] = react.exports.useState(false);
  const {
    address,
    isConnected
  } = useWalletHook();
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (address && isConnected) {
      navigate(`/pool/${poolAddress}`);
    } else {
      message.info("Please Connect to the Wallet");
    }
  };
  react.exports.useEffect(() => {
    if (token0?.symbol == "BUNNY" && token1?.symbol == "EGG") {
      setPoolTheme(true);
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    onClick: handleNavigate,
    className: `${poolTheme ? "pool_theme" : ""} poolcard`,
    children: [/* @__PURE__ */ jsxs("div", {
      className: "pool_icons",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("img", {
          src: token0?.logo,
          onError: imgError,
          alt: ""
        }), /* @__PURE__ */ jsx("img", {
          src: token1?.logo,
          onError: imgError,
          alt: ""
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: "paragraph03",
        children: `${token0?.symbol} / ${token1?.symbol}`
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "pool_data",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("p", {
          className: "paragraph06",
          children: "Total Supply"
        }), isNaN(totalLiquidity) ? /* @__PURE__ */ jsx("h5", {
          className: "skeleton loader"
        }) : /* @__PURE__ */ jsxs("h5", {
          className: "paragraph06",
          children: [totalLiquidity !== void 0 ? "$ " + Number(totalLiquidity).toFixed(2) : "$162,000", " "]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("p", {
          className: "paragraph06",
          children: "Total Borrowed"
        }), isNaN(totalBorrowed) ? /* @__PURE__ */ jsx("h5", {
          className: "skeleton loader"
        }) : /* @__PURE__ */ jsxs("h5", {
          className: "paragraph06",
          children: [totalBorrowed !== void 0 ? "$ " + Number(totalBorrowed).toFixed(2) : "$162,000", " "]
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "pool_footer",
      children: /* @__PURE__ */ jsx("p", {
        className: "paragraph06",
        children: "More Details"
      })
    }), poolTheme && /* @__PURE__ */ jsx("div", {
      className: "footer_img",
      children: /* @__PURE__ */ jsx("img", {
        src: bunnytheme,
        alt: ""
      })
    })]
  });
}
const index$1 = "";
const poolcard = "";
const poolList = "";
const index = "";
function NoPoolFound({
  token1,
  token2,
  updateToken
}) {
  const contracts = useSelector((state) => state?.contracts);
  const user = useSelector((state) => state?.user);
  const tokenList = useSelector((state) => state?.tokenList);
  const poolList2 = useSelector((state) => state?.poolList);
  const dispatch = useDispatch();
  const {
    address,
    isConnected,
    chain
  } = useWalletHook();
  const navigate = useNavigate();
  const query = getPoolsGraphQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isOpenTokenList, setIsOpenTokenList] = React.useState(false);
  const [currentToken, setCurrentToken] = React.useState("");
  const [token01, setToken01] = React.useState(token1);
  const [token02, setToken02] = React.useState(token2);
  const [coinGeckoToken, setCoinGeckoToken] = React.useState([]);
  const [tokenBackup, setTokenBackup] = React.useState([]);
  const [availableToken, setAvailableToken] = React.useState([...Object.values(tokenList)]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [serachTokenFromList, setSerachTokenFromList] = React.useState("");
  const [fetchFrom, setFetchFrom] = React.useState({
    coinGecko: true
  });
  const [availablePool, setAvailablePool] = React.useState({});
  const [sameTokenError, setSameTokenError] = React.useState(false);
  const [isCreatePoolLoading, setIsCreatePoolLoading] = React.useState(false);
  const [isPoolCreated, setIsPoolCreated] = React.useState(false);
  const [poolLength, setPoolLength] = react.exports.useState([]);
  const isMainNet = [1].includes(user.network.id);
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setAvailablePool({});
    updateToken(token01, token02);
  };
  const getCreatedPool = () => {
    fetchGraphQlData(chain?.id || 1442, query).then((res) => {
      const sortBy = sortByKey(res.pools, "blockTimestamp", 1);
      if (poolLength.length > 0 && poolLength.length < sortBy.length) {
        setIsPoolCreated(true);
        setAvailablePool(sortBy[0]);
      }
      setPoolLength(sortBy);
    });
  };
  const checkTxnStatus = (hash) => {
    waitForBlockConfirmation(hash).then((res) => {
      const [receipt, currentBlockNumber] = res;
      const trasactionBlock = fromBigNumber(receipt.blockNumber);
      const currentblock = fromBigNumber(currentBlockNumber);
      if (receipt.status == "success" && currentblock > trasactionBlock) {
        getCreatedPool();
        setIsCreatePoolLoading(false);
        const msg = `Pool is created with ${token01.symbol} and ${token02.symbol}`;
        NotificationMessage("success", msg);
      } else {
        setTimeout(function() {
          checkTxnStatus(hash);
        }, 1e3);
      }
    }).catch((error) => {
      setTimeout(function() {
        checkTxnStatus(hash);
      }, 1e3);
    });
  };
  const checkTxnError = (error) => {
    setIsCreatePoolLoading(false);
    setIsPoolCreated(false);
    const errorText = String(error.reason);
    error?.message ? errorText : "Error: Transaction Error";
    const msg = error?.code === "ACTION_REJECTED" ? "Transaction Denied" : "Something went wrong";
    NotificationMessage("error", msg)();
  };
  const handleCreate = async () => {
    if (token01.address === token02.address) {
      setSameTokenError(true);
      return;
    }
    if (Object.keys(availablePool).length === 0) {
      setIsCreatePoolLoading(true);
      try {
        const hash = await handleCreatePool(contracts, token01.address, token02.address, checkTxnStatus, checkTxnError);
        checkTxnStatus(hash);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleConnect = async () => {
    const user2 = await connectWallet();
    dispatch(setUser(user2));
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
    const filtered = tokenBackup.filter((el) => el.symbol.toLowerCase().includes(e.target.value.toLowerCase()) || el.address.toLowerCase().includes(e.target.value.toLowerCase()));
    setAvailableToken(filtered);
  };
  const handleCheckIspoolAvailable = () => {
    const filtered = Object.values(poolList2).filter((item) => item.token0.symbol === token01.symbol && item.token1.symbol === token02.symbol || item.token0.symbol === token02.symbol && item.token1.symbol === token01.symbol);
    setAvailablePool(filtered.length > 0 ? filtered[0] : {});
  };
  const handleViewPool = (poolAddress) => {
    navigate(`/pool/${poolAddress}?reload=${true}`);
  };
  react.exports.useEffect(() => {
    handleCheckIspoolAvailable();
  }, [token01, token02]);
  React.useEffect(() => {
    getCreatedPool();
    if (isMainNet) {
      if (fetchFrom.coinGecko) {
        setIsFetching(true);
        fetchCoinGeckoTokens().then((data) => {
          const tokensArray = Array.isArray(data?.tokens) && data?.tokens;
          setCoinGeckoToken(tokensArray.concat(Object.values(tokenList)));
          setTokenBackup(tokensArray.concat(Object.values(tokenList)));
          setAvailableToken(tokensArray.concat(Object.values(tokenList)));
        }).finally(() => setIsFetching(false));
      } else {
        setCoinGeckoToken([]);
      }
    } else {
      setAvailableToken([...Object.values(tokenList)]);
      setTokenBackup([...Object.values(tokenList)]);
    }
  }, [fetchFrom, isMainNet]);
  const TokenCard = React.memo(({
    token,
    index: index2
  }) => {
    const handleTokensList = () => {
      handleCloseModals();
      if (currentToken === "1") {
        setToken01(token);
      } else if (currentToken === "2") {
        setToken02(token);
      }
    };
    return /* @__PURE__ */ jsxs("div", {
      onClick: handleTokensList,
      className: "token-card",
      children: [/* @__PURE__ */ jsx("img", {
        src: token.logoURI || token.logo,
        alt: ""
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h3", {
          children: token.name
        }), /* @__PURE__ */ jsx("span", {
          children: token.symbol
        })]
      })]
    });
  });
  const TokenListModalBody = React.memo(() => {
    const container = React.useRef(null);
    const [page, setPage] = React.useState(1);
    React.useEffect(() => {
      container.current.addEventListener("scroll", () => {
        if (container.current.scrollTop + container.current.clientHeight >= container.current.scrollHeight) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    }, []);
    return /* @__PURE__ */ jsxs("div", {
      className: "select_token_modal",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "search_token",
        children: [/* @__PURE__ */ jsxs("h3", {
          className: "paragraph02",
          children: ["Select Token ", currentToken]
        }), /* @__PURE__ */ jsxs("div", {
          className: "input_container",
          children: [/* @__PURE__ */ jsx(FaSearch, {}), /* @__PURE__ */ jsx("input", {
            autoFocus: true,
            type: "text",
            placeholder: "Search Tokens",
            value: serachTokenFromList,
            onChange: handleSearchToken
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        ref: container,
        className: "token_list",
        children: [isFetching && /* @__PURE__ */ jsx("h2", {
          children: "Fetching..."
        }), !isFetching && availableToken.length === 0 && /* @__PURE__ */ jsx("h2", {
          children: "Tokens not listed"
        }), isOpenTokenList && availableToken.map((token, i) => i < page * 100 && /* @__PURE__ */ jsx(TokenCard, {
          token,
          index: i
        }, i))]
      })]
    });
  });
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "no_pool_container",
      children: /* @__PURE__ */ jsxs("div", {
        className: "no_pool_component",
        children: [/* @__PURE__ */ jsx("h1", {
          children: "No Pool Found"
        }), /* @__PURE__ */ jsx("p", {
          children: "With Market, you can maximize your yield, contribute to risk management and create unparalleled opportunities to make the most of DeFi."
        }), user.address == "0x" ? /* @__PURE__ */ jsx(Button, {
          icon: /* @__PURE__ */ jsx(WalletFilled, {}),
          size: "large",
          className: "btn_class",
          onClick: handleConnect,
          children: "Connect Wallet"
        }) : /* @__PURE__ */ jsx(Button, {
          onClick: handleOpenModal,
          className: "btn_class",
          children: "Create Pool"
        })]
      })
    }), isCreateModalOpen && /* @__PURE__ */ jsx(Modal, {
      className: "antd_modal_overlay",
      open: isCreateModalOpen,
      centered: true,
      onCancel: handleCloseModal,
      footer: null,
      closable: false,
      children: /* @__PURE__ */ jsxs("div", {
        className: "create_pool_modal",
        children: [/* @__PURE__ */ jsx("h1", {
          children: "Create New Pool"
        }), Object.keys(availablePool).length === 0 ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsxs("div", {
            className: "selected_tokens",
            children: [/* @__PURE__ */ jsxs("div", {
              onClick: () => handleToken("1"),
              className: "token_div",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("img", {
                  src: token01.logoURI || token01.logo,
                  alt: "logo"
                }), /* @__PURE__ */ jsx("h3", {
                  children: token01.symbol
                })]
              }), /* @__PURE__ */ jsx("img", {
                src: downoutline,
                alt: ""
              })]
            }), /* @__PURE__ */ jsxs("div", {
              onClick: () => handleToken("2"),
              className: "token_div",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("img", {
                  src: token02.logoURI || token02.logo,
                  alt: "logo"
                }), /* @__PURE__ */ jsx("h3", {
                  children: token02.symbol
                })]
              }), /* @__PURE__ */ jsx("img", {
                src: downoutline,
                alt: ""
              })]
            })]
          }), sameTokenError && /* @__PURE__ */ jsx("p", {
            className: "paragraph05 same_token_error",
            children: "Both tokens should not be same"
          }), /* @__PURE__ */ jsx(Button, {
            loading: isCreatePoolLoading,
            onClick: handleCreate,
            className: "btn_class",
            children: "Create Pool"
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsxs("div", {
            className: "pool_icons",
            children: [/* @__PURE__ */ jsx("img", {
              src: token01.logoURI || token01?.logo,
              onError: imgError,
              alt: ""
            }), /* @__PURE__ */ jsx("img", {
              src: token02.logoURI || token02?.logo,
              onError: imgError,
              alt: ""
            })]
          }), /* @__PURE__ */ jsx("h3", {
            className: "paragraph05",
            children: isPoolCreated ? "Pool is created" : "Pool is already available"
          }), /* @__PURE__ */ jsx(Button, {
            onClick: () => handleViewPool(availablePool?.id),
            className: "btn_class",
            children: "View Pool"
          })]
        })]
      })
    }), isOpenTokenList && /* @__PURE__ */ jsx(Modal, {
      className: "antd_modal_overlay",
      open: isOpenTokenList,
      centered: true,
      onCancel: handleCloseModals,
      footer: null,
      closable: false,
      children: /* @__PURE__ */ jsx(TokenListModalBody, {})
    })]
  });
}
export {
  ManageToken$1 as M,
  NoPoolFound as N,
  PoolCard as P
};
