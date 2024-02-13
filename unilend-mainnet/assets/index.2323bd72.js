import { b1 as jsx, b0 as jsxs, b4 as useSelector, a$ as react, bn as Button, b3 as sortByKey } from "./index.a9e8707a.js";
import { M as ManageToken, P as PoolCard, N as NoPoolFound } from "./index.ec559e5d.js";
import { D as DropDown, I as ImArrowUp2, a as ImArrowDown2 } from "./DropDown.74bf9039.js";
import "./pool.3ee9169e.js";
import "./index.aa1badc2.js";
import "./NotificationMessage.c0aa2d2d.js";
function PoolListSkeleton() {
  return /* @__PURE__ */ jsx("div", {
    className: "pool_list_skeleton_container",
    children: new Array(10).fill(10).map((el, i) => /* @__PURE__ */ jsxs("div", {
      className: "skeleton_card",
      children: [/* @__PURE__ */ jsx("div", {
        className: "pool_icons",
        children: /* @__PURE__ */ jsxs("div", {
          className: "div",
          children: [/* @__PURE__ */ jsx("div", {
            className: "skeleton"
          }), /* @__PURE__ */ jsx("div", {
            className: "skeleton"
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "pool_data",
        children: [/* @__PURE__ */ jsx("div", {
          className: "div1",
          children: /* @__PURE__ */ jsx("div", {
            className: "skeleton"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "div1",
          children: /* @__PURE__ */ jsx("div", {
            className: "skeleton"
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "pool_footer",
        children: /* @__PURE__ */ jsx("div", {
          className: "skeleton"
        })
      })]
    }, i))
  });
}
const banner = "/assets/poolbannermainnet.b1f494fb.svg";
const index = "";
function HallOfPoolsComponent() {
  const poolList = useSelector((state) => state.poolList);
  const isLoadingPoolData = useSelector((state) => state.isLoadingPoolData);
  const [token1, setToken1] = react.exports.useState({});
  const [token2, setToken2] = react.exports.useState({});
  const [pools, setPools] = react.exports.useState([]);
  const [myPoolTab, setMyPoolTab] = react.exports.useState(false);
  const [poolBackup, setPoolBackup] = react.exports.useState({});
  react.exports.useEffect(() => {
    if (Object.values(poolList).length > 0) {
      const toArray = Object.values(poolList).filter((pool) => pool.hide == false);
      setPools(toArray);
      setPoolBackup(toArray);
    }
  }, [poolList]);
  const handleSort = (key, order) => {
    const sorted = sortByKey(pools, key, order);
    setPools([...sorted]);
  };
  const sortList = [{
    text: "TimeStamp",
    fun: () => handleSort("blockTimestamp", 1),
    icon: /* @__PURE__ */ jsx(ImArrowUp2, {})
  }, {
    text: "TimeStamp",
    fun: () => handleSort("blockTimestamp", 2),
    icon: /* @__PURE__ */ jsx(ImArrowDown2, {})
  }];
  const handleTokens = (token, selectedToken) => {
    if (selectedToken === "token1") {
      setToken1(token);
    } else if (selectedToken === "token2") {
      setToken2(token);
    } else if (selectedToken == "clear") {
      setToken1({});
      setToken2({});
    }
  };
  react.exports.useEffect(() => {
    if (token1?.symbol && !token2?.symbol) {
      const filtered = Array.isArray(poolBackup) && poolBackup.filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token1.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token1.symbol)));
      setPools(filtered);
    } else if (token2?.symbol && !token1?.symbol) {
      const filtered = Array.isArray(poolBackup) && poolBackup.filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token2.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token2.symbol)));
      setPools(filtered);
    } else if (token1?.symbol && token2?.symbol) {
      const filtered = Array.isArray(poolBackup) && poolBackup.filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token1.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token1.symbol))).filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token2.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token2.symbol)));
      setPools(filtered);
    } else {
      setPools(poolBackup);
    }
  }, [token1, token2, poolBackup]);
  const updateToken = (token12, token22) => {
    setToken1(token12);
    setToken2(token22);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "hallofpools_container",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "analytics_container",
      children: [/* @__PURE__ */ jsx("div", {
        className: "analytics",
        children: /* @__PURE__ */ jsx("img", {
          src: banner,
          alt: "v2-banner"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "managepool_container",
        children: /* @__PURE__ */ jsx(ManageToken, {
          handleTokens,
          tokens: {
            token1,
            token2
          },
          pools
        })
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "pool_filter_container",
      children: [/* @__PURE__ */ jsx("div", {
        className: "pool_tans",
        children: /* @__PURE__ */ jsx(Button, {
          onClick: () => setMyPoolTab(false),
          className: `pool_btn  ${!myPoolTab ? "active_btn" : ""}`,
          children: "All Pools"
        })
      }), /* @__PURE__ */ jsx(DropDown, {
        list: sortList
      })]
    }), pools.length > 0 && !isLoadingPoolData ? /* @__PURE__ */ jsx("div", {
      className: "poolcard_container",
      children: myPoolTab ? pools.filter((pool) => pool.openPosition == true).map((pool, i) => /* @__PURE__ */ jsx(PoolCard, {
        pool
      }, i)) : pools.map((pool, i) => /* @__PURE__ */ jsx(PoolCard, {
        pool
      }, i))
    }) : isLoadingPoolData ? /* @__PURE__ */ jsx(PoolListSkeleton, {}) : /* @__PURE__ */ jsx(NoPoolFound, {
      token1,
      token2,
      updateToken
    })]
  });
}
function HallOfPools() {
  return /* @__PURE__ */ jsxs("div", {
    children: [" ", /* @__PURE__ */ jsx(HallOfPoolsComponent, {}), " "]
  });
}
export {
  HallOfPools as default
};
