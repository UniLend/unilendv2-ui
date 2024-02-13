import { b4 as useSelector, a$ as react, b5 as React, b0 as jsxs, b1 as jsx, c_ as FiSearch, c$ as FiArrowLeft, bZ as Popover, d0 as FiChevronUp, d1 as FiChevronDown, bj as imgError, bn as Button, bd as Modal } from "./index.a9e8707a.js";
import { S as Switch } from "./index.aa1badc2.js";
import { I as Input } from "./index.fa7ce1cc.js";
import "./SearchOutlined.8ef9fed2.js";
const index = "";
function GovernanceComponent() {
  const {
    tokenList
  } = useSelector((state) => state);
  const [showProposal, setShowProposal] = react.exports.useState(false);
  const [showActionModal, setShowActionModal] = react.exports.useState(false);
  const [proposalAction, setProposalAction] = react.exports.useState("Select an action");
  const [amount, setAmount] = react.exports.useState(null);
  const [showSelectTokenModal, setShowSelectTokenModal] = react.exports.useState(false);
  const [availableToken, setAvailableToken] = react.exports.useState(Object.values(tokenList));
  const [selectedToken, setSelectedToken] = react.exports.useState(availableToken[0]);
  const [serachTokenFromList, setSerachTokenFromList] = react.exports.useState("");
  const [tokenBackup, setTokenBackup] = React.useState(Object.values(tokenList));
  const handleCreateProposal = () => {
    setShowProposal(!showProposal);
  };
  const handleShowCancelled = (checked) => {
  };
  const handleShowActionModal = (visible) => {
    setShowActionModal(visible);
  };
  const handleSeclectProposalAction = (action) => {
    setProposalAction(action);
    setShowActionModal(false);
  };
  const handleOpenSelectTokenMoadal = () => {
    setAmount("");
    setShowSelectTokenModal(true);
  };
  const handleSearchToken = (e) => {
    setSerachTokenFromList(e.target.value);
    const filtered = tokenBackup.filter((el) => el.name.toLowerCase().includes(e.target.value.toLowerCase()) || el.symbol.toLowerCase().includes(e.target.value.toLowerCase()) || el.address.toLowerCase().includes(e.target.value.toLowerCase()));
    setAvailableToken(filtered);
  };
  const handleCloseModals = () => {
    setShowSelectTokenModal(false);
    setSerachTokenFromList("");
  };
  react.exports.useEffect(() => {
    const list = Object.values(tokenList);
    setAvailableToken(list);
    setTokenBackup(list);
    setSelectedToken(list[0]);
  }, [tokenList]);
  const SelectAction = react.exports.memo(() => {
    return /* @__PURE__ */ jsxs("div", {
      className: "select_action_popover",
      children: [/* @__PURE__ */ jsx("h3", {
        children: "Select an action"
      }), /* @__PURE__ */ jsx("p", {
        onClick: () => handleSeclectProposalAction("Transfer token"),
        className: "paragraph03",
        children: "Transfer token"
      }), /* @__PURE__ */ jsx("p", {
        onClick: () => handleSeclectProposalAction("Approve token"),
        className: "paragraph03",
        children: "Approve token"
      })]
    });
  });
  const TokenCard = React.memo(({
    token,
    index: index2
  }) => {
    const handleTokensList = () => {
      handleCloseModals();
      setSelectedToken(token);
    };
    return /* @__PURE__ */ jsxs("div", {
      onClick: handleTokensList,
      className: "token_card",
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
        children: [/* @__PURE__ */ jsx("h3", {
          className: "paragraph02",
          children: "Select Token"
        }), /* @__PURE__ */ jsxs("div", {
          className: "input_container",
          children: [/* @__PURE__ */ jsx(FiSearch, {}), /* @__PURE__ */ jsx("input", {
            autoFocus: true,
            type: "text",
            placeholder: "Search Tokens",
            value: serachTokenFromList,
            onChange: handleSearchToken
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        ref: container,
        className: "token_list",
        children: showSelectTokenModal && availableToken.map((token, i) => i < page * 100 && /* @__PURE__ */ jsx(TokenCard, {
          token,
          index: i
        }, i))
      })]
    });
  });
  return /* @__PURE__ */ jsx("div", {
    className: "governance_component",
    children: !showProposal ? /* @__PURE__ */ jsxs("div", {
      className: "governance",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "create",
        children: [/* @__PURE__ */ jsx("h2", {
          children: "Proposals"
        }), /* @__PURE__ */ jsx("button", {
          onClick: handleCreateProposal,
          children: "Create proposal"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "show_cancel_container",
        children: [/* @__PURE__ */ jsx("p", {
          children: "Show cancelled"
        }), /* @__PURE__ */ jsx(Switch, {
          onChange: handleShowCancelled
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "proposals_list",
        children: new Array(10).fill(0).map((_, ind) => {
          return /* @__PURE__ */ jsxs("a", {
            href: `/vote/${ind}`,
            className: "",
            children: [/* @__PURE__ */ jsx("span", {
              children: "1.11"
            }), /* @__PURE__ */ jsx("span", {
              children: "proposal title"
            }), /* @__PURE__ */ jsx("span", {
              children: "execute"
            })]
          }, ind);
        })
      })]
    }) : /* @__PURE__ */ jsxs("main", {
      className: "create_proposal_container",
      children: [/* @__PURE__ */ jsxs("div", {
        role: "button",
        className: "create_proposal_nav",
        onClick: handleCreateProposal,
        children: [/* @__PURE__ */ jsx(FiArrowLeft, {}), /* @__PURE__ */ jsx("p", {
          className: "paragraph02",
          children: " Create Proposal"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "create_proposal_requirements",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "proposal_tip",
          children: [/* @__PURE__ */ jsx("strong", {
            children: "Tip: "
          }), "\xA0Select an action and describe your proposal for the community. The proposal cannot be modified after submission, so please verify all information before submitting. The voting period will begin immediately and last for 7 days. To propose a custom action, \xA0", /* @__PURE__ */ jsx("a", {
            target: "_blank",
            rel: "noopener noreferrer",
            href: "",
            children: "read the docs"
          }), "."]
        }), /* @__PURE__ */ jsxs("section", {
          className: "proposal_action field",
          children: [/* @__PURE__ */ jsx("p", {
            className: "label paragraph05",
            children: "Proposed action"
          }), /* @__PURE__ */ jsx(Popover, {
            content: /* @__PURE__ */ jsx(SelectAction, {}),
            trigger: "click",
            overlayClassName: "proposal_action_dropdown",
            placement: "bottomLeft",
            open: showActionModal,
            onOpenChange: handleShowActionModal,
            children: /* @__PURE__ */ jsxs("div", {
              className: "proposal_action_data",
              children: [/* @__PURE__ */ jsx("p", {
                className: "paragraph02",
                children: proposalAction
              }), showActionModal ? /* @__PURE__ */ jsx(FiChevronUp, {}) : /* @__PURE__ */ jsx(FiChevronDown, {})]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          className: "proposal_address field",
          children: [/* @__PURE__ */ jsx("p", {
            className: "label paragraph05",
            children: "To"
          }), /* @__PURE__ */ jsx(Input, {
            type: "text",
            placeholder: "Wallet Address or ENS name"
          })]
        }), /* @__PURE__ */ jsxs("section", {
          className: "proposal_amount field",
          children: [/* @__PURE__ */ jsx(Input, {
            type: "number",
            placeholder: "0"
          }), /* @__PURE__ */ jsxs("div", {
            className: "token_container",
            onClick: handleOpenSelectTokenMoadal,
            children: [/* @__PURE__ */ jsx("img", {
              src: selectedToken?.logo,
              onError: imgError,
              alt: selectedToken?.symbol
            }), /* @__PURE__ */ jsx("h2", {
              children: selectedToken?.symbol
            }), /* @__PURE__ */ jsx(FiChevronDown, {
              className: "dropicon"
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          className: "proposal field",
          children: [/* @__PURE__ */ jsx("p", {
            className: "label paragraph05",
            children: "Proposal"
          }), /* @__PURE__ */ jsx("input", {
            type: "text",
            placeholder: "Proposal Title"
          }), /* @__PURE__ */ jsx("hr", {}), /* @__PURE__ */ jsx("textarea", {
            placeholder: `## Summry 
Insert your summary here 
## Methodology 
Insert your methodology here 
## Conclusion 
Insert your conclusion here`
          })]
        })]
      }), /* @__PURE__ */ jsx(Button, {
        className: "proposal_btn",
        children: "You must have 2,500,000 votes to submit a proposal"
      }), /* @__PURE__ */ jsxs("p", {
        className: "paragraph05 proposal_note",
        children: ["Don\u2019t have 2.5M votes? Anyone can create an autonomous proposal using ", /* @__PURE__ */ jsx("a", {
          href: "#",
          children: "fish.vote"
        })]
      }), /* @__PURE__ */ jsx(Modal, {
        className: "antd_modal_overlay",
        open: showSelectTokenModal,
        centered: true,
        onCancel: () => setShowSelectTokenModal(false),
        footer: null,
        closable: false,
        children: /* @__PURE__ */ jsx(TokenListModalBody, {})
      })]
    })
  });
}
function Governance() {
  return /* @__PURE__ */ jsx(GovernanceComponent, {});
}
export {
  Governance as default
};
