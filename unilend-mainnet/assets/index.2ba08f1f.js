import { bG as getEtherContract, by as decimal2Fixed, a$ as react, bh as useWalletHook, bi as useNavigate, cR as JsonRpcProvider, b1 as jsx, b0 as jsxs, bZ as Popover, cS as FiInfo, cH as shortenAddress, cT as FiCopy, bn as Button, cU as waitForTransactionLib, cV as contractAddress, bK as erc20Abi, bt as fromBigNumber, bf as isAddress, cW as uftgABI } from "./index.a9e8707a.js";
import { N as NotificationMessage } from "./NotificationMessage.c0aa2d2d.js";
import { I as Input } from "./index.fa7ce1cc.js";
import "./SearchOutlined.8ef9fed2.js";
const Vote$1 = "/assets/vote.a1c9d7e9.svg";
const uftIcon = "/assets/uft.019edf40.svg";
const index = "";
const handleWrapAndDelegate = async (governanceAddress, govABI, delegateAddress, amount, checkTxnStatus, checkTxnError) => {
  const fixedAmount = decimal2Fixed(amount, 18);
  try {
    const instance = await getEtherContract(governanceAddress, govABI);
    const txs = await instance.wrap(delegateAddress, fixedAmount);
    const txtData = {
      message: `Wrap and Delegate ${amount} UFT `
    };
    checkTxnStatus(txs?.hash, txtData);
  } catch (error) {
    checkTxnError(error);
  }
};
const checkAllowance = async (tokenAddress, abi, owner, spender) => {
  try {
    const instance = await getEtherContract(tokenAddress, abi);
    const allowance = await instance.allowance(owner, spender);
    return { allowance };
  } catch (error) {
    throw error;
  }
};
const setApproval = async (contractAddress2, abi, userAddress, checkTxnStatus, checkTxnError) => {
  try {
    var maxAllow = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const instance = await getEtherContract(contractAddress2, abi);
    const txs = await instance.approve(userAddress, maxAllow);
    const txtData = {
      message: `Approval Successfull! `,
      fn: "approve"
    };
    checkTxnStatus(txs?.hash, txtData);
  } catch (error) {
    checkTxnError(error);
  }
};
const handleUnWrap = async (governanceAddress, govABI, amount, checkTxnStatus, checkTxnError) => {
  try {
    const fixedAmount = decimal2Fixed(amount, 18);
    const instance = await getEtherContract(governanceAddress, govABI);
    const txs = await instance.unwrap(fixedAmount);
    const txtData = {
      message: `Unwrap ${amount} UFTG `
    };
    checkTxnStatus(txs?.hash, txtData);
  } catch (error) {
    checkTxnError(error);
  }
};
const handleUpdateDelegate = async (governanceAddress, govABI, delegateAddress, checkTxnStatus, checkTxnError) => {
  try {
    const instance = await getEtherContract(governanceAddress, govABI);
    const txs = await instance.delegate(delegateAddress);
    const txtData = {
      message: `Delegation Updated to ${delegateAddress} `
    };
    checkTxnStatus(txs?.hash, txtData);
  } catch (error) {
    checkTxnError(error);
  }
};
const useDomainHandling = (address, provider) => {
  const [domainDetail, setDomainDetail] = react.exports.useState({
    value: "",
    isAddress: false
  });
  const handleDomain = async () => {
    setDomainDetail({
      value: "",
      isAddress: false
    });
  };
  react.exports.useEffect(() => {
    let timeoutId;
    if (address) {
      timeoutId = setTimeout(() => {
        handleDomain();
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [address, 500]);
  return { domainDetail, handleDomain };
};
const useDomainHandling$1 = useDomainHandling;
const wrap = "wrap";
const unWrap = "unWrap";
const update = "update";
function VoteComponent() {
  const {
    address,
    chain,
    isConnected
  } = useWalletHook();
  react.exports.useState(address);
  const [tokenBalance, setTokenBalance] = react.exports.useState({
    uft: "",
    uftg: ""
  });
  const [activeTab, setActiveTab] = react.exports.useState(wrap);
  const [allowanceValue, setAllowanceValue] = react.exports.useState("");
  const [delegate, setDelegate] = react.exports.useState(address);
  const [votingPower, setVotingPower] = react.exports.useState("");
  const [isLoading, setIsLoading] = react.exports.useState(false);
  const [isDataLoading, setIsDataLoading] = react.exports.useState(false);
  const navigate = useNavigate();
  react.exports.useMemo(() => {
    const alchemyId = "NaHll2GHbp-BuM6HePxqJq0PpaKAnApy";
    const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    return new JsonRpcProvider(key);
  }, [chain?.id]);
  const checkTxnStatus = (hash, data) => {
    waitForTransactionLib({
      hash
    }).then((receipt) => {
      if (receipt.status == "success") {
        if (data?.fn == "approve") {
          setTimeout(() => {
            handleAllowance();
            NotificationMessage("success", `${data.message}`);
            setIsLoading(false);
          }, 6e3);
        } else {
          setTimeout(() => {
            handleAllowance();
            NotificationMessage("success", `${data.message}`);
            setIsLoading(false);
          }, 3e3);
        }
      } else {
        setTimeout(() => {
          checkTxnStatus(hash, data);
        }, 1e3);
      }
    }).catch(() => {
      setTimeout(() => {
        checkTxnStatus(hash, data);
      }, 1e3);
    });
  };
  const checkTxnError = (error) => {
    setIsLoading(false);
    const errorText = String(error.reason);
    NotificationMessage("error", error?.message ? errorText : "Error: Transaction Error");
  };
  const getTokenBal = async () => {
    const contractsAdd = contractAddress[chain?.id || "1"];
    const UFT = await getEtherContract(contractsAdd.uftToken, erc20Abi);
    const UFTG = await getEtherContract(contractsAdd?.uftgToken, uftgABI);
    const delegatesAddress = await UFTG.delegates(address);
    const isValid = isAddress(delegatesAddress);
    delegatesAddress != 0 && isValid && setDelegate(delegatesAddress);
    const uftBalance_BigNumber = await UFT.balanceOf(address);
    const uftgBalance_BigNumber = await UFTG.balanceOf(address);
    const uftgVotes_BigNumber = await UFTG.getCurrentVotes(address);
    const uftBalance = fromBigNumber(uftBalance_BigNumber) / 10 ** 18;
    const uftgBalance = fromBigNumber(uftgBalance_BigNumber) / 10 ** 18;
    const uftgVotes = fromBigNumber(uftgVotes_BigNumber) / 10 ** 18;
    setVotingPower(uftgVotes);
    setTokenBalance({
      uft: uftBalance,
      uftg: uftgBalance
    });
  };
  const handleAllowance = async () => {
    setIsDataLoading(true);
    const contractsAdd = contractAddress[chain?.id || "1"];
    getTokenBal();
    const {
      allowance
    } = await checkAllowance(contractsAdd?.uftToken, erc20Abi, address, contractsAdd?.uftgToken);
    const valueFromBigNumber = fromBigNumber(allowance);
    setAllowanceValue(valueFromBigNumber);
    setIsDataLoading(false);
  };
  const BalancePopover = () => {
    return /* @__PURE__ */ jsxs("div", {
      className: "balance_popover_container",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "balance_popover_item",
        children: [/* @__PURE__ */ jsx("img", {
          src: uftIcon,
          alt: "uftLogo"
        }), /* @__PURE__ */ jsxs("p", {
          children: [/* @__PURE__ */ jsx("span", {
            className: "uft_span",
            children: "UFT:"
          }), " ", /* @__PURE__ */ jsx("span", {
            children: Number(tokenBalance.uft).toFixed(2)
          }), " "]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "balance_popover_item",
        children: [/* @__PURE__ */ jsx("img", {
          src: uftIcon,
          alt: "uftLogo"
        }), /* @__PURE__ */ jsxs("p", {
          children: [/* @__PURE__ */ jsx("span", {
            className: "uftg_span",
            children: "UFTG:"
          }), " ", /* @__PURE__ */ jsx("span", {
            children: Number(tokenBalance.uftg).toFixed(2)
          }), " "]
        })]
      })]
    });
  };
  const {
    domainDetail,
    handleDomain
  } = useDomainHandling$1(delegate);
  react.exports.useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
    handleDomain(delegate);
  }, [delegate]);
  react.exports.useEffect(() => {
    if (address) {
      setDelegate(address);
      handleAllowance();
    }
  }, [address]);
  return /* @__PURE__ */ jsx("div", {
    className: "vote_container",
    children: /* @__PURE__ */ jsxs("div", {
      className: "vote_content",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "user_info",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [isDataLoading ? /* @__PURE__ */ jsx("h2", {
            className: "heading_loader skeleton"
          }) : /* @__PURE__ */ jsx("h2", {
            className: "heading05",
            children: Number(tokenBalance.uft + tokenBalance.uftg).toFixed(2)
          }), /* @__PURE__ */ jsxs("div", {
            className: "total_balance",
            children: [/* @__PURE__ */ jsx("p", {
              className: "paragraph03",
              children: "Total Balance"
            }), /* @__PURE__ */ jsx(Popover, {
              content: /* @__PURE__ */ jsx(BalancePopover, {}),
              overlayClassName: "total_balance_popover",
              placement: "bottomLeft",
              children: /* @__PURE__ */ jsx(FiInfo, {})
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [isDataLoading ? /* @__PURE__ */ jsx("h2", {
            className: "heading_loader skeleton"
          }) : /* @__PURE__ */ jsx("h2", {
            className: "heading05",
            children: Number(votingPower).toFixed(2)
          }), /* @__PURE__ */ jsx("p", {
            className: "paragraph03",
            children: "Voting Power"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [isDataLoading ? /* @__PURE__ */ jsx("h2", {
            className: "heading_loader skeleton"
          }) : /* @__PURE__ */ jsxs("div", {
            onClick: () => {
              navigator.clipboard.writeText(delegate);
            },
            className: "address_with_copy",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "heading05",
              children: domainDetail.value ? domainDetail.value : shortenAddress(String(delegate))
            }), /* @__PURE__ */ jsx(Popover, {
              content: "copied",
              overlayClassName: "copy_popover",
              placement: "top",
              trigger: "click",
              children: /* @__PURE__ */ jsx(FiCopy, {})
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "paragraph03",
            children: "Delegation address"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "operation",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "tabs",
          children: [/* @__PURE__ */ jsx("div", {
            onClick: () => setActiveTab(wrap),
            className: ` ${activeTab === wrap ? "active_tab" : ""}`,
            children: /* @__PURE__ */ jsx("span", {
              children: "Wrap & Delegate"
            })
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => setActiveTab(unWrap),
            className: ` ${activeTab === unWrap ? "active_tab" : ""}`,
            children: /* @__PURE__ */ jsx("span", {
              children: "Unwrap"
            })
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => setActiveTab(update),
            className: ` ${activeTab === update ? "active_tab" : ""}`,
            children: /* @__PURE__ */ jsx("span", {
              children: "Update delegation"
            })
          })]
        }), activeTab === wrap && /* @__PURE__ */ jsx(WrapAndDelegate, {
          checkTxnStatus,
          userAddress: delegate,
          tokenBalance,
          allowanceValue,
          isLoading,
          setIsLoading,
          checkTxnError
        }), activeTab === unWrap && /* @__PURE__ */ jsx(UnWrap, {
          checkTxnStatus,
          tokenBalance,
          isLoading,
          setIsLoading,
          checkTxnError
        }), activeTab === update && /* @__PURE__ */ jsx(UpdateDelegation, {
          checkTxnStatus,
          tokenBalance,
          isLoading,
          setIsLoading,
          checkTxnError
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "vote_info",
        children: [/* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("img", {
            src: Vote$1,
            alt: "vote info"
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h2", {
            className: "heading04",
            children: "Participate In Governance"
          }), /* @__PURE__ */ jsx("p", {
            className: "paragraph06",
            children: "You can either vote on each proposal yourself or delegate your votes to a third party. You can either vote on each proposal yourself or delegate your votes to a third party."
          }), /* @__PURE__ */ jsx(Button, {
            onClick: () => window.open("https://commonwealth.im/unilend-finance/discussions", "_blank"),
            children: "Join Now"
          })]
        })]
      })]
    })
  });
}
const WrapAndDelegate = ({
  checkTxnStatus,
  userAddress,
  tokenBalance,
  allowanceValue,
  isLoading,
  setIsLoading,
  checkTxnError
}) => {
  const [amount, setAmount] = react.exports.useState("");
  const {
    chain
  } = useWalletHook();
  const [address, setAddress] = react.exports.useState(userAddress);
  react.exports.useMemo(() => {
    const alchemyId = "NaHll2GHbp-BuM6HePxqJq0PpaKAnApy";
    const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    return new JsonRpcProvider(key);
  }, [chain?.id]);
  const {
    domainDetail
  } = useDomainHandling$1(address);
  const [buttonText, setButtonText] = react.exports.useState({
    text: "Enter Amount",
    disable: true
  });
  react.exports.useEffect(() => {
    setAddress(userAddress);
  }, [userAddress]);
  const handleAmount = (e) => {
    const value = e.target.value;
    setAmount(value);
  };
  react.exports.useEffect(() => {
    const isValid = isAddress(domainDetail.isAddress ? domainDetail.value : address);
    if (decimal2Fixed(amount, 18) > Number(allowanceValue)) {
      setButtonText({
        text: "Approve",
        disable: false
      });
    } else if (amount > tokenBalance?.uft) {
      setButtonText({
        text: "Low Balance",
        disable: true
      });
    } else if (!isValid) {
      setButtonText({
        text: "Enter Valid Address",
        disable: true
      });
    } else if (!(amount > 0)) {
      setButtonText({
        text: "Enter Amount",
        disable: true
      });
    } else {
      setButtonText({
        text: "Wrap & Delegate",
        disable: false
      });
    }
  }, [address, domainDetail.value, amount, allowanceValue, tokenBalance]);
  const handleAddress = async (e) => {
    setAddress(e.target.value);
  };
  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
  };
  const handleWrap = async () => {
    const fixedValue = decimal2Fixed(amount, 18);
    const contracts = contractAddress[chain?.id || "1"];
    if (Number(allowanceValue) >= Number(fixedValue)) {
      setIsLoading(true);
      handleWrapAndDelegate(contracts?.uftgToken, uftgABI, domainDetail.isAddress ? domainDetail.value : address, amount, checkTxnStatus, checkTxnError);
    } else {
      setIsLoading(true);
      setApproval(contracts?.uftToken, erc20Abi, contracts?.uftgToken, checkTxnStatus, checkTxnError);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "operation_content_container",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "info",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "heading03",
        children: "Wrap And Delegate"
      }), /* @__PURE__ */ jsx("p", {
        className: "paragraph06",
        children: "You can either vote on each proposal yourself or delegate your votes to a third party. You can either vote on each proposal yourself or delegate your votes to a third party."
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "action",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "amount_input_wraper",
        children: [/* @__PURE__ */ jsx(Input, {
          type: "number",
          placeholder: "Amount",
          onChange: handleAmount,
          value: amount
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setAmount(tokenBalance?.uft),
          className: "max_btn",
          children: "MAX"
        })]
      }), /* @__PURE__ */ jsx(Input, {
        type: "text",
        placeholder: "Address",
        value: address,
        onChange: handleAddress
      }), !domainDetail.isAddress ? /* @__PURE__ */ jsx("div", {
        className: "domain_data",
        children: /* @__PURE__ */ jsx("p", {
          className: "domain_value",
          children: domainDetail.value ? domainDetail.value : ""
        })
      }) : /* @__PURE__ */ jsxs("div", {
        onClick: () => copyAddress(domainDetail.value),
        className: "domain_data",
        children: [/* @__PURE__ */ jsx("p", {
          className: "domain_value paragraph05",
          children: domainDetail.value ? shortenAddress(domainDetail.value) : ""
        }), /* @__PURE__ */ jsx(Popover, {
          content: "copied",
          overlayClassName: "copy_popover",
          placement: "right",
          trigger: "click",
          children: domainDetail.value && /* @__PURE__ */ jsx(FiCopy, {})
        })]
      }), /* @__PURE__ */ jsxs(Button, {
        loading: isLoading,
        onClick: handleWrap,
        disabled: buttonText.disable,
        children: [buttonText.text, " "]
      })]
    })]
  });
};
const UnWrap = ({
  checkTxnStatus,
  tokenBalance,
  isLoading,
  setIsLoading,
  checkTxnError
}) => {
  const [amount, setAmount] = react.exports.useState("");
  const {
    chain
  } = useWalletHook();
  const [buttonText, setButtonText] = react.exports.useState({
    text: "Enter Amount",
    disable: true
  });
  const handleAmount = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value > tokenBalance?.uftg) {
      setButtonText({
        text: "Low Balance",
        disable: true
      });
    } else if (!(value > 0)) {
      setButtonText({
        text: "Enter Amount",
        disable: true
      });
    } else {
      setButtonText({
        text: "Unwrap",
        disable: false
      });
    }
  };
  const handleUnWrapOperation = async () => {
    const contracts = contractAddress[chain?.id || "1"];
    setIsLoading(true);
    handleUnWrap(contracts?.uftgToken, uftgABI, amount, checkTxnStatus, checkTxnError);
  };
  react.exports.useEffect(() => {
    if (amount > tokenBalance?.uftg) {
      setButtonText({
        text: "Low Balance",
        disable: true
      });
    } else if (!(amount > 0)) {
      setButtonText({
        text: "Enter Amount",
        disable: true
      });
    } else {
      setButtonText({
        text: "Unwrap",
        disable: false
      });
    }
  }, [amount]);
  return /* @__PURE__ */ jsxs("div", {
    className: "operation_content_container",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "info",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "heading03",
        children: "Unwrap"
      }), /* @__PURE__ */ jsx("p", {
        className: "paragraph06",
        children: "You can either vote on each proposal yourself or delegate your votes to a third party. You can either vote on each proposal yourself or delegate your votes to a third party."
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "action",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "amount_input_wraper",
        children: [/* @__PURE__ */ jsx(Input, {
          type: "number",
          placeholder: "Amount",
          onChange: handleAmount,
          value: amount
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setAmount(tokenBalance?.uftg),
          className: "max_btn",
          children: "MAX"
        })]
      }), /* @__PURE__ */ jsxs(Button, {
        loading: isLoading,
        onClick: handleUnWrapOperation,
        disabled: buttonText?.disable,
        children: [" ", buttonText?.text]
      })]
    })]
  });
};
const UpdateDelegation = ({
  checkTxnStatus,
  tokenBalance,
  isLoading,
  setIsLoading,
  checkTxnError
}) => {
  const [address, setAddress] = react.exports.useState("");
  const {
    chain
  } = useWalletHook();
  const [buttonText, setButtonText] = react.exports.useState({
    text: "Enter Address",
    disable: true
  });
  react.exports.useState(false);
  react.exports.useMemo(() => {
    const alchemyId = "NaHll2GHbp-BuM6HePxqJq0PpaKAnApy";
    const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
    return new JsonRpcProvider(key);
  }, [chain?.id]);
  const {
    domainDetail
  } = useDomainHandling$1(address);
  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  react.exports.useEffect(() => {
    const isValid = isAddress(domainDetail.isAddress ? domainDetail.value : address);
    if (!isValid) {
      setButtonText({
        text: "Enter Valid Address",
        disable: true
      });
    } else {
      setButtonText({
        text: "Update Delegation",
        disable: false
      });
    }
  }, [address, domainDetail.value]);
  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
  };
  const handleUpdate = () => {
    const contracts = contractAddress[chain?.id || "1"];
    setIsLoading(true);
    handleUpdateDelegate(contracts?.uftgToken, uftgABI, domainDetail.isAddress ? domainDetail.value : address, checkTxnStatus, checkTxnError);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "operation_content_container",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "info",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "heading03",
        children: "Update Delegation"
      }), /* @__PURE__ */ jsx("p", {
        className: "paragraph06",
        children: "You can either vote on each proposal yourself or delegate your votes to a third party. You can either vote on each proposal yourself or delegate your votes to a third party."
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "action",
      children: [/* @__PURE__ */ jsx(Input, {
        type: "text",
        placeholder: "Address",
        value: address,
        onChange: handleAddress
      }), !domainDetail.isAddress ? /* @__PURE__ */ jsx("div", {
        className: "domain_data",
        children: /* @__PURE__ */ jsx("p", {
          className: "domain_value",
          children: domainDetail.value ? domainDetail.value : ""
        })
      }) : /* @__PURE__ */ jsxs("div", {
        onClick: () => copyAddress(domainDetail.value),
        className: "domain_data",
        children: [/* @__PURE__ */ jsx("p", {
          className: "domain_value",
          children: domainDetail.value ? shortenAddress(domainDetail.value) : ""
        }), /* @__PURE__ */ jsx(Popover, {
          content: "copied",
          overlayClassName: "copy_popover",
          placement: "right",
          trigger: "click",
          children: domainDetail.value && /* @__PURE__ */ jsx(FiCopy, {})
        })]
      }), /* @__PURE__ */ jsx(Button, {
        loading: isLoading,
        onClick: handleUpdate,
        disabled: buttonText?.disable,
        children: buttonText?.text
      })]
    })]
  });
};
function Vote() {
  return /* @__PURE__ */ jsx(VoteComponent, {});
}
export {
  Vote as default
};
