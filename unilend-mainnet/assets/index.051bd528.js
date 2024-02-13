import { a$ as react, bO as _slicedToArray, bM as _objectWithoutProperties, b1 as jsx, bP as classNames, bY as _objectSpread2, c1 as wrapperRaf, c2 as useEvent, c3 as reactDom, b5 as React, c4 as useLayoutEffect$1, b0 as jsxs, c5 as warning, c6 as composeRef, c7 as _typeof, c8 as pickAttrs, b7 as Fragment, bQ as _defineProperty, bR as KeyCode, c9 as Trigger, ca as warningOnce, cb as _toArray, cc as _toConsumableArray, cd as isMobile, ce as useComposeRef, bN as useMergedState, cf as canUseDom, cg as toArray$1, ch as _inherits, ci as _createSuper, cj as _classCallCheck, ck as _createClass, cl as findDOMNode, cm as useMemo, cn as omit, bS as ConfigContext, co as LocaleReceiver, cp as ConfigConsumer, bX as AntdIcon, cq as CloseCircleFilled, cr as CloseOutlined, bW as LoadingOutlined, bT as SizeContext, cs as useCompactItemContext, ct as FormItemInputContext, cu as _extends, bU as DisabledContext, cv as getTransitionName, cw as getTransitionDirection, cx as enUS, cy as getPastEvents, bG as getEtherContract, cz as poolAbi, bt as fromBigNumber, cA as readContractLib, cB as positionAbi, cC as getEthersProvider, b4 as useSelector, bi as useNavigate, bh as useWalletHook, cD as getHistoryGraphQuery, b8 as supportedNetworks, cE as useQuery, b3 as sortByKey, bb as FaSearch, bj as imgError, cF as Tooltip, cG as truncateToDecimals, cH as shortenAddress, bp as fetchGraphQlData } from "./index.a9e8707a.js";
import { b as DownOutlined, D as DropDown, I as ImArrowUp2, a as ImArrowDown2 } from "./DropDown.74bf9039.js";
import { R as RefResizeObserver, S as SearchOutlined, g as getStatusClassNames, a as getMergedStatus } from "./SearchOutlined.8ef9fed2.js";
var BaseSelectContext = /* @__PURE__ */ react.exports.createContext(null);
function useBaseProps() {
  return react.exports.useContext(BaseSelectContext);
}
function useDelayReset() {
  var timeout = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
  var _React$useState = react.exports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), bool = _React$useState2[0], setBool = _React$useState2[1];
  var delayRef = react.exports.useRef(null);
  var cancelLatest = function cancelLatest2() {
    window.clearTimeout(delayRef.current);
  };
  react.exports.useEffect(function() {
    return cancelLatest;
  }, []);
  var delaySetBool = function delaySetBool2(value, callback) {
    cancelLatest();
    delayRef.current = window.setTimeout(function() {
      setBool(value);
      if (callback) {
        callback();
      }
    }, timeout);
  };
  return [bool, delaySetBool, cancelLatest];
}
function useLock() {
  var duration = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 250;
  var lockRef = react.exports.useRef(null);
  var timeoutRef = react.exports.useRef(null);
  react.exports.useEffect(function() {
    return function() {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);
  function doLock(locked) {
    if (locked || lockRef.current === null) {
      lockRef.current = locked;
    }
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(function() {
      lockRef.current = null;
    }, duration);
  }
  return [function() {
    return lockRef.current;
  }, doLock];
}
function useSelectTriggerControl(elements, open, triggerOpen, customizedTrigger) {
  var propsRef = react.exports.useRef(null);
  propsRef.current = {
    open,
    triggerOpen,
    customizedTrigger
  };
  react.exports.useEffect(function() {
    function onGlobalMouseDown(event) {
      var _propsRef$current;
      if ((_propsRef$current = propsRef.current) !== null && _propsRef$current !== void 0 && _propsRef$current.customizedTrigger) {
        return;
      }
      var target = event.target;
      if (target.shadowRoot && event.composed) {
        target = event.composedPath()[0] || target;
      }
      if (propsRef.current.open && elements().filter(function(element) {
        return element;
      }).every(function(element) {
        return !element.contains(target) && element !== target;
      })) {
        propsRef.current.triggerOpen(false);
      }
    }
    window.addEventListener("mousedown", onGlobalMouseDown);
    return function() {
      return window.removeEventListener("mousedown", onGlobalMouseDown);
    };
  }, []);
}
var _excluded$8 = ["prefixCls", "invalidate", "item", "renderItem", "responsive", "responsiveDisabled", "registerSize", "itemKey", "className", "style", "children", "display", "order", "component"];
var UNDEFINED = void 0;
function InternalItem(props, ref) {
  var prefixCls = props.prefixCls, invalidate = props.invalidate, item = props.item, renderItem = props.renderItem, responsive = props.responsive, responsiveDisabled = props.responsiveDisabled, registerSize = props.registerSize, itemKey2 = props.itemKey, className = props.className, style = props.style, children = props.children, display = props.display, order = props.order, _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, restProps = _objectWithoutProperties(props, _excluded$8);
  var mergedHidden = responsive && !display;
  function internalRegisterSize(width) {
    registerSize(itemKey2, width);
  }
  react.exports.useEffect(function() {
    return function() {
      internalRegisterSize(null);
    };
  }, []);
  var childNode = renderItem && item !== UNDEFINED ? renderItem(item) : children;
  var overflowStyle;
  if (!invalidate) {
    overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : UNDEFINED,
      overflowY: mergedHidden ? "hidden" : UNDEFINED,
      order: responsive ? order : UNDEFINED,
      pointerEvents: mergedHidden ? "none" : UNDEFINED,
      position: mergedHidden ? "absolute" : UNDEFINED
    };
  }
  var overflowProps = {};
  if (mergedHidden) {
    overflowProps["aria-hidden"] = true;
  }
  var itemNode = /* @__PURE__ */ jsx(Component, {
    className: classNames(!invalidate && prefixCls, className),
    style: _objectSpread2(_objectSpread2({}, overflowStyle), style),
    ...overflowProps,
    ...restProps,
    ref,
    children: childNode
  });
  if (responsive) {
    itemNode = /* @__PURE__ */ jsx(RefResizeObserver, {
      onResize: function onResize(_ref) {
        var offsetWidth = _ref.offsetWidth;
        internalRegisterSize(offsetWidth);
      },
      disabled: responsiveDisabled,
      children: itemNode
    });
  }
  return itemNode;
}
var Item$1 = /* @__PURE__ */ react.exports.forwardRef(InternalItem);
Item$1.displayName = "Item";
function channelUpdate(callback) {
  if (typeof MessageChannel === "undefined") {
    wrapperRaf(callback);
  } else {
    var channel = new MessageChannel();
    channel.port1.onmessage = function() {
      return callback();
    };
    channel.port2.postMessage(void 0);
  }
}
function useBatcher() {
  var updateFuncRef = react.exports.useRef(null);
  var notifyEffectUpdate = function notifyEffectUpdate2(callback) {
    if (!updateFuncRef.current) {
      updateFuncRef.current = [];
      channelUpdate(function() {
        reactDom.exports.unstable_batchedUpdates(function() {
          updateFuncRef.current.forEach(function(fn) {
            fn();
          });
          updateFuncRef.current = null;
        });
      });
    }
    updateFuncRef.current.push(callback);
  };
  return notifyEffectUpdate;
}
function useEffectState(notifyEffectUpdate, defaultValue) {
  var _React$useState = react.exports.useState(defaultValue), _React$useState2 = _slicedToArray(_React$useState, 2), stateValue = _React$useState2[0], setStateValue = _React$useState2[1];
  var setEffectVal = useEvent(function(nextValue) {
    notifyEffectUpdate(function() {
      setStateValue(nextValue);
    });
  });
  return [stateValue, setEffectVal];
}
var OverflowContext = /* @__PURE__ */ React.createContext(null);
var _excluded$7 = ["component"], _excluded2$1 = ["className"], _excluded3 = ["className"];
var InternalRawItem = function InternalRawItem2(props, ref) {
  var context = react.exports.useContext(OverflowContext);
  if (!context) {
    var _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, _restProps = _objectWithoutProperties(props, _excluded$7);
    return /* @__PURE__ */ jsx(Component, {
      ..._restProps,
      ref
    });
  }
  var contextClassName = context.className, restContext = _objectWithoutProperties(context, _excluded2$1);
  var className = props.className, restProps = _objectWithoutProperties(props, _excluded3);
  return /* @__PURE__ */ jsx(OverflowContext.Provider, {
    value: null,
    children: /* @__PURE__ */ jsx(Item$1, {
      ref,
      className: classNames(contextClassName, className),
      ...restContext,
      ...restProps
    })
  });
};
var RawItem = /* @__PURE__ */ react.exports.forwardRef(InternalRawItem);
RawItem.displayName = "RawItem";
var _excluded$6 = ["prefixCls", "data", "renderItem", "renderRawItem", "itemKey", "itemWidth", "ssr", "style", "className", "maxCount", "renderRest", "renderRawRest", "suffix", "component", "itemComponent", "onVisibleChange"];
var RESPONSIVE = "responsive";
var INVALIDATE = "invalidate";
function defaultRenderRest(omittedItems) {
  return "+ ".concat(omittedItems.length, " ...");
}
function Overflow(props, ref) {
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-overflow" : _props$prefixCls, _props$data = props.data, data = _props$data === void 0 ? [] : _props$data, renderItem = props.renderItem, renderRawItem = props.renderRawItem, itemKey2 = props.itemKey, _props$itemWidth = props.itemWidth, itemWidth = _props$itemWidth === void 0 ? 10 : _props$itemWidth, ssr = props.ssr, style = props.style, className = props.className, maxCount = props.maxCount, renderRest = props.renderRest, renderRawRest = props.renderRawRest, suffix = props.suffix, _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, itemComponent = props.itemComponent, onVisibleChange = props.onVisibleChange, restProps = _objectWithoutProperties(props, _excluded$6);
  var fullySSR = ssr === "full";
  var notifyEffectUpdate = useBatcher();
  var _useEffectState = useEffectState(notifyEffectUpdate, null), _useEffectState2 = _slicedToArray(_useEffectState, 2), containerWidth = _useEffectState2[0], setContainerWidth = _useEffectState2[1];
  var mergedContainerWidth = containerWidth || 0;
  var _useEffectState3 = useEffectState(notifyEffectUpdate, /* @__PURE__ */ new Map()), _useEffectState4 = _slicedToArray(_useEffectState3, 2), itemWidths = _useEffectState4[0], setItemWidths = _useEffectState4[1];
  var _useEffectState5 = useEffectState(notifyEffectUpdate, 0), _useEffectState6 = _slicedToArray(_useEffectState5, 2), prevRestWidth = _useEffectState6[0], setPrevRestWidth = _useEffectState6[1];
  var _useEffectState7 = useEffectState(notifyEffectUpdate, 0), _useEffectState8 = _slicedToArray(_useEffectState7, 2), restWidth = _useEffectState8[0], setRestWidth = _useEffectState8[1];
  var _useEffectState9 = useEffectState(notifyEffectUpdate, 0), _useEffectState10 = _slicedToArray(_useEffectState9, 2), suffixWidth = _useEffectState10[0], setSuffixWidth = _useEffectState10[1];
  var _useState = react.exports.useState(null), _useState2 = _slicedToArray(_useState, 2), suffixFixedStart = _useState2[0], setSuffixFixedStart = _useState2[1];
  var _useState3 = react.exports.useState(null), _useState4 = _slicedToArray(_useState3, 2), displayCount = _useState4[0], setDisplayCount = _useState4[1];
  var mergedDisplayCount = react.exports.useMemo(function() {
    if (displayCount === null && fullySSR) {
      return Number.MAX_SAFE_INTEGER;
    }
    return displayCount || 0;
  }, [displayCount, containerWidth]);
  var _useState5 = react.exports.useState(false), _useState6 = _slicedToArray(_useState5, 2), restReady = _useState6[0], setRestReady = _useState6[1];
  var itemPrefixCls = "".concat(prefixCls, "-item");
  var mergedRestWidth = Math.max(prevRestWidth, restWidth);
  var isResponsive = maxCount === RESPONSIVE;
  var shouldResponsive = data.length && isResponsive;
  var invalidate = maxCount === INVALIDATE;
  var showRest = shouldResponsive || typeof maxCount === "number" && data.length > maxCount;
  var mergedData = react.exports.useMemo(function() {
    var items = data;
    if (shouldResponsive) {
      if (containerWidth === null && fullySSR) {
        items = data;
      } else {
        items = data.slice(0, Math.min(data.length, mergedContainerWidth / itemWidth));
      }
    } else if (typeof maxCount === "number") {
      items = data.slice(0, maxCount);
    }
    return items;
  }, [data, itemWidth, containerWidth, maxCount, shouldResponsive]);
  var omittedItems = react.exports.useMemo(function() {
    if (shouldResponsive) {
      return data.slice(mergedDisplayCount + 1);
    }
    return data.slice(mergedData.length);
  }, [data, mergedData, shouldResponsive, mergedDisplayCount]);
  var getKey2 = react.exports.useCallback(function(item, index2) {
    var _ref;
    if (typeof itemKey2 === "function") {
      return itemKey2(item);
    }
    return (_ref = itemKey2 && (item === null || item === void 0 ? void 0 : item[itemKey2])) !== null && _ref !== void 0 ? _ref : index2;
  }, [itemKey2]);
  var mergedRenderItem = react.exports.useCallback(renderItem || function(item) {
    return item;
  }, [renderItem]);
  function updateDisplayCount(count, suffixFixedStartVal, notReady) {
    if (displayCount === count && (suffixFixedStartVal === void 0 || suffixFixedStartVal === suffixFixedStart)) {
      return;
    }
    setDisplayCount(count);
    if (!notReady) {
      setRestReady(count < data.length - 1);
      onVisibleChange === null || onVisibleChange === void 0 ? void 0 : onVisibleChange(count);
    }
    if (suffixFixedStartVal !== void 0) {
      setSuffixFixedStart(suffixFixedStartVal);
    }
  }
  function onOverflowResize(_, element) {
    setContainerWidth(element.clientWidth);
  }
  function registerSize(key, width) {
    setItemWidths(function(origin) {
      var clone = new Map(origin);
      if (width === null) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }
      return clone;
    });
  }
  function registerOverflowSize(_, width) {
    setRestWidth(width);
    setPrevRestWidth(restWidth);
  }
  function registerSuffixSize(_, width) {
    setSuffixWidth(width);
  }
  function getItemWidth(index2) {
    return itemWidths.get(getKey2(mergedData[index2], index2));
  }
  useLayoutEffect$1(function() {
    if (mergedContainerWidth && typeof mergedRestWidth === "number" && mergedData) {
      var totalWidth = suffixWidth;
      var len = mergedData.length;
      var lastIndex = len - 1;
      if (!len) {
        updateDisplayCount(0, null);
        return;
      }
      for (var i = 0; i < len; i += 1) {
        var currentItemWidth = getItemWidth(i);
        if (fullySSR) {
          currentItemWidth = currentItemWidth || 0;
        }
        if (currentItemWidth === void 0) {
          updateDisplayCount(i - 1, void 0, true);
          break;
        }
        totalWidth += currentItemWidth;
        if (lastIndex === 0 && totalWidth <= mergedContainerWidth || i === lastIndex - 1 && totalWidth + getItemWidth(lastIndex) <= mergedContainerWidth) {
          updateDisplayCount(lastIndex, null);
          break;
        } else if (totalWidth + mergedRestWidth > mergedContainerWidth) {
          updateDisplayCount(i - 1, totalWidth - currentItemWidth - suffixWidth + restWidth);
          break;
        }
      }
      if (suffix && getItemWidth(0) + suffixWidth > mergedContainerWidth) {
        setSuffixFixedStart(null);
      }
    }
  }, [mergedContainerWidth, itemWidths, restWidth, suffixWidth, getKey2, mergedData]);
  var displayRest = restReady && !!omittedItems.length;
  var suffixStyle = {};
  if (suffixFixedStart !== null && shouldResponsive) {
    suffixStyle = {
      position: "absolute",
      left: suffixFixedStart,
      top: 0
    };
  }
  var itemSharedProps = {
    prefixCls: itemPrefixCls,
    responsive: shouldResponsive,
    component: itemComponent,
    invalidate
  };
  var internalRenderItemNode = renderRawItem ? function(item, index2) {
    var key = getKey2(item, index2);
    return /* @__PURE__ */ jsx(OverflowContext.Provider, {
      value: _objectSpread2(_objectSpread2({}, itemSharedProps), {}, {
        order: index2,
        item,
        itemKey: key,
        registerSize,
        display: index2 <= mergedDisplayCount
      }),
      children: renderRawItem(item, index2)
    }, key);
  } : function(item, index2) {
    var key = getKey2(item, index2);
    return /* @__PURE__ */ react.exports.createElement(Item$1, {
      ...itemSharedProps,
      order: index2,
      key,
      item,
      renderItem: mergedRenderItem,
      itemKey: key,
      registerSize,
      display: index2 <= mergedDisplayCount
    });
  };
  var restNode;
  var restContextProps = {
    order: displayRest ? mergedDisplayCount : Number.MAX_SAFE_INTEGER,
    className: "".concat(itemPrefixCls, "-rest"),
    registerSize: registerOverflowSize,
    display: displayRest
  };
  if (!renderRawRest) {
    var mergedRenderRest = renderRest || defaultRenderRest;
    restNode = /* @__PURE__ */ jsx(Item$1, {
      ...itemSharedProps,
      ...restContextProps,
      children: typeof mergedRenderRest === "function" ? mergedRenderRest(omittedItems) : mergedRenderRest
    });
  } else if (renderRawRest) {
    restNode = /* @__PURE__ */ jsx(OverflowContext.Provider, {
      value: _objectSpread2(_objectSpread2({}, itemSharedProps), restContextProps),
      children: renderRawRest(omittedItems)
    });
  }
  var overflowNode = /* @__PURE__ */ jsxs(Component, {
    className: classNames(!invalidate && prefixCls, className),
    style,
    ref,
    ...restProps,
    children: [mergedData.map(internalRenderItemNode), showRest ? restNode : null, suffix && /* @__PURE__ */ jsx(Item$1, {
      ...itemSharedProps,
      responsive: isResponsive,
      responsiveDisabled: !shouldResponsive,
      order: mergedDisplayCount,
      className: "".concat(itemPrefixCls, "-suffix"),
      registerSize: registerSuffixSize,
      display: true,
      style: suffixStyle,
      children: suffix
    })]
  });
  if (isResponsive) {
    overflowNode = /* @__PURE__ */ jsx(RefResizeObserver, {
      onResize: onOverflowResize,
      disabled: !shouldResponsive,
      children: overflowNode
    });
  }
  return overflowNode;
}
var ForwardOverflow = /* @__PURE__ */ react.exports.forwardRef(Overflow);
ForwardOverflow.displayName = "Overflow";
ForwardOverflow.Item = RawItem;
ForwardOverflow.RESPONSIVE = RESPONSIVE;
ForwardOverflow.INVALIDATE = INVALIDATE;
var TransBtn = function TransBtn2(_ref) {
  var className = _ref.className, customizeIcon = _ref.customizeIcon, customizeIconProps = _ref.customizeIconProps, _onMouseDown = _ref.onMouseDown, onClick = _ref.onClick, children = _ref.children;
  var icon;
  if (typeof customizeIcon === "function") {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = customizeIcon;
  }
  return /* @__PURE__ */ jsx("span", {
    className,
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();
      if (_onMouseDown) {
        _onMouseDown(event);
      }
    },
    style: {
      userSelect: "none",
      WebkitUserSelect: "none"
    },
    unselectable: "on",
    onClick,
    "aria-hidden": true,
    children: icon !== void 0 ? icon : /* @__PURE__ */ jsx("span", {
      className: classNames(className.split(/\s+/).map(function(cls) {
        return "".concat(cls, "-icon");
      })),
      children
    })
  });
};
var Input = function Input2(_ref, ref) {
  var _inputNode2, _inputNode2$props;
  var prefixCls = _ref.prefixCls, id = _ref.id, inputElement = _ref.inputElement, disabled = _ref.disabled, tabIndex = _ref.tabIndex, autoFocus = _ref.autoFocus, autoComplete = _ref.autoComplete, editable = _ref.editable, activeDescendantId = _ref.activeDescendantId, value = _ref.value, maxLength = _ref.maxLength, _onKeyDown = _ref.onKeyDown, _onMouseDown = _ref.onMouseDown, _onChange = _ref.onChange, onPaste = _ref.onPaste, _onCompositionStart = _ref.onCompositionStart, _onCompositionEnd = _ref.onCompositionEnd, open = _ref.open, attrs = _ref.attrs;
  var inputNode = inputElement || /* @__PURE__ */ jsx("input", {});
  var _inputNode = inputNode, originRef = _inputNode.ref, originProps = _inputNode.props;
  var onOriginKeyDown = originProps.onKeyDown, onOriginChange = originProps.onChange, onOriginMouseDown = originProps.onMouseDown, onOriginCompositionStart = originProps.onCompositionStart, onOriginCompositionEnd = originProps.onCompositionEnd, style = originProps.style;
  warning(!("maxLength" in inputNode.props));
  inputNode = /* @__PURE__ */ react.exports.cloneElement(inputNode, _objectSpread2(_objectSpread2(_objectSpread2({
    type: "search"
  }, originProps), {}, {
    id,
    ref: composeRef(ref, originRef),
    disabled,
    tabIndex,
    autoComplete: autoComplete || "off",
    autoFocus,
    className: classNames("".concat(prefixCls, "-selection-search-input"), (_inputNode2 = inputNode) === null || _inputNode2 === void 0 ? void 0 : (_inputNode2$props = _inputNode2.props) === null || _inputNode2$props === void 0 ? void 0 : _inputNode2$props.className),
    role: "combobox",
    "aria-expanded": open,
    "aria-haspopup": "listbox",
    "aria-owns": "".concat(id, "_list"),
    "aria-autocomplete": "list",
    "aria-controls": "".concat(id, "_list"),
    "aria-activedescendant": activeDescendantId
  }, attrs), {}, {
    value: editable ? value : "",
    maxLength,
    readOnly: !editable,
    unselectable: !editable ? "on" : null,
    style: _objectSpread2(_objectSpread2({}, style), {}, {
      opacity: editable ? null : 0
    }),
    onKeyDown: function onKeyDown(event) {
      _onKeyDown(event);
      if (onOriginKeyDown) {
        onOriginKeyDown(event);
      }
    },
    onMouseDown: function onMouseDown(event) {
      _onMouseDown(event);
      if (onOriginMouseDown) {
        onOriginMouseDown(event);
      }
    },
    onChange: function onChange(event) {
      _onChange(event);
      if (onOriginChange) {
        onOriginChange(event);
      }
    },
    onCompositionStart: function onCompositionStart(event) {
      _onCompositionStart(event);
      if (onOriginCompositionStart) {
        onOriginCompositionStart(event);
      }
    },
    onCompositionEnd: function onCompositionEnd(event) {
      _onCompositionEnd(event);
      if (onOriginCompositionEnd) {
        onOriginCompositionEnd(event);
      }
    },
    onPaste
  }));
  return inputNode;
};
var RefInput = /* @__PURE__ */ react.exports.forwardRef(Input);
RefInput.displayName = "Input";
function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== void 0 ? [value] : [];
}
var isClient = typeof window !== "undefined" && window.document && window.document.documentElement;
var isBrowserClient$1 = isClient;
function hasValue(value) {
  return value !== void 0 && value !== null;
}
function isTitleType$1(title) {
  return ["string", "number"].includes(_typeof(title));
}
function getTitle(item) {
  var title = void 0;
  if (item) {
    if (isTitleType$1(item.title)) {
      title = item.title.toString();
    } else if (isTitleType$1(item.label)) {
      title = item.label.toString();
    }
  }
  return title;
}
function useLayoutEffect(effect, deps) {
  if (isBrowserClient$1) {
    react.exports.useLayoutEffect(effect, deps);
  } else {
    react.exports.useEffect(effect, deps);
  }
}
function itemKey(value) {
  var _value$key;
  return (_value$key = value.key) !== null && _value$key !== void 0 ? _value$key : value.value;
}
var onPreventMouseDown = function onPreventMouseDown2(event) {
  event.preventDefault();
  event.stopPropagation();
};
var SelectSelector = function SelectSelector2(props) {
  var id = props.id, prefixCls = props.prefixCls, values = props.values, open = props.open, searchValue = props.searchValue, autoClearSearchValue = props.autoClearSearchValue, inputRef = props.inputRef, placeholder = props.placeholder, disabled = props.disabled, mode = props.mode, showSearch = props.showSearch, autoFocus = props.autoFocus, autoComplete = props.autoComplete, activeDescendantId = props.activeDescendantId, tabIndex = props.tabIndex, removeIcon = props.removeIcon, maxTagCount = props.maxTagCount, maxTagTextLength = props.maxTagTextLength, _props$maxTagPlacehol = props.maxTagPlaceholder, maxTagPlaceholder = _props$maxTagPlacehol === void 0 ? function(omittedValues) {
    return "+ ".concat(omittedValues.length, " ...");
  } : _props$maxTagPlacehol, tagRender = props.tagRender, onToggleOpen = props.onToggleOpen, onRemove = props.onRemove, onInputChange = props.onInputChange, onInputPaste = props.onInputPaste, onInputKeyDown = props.onInputKeyDown, onInputMouseDown = props.onInputMouseDown, onInputCompositionStart = props.onInputCompositionStart, onInputCompositionEnd = props.onInputCompositionEnd;
  var measureRef = react.exports.useRef(null);
  var _useState = react.exports.useState(0), _useState2 = _slicedToArray(_useState, 2), inputWidth = _useState2[0], setInputWidth = _useState2[1];
  var _useState3 = react.exports.useState(false), _useState4 = _slicedToArray(_useState3, 2), focused = _useState4[0], setFocused = _useState4[1];
  var selectionPrefixCls = "".concat(prefixCls, "-selection");
  var inputValue = open || mode === "multiple" && autoClearSearchValue === false || mode === "tags" ? searchValue : "";
  var inputEditable = mode === "tags" || mode === "multiple" && autoClearSearchValue === false || showSearch && (open || focused);
  useLayoutEffect(function() {
    setInputWidth(measureRef.current.scrollWidth);
  }, [inputValue]);
  function defaultRenderSelector(item, content, itemDisabled, closable, onClose) {
    return /* @__PURE__ */ jsxs("span", {
      className: classNames("".concat(selectionPrefixCls, "-item"), _defineProperty({}, "".concat(selectionPrefixCls, "-item-disabled"), itemDisabled)),
      title: getTitle(item),
      children: [/* @__PURE__ */ jsx("span", {
        className: "".concat(selectionPrefixCls, "-item-content"),
        children: content
      }), closable && /* @__PURE__ */ jsx(TransBtn, {
        className: "".concat(selectionPrefixCls, "-item-remove"),
        onMouseDown: onPreventMouseDown,
        onClick: onClose,
        customizeIcon: removeIcon,
        children: "\xD7"
      })]
    });
  }
  function customizeRenderSelector(value, content, itemDisabled, closable, onClose) {
    var onMouseDown = function onMouseDown2(e) {
      onPreventMouseDown(e);
      onToggleOpen(!open);
    };
    return /* @__PURE__ */ jsx("span", {
      onMouseDown,
      children: tagRender({
        label: content,
        value,
        disabled: itemDisabled,
        closable,
        onClose
      })
    });
  }
  function renderItem(valueItem) {
    var itemDisabled = valueItem.disabled, label = valueItem.label, value = valueItem.value;
    var closable = !disabled && !itemDisabled;
    var displayLabel = label;
    if (typeof maxTagTextLength === "number") {
      if (typeof label === "string" || typeof label === "number") {
        var strLabel = String(displayLabel);
        if (strLabel.length > maxTagTextLength) {
          displayLabel = "".concat(strLabel.slice(0, maxTagTextLength), "...");
        }
      }
    }
    var onClose = function onClose2(event) {
      if (event)
        event.stopPropagation();
      onRemove(valueItem);
    };
    return typeof tagRender === "function" ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose) : defaultRenderSelector(valueItem, displayLabel, itemDisabled, closable, onClose);
  }
  function renderRest(omittedValues) {
    var content = typeof maxTagPlaceholder === "function" ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
    return defaultRenderSelector({
      title: content
    }, content, false);
  }
  var inputNode = /* @__PURE__ */ jsxs("div", {
    className: "".concat(selectionPrefixCls, "-search"),
    style: {
      width: inputWidth
    },
    onFocus: function onFocus() {
      setFocused(true);
    },
    onBlur: function onBlur() {
      setFocused(false);
    },
    children: [/* @__PURE__ */ jsx(RefInput, {
      ref: inputRef,
      open,
      prefixCls,
      id,
      inputElement: null,
      disabled,
      autoFocus,
      autoComplete,
      editable: inputEditable,
      activeDescendantId,
      value: inputValue,
      onKeyDown: onInputKeyDown,
      onMouseDown: onInputMouseDown,
      onChange: onInputChange,
      onPaste: onInputPaste,
      onCompositionStart: onInputCompositionStart,
      onCompositionEnd: onInputCompositionEnd,
      tabIndex,
      attrs: pickAttrs(props, true)
    }), /* @__PURE__ */ jsxs("span", {
      ref: measureRef,
      className: "".concat(selectionPrefixCls, "-search-mirror"),
      "aria-hidden": true,
      children: [inputValue, "\xA0"]
    })]
  });
  var selectionNode = /* @__PURE__ */ jsx(ForwardOverflow, {
    prefixCls: "".concat(selectionPrefixCls, "-overflow"),
    data: values,
    renderItem,
    renderRest,
    suffix: inputNode,
    itemKey,
    maxCount: maxTagCount
  });
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [selectionNode, !values.length && !inputValue && /* @__PURE__ */ jsx("span", {
      className: "".concat(selectionPrefixCls, "-placeholder"),
      children: placeholder
    })]
  });
};
var SingleSelector = function SingleSelector2(props) {
  var inputElement = props.inputElement, prefixCls = props.prefixCls, id = props.id, inputRef = props.inputRef, disabled = props.disabled, autoFocus = props.autoFocus, autoComplete = props.autoComplete, activeDescendantId = props.activeDescendantId, mode = props.mode, open = props.open, values = props.values, placeholder = props.placeholder, tabIndex = props.tabIndex, showSearch = props.showSearch, searchValue = props.searchValue, activeValue = props.activeValue, maxLength = props.maxLength, onInputKeyDown = props.onInputKeyDown, onInputMouseDown = props.onInputMouseDown, onInputChange = props.onInputChange, onInputPaste = props.onInputPaste, onInputCompositionStart = props.onInputCompositionStart, onInputCompositionEnd = props.onInputCompositionEnd;
  var _React$useState = react.exports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), inputChanged = _React$useState2[0], setInputChanged = _React$useState2[1];
  var combobox = mode === "combobox";
  var inputEditable = combobox || showSearch;
  var item = values[0];
  var inputValue = searchValue || "";
  if (combobox && activeValue && !inputChanged) {
    inputValue = activeValue;
  }
  react.exports.useEffect(function() {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);
  var hasTextInput = mode !== "combobox" && !open && !showSearch ? false : !!inputValue;
  var title = getTitle(item);
  var renderPlaceholder = function renderPlaceholder2() {
    if (item) {
      return null;
    }
    var hiddenStyle = hasTextInput ? {
      visibility: "hidden"
    } : void 0;
    return /* @__PURE__ */ jsx("span", {
      className: "".concat(prefixCls, "-selection-placeholder"),
      style: hiddenStyle,
      children: placeholder
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("span", {
      className: "".concat(prefixCls, "-selection-search"),
      children: /* @__PURE__ */ jsx(RefInput, {
        ref: inputRef,
        prefixCls,
        id,
        open,
        inputElement,
        disabled,
        autoFocus,
        autoComplete,
        editable: inputEditable,
        activeDescendantId,
        value: inputValue,
        onKeyDown: onInputKeyDown,
        onMouseDown: onInputMouseDown,
        onChange: function onChange(e) {
          setInputChanged(true);
          onInputChange(e);
        },
        onPaste: onInputPaste,
        onCompositionStart: onInputCompositionStart,
        onCompositionEnd: onInputCompositionEnd,
        tabIndex,
        attrs: pickAttrs(props, true),
        maxLength: combobox ? maxLength : void 0
      })
    }), !combobox && item ? /* @__PURE__ */ jsx("span", {
      className: "".concat(prefixCls, "-selection-item"),
      title,
      style: hasTextInput ? {
        visibility: "hidden"
      } : void 0,
      children: item.label
    }) : null, renderPlaceholder()]
  });
};
function isValidateOpenKey(currentKeyCode) {
  return ![
    KeyCode.ESC,
    KeyCode.SHIFT,
    KeyCode.BACKSPACE,
    KeyCode.TAB,
    KeyCode.WIN_KEY,
    KeyCode.ALT,
    KeyCode.META,
    KeyCode.WIN_KEY_RIGHT,
    KeyCode.CTRL,
    KeyCode.SEMICOLON,
    KeyCode.EQUALS,
    KeyCode.CAPS_LOCK,
    KeyCode.CONTEXT_MENU,
    KeyCode.F1,
    KeyCode.F2,
    KeyCode.F3,
    KeyCode.F4,
    KeyCode.F5,
    KeyCode.F6,
    KeyCode.F7,
    KeyCode.F8,
    KeyCode.F9,
    KeyCode.F10,
    KeyCode.F11,
    KeyCode.F12
  ].includes(currentKeyCode);
}
var Selector = function Selector2(props, ref) {
  var inputRef = react.exports.useRef(null);
  var compositionStatusRef = react.exports.useRef(false);
  var prefixCls = props.prefixCls, open = props.open, mode = props.mode, showSearch = props.showSearch, tokenWithEnter = props.tokenWithEnter, autoClearSearchValue = props.autoClearSearchValue, onSearch = props.onSearch, onSearchSubmit = props.onSearchSubmit, onToggleOpen = props.onToggleOpen, onInputKeyDown = props.onInputKeyDown, domRef = props.domRef;
  react.exports.useImperativeHandle(ref, function() {
    return {
      focus: function focus() {
        inputRef.current.focus();
      },
      blur: function blur() {
        inputRef.current.blur();
      }
    };
  });
  var _useLock = useLock(0), _useLock2 = _slicedToArray(_useLock, 2), getInputMouseDown = _useLock2[0], setInputMouseDown = _useLock2[1];
  var onInternalInputKeyDown = function onInternalInputKeyDown2(event) {
    var which = event.which;
    if (which === KeyCode.UP || which === KeyCode.DOWN) {
      event.preventDefault();
    }
    if (onInputKeyDown) {
      onInputKeyDown(event);
    }
    if (which === KeyCode.ENTER && mode === "tags" && !compositionStatusRef.current && !open) {
      onSearchSubmit === null || onSearchSubmit === void 0 ? void 0 : onSearchSubmit(event.target.value);
    }
    if (isValidateOpenKey(which)) {
      onToggleOpen(true);
    }
  };
  var onInternalInputMouseDown = function onInternalInputMouseDown2() {
    setInputMouseDown(true);
  };
  var pastedTextRef = react.exports.useRef(null);
  var triggerOnSearch = function triggerOnSearch2(value) {
    if (onSearch(value, true, compositionStatusRef.current) !== false) {
      onToggleOpen(true);
    }
  };
  var onInputCompositionStart = function onInputCompositionStart2() {
    compositionStatusRef.current = true;
  };
  var onInputCompositionEnd = function onInputCompositionEnd2(e) {
    compositionStatusRef.current = false;
    if (mode !== "combobox") {
      triggerOnSearch(e.target.value);
    }
  };
  var onInputChange = function onInputChange2(event) {
    var value = event.target.value;
    if (tokenWithEnter && pastedTextRef.current && /[\r\n]/.test(pastedTextRef.current)) {
      var replacedText = pastedTextRef.current.replace(/[\r\n]+$/, "").replace(/\r\n/g, " ").replace(/[\r\n]/g, " ");
      value = value.replace(replacedText, pastedTextRef.current);
    }
    pastedTextRef.current = null;
    triggerOnSearch(value);
  };
  var onInputPaste = function onInputPaste2(e) {
    var clipboardData = e.clipboardData;
    var value = clipboardData.getData("text");
    pastedTextRef.current = value;
  };
  var onClick = function onClick2(_ref) {
    var target = _ref.target;
    if (target !== inputRef.current) {
      var isIE = document.body.style.msTouchAction !== void 0;
      if (isIE) {
        setTimeout(function() {
          inputRef.current.focus();
        });
      } else {
        inputRef.current.focus();
      }
    }
  };
  var onMouseDown = function onMouseDown2(event) {
    var inputMouseDown = getInputMouseDown();
    if (event.target !== inputRef.current && !inputMouseDown && mode !== "combobox") {
      event.preventDefault();
    }
    if (mode !== "combobox" && (!showSearch || !inputMouseDown) || !open) {
      if (open && autoClearSearchValue !== false) {
        onSearch("", true, false);
      }
      onToggleOpen();
    }
  };
  var sharedProps = {
    inputRef,
    onInputKeyDown: onInternalInputKeyDown,
    onInputMouseDown: onInternalInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd
  };
  var selectNode = mode === "multiple" || mode === "tags" ? /* @__PURE__ */ jsx(SelectSelector, {
    ...props,
    ...sharedProps
  }) : /* @__PURE__ */ jsx(SingleSelector, {
    ...props,
    ...sharedProps
  });
  return /* @__PURE__ */ jsx("div", {
    ref: domRef,
    className: "".concat(prefixCls, "-selector"),
    onClick,
    onMouseDown,
    children: selectNode
  });
};
var ForwardSelector = /* @__PURE__ */ react.exports.forwardRef(Selector);
ForwardSelector.displayName = "Selector";
var _excluded$5 = ["prefixCls", "disabled", "visible", "children", "popupElement", "containerWidth", "animation", "transitionName", "dropdownStyle", "dropdownClassName", "direction", "placement", "dropdownMatchSelectWidth", "dropdownRender", "dropdownAlign", "getPopupContainer", "empty", "getTriggerDOMNode", "onPopupVisibleChange", "onPopupMouseEnter"];
var getBuiltInPlacements = function getBuiltInPlacements2(dropdownMatchSelectWidth) {
  var adjustX = dropdownMatchSelectWidth === true ? 0 : 1;
  return {
    bottomLeft: {
      points: ["tl", "bl"],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    },
    bottomRight: {
      points: ["tr", "br"],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    },
    topLeft: {
      points: ["bl", "tl"],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    },
    topRight: {
      points: ["br", "tr"],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1
      }
    }
  };
};
var SelectTrigger = function SelectTrigger2(props, ref) {
  var prefixCls = props.prefixCls;
  props.disabled;
  var visible = props.visible, children = props.children, popupElement = props.popupElement, containerWidth = props.containerWidth, animation = props.animation, transitionName = props.transitionName, dropdownStyle = props.dropdownStyle, dropdownClassName = props.dropdownClassName, _props$direction = props.direction, direction = _props$direction === void 0 ? "ltr" : _props$direction, placement = props.placement, dropdownMatchSelectWidth = props.dropdownMatchSelectWidth, dropdownRender = props.dropdownRender, dropdownAlign = props.dropdownAlign, getPopupContainer = props.getPopupContainer, empty = props.empty, getTriggerDOMNode = props.getTriggerDOMNode, onPopupVisibleChange = props.onPopupVisibleChange, onPopupMouseEnter = props.onPopupMouseEnter, restProps = _objectWithoutProperties(props, _excluded$5);
  var dropdownPrefixCls = "".concat(prefixCls, "-dropdown");
  var popupNode = popupElement;
  if (dropdownRender) {
    popupNode = dropdownRender(popupElement);
  }
  var builtInPlacements = react.exports.useMemo(function() {
    return getBuiltInPlacements(dropdownMatchSelectWidth);
  }, [dropdownMatchSelectWidth]);
  var mergedTransitionName = animation ? "".concat(dropdownPrefixCls, "-").concat(animation) : transitionName;
  var popupRef = react.exports.useRef(null);
  react.exports.useImperativeHandle(ref, function() {
    return {
      getPopupElement: function getPopupElement() {
        return popupRef.current;
      }
    };
  });
  var popupStyle = _objectSpread2({
    minWidth: containerWidth
  }, dropdownStyle);
  if (typeof dropdownMatchSelectWidth === "number") {
    popupStyle.width = dropdownMatchSelectWidth;
  } else if (dropdownMatchSelectWidth) {
    popupStyle.width = containerWidth;
  }
  return /* @__PURE__ */ jsx(Trigger, {
    ...restProps,
    showAction: onPopupVisibleChange ? ["click"] : [],
    hideAction: onPopupVisibleChange ? ["click"] : [],
    popupPlacement: placement || (direction === "rtl" ? "bottomRight" : "bottomLeft"),
    builtinPlacements: builtInPlacements,
    prefixCls: dropdownPrefixCls,
    popupTransitionName: mergedTransitionName,
    popup: /* @__PURE__ */ jsx("div", {
      ref: popupRef,
      onMouseEnter: onPopupMouseEnter,
      children: popupNode
    }),
    popupAlign: dropdownAlign,
    popupVisible: visible,
    getPopupContainer,
    popupClassName: classNames(dropdownClassName, _defineProperty({}, "".concat(dropdownPrefixCls, "-empty"), empty)),
    popupStyle,
    getTriggerDOMNode,
    onPopupVisibleChange,
    children
  });
};
var RefSelectTrigger = /* @__PURE__ */ react.exports.forwardRef(SelectTrigger);
RefSelectTrigger.displayName = "SelectTrigger";
function getKey(data, index2) {
  var key = data.key;
  var value;
  if ("value" in data) {
    value = data.value;
  }
  if (key !== null && key !== void 0) {
    return key;
  }
  if (value !== void 0) {
    return value;
  }
  return "rc-index-key-".concat(index2);
}
function fillFieldNames(fieldNames, childrenAsData) {
  var _ref = fieldNames || {}, label = _ref.label, value = _ref.value, options = _ref.options;
  return {
    label: label || (childrenAsData ? "children" : "label"),
    value: value || "value",
    options: options || "options"
  };
}
function flattenOptions(options) {
  var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, fieldNames = _ref2.fieldNames, childrenAsData = _ref2.childrenAsData;
  var flattenList = [];
  var _fillFieldNames = fillFieldNames(fieldNames, false), fieldLabel = _fillFieldNames.label, fieldValue = _fillFieldNames.value, fieldOptions = _fillFieldNames.options;
  function dig(list, isGroupOption) {
    list.forEach(function(data) {
      var label = data[fieldLabel];
      if (isGroupOption || !(fieldOptions in data)) {
        var value = data[fieldValue];
        flattenList.push({
          key: getKey(data, flattenList.length),
          groupOption: isGroupOption,
          data,
          label,
          value
        });
      } else {
        var grpLabel = label;
        if (grpLabel === void 0 && childrenAsData) {
          grpLabel = data.label;
        }
        flattenList.push({
          key: getKey(data, flattenList.length),
          group: true,
          data,
          label: grpLabel
        });
        dig(data[fieldOptions], true);
      }
    });
  }
  dig(options, false);
  return flattenList;
}
function injectPropsWithOption(option) {
  var newOption = _objectSpread2({}, option);
  if (!("props" in newOption)) {
    Object.defineProperty(newOption, "props", {
      get: function get() {
        warningOnce(false, "Return type is option instead of Option instance. Please read value directly instead of reading from `props`.");
        return newOption;
      }
    });
  }
  return newOption;
}
function getSeparatedContent(text, tokens) {
  if (!tokens || !tokens.length) {
    return null;
  }
  var match = false;
  function separate(str, _ref3) {
    var _ref4 = _toArray(_ref3), token = _ref4[0], restTokens = _ref4.slice(1);
    if (!token) {
      return [str];
    }
    var list2 = str.split(token);
    match = match || list2.length > 1;
    return list2.reduce(function(prevList, unitStr) {
      return [].concat(_toConsumableArray(prevList), _toConsumableArray(separate(unitStr, restTokens)));
    }, []).filter(function(unit) {
      return unit;
    });
  }
  var list = separate(text, tokens);
  return match ? list : null;
}
var _excluded$4 = ["id", "prefixCls", "className", "showSearch", "tagRender", "direction", "omitDomProps", "displayValues", "onDisplayValuesChange", "emptyOptions", "notFoundContent", "onClear", "mode", "disabled", "loading", "getInputElement", "getRawInputElement", "open", "defaultOpen", "onDropdownVisibleChange", "activeValue", "onActiveValueChange", "activeDescendantId", "searchValue", "autoClearSearchValue", "onSearch", "onSearchSplit", "tokenSeparators", "allowClear", "showArrow", "inputIcon", "clearIcon", "OptionList", "animation", "transitionName", "dropdownStyle", "dropdownClassName", "dropdownMatchSelectWidth", "dropdownRender", "dropdownAlign", "placement", "getPopupContainer", "showAction", "onFocus", "onBlur", "onKeyUp", "onKeyDown", "onMouseDown"];
var DEFAULT_OMIT_PROPS = ["value", "onChange", "removeIcon", "placeholder", "autoFocus", "maxTagCount", "maxTagTextLength", "maxTagPlaceholder", "choiceTransitionName", "onInputKeyDown", "onPopupScroll", "tabIndex"];
function isMultiple(mode) {
  return mode === "tags" || mode === "multiple";
}
var BaseSelect = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _customizeRawInputEle, _classNames2;
  var id = props.id, prefixCls = props.prefixCls, className = props.className, showSearch = props.showSearch, tagRender = props.tagRender, direction = props.direction, omitDomProps = props.omitDomProps, displayValues = props.displayValues, onDisplayValuesChange = props.onDisplayValuesChange, emptyOptions = props.emptyOptions, _props$notFoundConten = props.notFoundContent, notFoundContent = _props$notFoundConten === void 0 ? "Not Found" : _props$notFoundConten, onClear = props.onClear, mode = props.mode, disabled = props.disabled, loading = props.loading, getInputElement = props.getInputElement, getRawInputElement = props.getRawInputElement, open = props.open, defaultOpen = props.defaultOpen, onDropdownVisibleChange = props.onDropdownVisibleChange, activeValue = props.activeValue, onActiveValueChange = props.onActiveValueChange, activeDescendantId = props.activeDescendantId, searchValue = props.searchValue, autoClearSearchValue = props.autoClearSearchValue, onSearch = props.onSearch, onSearchSplit = props.onSearchSplit, tokenSeparators = props.tokenSeparators, allowClear = props.allowClear, showArrow = props.showArrow, inputIcon = props.inputIcon, clearIcon = props.clearIcon, OptionList3 = props.OptionList, animation = props.animation, transitionName = props.transitionName, dropdownStyle = props.dropdownStyle, dropdownClassName = props.dropdownClassName, dropdownMatchSelectWidth = props.dropdownMatchSelectWidth, dropdownRender = props.dropdownRender, dropdownAlign = props.dropdownAlign, placement = props.placement, getPopupContainer = props.getPopupContainer, _props$showAction = props.showAction, showAction = _props$showAction === void 0 ? [] : _props$showAction, onFocus = props.onFocus, onBlur = props.onBlur, onKeyUp = props.onKeyUp, onKeyDown = props.onKeyDown, onMouseDown = props.onMouseDown, restProps = _objectWithoutProperties(props, _excluded$4);
  var multiple = isMultiple(mode);
  var mergedShowSearch = (showSearch !== void 0 ? showSearch : multiple) || mode === "combobox";
  var domProps = _objectSpread2({}, restProps);
  DEFAULT_OMIT_PROPS.forEach(function(propName) {
    delete domProps[propName];
  });
  omitDomProps === null || omitDomProps === void 0 ? void 0 : omitDomProps.forEach(function(propName) {
    delete domProps[propName];
  });
  var _React$useState = react.exports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), mobile = _React$useState2[0], setMobile = _React$useState2[1];
  react.exports.useEffect(function() {
    setMobile(isMobile());
  }, []);
  var containerRef = react.exports.useRef(null);
  var selectorDomRef = react.exports.useRef(null);
  var triggerRef = react.exports.useRef(null);
  var selectorRef = react.exports.useRef(null);
  var listRef = react.exports.useRef(null);
  var _useDelayReset = useDelayReset(), _useDelayReset2 = _slicedToArray(_useDelayReset, 3), mockFocused = _useDelayReset2[0], setMockFocused = _useDelayReset2[1], cancelSetMockFocused = _useDelayReset2[2];
  react.exports.useImperativeHandle(ref, function() {
    var _selectorRef$current, _selectorRef$current2;
    return {
      focus: (_selectorRef$current = selectorRef.current) === null || _selectorRef$current === void 0 ? void 0 : _selectorRef$current.focus,
      blur: (_selectorRef$current2 = selectorRef.current) === null || _selectorRef$current2 === void 0 ? void 0 : _selectorRef$current2.blur,
      scrollTo: function scrollTo(arg) {
        var _listRef$current;
        return (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.scrollTo(arg);
      }
    };
  });
  var mergedSearchValue = react.exports.useMemo(function() {
    var _displayValues$;
    if (mode !== "combobox") {
      return searchValue;
    }
    var val = (_displayValues$ = displayValues[0]) === null || _displayValues$ === void 0 ? void 0 : _displayValues$.value;
    return typeof val === "string" || typeof val === "number" ? String(val) : "";
  }, [searchValue, mode, displayValues]);
  var customizeInputElement = mode === "combobox" && typeof getInputElement === "function" && getInputElement() || null;
  var customizeRawInputElement = typeof getRawInputElement === "function" && getRawInputElement();
  var customizeRawInputRef = useComposeRef(selectorDomRef, customizeRawInputElement === null || customizeRawInputElement === void 0 ? void 0 : (_customizeRawInputEle = customizeRawInputElement.props) === null || _customizeRawInputEle === void 0 ? void 0 : _customizeRawInputEle.ref);
  var _useMergedState = useMergedState(void 0, {
    defaultValue: defaultOpen,
    value: open
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), innerOpen = _useMergedState2[0], setInnerOpen = _useMergedState2[1];
  var mergedOpen = innerOpen;
  var emptyListContent = !notFoundContent && emptyOptions;
  if (disabled || emptyListContent && mergedOpen && mode === "combobox") {
    mergedOpen = false;
  }
  var triggerOpen = emptyListContent ? false : mergedOpen;
  var onToggleOpen = react.exports.useCallback(function(newOpen) {
    var nextOpen = newOpen !== void 0 ? newOpen : !mergedOpen;
    if (!disabled) {
      setInnerOpen(nextOpen);
      if (mergedOpen !== nextOpen) {
        onDropdownVisibleChange === null || onDropdownVisibleChange === void 0 ? void 0 : onDropdownVisibleChange(nextOpen);
      }
    }
  }, [disabled, mergedOpen, setInnerOpen, onDropdownVisibleChange]);
  var tokenWithEnter = react.exports.useMemo(function() {
    return (tokenSeparators || []).some(function(tokenSeparator) {
      return ["\n", "\r\n"].includes(tokenSeparator);
    });
  }, [tokenSeparators]);
  var onInternalSearch = function onInternalSearch2(searchText, fromTyping, isCompositing) {
    var ret = true;
    var newSearchText = searchText;
    onActiveValueChange === null || onActiveValueChange === void 0 ? void 0 : onActiveValueChange(null);
    var patchLabels = isCompositing ? null : getSeparatedContent(searchText, tokenSeparators);
    if (mode !== "combobox" && patchLabels) {
      newSearchText = "";
      onSearchSplit === null || onSearchSplit === void 0 ? void 0 : onSearchSplit(patchLabels);
      onToggleOpen(false);
      ret = false;
    }
    if (onSearch && mergedSearchValue !== newSearchText) {
      onSearch(newSearchText, {
        source: fromTyping ? "typing" : "effect"
      });
    }
    return ret;
  };
  var onInternalSearchSubmit = function onInternalSearchSubmit2(searchText) {
    if (!searchText || !searchText.trim()) {
      return;
    }
    onSearch(searchText, {
      source: "submit"
    });
  };
  react.exports.useEffect(function() {
    if (!mergedOpen && !multiple && mode !== "combobox") {
      onInternalSearch("", false, false);
    }
  }, [mergedOpen]);
  react.exports.useEffect(function() {
    if (innerOpen && disabled) {
      setInnerOpen(false);
    }
    if (disabled) {
      setMockFocused(false);
    }
  }, [disabled]);
  var _useLock = useLock(), _useLock2 = _slicedToArray(_useLock, 2), getClearLock = _useLock2[0], setClearLock = _useLock2[1];
  var onInternalKeyDown = function onInternalKeyDown2(event) {
    var clearLock = getClearLock();
    var which = event.which;
    if (which === KeyCode.ENTER) {
      if (mode !== "combobox") {
        event.preventDefault();
      }
      if (!mergedOpen) {
        onToggleOpen(true);
      }
    }
    setClearLock(!!mergedSearchValue);
    if (which === KeyCode.BACKSPACE && !clearLock && multiple && !mergedSearchValue && displayValues.length) {
      var cloneDisplayValues = _toConsumableArray(displayValues);
      var removedDisplayValue = null;
      for (var i = cloneDisplayValues.length - 1; i >= 0; i -= 1) {
        var current = cloneDisplayValues[i];
        if (!current.disabled) {
          cloneDisplayValues.splice(i, 1);
          removedDisplayValue = current;
          break;
        }
      }
      if (removedDisplayValue) {
        onDisplayValuesChange(cloneDisplayValues, {
          type: "remove",
          values: [removedDisplayValue]
        });
      }
    }
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    if (mergedOpen && listRef.current) {
      var _listRef$current2;
      (_listRef$current2 = listRef.current).onKeyDown.apply(_listRef$current2, [event].concat(rest));
    }
    onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown.apply(void 0, [event].concat(rest));
  };
  var onInternalKeyUp = function onInternalKeyUp2(event) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }
    if (mergedOpen && listRef.current) {
      var _listRef$current3;
      (_listRef$current3 = listRef.current).onKeyUp.apply(_listRef$current3, [event].concat(rest));
    }
    onKeyUp === null || onKeyUp === void 0 ? void 0 : onKeyUp.apply(void 0, [event].concat(rest));
  };
  var onSelectorRemove = function onSelectorRemove2(val) {
    var newValues = displayValues.filter(function(i) {
      return i !== val;
    });
    onDisplayValuesChange(newValues, {
      type: "remove",
      values: [val]
    });
  };
  var focusRef = react.exports.useRef(false);
  var onContainerFocus = function onContainerFocus2() {
    setMockFocused(true);
    if (!disabled) {
      if (onFocus && !focusRef.current) {
        onFocus.apply(void 0, arguments);
      }
      if (showAction.includes("focus")) {
        onToggleOpen(true);
      }
    }
    focusRef.current = true;
  };
  var onContainerBlur = function onContainerBlur2() {
    setMockFocused(false, function() {
      focusRef.current = false;
      onToggleOpen(false);
    });
    if (disabled) {
      return;
    }
    if (mergedSearchValue) {
      if (mode === "tags") {
        onSearch(mergedSearchValue, {
          source: "submit"
        });
      } else if (mode === "multiple") {
        onSearch("", {
          source: "blur"
        });
      }
    }
    if (onBlur) {
      onBlur.apply(void 0, arguments);
    }
  };
  var activeTimeoutIds = [];
  react.exports.useEffect(function() {
    return function() {
      activeTimeoutIds.forEach(function(timeoutId) {
        return clearTimeout(timeoutId);
      });
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    };
  }, []);
  var onInternalMouseDown = function onInternalMouseDown2(event) {
    var _triggerRef$current;
    var target = event.target;
    var popupElement = (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 ? void 0 : _triggerRef$current.getPopupElement();
    if (popupElement && popupElement.contains(target)) {
      var timeoutId = setTimeout(function() {
        var index2 = activeTimeoutIds.indexOf(timeoutId);
        if (index2 !== -1) {
          activeTimeoutIds.splice(index2, 1);
        }
        cancelSetMockFocused();
        if (!mobile && !popupElement.contains(document.activeElement)) {
          var _selectorRef$current3;
          (_selectorRef$current3 = selectorRef.current) === null || _selectorRef$current3 === void 0 ? void 0 : _selectorRef$current3.focus();
        }
      });
      activeTimeoutIds.push(timeoutId);
    }
    for (var _len3 = arguments.length, restArgs = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      restArgs[_key3 - 1] = arguments[_key3];
    }
    onMouseDown === null || onMouseDown === void 0 ? void 0 : onMouseDown.apply(void 0, [event].concat(restArgs));
  };
  var _React$useState3 = react.exports.useState(null), _React$useState4 = _slicedToArray(_React$useState3, 2), containerWidth = _React$useState4[0], setContainerWidth = _React$useState4[1];
  var _React$useState5 = react.exports.useState({}), _React$useState6 = _slicedToArray(_React$useState5, 2), forceUpdate = _React$useState6[1];
  function onPopupMouseEnter() {
    forceUpdate({});
  }
  useLayoutEffect$1(function() {
    if (triggerOpen) {
      var _containerRef$current;
      var newWidth = Math.ceil((_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.offsetWidth);
      if (containerWidth !== newWidth && !Number.isNaN(newWidth)) {
        setContainerWidth(newWidth);
      }
    }
  }, [triggerOpen]);
  var onTriggerVisibleChange;
  if (customizeRawInputElement) {
    onTriggerVisibleChange = function onTriggerVisibleChange2(newOpen) {
      onToggleOpen(newOpen);
    };
  }
  useSelectTriggerControl(function() {
    var _triggerRef$current2;
    return [containerRef.current, (_triggerRef$current2 = triggerRef.current) === null || _triggerRef$current2 === void 0 ? void 0 : _triggerRef$current2.getPopupElement()];
  }, triggerOpen, onToggleOpen, !!customizeRawInputElement);
  var baseSelectContext = react.exports.useMemo(function() {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      notFoundContent,
      open: mergedOpen,
      triggerOpen,
      id,
      showSearch: mergedShowSearch,
      multiple,
      toggleOpen: onToggleOpen
    });
  }, [props, notFoundContent, triggerOpen, mergedOpen, id, mergedShowSearch, multiple, onToggleOpen]);
  var mergedShowArrow = showArrow !== void 0 ? showArrow : loading || !multiple && mode !== "combobox";
  var arrowNode;
  if (mergedShowArrow) {
    arrowNode = /* @__PURE__ */ jsx(TransBtn, {
      className: classNames("".concat(prefixCls, "-arrow"), _defineProperty({}, "".concat(prefixCls, "-arrow-loading"), loading)),
      customizeIcon: inputIcon,
      customizeIconProps: {
        loading,
        searchValue: mergedSearchValue,
        open: mergedOpen,
        focused: mockFocused,
        showSearch: mergedShowSearch
      }
    });
  }
  var clearNode;
  var onClearMouseDown = function onClearMouseDown2() {
    var _selectorRef$current4;
    onClear === null || onClear === void 0 ? void 0 : onClear();
    (_selectorRef$current4 = selectorRef.current) === null || _selectorRef$current4 === void 0 ? void 0 : _selectorRef$current4.focus();
    onDisplayValuesChange([], {
      type: "clear",
      values: displayValues
    });
    onInternalSearch("", false, false);
  };
  if (!disabled && allowClear && (displayValues.length || mergedSearchValue) && !(mode === "combobox" && mergedSearchValue === "")) {
    clearNode = /* @__PURE__ */ jsx(TransBtn, {
      className: "".concat(prefixCls, "-clear"),
      onMouseDown: onClearMouseDown,
      customizeIcon: clearIcon,
      children: "\xD7"
    });
  }
  var optionList = /* @__PURE__ */ jsx(OptionList3, {
    ref: listRef
  });
  var mergedClassName = classNames(prefixCls, className, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-focused"), mockFocused), _defineProperty(_classNames2, "".concat(prefixCls, "-multiple"), multiple), _defineProperty(_classNames2, "".concat(prefixCls, "-single"), !multiple), _defineProperty(_classNames2, "".concat(prefixCls, "-allow-clear"), allowClear), _defineProperty(_classNames2, "".concat(prefixCls, "-show-arrow"), mergedShowArrow), _defineProperty(_classNames2, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames2, "".concat(prefixCls, "-loading"), loading), _defineProperty(_classNames2, "".concat(prefixCls, "-open"), mergedOpen), _defineProperty(_classNames2, "".concat(prefixCls, "-customize-input"), customizeInputElement), _defineProperty(_classNames2, "".concat(prefixCls, "-show-search"), mergedShowSearch), _classNames2));
  var selectorNode = /* @__PURE__ */ jsx(RefSelectTrigger, {
    ref: triggerRef,
    disabled,
    prefixCls,
    visible: triggerOpen,
    popupElement: optionList,
    containerWidth,
    animation,
    transitionName,
    dropdownStyle,
    dropdownClassName,
    direction,
    dropdownMatchSelectWidth,
    dropdownRender,
    dropdownAlign,
    placement,
    getPopupContainer,
    empty: emptyOptions,
    getTriggerDOMNode: function getTriggerDOMNode() {
      return selectorDomRef.current;
    },
    onPopupVisibleChange: onTriggerVisibleChange,
    onPopupMouseEnter,
    children: customizeRawInputElement ? /* @__PURE__ */ react.exports.cloneElement(customizeRawInputElement, {
      ref: customizeRawInputRef
    }) : /* @__PURE__ */ jsx(ForwardSelector, {
      ...props,
      domRef: selectorDomRef,
      prefixCls,
      inputElement: customizeInputElement,
      ref: selectorRef,
      id,
      showSearch: mergedShowSearch,
      autoClearSearchValue,
      mode,
      activeDescendantId,
      tagRender,
      values: displayValues,
      open: mergedOpen,
      onToggleOpen,
      activeValue,
      searchValue: mergedSearchValue,
      onSearch: onInternalSearch,
      onSearchSubmit: onInternalSearchSubmit,
      onRemove: onSelectorRemove,
      tokenWithEnter
    })
  });
  var renderNode;
  if (customizeRawInputElement) {
    renderNode = selectorNode;
  } else {
    renderNode = /* @__PURE__ */ jsxs("div", {
      className: mergedClassName,
      ...domProps,
      ref: containerRef,
      onMouseDown: onInternalMouseDown,
      onKeyDown: onInternalKeyDown,
      onKeyUp: onInternalKeyUp,
      onFocus: onContainerFocus,
      onBlur: onContainerBlur,
      children: [mockFocused && !mergedOpen && /* @__PURE__ */ jsx("span", {
        style: {
          width: 0,
          height: 0,
          position: "absolute",
          overflow: "hidden",
          opacity: 0
        },
        "aria-live": "polite",
        children: "".concat(displayValues.map(function(_ref) {
          var label = _ref.label, value = _ref.value;
          return ["number", "string"].includes(_typeof(label)) ? label : value;
        }).join(", "))
      }), selectorNode, arrowNode, clearNode]
    });
  }
  return /* @__PURE__ */ jsx(BaseSelectContext.Provider, {
    value: baseSelectContext,
    children: renderNode
  });
});
const useCache = function(labeledValues, valueOptions) {
  var cacheRef = react.exports.useRef({
    values: /* @__PURE__ */ new Map(),
    options: /* @__PURE__ */ new Map()
  });
  var filledLabeledValues = react.exports.useMemo(function() {
    var _cacheRef$current = cacheRef.current, prevValueCache = _cacheRef$current.values, prevOptionCache = _cacheRef$current.options;
    var patchedValues = labeledValues.map(function(item) {
      if (item.label === void 0) {
        var _prevValueCache$get;
        return _objectSpread2(_objectSpread2({}, item), {}, {
          label: (_prevValueCache$get = prevValueCache.get(item.value)) === null || _prevValueCache$get === void 0 ? void 0 : _prevValueCache$get.label
        });
      }
      return item;
    });
    var valueCache = /* @__PURE__ */ new Map();
    var optionCache = /* @__PURE__ */ new Map();
    patchedValues.forEach(function(item) {
      valueCache.set(item.value, item);
      optionCache.set(item.value, valueOptions.get(item.value) || prevOptionCache.get(item.value));
    });
    cacheRef.current.values = valueCache;
    cacheRef.current.options = optionCache;
    return patchedValues;
  }, [labeledValues, valueOptions]);
  var getOption = react.exports.useCallback(function(val) {
    return valueOptions.get(val) || cacheRef.current.options.get(val);
  }, [valueOptions]);
  return [filledLabeledValues, getOption];
};
function includes(test, search) {
  return toArray(test).join("").toUpperCase().includes(search);
}
const useFilterOptions = function(options, fieldNames, searchValue, filterOption, optionFilterProp) {
  return react.exports.useMemo(function() {
    if (!searchValue || filterOption === false) {
      return options;
    }
    var fieldOptions = fieldNames.options, fieldLabel = fieldNames.label, fieldValue = fieldNames.value;
    var filteredOptions = [];
    var customizeFilter = typeof filterOption === "function";
    var upperSearch = searchValue.toUpperCase();
    var filterFunc = customizeFilter ? filterOption : function(_, option) {
      if (optionFilterProp) {
        return includes(option[optionFilterProp], upperSearch);
      }
      if (option[fieldOptions]) {
        return includes(option[fieldLabel !== "children" ? fieldLabel : "label"], upperSearch);
      }
      return includes(option[fieldValue], upperSearch);
    };
    var wrapOption = customizeFilter ? function(opt) {
      return injectPropsWithOption(opt);
    } : function(opt) {
      return opt;
    };
    options.forEach(function(item) {
      if (item[fieldOptions]) {
        var matchGroup = filterFunc(searchValue, wrapOption(item));
        if (matchGroup) {
          filteredOptions.push(item);
        } else {
          var subOptions = item[fieldOptions].filter(function(subItem) {
            return filterFunc(searchValue, wrapOption(subItem));
          });
          if (subOptions.length) {
            filteredOptions.push(_objectSpread2(_objectSpread2({}, item), {}, _defineProperty({}, fieldOptions, subOptions)));
          }
        }
        return;
      }
      if (filterFunc(searchValue, wrapOption(item))) {
        filteredOptions.push(item);
      }
    });
    return filteredOptions;
  }, [options, filterOption, optionFilterProp, searchValue, fieldNames]);
};
var uuid = 0;
var isBrowserClient = canUseDom();
function getUUID() {
  var retId;
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = "TEST_OR_SSR";
  }
  return retId;
}
function useId(id) {
  var _React$useState = react.exports.useState(), _React$useState2 = _slicedToArray(_React$useState, 2), innerId = _React$useState2[0], setInnerId = _React$useState2[1];
  react.exports.useEffect(function() {
    setInnerId("rc_select_".concat(getUUID()));
  }, []);
  return id || innerId;
}
var _excluded$3 = ["children", "value"], _excluded2 = ["children"];
function convertNodeToOption(node) {
  var _ref = node, key = _ref.key, _ref$props = _ref.props, children = _ref$props.children, value = _ref$props.value, restProps = _objectWithoutProperties(_ref$props, _excluded$3);
  return _objectSpread2({
    key,
    value: value !== void 0 ? value : key,
    children
  }, restProps);
}
function convertChildrenToData(nodes) {
  var optionOnly = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  return toArray$1(nodes).map(function(node, index2) {
    if (!/* @__PURE__ */ react.exports.isValidElement(node) || !node.type) {
      return null;
    }
    var _ref2 = node, isSelectOptGroup = _ref2.type.isSelectOptGroup, key = _ref2.key, _ref2$props = _ref2.props, children = _ref2$props.children, restProps = _objectWithoutProperties(_ref2$props, _excluded2);
    if (optionOnly || !isSelectOptGroup) {
      return convertNodeToOption(node);
    }
    return _objectSpread2(_objectSpread2({
      key: "__RC_SELECT_GRP__".concat(key === null ? index2 : key, "__"),
      label: key
    }, restProps), {}, {
      options: convertChildrenToData(children)
    });
  }).filter(function(data) {
    return data;
  });
}
function useOptions(options, children, fieldNames, optionFilterProp, optionLabelProp) {
  return react.exports.useMemo(function() {
    var mergedOptions = options;
    var childrenAsData = !options;
    if (childrenAsData) {
      mergedOptions = convertChildrenToData(children);
    }
    var valueOptions = /* @__PURE__ */ new Map();
    var labelOptions = /* @__PURE__ */ new Map();
    var setLabelOptions = function setLabelOptions2(labelOptionsMap, option, key) {
      if (key && typeof key === "string") {
        labelOptionsMap.set(option[key], option);
      }
    };
    function dig(optionList) {
      var isChildren = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      for (var i = 0; i < optionList.length; i += 1) {
        var option = optionList[i];
        if (!option[fieldNames.options] || isChildren) {
          valueOptions.set(option[fieldNames.value], option);
          setLabelOptions(labelOptions, option, fieldNames.label);
          setLabelOptions(labelOptions, option, optionFilterProp);
          setLabelOptions(labelOptions, option, optionLabelProp);
        } else {
          dig(option[fieldNames.options], true);
        }
      }
    }
    dig(mergedOptions);
    return {
      options: mergedOptions,
      valueOptions,
      labelOptions
    };
  }, [options, children, fieldNames, optionFilterProp, optionLabelProp]);
}
function useRefFunc(callback) {
  var funcRef = react.exports.useRef();
  funcRef.current = callback;
  var cacheFn = react.exports.useCallback(function() {
    return funcRef.current.apply(funcRef, arguments);
  }, []);
  return cacheFn;
}
var OptGroup = function OptGroup2() {
  return null;
};
OptGroup.isSelectOptGroup = true;
var Option = function Option2() {
  return null;
};
Option.isSelectOption = true;
var Filler = /* @__PURE__ */ react.exports.forwardRef(function(_ref, ref) {
  var height = _ref.height, offset = _ref.offset, children = _ref.children, prefixCls = _ref.prefixCls, onInnerResize = _ref.onInnerResize, innerProps = _ref.innerProps;
  var outerStyle = {};
  var innerStyle = {
    display: "flex",
    flexDirection: "column"
  };
  if (offset !== void 0) {
    outerStyle = {
      height,
      position: "relative",
      overflow: "hidden"
    };
    innerStyle = _objectSpread2(_objectSpread2({}, innerStyle), {}, {
      transform: "translateY(".concat(offset, "px)"),
      position: "absolute",
      left: 0,
      right: 0,
      top: 0
    });
  }
  return /* @__PURE__ */ jsx("div", {
    style: outerStyle,
    children: /* @__PURE__ */ jsx(RefResizeObserver, {
      onResize: function onResize(_ref2) {
        var offsetHeight = _ref2.offsetHeight;
        if (offsetHeight && onInnerResize) {
          onInnerResize();
        }
      },
      children: /* @__PURE__ */ jsx("div", {
        style: innerStyle,
        className: classNames(_defineProperty({}, "".concat(prefixCls, "-holder-inner"), prefixCls)),
        ref,
        ...innerProps,
        children
      })
    })
  });
});
Filler.displayName = "Filler";
var MIN_SIZE = 20;
function getPageY(e) {
  return "touches" in e ? e.touches[0].pageY : e.pageY;
}
var ScrollBar = /* @__PURE__ */ function(_React$Component) {
  _inherits(ScrollBar2, _React$Component);
  var _super = _createSuper(ScrollBar2);
  function ScrollBar2() {
    var _this;
    _classCallCheck(this, ScrollBar2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _this.moveRaf = null;
    _this.scrollbarRef = /* @__PURE__ */ react.exports.createRef();
    _this.thumbRef = /* @__PURE__ */ react.exports.createRef();
    _this.visibleTimeout = null;
    _this.state = {
      dragging: false,
      pageY: null,
      startTop: null,
      visible: false
    };
    _this.delayHidden = function() {
      clearTimeout(_this.visibleTimeout);
      _this.setState({
        visible: true
      });
      _this.visibleTimeout = setTimeout(function() {
        _this.setState({
          visible: false
        });
      }, 2e3);
    };
    _this.onScrollbarTouchStart = function(e) {
      e.preventDefault();
    };
    _this.onContainerMouseDown = function(e) {
      e.stopPropagation();
      e.preventDefault();
    };
    _this.patchEvents = function() {
      window.addEventListener("mousemove", _this.onMouseMove);
      window.addEventListener("mouseup", _this.onMouseUp);
      _this.thumbRef.current.addEventListener("touchmove", _this.onMouseMove);
      _this.thumbRef.current.addEventListener("touchend", _this.onMouseUp);
    };
    _this.removeEvents = function() {
      var _this$scrollbarRef$cu;
      window.removeEventListener("mousemove", _this.onMouseMove);
      window.removeEventListener("mouseup", _this.onMouseUp);
      (_this$scrollbarRef$cu = _this.scrollbarRef.current) === null || _this$scrollbarRef$cu === void 0 ? void 0 : _this$scrollbarRef$cu.removeEventListener("touchstart", _this.onScrollbarTouchStart);
      if (_this.thumbRef.current) {
        _this.thumbRef.current.removeEventListener("touchstart", _this.onMouseDown);
        _this.thumbRef.current.removeEventListener("touchmove", _this.onMouseMove);
        _this.thumbRef.current.removeEventListener("touchend", _this.onMouseUp);
      }
      wrapperRaf.cancel(_this.moveRaf);
    };
    _this.onMouseDown = function(e) {
      var onStartMove = _this.props.onStartMove;
      _this.setState({
        dragging: true,
        pageY: getPageY(e),
        startTop: _this.getTop()
      });
      onStartMove();
      _this.patchEvents();
      e.stopPropagation();
      e.preventDefault();
    };
    _this.onMouseMove = function(e) {
      var _this$state = _this.state, dragging = _this$state.dragging, pageY = _this$state.pageY, startTop = _this$state.startTop;
      var onScroll = _this.props.onScroll;
      wrapperRaf.cancel(_this.moveRaf);
      if (dragging) {
        var offsetY = getPageY(e) - pageY;
        var newTop = startTop + offsetY;
        var enableScrollRange = _this.getEnableScrollRange();
        var enableHeightRange = _this.getEnableHeightRange();
        var ptg = enableHeightRange ? newTop / enableHeightRange : 0;
        var newScrollTop = Math.ceil(ptg * enableScrollRange);
        _this.moveRaf = wrapperRaf(function() {
          onScroll(newScrollTop);
        });
      }
    };
    _this.onMouseUp = function() {
      var onStopMove = _this.props.onStopMove;
      _this.setState({
        dragging: false
      });
      onStopMove();
      _this.removeEvents();
    };
    _this.getSpinHeight = function() {
      var _this$props = _this.props, height = _this$props.height, count = _this$props.count;
      var baseHeight = height / count * 10;
      baseHeight = Math.max(baseHeight, MIN_SIZE);
      baseHeight = Math.min(baseHeight, height / 2);
      return Math.floor(baseHeight);
    };
    _this.getEnableScrollRange = function() {
      var _this$props2 = _this.props, scrollHeight = _this$props2.scrollHeight, height = _this$props2.height;
      return scrollHeight - height || 0;
    };
    _this.getEnableHeightRange = function() {
      var height = _this.props.height;
      var spinHeight = _this.getSpinHeight();
      return height - spinHeight || 0;
    };
    _this.getTop = function() {
      var scrollTop = _this.props.scrollTop;
      var enableScrollRange = _this.getEnableScrollRange();
      var enableHeightRange = _this.getEnableHeightRange();
      if (scrollTop === 0 || enableScrollRange === 0) {
        return 0;
      }
      var ptg = scrollTop / enableScrollRange;
      return ptg * enableHeightRange;
    };
    _this.showScroll = function() {
      var _this$props3 = _this.props, height = _this$props3.height, scrollHeight = _this$props3.scrollHeight;
      return scrollHeight > height;
    };
    return _this;
  }
  _createClass(ScrollBar2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollbarRef.current.addEventListener("touchstart", this.onScrollbarTouchStart);
      this.thumbRef.current.addEventListener("touchstart", this.onMouseDown);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.scrollTop !== this.props.scrollTop) {
        this.delayHidden();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeEvents();
      clearTimeout(this.visibleTimeout);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state, dragging = _this$state2.dragging, visible = _this$state2.visible;
      var _this$props4 = this.props, prefixCls = _this$props4.prefixCls, direction = _this$props4.direction;
      var spinHeight = this.getSpinHeight();
      var top = this.getTop();
      var canScroll = this.showScroll();
      var mergedVisible = canScroll && visible;
      var scrollBarDirection = direction === "rtl" ? {
        left: 0
      } : {
        right: 0
      };
      return /* @__PURE__ */ jsx("div", {
        ref: this.scrollbarRef,
        className: classNames("".concat(prefixCls, "-scrollbar"), _defineProperty({}, "".concat(prefixCls, "-scrollbar-show"), canScroll)),
        style: _objectSpread2(_objectSpread2({
          width: 8,
          top: 0,
          bottom: 0
        }, scrollBarDirection), {}, {
          position: "absolute",
          display: mergedVisible ? null : "none"
        }),
        onMouseDown: this.onContainerMouseDown,
        onMouseMove: this.delayHidden,
        children: /* @__PURE__ */ jsx("div", {
          ref: this.thumbRef,
          className: classNames("".concat(prefixCls, "-scrollbar-thumb"), _defineProperty({}, "".concat(prefixCls, "-scrollbar-thumb-moving"), dragging)),
          style: {
            width: "100%",
            height: spinHeight,
            top,
            left: 0,
            position: "absolute",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: 99,
            cursor: "pointer",
            userSelect: "none"
          },
          onMouseDown: this.onMouseDown
        })
      });
    }
  }]);
  return ScrollBar2;
}(react.exports.Component);
function Item(_ref) {
  var children = _ref.children, setRef = _ref.setRef;
  var refFunc = react.exports.useCallback(function(node) {
    setRef(node);
  }, []);
  return /* @__PURE__ */ react.exports.cloneElement(children, {
    ref: refFunc
  });
}
function useChildren(list, startIndex, endIndex, setNodeRef, renderFunc, _ref) {
  var getKey2 = _ref.getKey;
  return list.slice(startIndex, endIndex + 1).map(function(item, index2) {
    var eleIndex = startIndex + index2;
    var node = renderFunc(item, eleIndex, {});
    var key = getKey2(item);
    return /* @__PURE__ */ jsx(Item, {
      setRef: function setRef(ele) {
        return setNodeRef(item, ele);
      },
      children: node
    }, key);
  });
}
var CacheMap = /* @__PURE__ */ function() {
  function CacheMap2() {
    _classCallCheck(this, CacheMap2);
    this.maps = void 0;
    this.maps = /* @__PURE__ */ Object.create(null);
  }
  _createClass(CacheMap2, [{
    key: "set",
    value: function set(key, value) {
      this.maps[key] = value;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.maps[key];
    }
  }]);
  return CacheMap2;
}();
function useHeights(getKey2, onItemAdd, onItemRemove) {
  var _React$useState = react.exports.useState(0), _React$useState2 = _slicedToArray(_React$useState, 2), updatedMark = _React$useState2[0], setUpdatedMark = _React$useState2[1];
  var instanceRef = react.exports.useRef(/* @__PURE__ */ new Map());
  var heightsRef = react.exports.useRef(new CacheMap());
  var collectRafRef = react.exports.useRef();
  function cancelRaf() {
    wrapperRaf.cancel(collectRafRef.current);
  }
  function collectHeight() {
    cancelRaf();
    collectRafRef.current = wrapperRaf(function() {
      instanceRef.current.forEach(function(element, key) {
        if (element && element.offsetParent) {
          var htmlElement = findDOMNode(element);
          var offsetHeight = htmlElement.offsetHeight;
          if (heightsRef.current.get(key) !== offsetHeight) {
            heightsRef.current.set(key, htmlElement.offsetHeight);
          }
        }
      });
      setUpdatedMark(function(c) {
        return c + 1;
      });
    });
  }
  function setInstanceRef(item, instance) {
    var key = getKey2(item);
    var origin = instanceRef.current.get(key);
    if (instance) {
      instanceRef.current.set(key, instance);
      collectHeight();
    } else {
      instanceRef.current.delete(key);
    }
    if (!origin !== !instance) {
      if (instance) {
        onItemAdd === null || onItemAdd === void 0 ? void 0 : onItemAdd(item);
      } else {
        onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(item);
      }
    }
  }
  react.exports.useEffect(function() {
    return cancelRaf;
  }, []);
  return [setInstanceRef, collectHeight, heightsRef.current, updatedMark];
}
function useScrollTo(containerRef, data, heights, itemHeight, getKey2, collectHeight, syncScrollTop, triggerFlash) {
  var scrollRef = react.exports.useRef();
  return function(arg) {
    if (arg === null || arg === void 0) {
      triggerFlash();
      return;
    }
    wrapperRaf.cancel(scrollRef.current);
    if (typeof arg === "number") {
      syncScrollTop(arg);
    } else if (arg && _typeof(arg) === "object") {
      var index2;
      var align = arg.align;
      if ("index" in arg) {
        index2 = arg.index;
      } else {
        index2 = data.findIndex(function(item) {
          return getKey2(item) === arg.key;
        });
      }
      var _arg$offset = arg.offset, offset = _arg$offset === void 0 ? 0 : _arg$offset;
      var syncScroll = function syncScroll2(times, targetAlign) {
        if (times < 0 || !containerRef.current)
          return;
        var height = containerRef.current.clientHeight;
        var needCollectHeight = false;
        var newTargetAlign = targetAlign;
        if (height) {
          var mergedAlign = targetAlign || align;
          var stackTop = 0;
          var itemTop = 0;
          var itemBottom = 0;
          var maxLen = Math.min(data.length, index2);
          for (var i = 0; i <= maxLen; i += 1) {
            var key = getKey2(data[i]);
            itemTop = stackTop;
            var cacheHeight = heights.get(key);
            itemBottom = itemTop + (cacheHeight === void 0 ? itemHeight : cacheHeight);
            stackTop = itemBottom;
            if (i === index2 && cacheHeight === void 0) {
              needCollectHeight = true;
            }
          }
          var targetTop = null;
          switch (mergedAlign) {
            case "top":
              targetTop = itemTop - offset;
              break;
            case "bottom":
              targetTop = itemBottom - height + offset;
              break;
            default: {
              var scrollTop = containerRef.current.scrollTop;
              var scrollBottom = scrollTop + height;
              if (itemTop < scrollTop) {
                newTargetAlign = "top";
              } else if (itemBottom > scrollBottom) {
                newTargetAlign = "bottom";
              }
            }
          }
          if (targetTop !== null && targetTop !== containerRef.current.scrollTop) {
            syncScrollTop(targetTop);
          }
        }
        scrollRef.current = wrapperRaf(function() {
          if (needCollectHeight) {
            collectHeight();
          }
          syncScroll2(times - 1, newTargetAlign);
        }, 2);
      };
      syncScroll(3);
    }
  };
}
function findListDiffIndex(originList, targetList, getKey2) {
  var originLen = originList.length;
  var targetLen = targetList.length;
  var shortList;
  var longList;
  if (originLen === 0 && targetLen === 0) {
    return null;
  }
  if (originLen < targetLen) {
    shortList = originList;
    longList = targetList;
  } else {
    shortList = targetList;
    longList = originList;
  }
  var notExistKey = {
    __EMPTY_ITEM__: true
  };
  function getItemKey(item) {
    if (item !== void 0) {
      return getKey2(item);
    }
    return notExistKey;
  }
  var diffIndex = null;
  var multiple = Math.abs(originLen - targetLen) !== 1;
  for (var i = 0; i < longList.length; i += 1) {
    var shortKey = getItemKey(shortList[i]);
    var longKey = getItemKey(longList[i]);
    if (shortKey !== longKey) {
      diffIndex = i;
      multiple = multiple || shortKey !== getItemKey(longList[i + 1]);
      break;
    }
  }
  return diffIndex === null ? null : {
    index: diffIndex,
    multiple
  };
}
function useDiffItem(data, getKey2, onDiff) {
  var _React$useState = react.exports.useState(data), _React$useState2 = _slicedToArray(_React$useState, 2), prevData = _React$useState2[0], setPrevData = _React$useState2[1];
  var _React$useState3 = react.exports.useState(null), _React$useState4 = _slicedToArray(_React$useState3, 2), diffItem = _React$useState4[0], setDiffItem = _React$useState4[1];
  react.exports.useEffect(function() {
    var diff = findListDiffIndex(prevData || [], data || [], getKey2);
    if ((diff === null || diff === void 0 ? void 0 : diff.index) !== void 0) {
      onDiff === null || onDiff === void 0 ? void 0 : onDiff(diff.index);
      setDiffItem(data[diff.index]);
    }
    setPrevData(data);
  }, [data]);
  return [diffItem];
}
var isFF = (typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === "object" && /Firefox/i.test(navigator.userAgent);
const useOriginScroll = function(isScrollAtTop, isScrollAtBottom) {
  var lockRef = react.exports.useRef(false);
  var lockTimeoutRef = react.exports.useRef(null);
  function lockScroll() {
    clearTimeout(lockTimeoutRef.current);
    lockRef.current = true;
    lockTimeoutRef.current = setTimeout(function() {
      lockRef.current = false;
    }, 50);
  }
  var scrollPingRef = react.exports.useRef({
    top: isScrollAtTop,
    bottom: isScrollAtBottom
  });
  scrollPingRef.current.top = isScrollAtTop;
  scrollPingRef.current.bottom = isScrollAtBottom;
  return function(deltaY) {
    var smoothOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var originScroll = deltaY < 0 && scrollPingRef.current.top || deltaY > 0 && scrollPingRef.current.bottom;
    if (smoothOffset && originScroll) {
      clearTimeout(lockTimeoutRef.current);
      lockRef.current = false;
    } else if (!originScroll || lockRef.current) {
      lockScroll();
    }
    return !lockRef.current && originScroll;
  };
};
function useFrameWheel(inVirtual, isScrollAtTop, isScrollAtBottom, onWheelDelta) {
  var offsetRef = react.exports.useRef(0);
  var nextFrameRef = react.exports.useRef(null);
  var wheelValueRef = react.exports.useRef(null);
  var isMouseScrollRef = react.exports.useRef(false);
  var originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom);
  function onWheel(event) {
    if (!inVirtual)
      return;
    wrapperRaf.cancel(nextFrameRef.current);
    var deltaY = event.deltaY;
    offsetRef.current += deltaY;
    wheelValueRef.current = deltaY;
    if (originScroll(deltaY))
      return;
    if (!isFF) {
      event.preventDefault();
    }
    nextFrameRef.current = wrapperRaf(function() {
      var patchMultiple = isMouseScrollRef.current ? 10 : 1;
      onWheelDelta(offsetRef.current * patchMultiple);
      offsetRef.current = 0;
    });
  }
  function onFireFoxScroll(event) {
    if (!inVirtual)
      return;
    isMouseScrollRef.current = event.detail === wheelValueRef.current;
  }
  return [onWheel, onFireFoxScroll];
}
var SMOOTH_PTG = 14 / 15;
function useMobileTouchMove(inVirtual, listRef, callback) {
  var touchedRef = react.exports.useRef(false);
  var touchYRef = react.exports.useRef(0);
  var elementRef = react.exports.useRef(null);
  var intervalRef = react.exports.useRef(null);
  var cleanUpEvents;
  var onTouchMove = function onTouchMove2(e) {
    if (touchedRef.current) {
      var currentY = Math.ceil(e.touches[0].pageY);
      var offsetY = touchYRef.current - currentY;
      touchYRef.current = currentY;
      if (callback(offsetY)) {
        e.preventDefault();
      }
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(function() {
        offsetY *= SMOOTH_PTG;
        if (!callback(offsetY, true) || Math.abs(offsetY) <= 0.1) {
          clearInterval(intervalRef.current);
        }
      }, 16);
    }
  };
  var onTouchEnd = function onTouchEnd2() {
    touchedRef.current = false;
    cleanUpEvents();
  };
  var onTouchStart = function onTouchStart2(e) {
    cleanUpEvents();
    if (e.touches.length === 1 && !touchedRef.current) {
      touchedRef.current = true;
      touchYRef.current = Math.ceil(e.touches[0].pageY);
      elementRef.current = e.target;
      elementRef.current.addEventListener("touchmove", onTouchMove);
      elementRef.current.addEventListener("touchend", onTouchEnd);
    }
  };
  cleanUpEvents = function cleanUpEvents2() {
    if (elementRef.current) {
      elementRef.current.removeEventListener("touchmove", onTouchMove);
      elementRef.current.removeEventListener("touchend", onTouchEnd);
    }
  };
  useLayoutEffect$1(function() {
    if (inVirtual) {
      listRef.current.addEventListener("touchstart", onTouchStart);
    }
    return function() {
      var _listRef$current;
      (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.removeEventListener("touchstart", onTouchStart);
      cleanUpEvents();
      clearInterval(intervalRef.current);
    };
  }, [inVirtual]);
}
var _excluded$2 = ["prefixCls", "className", "height", "itemHeight", "fullHeight", "style", "data", "children", "itemKey", "virtual", "direction", "component", "onScroll", "onVisibleChange", "innerProps"];
var EMPTY_DATA = [];
var ScrollStyle = {
  overflowY: "auto",
  overflowAnchor: "none"
};
function RawList(props, ref) {
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-virtual-list" : _props$prefixCls, className = props.className, height = props.height, itemHeight = props.itemHeight, _props$fullHeight = props.fullHeight, fullHeight = _props$fullHeight === void 0 ? true : _props$fullHeight, style = props.style, data = props.data, children = props.children, itemKey2 = props.itemKey, virtual = props.virtual, direction = props.direction, _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, onScroll = props.onScroll, onVisibleChange = props.onVisibleChange, innerProps = props.innerProps, restProps = _objectWithoutProperties(props, _excluded$2);
  var useVirtual = !!(virtual !== false && height && itemHeight);
  var inVirtual = useVirtual && data && itemHeight * data.length > height;
  var _useState = react.exports.useState(0), _useState2 = _slicedToArray(_useState, 2), scrollTop = _useState2[0], setScrollTop = _useState2[1];
  var _useState3 = react.exports.useState(false), _useState4 = _slicedToArray(_useState3, 2), scrollMoving = _useState4[0], setScrollMoving = _useState4[1];
  var mergedClassName = classNames(prefixCls, _defineProperty({}, "".concat(prefixCls, "-rtl"), direction === "rtl"), className);
  var mergedData = data || EMPTY_DATA;
  var componentRef = react.exports.useRef();
  var fillerInnerRef = react.exports.useRef();
  var scrollBarRef = react.exports.useRef();
  var getKey2 = react.exports.useCallback(function(item) {
    if (typeof itemKey2 === "function") {
      return itemKey2(item);
    }
    return item === null || item === void 0 ? void 0 : item[itemKey2];
  }, [itemKey2]);
  var sharedConfig = {
    getKey: getKey2
  };
  function syncScrollTop(newTop) {
    setScrollTop(function(origin) {
      var value;
      if (typeof newTop === "function") {
        value = newTop(origin);
      } else {
        value = newTop;
      }
      var alignedTop = keepInRange(value);
      componentRef.current.scrollTop = alignedTop;
      return alignedTop;
    });
  }
  var rangeRef = react.exports.useRef({
    start: 0,
    end: mergedData.length
  });
  var diffItemRef = react.exports.useRef();
  var _useDiffItem = useDiffItem(mergedData, getKey2), _useDiffItem2 = _slicedToArray(_useDiffItem, 1), diffItem = _useDiffItem2[0];
  diffItemRef.current = diffItem;
  var _useHeights = useHeights(getKey2, null, null), _useHeights2 = _slicedToArray(_useHeights, 4), setInstanceRef = _useHeights2[0], collectHeight = _useHeights2[1], heights = _useHeights2[2], heightUpdatedMark = _useHeights2[3];
  var _React$useMemo = react.exports.useMemo(function() {
    if (!useVirtual) {
      return {
        scrollHeight: void 0,
        start: 0,
        end: mergedData.length - 1,
        offset: void 0
      };
    }
    if (!inVirtual) {
      var _fillerInnerRef$curre;
      return {
        scrollHeight: ((_fillerInnerRef$curre = fillerInnerRef.current) === null || _fillerInnerRef$curre === void 0 ? void 0 : _fillerInnerRef$curre.offsetHeight) || 0,
        start: 0,
        end: mergedData.length - 1,
        offset: void 0
      };
    }
    var itemTop = 0;
    var startIndex;
    var startOffset;
    var endIndex;
    var dataLen = mergedData.length;
    for (var i = 0; i < dataLen; i += 1) {
      var item = mergedData[i];
      var key = getKey2(item);
      var cacheHeight = heights.get(key);
      var currentItemBottom = itemTop + (cacheHeight === void 0 ? itemHeight : cacheHeight);
      if (currentItemBottom >= scrollTop && startIndex === void 0) {
        startIndex = i;
        startOffset = itemTop;
      }
      if (currentItemBottom > scrollTop + height && endIndex === void 0) {
        endIndex = i;
      }
      itemTop = currentItemBottom;
    }
    if (startIndex === void 0) {
      startIndex = 0;
      startOffset = 0;
      endIndex = Math.ceil(height / itemHeight);
    }
    if (endIndex === void 0) {
      endIndex = mergedData.length - 1;
    }
    endIndex = Math.min(endIndex + 1, mergedData.length);
    return {
      scrollHeight: itemTop,
      start: startIndex,
      end: endIndex,
      offset: startOffset
    };
  }, [inVirtual, useVirtual, scrollTop, mergedData, heightUpdatedMark, height]), scrollHeight = _React$useMemo.scrollHeight, start = _React$useMemo.start, end = _React$useMemo.end, offset = _React$useMemo.offset;
  rangeRef.current.start = start;
  rangeRef.current.end = end;
  var maxScrollHeight = scrollHeight - height;
  var maxScrollHeightRef = react.exports.useRef(maxScrollHeight);
  maxScrollHeightRef.current = maxScrollHeight;
  function keepInRange(newScrollTop) {
    var newTop = newScrollTop;
    if (!Number.isNaN(maxScrollHeightRef.current)) {
      newTop = Math.min(newTop, maxScrollHeightRef.current);
    }
    newTop = Math.max(newTop, 0);
    return newTop;
  }
  var isScrollAtTop = scrollTop <= 0;
  var isScrollAtBottom = scrollTop >= maxScrollHeight;
  var originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom);
  function onScrollBar(newScrollTop) {
    var newTop = newScrollTop;
    syncScrollTop(newTop);
  }
  function onFallbackScroll(e) {
    var newScrollTop = e.currentTarget.scrollTop;
    if (newScrollTop !== scrollTop) {
      syncScrollTop(newScrollTop);
    }
    onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
  }
  var _useFrameWheel = useFrameWheel(useVirtual, isScrollAtTop, isScrollAtBottom, function(offsetY) {
    syncScrollTop(function(top) {
      var newTop = top + offsetY;
      return newTop;
    });
  }), _useFrameWheel2 = _slicedToArray(_useFrameWheel, 2), onRawWheel = _useFrameWheel2[0], onFireFoxScroll = _useFrameWheel2[1];
  useMobileTouchMove(useVirtual, componentRef, function(deltaY, smoothOffset) {
    if (originScroll(deltaY, smoothOffset)) {
      return false;
    }
    onRawWheel({
      preventDefault: function preventDefault() {
      },
      deltaY
    });
    return true;
  });
  useLayoutEffect$1(function() {
    function onMozMousePixelScroll(e) {
      if (useVirtual) {
        e.preventDefault();
      }
    }
    componentRef.current.addEventListener("wheel", onRawWheel);
    componentRef.current.addEventListener("DOMMouseScroll", onFireFoxScroll);
    componentRef.current.addEventListener("MozMousePixelScroll", onMozMousePixelScroll);
    return function() {
      if (componentRef.current) {
        componentRef.current.removeEventListener("wheel", onRawWheel);
        componentRef.current.removeEventListener("DOMMouseScroll", onFireFoxScroll);
        componentRef.current.removeEventListener("MozMousePixelScroll", onMozMousePixelScroll);
      }
    };
  }, [useVirtual]);
  var scrollTo = useScrollTo(componentRef, mergedData, heights, itemHeight, getKey2, collectHeight, syncScrollTop, function() {
    var _scrollBarRef$current;
    (_scrollBarRef$current = scrollBarRef.current) === null || _scrollBarRef$current === void 0 ? void 0 : _scrollBarRef$current.delayHidden();
  });
  react.exports.useImperativeHandle(ref, function() {
    return {
      scrollTo
    };
  });
  useLayoutEffect$1(function() {
    if (onVisibleChange) {
      var renderList = mergedData.slice(start, end + 1);
      onVisibleChange(renderList, mergedData);
    }
  }, [start, end, mergedData]);
  var listChildren = useChildren(mergedData, start, end, setInstanceRef, children, sharedConfig);
  var componentStyle = null;
  if (height) {
    componentStyle = _objectSpread2(_defineProperty({}, fullHeight ? "height" : "maxHeight", height), ScrollStyle);
    if (useVirtual) {
      componentStyle.overflowY = "hidden";
      if (scrollMoving) {
        componentStyle.pointerEvents = "none";
      }
    }
  }
  return /* @__PURE__ */ jsxs("div", {
    style: _objectSpread2(_objectSpread2({}, style), {}, {
      position: "relative"
    }),
    className: mergedClassName,
    ...restProps,
    children: [/* @__PURE__ */ jsx(Component, {
      className: "".concat(prefixCls, "-holder"),
      style: componentStyle,
      ref: componentRef,
      onScroll: onFallbackScroll,
      children: /* @__PURE__ */ jsx(Filler, {
        prefixCls,
        height: scrollHeight,
        offset,
        onInnerResize: collectHeight,
        ref: fillerInnerRef,
        innerProps,
        children: listChildren
      })
    }), useVirtual && /* @__PURE__ */ jsx(ScrollBar, {
      ref: scrollBarRef,
      prefixCls,
      scrollTop,
      height,
      scrollHeight,
      count: mergedData.length,
      direction,
      onScroll: onScrollBar,
      onStartMove: function onStartMove() {
        setScrollMoving(true);
      },
      onStopMove: function onStopMove() {
        setScrollMoving(false);
      }
    })]
  });
}
var List = /* @__PURE__ */ react.exports.forwardRef(RawList);
List.displayName = "List";
function isPlatformMac() {
  return /(mac\sos|macintosh)/i.test(navigator.appVersion);
}
var SelectContext = /* @__PURE__ */ react.exports.createContext(null);
var _excluded$1 = ["disabled", "title", "children", "style", "className"];
function isTitleType(content) {
  return typeof content === "string" || typeof content === "number";
}
var OptionList = function OptionList2(_, ref) {
  var _useBaseProps = useBaseProps(), prefixCls = _useBaseProps.prefixCls, id = _useBaseProps.id, open = _useBaseProps.open, multiple = _useBaseProps.multiple, mode = _useBaseProps.mode, searchValue = _useBaseProps.searchValue, toggleOpen = _useBaseProps.toggleOpen, notFoundContent = _useBaseProps.notFoundContent, onPopupScroll = _useBaseProps.onPopupScroll;
  var _React$useContext = react.exports.useContext(SelectContext), flattenOptions2 = _React$useContext.flattenOptions, onActiveValue = _React$useContext.onActiveValue, defaultActiveFirstOption = _React$useContext.defaultActiveFirstOption, onSelect = _React$useContext.onSelect, menuItemSelectedIcon = _React$useContext.menuItemSelectedIcon, rawValues = _React$useContext.rawValues, fieldNames = _React$useContext.fieldNames, virtual = _React$useContext.virtual, listHeight = _React$useContext.listHeight, listItemHeight = _React$useContext.listItemHeight;
  var itemPrefixCls = "".concat(prefixCls, "-item");
  var memoFlattenOptions = useMemo(function() {
    return flattenOptions2;
  }, [open, flattenOptions2], function(prev, next) {
    return next[0] && prev[1] !== next[1];
  });
  var listRef = react.exports.useRef(null);
  var onListMouseDown = function onListMouseDown2(event) {
    event.preventDefault();
  };
  var scrollIntoView = function scrollIntoView2(args) {
    if (listRef.current) {
      listRef.current.scrollTo(typeof args === "number" ? {
        index: args
      } : args);
    }
  };
  var getEnabledActiveIndex = function getEnabledActiveIndex2(index2) {
    var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    var len = memoFlattenOptions.length;
    for (var i = 0; i < len; i += 1) {
      var current = (index2 + i * offset + len) % len;
      var _memoFlattenOptions$c = memoFlattenOptions[current], group = _memoFlattenOptions$c.group, data = _memoFlattenOptions$c.data;
      if (!group && !data.disabled) {
        return current;
      }
    }
    return -1;
  };
  var _React$useState = react.exports.useState(function() {
    return getEnabledActiveIndex(0);
  }), _React$useState2 = _slicedToArray(_React$useState, 2), activeIndex = _React$useState2[0], setActiveIndex = _React$useState2[1];
  var setActive = function setActive2(index2) {
    var fromKeyboard = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    setActiveIndex(index2);
    var info = {
      source: fromKeyboard ? "keyboard" : "mouse"
    };
    var flattenItem = memoFlattenOptions[index2];
    if (!flattenItem) {
      onActiveValue(null, -1, info);
      return;
    }
    onActiveValue(flattenItem.value, index2, info);
  };
  react.exports.useEffect(function() {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [memoFlattenOptions.length, searchValue]);
  var isSelected = react.exports.useCallback(function(value) {
    return rawValues.has(value) && mode !== "combobox";
  }, [mode, _toConsumableArray(rawValues).toString(), rawValues.size]);
  react.exports.useEffect(function() {
    var timeoutId = setTimeout(function() {
      if (!multiple && open && rawValues.size === 1) {
        var value = Array.from(rawValues)[0];
        var index2 = memoFlattenOptions.findIndex(function(_ref) {
          var data = _ref.data;
          return data.value === value;
        });
        if (index2 !== -1) {
          setActive(index2);
          scrollIntoView(index2);
        }
      }
    });
    if (open) {
      var _listRef$current;
      (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.scrollTo(void 0);
    }
    return function() {
      return clearTimeout(timeoutId);
    };
  }, [open, searchValue]);
  var onSelectValue = function onSelectValue2(value) {
    if (value !== void 0) {
      onSelect(value, {
        selected: !rawValues.has(value)
      });
    }
    if (!multiple) {
      toggleOpen(false);
    }
  };
  react.exports.useImperativeHandle(ref, function() {
    return {
      onKeyDown: function onKeyDown(event) {
        var which = event.which, ctrlKey = event.ctrlKey;
        switch (which) {
          case KeyCode.N:
          case KeyCode.P:
          case KeyCode.UP:
          case KeyCode.DOWN: {
            var offset = 0;
            if (which === KeyCode.UP) {
              offset = -1;
            } else if (which === KeyCode.DOWN) {
              offset = 1;
            } else if (isPlatformMac() && ctrlKey) {
              if (which === KeyCode.N) {
                offset = 1;
              } else if (which === KeyCode.P) {
                offset = -1;
              }
            }
            if (offset !== 0) {
              var nextActiveIndex = getEnabledActiveIndex(activeIndex + offset, offset);
              scrollIntoView(nextActiveIndex);
              setActive(nextActiveIndex, true);
            }
            break;
          }
          case KeyCode.ENTER: {
            var item = memoFlattenOptions[activeIndex];
            if (item && !item.data.disabled) {
              onSelectValue(item.value);
            } else {
              onSelectValue(void 0);
            }
            if (open) {
              event.preventDefault();
            }
            break;
          }
          case KeyCode.ESC: {
            toggleOpen(false);
            if (open) {
              event.stopPropagation();
            }
          }
        }
      },
      onKeyUp: function onKeyUp() {
      },
      scrollTo: function scrollTo(index2) {
        scrollIntoView(index2);
      }
    };
  });
  if (memoFlattenOptions.length === 0) {
    return /* @__PURE__ */ jsx("div", {
      role: "listbox",
      id: "".concat(id, "_list"),
      className: "".concat(itemPrefixCls, "-empty"),
      onMouseDown: onListMouseDown,
      children: notFoundContent
    });
  }
  var omitFieldNameList = Object.keys(fieldNames).map(function(key) {
    return fieldNames[key];
  });
  var getLabel = function getLabel2(item) {
    return item.label;
  };
  var renderItem = function renderItem2(index2) {
    var item = memoFlattenOptions[index2];
    if (!item)
      return null;
    var itemData = item.data || {};
    var value = itemData.value;
    var group = item.group;
    var attrs = pickAttrs(itemData, true);
    var mergedLabel = getLabel(item);
    return item ? /* @__PURE__ */ react.exports.createElement("div", {
      "aria-label": typeof mergedLabel === "string" && !group ? mergedLabel : null,
      ...attrs,
      key: index2,
      role: group ? "presentation" : "option",
      id: "".concat(id, "_list_").concat(index2),
      "aria-selected": isSelected(value)
    }, value) : null;
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("div", {
      role: "listbox",
      id: "".concat(id, "_list"),
      style: {
        height: 0,
        width: 0,
        overflow: "hidden"
      },
      children: [renderItem(activeIndex - 1), renderItem(activeIndex), renderItem(activeIndex + 1)]
    }), /* @__PURE__ */ jsx(List, {
      itemKey: "key",
      ref: listRef,
      data: memoFlattenOptions,
      height: listHeight,
      itemHeight: listItemHeight,
      fullHeight: false,
      onMouseDown: onListMouseDown,
      onScroll: onPopupScroll,
      virtual,
      children: function(item, itemIndex) {
        var _classNames;
        var group = item.group, groupOption = item.groupOption, data = item.data, label = item.label, value = item.value;
        var key = data.key;
        if (group) {
          var _data$title;
          var groupTitle = (_data$title = data.title) !== null && _data$title !== void 0 ? _data$title : isTitleType(label) ? label.toString() : void 0;
          return /* @__PURE__ */ jsx("div", {
            className: classNames(itemPrefixCls, "".concat(itemPrefixCls, "-group")),
            title: groupTitle,
            children: label !== void 0 ? label : key
          });
        }
        var disabled = data.disabled, title = data.title;
        data.children;
        var style = data.style, className = data.className, otherProps = _objectWithoutProperties(data, _excluded$1);
        var passedProps = omit(otherProps, omitFieldNameList);
        var selected = isSelected(value);
        var optionPrefixCls = "".concat(itemPrefixCls, "-option");
        var optionClassName = classNames(itemPrefixCls, optionPrefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(optionPrefixCls, "-grouped"), groupOption), _defineProperty(_classNames, "".concat(optionPrefixCls, "-active"), activeIndex === itemIndex && !disabled), _defineProperty(_classNames, "".concat(optionPrefixCls, "-disabled"), disabled), _defineProperty(_classNames, "".concat(optionPrefixCls, "-selected"), selected), _classNames));
        var mergedLabel = getLabel(item);
        var iconVisible = !menuItemSelectedIcon || typeof menuItemSelectedIcon === "function" || selected;
        var content = typeof mergedLabel === "number" ? mergedLabel : mergedLabel || value;
        var optionTitle = isTitleType(content) ? content.toString() : void 0;
        if (title !== void 0) {
          optionTitle = title;
        }
        return /* @__PURE__ */ jsxs("div", {
          ...pickAttrs(passedProps),
          "aria-selected": selected,
          className: optionClassName,
          title: optionTitle,
          onMouseMove: function onMouseMove() {
            if (activeIndex === itemIndex || disabled) {
              return;
            }
            setActive(itemIndex);
          },
          onClick: function onClick() {
            if (!disabled) {
              onSelectValue(value);
            }
          },
          style,
          children: [/* @__PURE__ */ jsx("div", {
            className: "".concat(optionPrefixCls, "-content"),
            children: content
          }), /* @__PURE__ */ react.exports.isValidElement(menuItemSelectedIcon) || selected, iconVisible && /* @__PURE__ */ jsx(TransBtn, {
            className: "".concat(itemPrefixCls, "-option-state"),
            customizeIcon: menuItemSelectedIcon,
            customizeIconProps: {
              isSelected: selected
            },
            children: selected ? "\u2713" : null
          })]
        });
      }
    })]
  });
};
var RefOptionList = /* @__PURE__ */ react.exports.forwardRef(OptionList);
RefOptionList.displayName = "OptionList";
var _excluded = ["id", "mode", "prefixCls", "backfill", "fieldNames", "inputValue", "searchValue", "onSearch", "autoClearSearchValue", "onSelect", "onDeselect", "dropdownMatchSelectWidth", "filterOption", "filterSort", "optionFilterProp", "optionLabelProp", "options", "children", "defaultActiveFirstOption", "menuItemSelectedIcon", "virtual", "listHeight", "listItemHeight", "value", "defaultValue", "labelInValue", "onChange"];
var OMIT_DOM_PROPS = ["inputValue"];
function isRawValue(value) {
  return !value || _typeof(value) !== "object";
}
var Select$2 = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var id = props.id, mode = props.mode, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-select" : _props$prefixCls, backfill = props.backfill, fieldNames = props.fieldNames, inputValue = props.inputValue, searchValue = props.searchValue, onSearch = props.onSearch, _props$autoClearSearc = props.autoClearSearchValue, autoClearSearchValue = _props$autoClearSearc === void 0 ? true : _props$autoClearSearc, onSelect = props.onSelect, onDeselect = props.onDeselect, _props$dropdownMatchS = props.dropdownMatchSelectWidth, dropdownMatchSelectWidth = _props$dropdownMatchS === void 0 ? true : _props$dropdownMatchS, filterOption = props.filterOption, filterSort = props.filterSort, optionFilterProp = props.optionFilterProp, optionLabelProp = props.optionLabelProp, options = props.options, children = props.children, defaultActiveFirstOption = props.defaultActiveFirstOption, menuItemSelectedIcon = props.menuItemSelectedIcon, virtual = props.virtual, _props$listHeight = props.listHeight, listHeight = _props$listHeight === void 0 ? 200 : _props$listHeight, _props$listItemHeight = props.listItemHeight, listItemHeight = _props$listItemHeight === void 0 ? 20 : _props$listItemHeight, value = props.value, defaultValue = props.defaultValue, labelInValue = props.labelInValue, onChange = props.onChange, restProps = _objectWithoutProperties(props, _excluded);
  var mergedId = useId(id);
  var multiple = isMultiple(mode);
  var childrenAsData = !!(!options && children);
  var mergedFilterOption = react.exports.useMemo(function() {
    if (filterOption === void 0 && mode === "combobox") {
      return false;
    }
    return filterOption;
  }, [filterOption, mode]);
  var mergedFieldNames = react.exports.useMemo(
    function() {
      return fillFieldNames(fieldNames, childrenAsData);
    },
    [
      JSON.stringify(fieldNames),
      childrenAsData
    ]
  );
  var _useMergedState = useMergedState("", {
    value: searchValue !== void 0 ? searchValue : inputValue,
    postState: function postState(search) {
      return search || "";
    }
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedSearchValue = _useMergedState2[0], setSearchValue = _useMergedState2[1];
  var parsedOptions = useOptions(options, children, mergedFieldNames, optionFilterProp, optionLabelProp);
  var valueOptions = parsedOptions.valueOptions, labelOptions = parsedOptions.labelOptions, mergedOptions = parsedOptions.options;
  var convert2LabelValues = react.exports.useCallback(function(draftValues) {
    var valueList = toArray(draftValues);
    return valueList.map(function(val) {
      var rawValue;
      var rawLabel;
      var rawKey;
      var rawDisabled;
      var rawTitle;
      if (isRawValue(val)) {
        rawValue = val;
      } else {
        var _val$value;
        rawKey = val.key;
        rawLabel = val.label;
        rawValue = (_val$value = val.value) !== null && _val$value !== void 0 ? _val$value : rawKey;
      }
      var option = valueOptions.get(rawValue);
      if (option) {
        var _option$key;
        if (rawLabel === void 0)
          rawLabel = option === null || option === void 0 ? void 0 : option[optionLabelProp || mergedFieldNames.label];
        if (rawKey === void 0)
          rawKey = (_option$key = option === null || option === void 0 ? void 0 : option.key) !== null && _option$key !== void 0 ? _option$key : rawValue;
        rawDisabled = option === null || option === void 0 ? void 0 : option.disabled;
        rawTitle = option === null || option === void 0 ? void 0 : option.title;
      }
      return {
        label: rawLabel,
        value: rawValue,
        key: rawKey,
        disabled: rawDisabled,
        title: rawTitle
      };
    });
  }, [mergedFieldNames, optionLabelProp, valueOptions]);
  var _useMergedState3 = useMergedState(defaultValue, {
    value
  }), _useMergedState4 = _slicedToArray(_useMergedState3, 2), internalValue = _useMergedState4[0], setInternalValue = _useMergedState4[1];
  var rawLabeledValues = react.exports.useMemo(function() {
    var _values$;
    var values = convert2LabelValues(internalValue);
    if (mode === "combobox" && !((_values$ = values[0]) !== null && _values$ !== void 0 && _values$.value)) {
      return [];
    }
    return values;
  }, [internalValue, convert2LabelValues, mode]);
  var _useCache = useCache(rawLabeledValues, valueOptions), _useCache2 = _slicedToArray(_useCache, 2), mergedValues = _useCache2[0], getMixedOption = _useCache2[1];
  var displayValues = react.exports.useMemo(function() {
    if (!mode && mergedValues.length === 1) {
      var firstValue = mergedValues[0];
      if (firstValue.value === null && (firstValue.label === null || firstValue.label === void 0)) {
        return [];
      }
    }
    return mergedValues.map(function(item) {
      var _item$label;
      return _objectSpread2(_objectSpread2({}, item), {}, {
        label: (_item$label = item.label) !== null && _item$label !== void 0 ? _item$label : item.value
      });
    });
  }, [mode, mergedValues]);
  var rawValues = react.exports.useMemo(function() {
    return new Set(mergedValues.map(function(val) {
      return val.value;
    }));
  }, [mergedValues]);
  react.exports.useEffect(function() {
    if (mode === "combobox") {
      var _mergedValues$;
      var strValue = (_mergedValues$ = mergedValues[0]) === null || _mergedValues$ === void 0 ? void 0 : _mergedValues$.value;
      setSearchValue(hasValue(strValue) ? String(strValue) : "");
    }
  }, [mergedValues]);
  var createTagOption = useRefFunc(function(val, label) {
    var _ref;
    var mergedLabel = label !== null && label !== void 0 ? label : val;
    return _ref = {}, _defineProperty(_ref, mergedFieldNames.value, val), _defineProperty(_ref, mergedFieldNames.label, mergedLabel), _ref;
  });
  var filledTagOptions = react.exports.useMemo(function() {
    if (mode !== "tags") {
      return mergedOptions;
    }
    var cloneOptions = _toConsumableArray(mergedOptions);
    var existOptions = function existOptions2(val) {
      return valueOptions.has(val);
    };
    _toConsumableArray(mergedValues).sort(function(a, b) {
      return a.value < b.value ? -1 : 1;
    }).forEach(function(item) {
      var val = item.value;
      if (!existOptions(val)) {
        cloneOptions.push(createTagOption(val, item.label));
      }
    });
    return cloneOptions;
  }, [createTagOption, mergedOptions, valueOptions, mergedValues, mode]);
  var filteredOptions = useFilterOptions(filledTagOptions, mergedFieldNames, mergedSearchValue, mergedFilterOption, optionFilterProp);
  var filledSearchOptions = react.exports.useMemo(function() {
    if (mode !== "tags" || !mergedSearchValue || filteredOptions.some(function(item) {
      return item[optionFilterProp || "value"] === mergedSearchValue;
    })) {
      return filteredOptions;
    }
    return [createTagOption(mergedSearchValue)].concat(_toConsumableArray(filteredOptions));
  }, [createTagOption, optionFilterProp, mode, filteredOptions, mergedSearchValue]);
  var orderedFilteredOptions = react.exports.useMemo(function() {
    if (!filterSort) {
      return filledSearchOptions;
    }
    return _toConsumableArray(filledSearchOptions).sort(function(a, b) {
      return filterSort(a, b);
    });
  }, [filledSearchOptions, filterSort]);
  var displayOptions = react.exports.useMemo(function() {
    return flattenOptions(orderedFilteredOptions, {
      fieldNames: mergedFieldNames,
      childrenAsData
    });
  }, [orderedFilteredOptions, mergedFieldNames, childrenAsData]);
  var triggerChange = function triggerChange2(values) {
    var labeledValues = convert2LabelValues(values);
    setInternalValue(labeledValues);
    if (onChange && (labeledValues.length !== mergedValues.length || labeledValues.some(function(newVal, index2) {
      var _mergedValues$index;
      return ((_mergedValues$index = mergedValues[index2]) === null || _mergedValues$index === void 0 ? void 0 : _mergedValues$index.value) !== (newVal === null || newVal === void 0 ? void 0 : newVal.value);
    }))) {
      var returnValues = labelInValue ? labeledValues : labeledValues.map(function(v) {
        return v.value;
      });
      var returnOptions = labeledValues.map(function(v) {
        return injectPropsWithOption(getMixedOption(v.value));
      });
      onChange(
        multiple ? returnValues : returnValues[0],
        multiple ? returnOptions : returnOptions[0]
      );
    }
  };
  var _React$useState = react.exports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), activeValue = _React$useState2[0], setActiveValue = _React$useState2[1];
  var _React$useState3 = react.exports.useState(0), _React$useState4 = _slicedToArray(_React$useState3, 2), accessibilityIndex = _React$useState4[0], setAccessibilityIndex = _React$useState4[1];
  var mergedDefaultActiveFirstOption = defaultActiveFirstOption !== void 0 ? defaultActiveFirstOption : mode !== "combobox";
  var onActiveValue = react.exports.useCallback(function(active, index2) {
    var _ref2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, _ref2$source = _ref2.source, source = _ref2$source === void 0 ? "keyboard" : _ref2$source;
    setAccessibilityIndex(index2);
    if (backfill && mode === "combobox" && active !== null && source === "keyboard") {
      setActiveValue(String(active));
    }
  }, [backfill, mode]);
  var triggerSelect = function triggerSelect2(val, selected, type) {
    var getSelectEnt = function getSelectEnt2() {
      var _option$key2;
      var option = getMixedOption(val);
      return [labelInValue ? {
        label: option === null || option === void 0 ? void 0 : option[mergedFieldNames.label],
        value: val,
        key: (_option$key2 = option === null || option === void 0 ? void 0 : option.key) !== null && _option$key2 !== void 0 ? _option$key2 : val
      } : val, injectPropsWithOption(option)];
    };
    if (selected && onSelect) {
      var _getSelectEnt = getSelectEnt(), _getSelectEnt2 = _slicedToArray(_getSelectEnt, 2), wrappedValue = _getSelectEnt2[0], _option = _getSelectEnt2[1];
      onSelect(wrappedValue, _option);
    } else if (!selected && onDeselect && type !== "clear") {
      var _getSelectEnt3 = getSelectEnt(), _getSelectEnt4 = _slicedToArray(_getSelectEnt3, 2), _wrappedValue = _getSelectEnt4[0], _option2 = _getSelectEnt4[1];
      onDeselect(_wrappedValue, _option2);
    }
  };
  var onInternalSelect = useRefFunc(function(val, info) {
    var cloneValues;
    var mergedSelect = multiple ? info.selected : true;
    if (mergedSelect) {
      cloneValues = multiple ? [].concat(_toConsumableArray(mergedValues), [val]) : [val];
    } else {
      cloneValues = mergedValues.filter(function(v) {
        return v.value !== val;
      });
    }
    triggerChange(cloneValues);
    triggerSelect(val, mergedSelect);
    if (mode === "combobox") {
      setActiveValue("");
    } else if (!isMultiple || autoClearSearchValue) {
      setSearchValue("");
      setActiveValue("");
    }
  });
  var onDisplayValuesChange = function onDisplayValuesChange2(nextValues, info) {
    triggerChange(nextValues);
    var type = info.type, values = info.values;
    if (type === "remove" || type === "clear") {
      values.forEach(function(item) {
        triggerSelect(item.value, false, type);
      });
    }
  };
  var onInternalSearch = function onInternalSearch2(searchText, info) {
    setSearchValue(searchText);
    setActiveValue(null);
    if (info.source === "submit") {
      var formatted = (searchText || "").trim();
      if (formatted) {
        var newRawValues = Array.from(new Set([].concat(_toConsumableArray(rawValues), [formatted])));
        triggerChange(newRawValues);
        triggerSelect(formatted, true);
        setSearchValue("");
      }
      return;
    }
    if (info.source !== "blur") {
      if (mode === "combobox") {
        triggerChange(searchText);
      }
      onSearch === null || onSearch === void 0 ? void 0 : onSearch(searchText);
    }
  };
  var onInternalSearchSplit = function onInternalSearchSplit2(words) {
    var patchValues = words;
    if (mode !== "tags") {
      patchValues = words.map(function(word) {
        var opt = labelOptions.get(word);
        return opt === null || opt === void 0 ? void 0 : opt.value;
      }).filter(function(val) {
        return val !== void 0;
      });
    }
    var newRawValues = Array.from(new Set([].concat(_toConsumableArray(rawValues), _toConsumableArray(patchValues))));
    triggerChange(newRawValues);
    newRawValues.forEach(function(newRawValue) {
      triggerSelect(newRawValue, true);
    });
  };
  var selectContext = react.exports.useMemo(function() {
    var realVirtual = virtual !== false && dropdownMatchSelectWidth !== false;
    return _objectSpread2(_objectSpread2({}, parsedOptions), {}, {
      flattenOptions: displayOptions,
      onActiveValue,
      defaultActiveFirstOption: mergedDefaultActiveFirstOption,
      onSelect: onInternalSelect,
      menuItemSelectedIcon,
      rawValues,
      fieldNames: mergedFieldNames,
      virtual: realVirtual,
      listHeight,
      listItemHeight,
      childrenAsData
    });
  }, [parsedOptions, displayOptions, onActiveValue, mergedDefaultActiveFirstOption, onInternalSelect, menuItemSelectedIcon, rawValues, mergedFieldNames, virtual, dropdownMatchSelectWidth, listHeight, listItemHeight, childrenAsData]);
  return /* @__PURE__ */ jsx(SelectContext.Provider, {
    value: selectContext,
    children: /* @__PURE__ */ jsx(BaseSelect, {
      ...restProps,
      id: mergedId,
      prefixCls,
      ref,
      omitDomProps: OMIT_DOM_PROPS,
      mode,
      displayValues,
      onDisplayValuesChange,
      searchValue: mergedSearchValue,
      onSearch: onInternalSearch,
      autoClearSearchValue,
      onSearchSplit: onInternalSearchSplit,
      dropdownMatchSelectWidth,
      OptionList: RefOptionList,
      emptyOptions: !displayOptions.length,
      activeValue,
      activeDescendantId: "".concat(mergedId, "_list_").concat(accessibilityIndex)
    })
  });
});
var TypedSelect = Select$2;
TypedSelect.Option = Option;
TypedSelect.OptGroup = OptGroup;
var Empty$2 = function Empty() {
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls;
  var prefixCls = getPrefixCls("empty-img-default");
  return /* @__PURE__ */ jsx("svg", {
    className: prefixCls,
    width: "184",
    height: "152",
    viewBox: "0 0 184 152",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxs("g", {
      fill: "none",
      fillRule: "evenodd",
      children: [/* @__PURE__ */ jsxs("g", {
        transform: "translate(24 31.67)",
        children: [/* @__PURE__ */ jsx("ellipse", {
          className: "".concat(prefixCls, "-ellipse"),
          cx: "67.797",
          cy: "106.89",
          rx: "67.797",
          ry: "12.668"
        }), /* @__PURE__ */ jsx("path", {
          className: "".concat(prefixCls, "-path-1"),
          d: "M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
        }), /* @__PURE__ */ jsx("path", {
          className: "".concat(prefixCls, "-path-2"),
          d: "M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z",
          transform: "translate(13.56)"
        }), /* @__PURE__ */ jsx("path", {
          className: "".concat(prefixCls, "-path-3"),
          d: "M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
        }), /* @__PURE__ */ jsx("path", {
          className: "".concat(prefixCls, "-path-4"),
          d: "M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
        })]
      }), /* @__PURE__ */ jsx("path", {
        className: "".concat(prefixCls, "-path-5"),
        d: "M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
      }), /* @__PURE__ */ jsxs("g", {
        className: "".concat(prefixCls, "-g"),
        transform: "translate(149.65 15.383)",
        children: [/* @__PURE__ */ jsx("ellipse", {
          cx: "20.654",
          cy: "3.167",
          rx: "2.849",
          ry: "2.815"
        }), /* @__PURE__ */ jsx("path", {
          d: "M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"
        })]
      })]
    })
  });
};
const DefaultEmptyImg = Empty$2;
var Simple = function Simple2() {
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls;
  var prefixCls = getPrefixCls("empty-img-simple");
  return /* @__PURE__ */ jsx("svg", {
    className: prefixCls,
    width: "64",
    height: "41",
    viewBox: "0 0 64 41",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxs("g", {
      transform: "translate(0 1)",
      fill: "none",
      fillRule: "evenodd",
      children: [/* @__PURE__ */ jsx("ellipse", {
        className: "".concat(prefixCls, "-ellipse"),
        cx: "32",
        cy: "33",
        rx: "32",
        ry: "7"
      }), /* @__PURE__ */ jsxs("g", {
        className: "".concat(prefixCls, "-g"),
        fillRule: "nonzero",
        children: [/* @__PURE__ */ jsx("path", {
          d: "M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
        }), /* @__PURE__ */ jsx("path", {
          d: "M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z",
          className: "".concat(prefixCls, "-path")
        })]
      })]
    })
  });
};
const SimpleEmptyImg = Simple;
var __rest$2 = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var defaultEmptyImg = /* @__PURE__ */ jsx(DefaultEmptyImg, {});
var simpleEmptyImg = /* @__PURE__ */ jsx(SimpleEmptyImg, {});
var Empty2 = function Empty3(_a) {
  var className = _a.className, customizePrefixCls = _a.prefixCls, _a$image = _a.image, image = _a$image === void 0 ? defaultEmptyImg : _a$image, description = _a.description, children = _a.children, imageStyle = _a.imageStyle, restProps = __rest$2(_a, ["className", "prefixCls", "image", "description", "children", "imageStyle"]);
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction;
  return /* @__PURE__ */ jsx(LocaleReceiver, {
    componentName: "Empty",
    children: function(contextLocale) {
      var _classNames;
      var prefixCls = getPrefixCls("empty", customizePrefixCls);
      var des = typeof description !== "undefined" ? description : contextLocale.description;
      var alt = typeof des === "string" ? des : "empty";
      var imageNode = null;
      if (typeof image === "string") {
        imageNode = /* @__PURE__ */ jsx("img", {
          alt,
          src: image
        });
      } else {
        imageNode = image;
      }
      return /* @__PURE__ */ jsxs("div", {
        className: classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-normal"), image === simpleEmptyImg), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === "rtl"), _classNames), className),
        ...restProps,
        children: [/* @__PURE__ */ jsx("div", {
          className: "".concat(prefixCls, "-image"),
          style: imageStyle,
          children: imageNode
        }), des && /* @__PURE__ */ jsx("div", {
          className: "".concat(prefixCls, "-description"),
          children: des
        }), children && /* @__PURE__ */ jsx("div", {
          className: "".concat(prefixCls, "-footer"),
          children
        })]
      });
    }
  });
};
Empty2.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty2.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;
const Empty$1 = Empty2;
var defaultRenderEmpty = function defaultRenderEmpty2(componentName) {
  return /* @__PURE__ */ jsx(ConfigConsumer, {
    children: function(_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var prefix = getPrefixCls("empty");
      switch (componentName) {
        case "Table":
        case "List":
          return /* @__PURE__ */ jsx(Empty$1, {
            image: Empty$1.PRESENTED_IMAGE_SIMPLE
          });
        case "Select":
        case "TreeSelect":
        case "Cascader":
        case "Transfer":
        case "Mentions":
          return /* @__PURE__ */ jsx(Empty$1, {
            image: Empty$1.PRESENTED_IMAGE_SIMPLE,
            className: "".concat(prefix, "-small")
          });
        default:
          return /* @__PURE__ */ jsx(Empty$1, {});
      }
    }
  });
};
const defaultRenderEmpty$1 = defaultRenderEmpty;
var CheckOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" } }] }, "name": "check", "theme": "outlined" };
const CheckOutlinedSvg = CheckOutlined$2;
var CheckOutlined = function CheckOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: CheckOutlinedSvg
    })
  });
};
CheckOutlined.displayName = "CheckOutlined";
const CheckOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(CheckOutlined);
function getIcons(_ref) {
  var suffixIcon = _ref.suffixIcon, clearIcon = _ref.clearIcon, menuItemSelectedIcon = _ref.menuItemSelectedIcon, removeIcon = _ref.removeIcon, loading = _ref.loading, multiple = _ref.multiple, hasFeedback = _ref.hasFeedback, prefixCls = _ref.prefixCls, showArrow = _ref.showArrow, feedbackIcon = _ref.feedbackIcon;
  var mergedClearIcon = clearIcon !== null && clearIcon !== void 0 ? clearIcon : /* @__PURE__ */ jsx(CloseCircleFilled, {});
  var getSuffixIconNode = function getSuffixIconNode2(arrowIcon) {
    return /* @__PURE__ */ jsxs(Fragment, {
      children: [showArrow !== false && arrowIcon, hasFeedback && feedbackIcon]
    });
  };
  var mergedSuffixIcon = null;
  if (suffixIcon !== void 0) {
    mergedSuffixIcon = getSuffixIconNode(suffixIcon);
  } else if (loading) {
    mergedSuffixIcon = getSuffixIconNode(
      /* @__PURE__ */ jsx(LoadingOutlined, {
        spin: true
      })
    );
  } else {
    var iconCls = "".concat(prefixCls, "-suffix");
    mergedSuffixIcon = function mergedSuffixIcon2(_ref2) {
      var open = _ref2.open, showSearch = _ref2.showSearch;
      if (open && showSearch) {
        return getSuffixIconNode(
          /* @__PURE__ */ jsx(SearchOutlined, {
            className: iconCls
          })
        );
      }
      return getSuffixIconNode(
        /* @__PURE__ */ jsx(DownOutlined, {
          className: iconCls
        })
      );
    };
  }
  var mergedItemIcon = null;
  if (menuItemSelectedIcon !== void 0) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = /* @__PURE__ */ jsx(CheckOutlined$1, {});
  } else {
    mergedItemIcon = null;
  }
  var mergedRemoveIcon = null;
  if (removeIcon !== void 0) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = /* @__PURE__ */ jsx(CloseOutlined, {});
  }
  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon
  };
}
var __rest$1 = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var SECRET_COMBOBOX_MODE_DO_NOT_USE = "SECRET_COMBOBOX_MODE_DO_NOT_USE";
var InternalSelect = function InternalSelect2(_a, ref) {
  var _classNames2;
  var customizePrefixCls = _a.prefixCls, _a$bordered = _a.bordered, bordered = _a$bordered === void 0 ? true : _a$bordered, className = _a.className, getPopupContainer = _a.getPopupContainer, dropdownClassName = _a.dropdownClassName, popupClassName = _a.popupClassName, _a$listHeight = _a.listHeight, listHeight = _a$listHeight === void 0 ? 256 : _a$listHeight, placement = _a.placement, _a$listItemHeight = _a.listItemHeight, listItemHeight = _a$listItemHeight === void 0 ? 24 : _a$listItemHeight, customizeSize = _a.size, customDisabled = _a.disabled, notFoundContent = _a.notFoundContent, customStatus = _a.status, showArrow = _a.showArrow, props = __rest$1(_a, ["prefixCls", "bordered", "className", "getPopupContainer", "dropdownClassName", "popupClassName", "listHeight", "placement", "listItemHeight", "size", "disabled", "notFoundContent", "status", "showArrow"]);
  var _React$useContext = react.exports.useContext(ConfigContext), getContextPopupContainer = _React$useContext.getPopupContainer, getPrefixCls = _React$useContext.getPrefixCls, renderEmpty = _React$useContext.renderEmpty, direction = _React$useContext.direction, virtual = _React$useContext.virtual, dropdownMatchSelectWidth = _React$useContext.dropdownMatchSelectWidth;
  var size = react.exports.useContext(SizeContext);
  var prefixCls = getPrefixCls("select", customizePrefixCls);
  var rootPrefixCls = getPrefixCls();
  var _useCompactItemContex = useCompactItemContext(prefixCls, direction), compactSize = _useCompactItemContex.compactSize, compactItemClassnames = _useCompactItemContex.compactItemClassnames;
  var mode = react.exports.useMemo(function() {
    var m = props.mode;
    if (m === "combobox") {
      return void 0;
    }
    if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
      return "combobox";
    }
    return m;
  }, [props.mode]);
  var isMultiple2 = mode === "multiple" || mode === "tags";
  var mergedShowArrow = showArrow !== void 0 ? showArrow : props.loading || !(isMultiple2 || mode === "combobox");
  var _useContext = react.exports.useContext(FormItemInputContext), contextStatus = _useContext.status, hasFeedback = _useContext.hasFeedback, isFormItemInput = _useContext.isFormItemInput, feedbackIcon = _useContext.feedbackIcon;
  var mergedStatus = getMergedStatus(contextStatus, customStatus);
  var mergedNotFound;
  if (notFoundContent !== void 0) {
    mergedNotFound = notFoundContent;
  } else if (mode === "combobox") {
    mergedNotFound = null;
  } else {
    mergedNotFound = (renderEmpty || defaultRenderEmpty$1)("Select");
  }
  var _getIcons = getIcons(_extends(_extends({}, props), {
    multiple: isMultiple2,
    hasFeedback,
    feedbackIcon,
    showArrow: mergedShowArrow,
    prefixCls
  })), suffixIcon = _getIcons.suffixIcon, itemIcon = _getIcons.itemIcon, removeIcon = _getIcons.removeIcon, clearIcon = _getIcons.clearIcon;
  var selectProps = omit(props, ["suffixIcon", "itemIcon"]);
  var rcSelectRtlDropdownClassName = classNames(popupClassName || dropdownClassName, _defineProperty({}, "".concat(prefixCls, "-dropdown-").concat(direction), direction === "rtl"));
  var mergedSize = compactSize || customizeSize || size;
  var disabled = react.exports.useContext(DisabledContext);
  var mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  var mergedClassName = classNames((_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-lg"), mergedSize === "large"), _defineProperty(_classNames2, "".concat(prefixCls, "-sm"), mergedSize === "small"), _defineProperty(_classNames2, "".concat(prefixCls, "-rtl"), direction === "rtl"), _defineProperty(_classNames2, "".concat(prefixCls, "-borderless"), !bordered), _defineProperty(_classNames2, "".concat(prefixCls, "-in-form-item"), isFormItemInput), _classNames2), getStatusClassNames(prefixCls, mergedStatus, hasFeedback), compactItemClassnames, className);
  var getPlacement = function getPlacement2() {
    if (placement !== void 0) {
      return placement;
    }
    return direction === "rtl" ? "bottomRight" : "bottomLeft";
  };
  return /* @__PURE__ */ jsx(TypedSelect, {
    ref,
    virtual,
    dropdownMatchSelectWidth,
    ...selectProps,
    transitionName: getTransitionName(rootPrefixCls, getTransitionDirection(placement), props.transitionName),
    listHeight,
    listItemHeight,
    mode,
    prefixCls,
    placement: getPlacement(),
    direction,
    inputIcon: suffixIcon,
    menuItemSelectedIcon: itemIcon,
    removeIcon,
    clearIcon,
    notFoundContent: mergedNotFound,
    className: mergedClassName,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
    dropdownClassName: rcSelectRtlDropdownClassName,
    showArrow: hasFeedback || showArrow,
    disabled: mergedDisabled
  });
};
var Select = /* @__PURE__ */ react.exports.forwardRef(InternalSelect);
Select.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
Select.Option = Option;
Select.OptGroup = OptGroup;
const Select$1 = Select;
function useForceUpdate() {
  var _React$useReducer = react.exports.useReducer(function(x) {
    return x + 1;
  }, 0), _React$useReducer2 = _slicedToArray(_React$useReducer, 2), forceUpdate = _React$useReducer2[1];
  return forceUpdate;
}
var responsiveMap = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)"
};
var subscribers = /* @__PURE__ */ new Map();
var subUid = -1;
var screens = {};
var responsiveObserve = {
  matchHandlers: {},
  dispatch: function dispatch(pointMap) {
    screens = pointMap;
    subscribers.forEach(function(func) {
      return func(screens);
    });
    return subscribers.size >= 1;
  },
  subscribe: function subscribe(func) {
    if (!subscribers.size)
      this.register();
    subUid += 1;
    subscribers.set(subUid, func);
    func(screens);
    return subUid;
  },
  unsubscribe: function unsubscribe(token) {
    subscribers["delete"](token);
    if (!subscribers.size)
      this.unregister();
  },
  unregister: function unregister() {
    var _this = this;
    Object.keys(responsiveMap).forEach(function(screen) {
      var matchMediaQuery = responsiveMap[screen];
      var handler = _this.matchHandlers[matchMediaQuery];
      handler === null || handler === void 0 ? void 0 : handler.mql.removeListener(handler === null || handler === void 0 ? void 0 : handler.listener);
    });
    subscribers.clear();
  },
  register: function register() {
    var _this2 = this;
    Object.keys(responsiveMap).forEach(function(screen) {
      var matchMediaQuery = responsiveMap[screen];
      var listener = function listener2(_ref) {
        var matches = _ref.matches;
        _this2.dispatch(_extends(_extends({}, screens), _defineProperty({}, screen, matches)));
      };
      var mql = window.matchMedia(matchMediaQuery);
      mql.addListener(listener);
      _this2.matchHandlers[matchMediaQuery] = {
        mql,
        listener
      };
      listener(mql);
    });
  }
};
const ResponsiveObserve = responsiveObserve;
function useBreakpoint() {
  var refreshOnChange = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
  var screensRef = react.exports.useRef({});
  var forceUpdate = useForceUpdate();
  react.exports.useEffect(function() {
    var token = ResponsiveObserve.subscribe(function(supportScreens) {
      screensRef.current = supportScreens;
      if (refreshOnChange) {
        forceUpdate();
      }
    });
    return function() {
      return ResponsiveObserve.unsubscribe(token);
    };
  }, []);
  return screensRef.current;
}
var LeftOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" } }] }, "name": "left", "theme": "outlined" };
const LeftOutlinedSvg = LeftOutlined$2;
var LeftOutlined = function LeftOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: LeftOutlinedSvg
    })
  });
};
LeftOutlined.displayName = "LeftOutlined";
const LeftOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(LeftOutlined);
var RightOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" } }] }, "name": "right", "theme": "outlined" };
const RightOutlinedSvg = RightOutlined$2;
var RightOutlined = function RightOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: RightOutlinedSvg
    })
  });
};
RightOutlined.displayName = "RightOutlined";
const RightOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(RightOutlined);
var DoubleLeftOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z" } }] }, "name": "double-left", "theme": "outlined" };
const DoubleLeftOutlinedSvg = DoubleLeftOutlined$2;
var DoubleLeftOutlined = function DoubleLeftOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: DoubleLeftOutlinedSvg
    })
  });
};
DoubleLeftOutlined.displayName = "DoubleLeftOutlined";
const DoubleLeftOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(DoubleLeftOutlined);
var DoubleRightOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z" } }] }, "name": "double-right", "theme": "outlined" };
const DoubleRightOutlinedSvg = DoubleRightOutlined$2;
var DoubleRightOutlined = function DoubleRightOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: DoubleRightOutlinedSvg
    })
  });
};
DoubleRightOutlined.displayName = "DoubleRightOutlined";
const DoubleRightOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(DoubleRightOutlined);
var Pager = function Pager2(props) {
  var _classNames;
  var prefixCls = "".concat(props.rootPrefixCls, "-item");
  var cls = classNames(prefixCls, "".concat(prefixCls, "-").concat(props.page), (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-active"), props.active), _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), !props.page), _defineProperty(_classNames, props.className, !!props.className), _classNames));
  var handleClick = function handleClick2() {
    props.onClick(props.page);
  };
  var handleKeyPress = function handleKeyPress2(e) {
    props.onKeyPress(e, props.onClick, props.page);
  };
  return /* @__PURE__ */ jsx("li", {
    title: props.showTitle ? props.page : null,
    className: cls,
    onClick: handleClick,
    onKeyPress: handleKeyPress,
    tabIndex: "0",
    children: props.itemRender(
      props.page,
      "page",
      /* @__PURE__ */ jsx("a", {
        rel: "nofollow",
        children: props.page
      })
    )
  });
};
const KEYCODE = {
  ZERO: 48,
  NINE: 57,
  NUMPAD_ZERO: 96,
  NUMPAD_NINE: 105,
  BACKSPACE: 8,
  DELETE: 46,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40
};
var Options = /* @__PURE__ */ function(_React$Component) {
  _inherits(Options2, _React$Component);
  var _super = _createSuper(Options2);
  function Options2() {
    var _this;
    _classCallCheck(this, Options2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      goInputText: ""
    };
    _this.buildOptionText = function(value) {
      return "".concat(value, " ").concat(_this.props.locale.items_per_page);
    };
    _this.changeSize = function(value) {
      _this.props.changeSize(Number(value));
    };
    _this.handleChange = function(e) {
      _this.setState({
        goInputText: e.target.value
      });
    };
    _this.handleBlur = function(e) {
      var _this$props = _this.props, goButton = _this$props.goButton, quickGo = _this$props.quickGo, rootPrefixCls = _this$props.rootPrefixCls;
      var goInputText = _this.state.goInputText;
      if (goButton || goInputText === "") {
        return;
      }
      _this.setState({
        goInputText: ""
      });
      if (e.relatedTarget && (e.relatedTarget.className.indexOf("".concat(rootPrefixCls, "-item-link")) >= 0 || e.relatedTarget.className.indexOf("".concat(rootPrefixCls, "-item")) >= 0)) {
        return;
      }
      quickGo(_this.getValidValue());
    };
    _this.go = function(e) {
      var goInputText = _this.state.goInputText;
      if (goInputText === "") {
        return;
      }
      if (e.keyCode === KEYCODE.ENTER || e.type === "click") {
        _this.setState({
          goInputText: ""
        });
        _this.props.quickGo(_this.getValidValue());
      }
    };
    return _this;
  }
  _createClass(Options2, [{
    key: "getValidValue",
    value: function getValidValue() {
      var goInputText = this.state.goInputText;
      return !goInputText || isNaN(goInputText) ? void 0 : Number(goInputText);
    }
  }, {
    key: "getPageSizeOptions",
    value: function getPageSizeOptions() {
      var _this$props2 = this.props, pageSize = _this$props2.pageSize, pageSizeOptions = _this$props2.pageSizeOptions;
      if (pageSizeOptions.some(function(option) {
        return option.toString() === pageSize.toString();
      })) {
        return pageSizeOptions;
      }
      return pageSizeOptions.concat([pageSize.toString()]).sort(function(a, b) {
        var numberA = isNaN(Number(a)) ? 0 : Number(a);
        var numberB = isNaN(Number(b)) ? 0 : Number(b);
        return numberA - numberB;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props3 = this.props, pageSize = _this$props3.pageSize, locale = _this$props3.locale, rootPrefixCls = _this$props3.rootPrefixCls, changeSize = _this$props3.changeSize, quickGo = _this$props3.quickGo, goButton = _this$props3.goButton, selectComponentClass = _this$props3.selectComponentClass, buildOptionText = _this$props3.buildOptionText, selectPrefixCls = _this$props3.selectPrefixCls, disabled = _this$props3.disabled;
      var goInputText = this.state.goInputText;
      var prefixCls = "".concat(rootPrefixCls, "-options");
      var Select2 = selectComponentClass;
      var changeSelect = null;
      var goInput = null;
      var gotoButton = null;
      if (!changeSize && !quickGo) {
        return null;
      }
      var pageSizeOptions = this.getPageSizeOptions();
      if (changeSize && Select2) {
        var options = pageSizeOptions.map(function(opt, i) {
          return /* @__PURE__ */ jsx(Select2.Option, {
            value: opt.toString(),
            children: (buildOptionText || _this2.buildOptionText)(opt)
          }, i);
        });
        changeSelect = /* @__PURE__ */ jsx(Select2, {
          disabled,
          prefixCls: selectPrefixCls,
          showSearch: false,
          className: "".concat(prefixCls, "-size-changer"),
          optionLabelProp: "children",
          dropdownMatchSelectWidth: false,
          value: (pageSize || pageSizeOptions[0]).toString(),
          onChange: this.changeSize,
          getPopupContainer: function getPopupContainer(triggerNode) {
            return triggerNode.parentNode;
          },
          "aria-label": locale.page_size,
          defaultOpen: false,
          children: options
        });
      }
      if (quickGo) {
        if (goButton) {
          gotoButton = typeof goButton === "boolean" ? /* @__PURE__ */ jsx("button", {
            type: "button",
            onClick: this.go,
            onKeyUp: this.go,
            disabled,
            className: "".concat(prefixCls, "-quick-jumper-button"),
            children: locale.jump_to_confirm
          }) : /* @__PURE__ */ jsx("span", {
            onClick: this.go,
            onKeyUp: this.go,
            children: goButton
          });
        }
        goInput = /* @__PURE__ */ jsxs("div", {
          className: "".concat(prefixCls, "-quick-jumper"),
          children: [locale.jump_to, /* @__PURE__ */ jsx("input", {
            disabled,
            type: "text",
            value: goInputText,
            onChange: this.handleChange,
            onKeyUp: this.go,
            onBlur: this.handleBlur,
            "aria-label": locale.page
          }), locale.page, gotoButton]
        });
      }
      return /* @__PURE__ */ jsxs("li", {
        className: "".concat(prefixCls),
        children: [changeSelect, goInput]
      });
    }
  }]);
  return Options2;
}(React.Component);
Options.defaultProps = {
  pageSizeOptions: ["10", "20", "50", "100"]
};
const LOCALE = {
  items_per_page: "\u6761/\u9875",
  jump_to: "\u8DF3\u81F3",
  jump_to_confirm: "\u786E\u5B9A",
  page: "\u9875",
  prev_page: "\u4E0A\u4E00\u9875",
  next_page: "\u4E0B\u4E00\u9875",
  prev_5: "\u5411\u524D 5 \u9875",
  next_5: "\u5411\u540E 5 \u9875",
  prev_3: "\u5411\u524D 3 \u9875",
  next_3: "\u5411\u540E 3 \u9875",
  page_size: "\u9875\u7801"
};
function noop() {
}
function isInteger(v) {
  var value = Number(v);
  return typeof value === "number" && !isNaN(value) && isFinite(value) && Math.floor(value) === value;
}
function defaultItemRender(page, type, element) {
  return element;
}
function calculatePage(p, state, props) {
  var pageSize = typeof p === "undefined" ? state.pageSize : p;
  return Math.floor((props.total - 1) / pageSize) + 1;
}
var Pagination$2 = /* @__PURE__ */ function(_React$Component) {
  _inherits(Pagination3, _React$Component);
  var _super = _createSuper(Pagination3);
  function Pagination3(props) {
    var _this;
    _classCallCheck(this, Pagination3);
    _this = _super.call(this, props);
    _this.getJumpPrevPage = function() {
      return Math.max(1, _this.state.current - (_this.props.showLessItems ? 3 : 5));
    };
    _this.getJumpNextPage = function() {
      return Math.min(calculatePage(void 0, _this.state, _this.props), _this.state.current + (_this.props.showLessItems ? 3 : 5));
    };
    _this.getItemIcon = function(icon, label) {
      var prefixCls = _this.props.prefixCls;
      var iconNode = icon || /* @__PURE__ */ jsx("button", {
        type: "button",
        "aria-label": label,
        className: "".concat(prefixCls, "-item-link")
      });
      if (typeof icon === "function") {
        iconNode = /* @__PURE__ */ React.createElement(icon, _objectSpread2({}, _this.props));
      }
      return iconNode;
    };
    _this.savePaginationNode = function(node) {
      _this.paginationNode = node;
    };
    _this.isValid = function(page) {
      var total = _this.props.total;
      return isInteger(page) && page !== _this.state.current && isInteger(total) && total > 0;
    };
    _this.shouldDisplayQuickJumper = function() {
      var _this$props = _this.props, showQuickJumper = _this$props.showQuickJumper, total = _this$props.total;
      var pageSize = _this.state.pageSize;
      if (total <= pageSize) {
        return false;
      }
      return showQuickJumper;
    };
    _this.handleKeyDown = function(e) {
      if (e.keyCode === KEYCODE.ARROW_UP || e.keyCode === KEYCODE.ARROW_DOWN) {
        e.preventDefault();
      }
    };
    _this.handleKeyUp = function(e) {
      var value = _this.getValidValue(e);
      var currentInputValue = _this.state.currentInputValue;
      if (value !== currentInputValue) {
        _this.setState({
          currentInputValue: value
        });
      }
      if (e.keyCode === KEYCODE.ENTER) {
        _this.handleChange(value);
      } else if (e.keyCode === KEYCODE.ARROW_UP) {
        _this.handleChange(value - 1);
      } else if (e.keyCode === KEYCODE.ARROW_DOWN) {
        _this.handleChange(value + 1);
      }
    };
    _this.handleBlur = function(e) {
      var value = _this.getValidValue(e);
      _this.handleChange(value);
    };
    _this.changePageSize = function(size) {
      var current = _this.state.current;
      var newCurrent = calculatePage(size, _this.state, _this.props);
      current = current > newCurrent ? newCurrent : current;
      if (newCurrent === 0) {
        current = _this.state.current;
      }
      if (typeof size === "number") {
        if (!("pageSize" in _this.props)) {
          _this.setState({
            pageSize: size
          });
        }
        if (!("current" in _this.props)) {
          _this.setState({
            current,
            currentInputValue: current
          });
        }
      }
      _this.props.onShowSizeChange(current, size);
      if ("onChange" in _this.props && _this.props.onChange) {
        _this.props.onChange(current, size);
      }
    };
    _this.handleChange = function(page) {
      var _this$props2 = _this.props, disabled = _this$props2.disabled, onChange = _this$props2.onChange;
      var _this$state = _this.state, pageSize = _this$state.pageSize, current = _this$state.current, currentInputValue = _this$state.currentInputValue;
      if (_this.isValid(page) && !disabled) {
        var currentPage = calculatePage(void 0, _this.state, _this.props);
        var newPage = page;
        if (page > currentPage) {
          newPage = currentPage;
        } else if (page < 1) {
          newPage = 1;
        }
        if (!("current" in _this.props)) {
          _this.setState({
            current: newPage
          });
        }
        if (newPage !== currentInputValue) {
          _this.setState({
            currentInputValue: newPage
          });
        }
        onChange(newPage, pageSize);
        return newPage;
      }
      return current;
    };
    _this.prev = function() {
      if (_this.hasPrev()) {
        _this.handleChange(_this.state.current - 1);
      }
    };
    _this.next = function() {
      if (_this.hasNext()) {
        _this.handleChange(_this.state.current + 1);
      }
    };
    _this.jumpPrev = function() {
      _this.handleChange(_this.getJumpPrevPage());
    };
    _this.jumpNext = function() {
      _this.handleChange(_this.getJumpNextPage());
    };
    _this.hasPrev = function() {
      return _this.state.current > 1;
    };
    _this.hasNext = function() {
      return _this.state.current < calculatePage(void 0, _this.state, _this.props);
    };
    _this.runIfEnter = function(event, callback) {
      if (event.key === "Enter" || event.charCode === 13) {
        for (var _len = arguments.length, restParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          restParams[_key - 2] = arguments[_key];
        }
        callback.apply(void 0, restParams);
      }
    };
    _this.runIfEnterPrev = function(e) {
      _this.runIfEnter(e, _this.prev);
    };
    _this.runIfEnterNext = function(e) {
      _this.runIfEnter(e, _this.next);
    };
    _this.runIfEnterJumpPrev = function(e) {
      _this.runIfEnter(e, _this.jumpPrev);
    };
    _this.runIfEnterJumpNext = function(e) {
      _this.runIfEnter(e, _this.jumpNext);
    };
    _this.handleGoTO = function(e) {
      if (e.keyCode === KEYCODE.ENTER || e.type === "click") {
        _this.handleChange(_this.state.currentInputValue);
      }
    };
    var hasOnChange = props.onChange !== noop;
    var hasCurrent = "current" in props;
    if (hasCurrent && !hasOnChange) {
      console.warn("Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.");
    }
    var _current = props.defaultCurrent;
    if ("current" in props) {
      _current = props.current;
    }
    var _pageSize = props.defaultPageSize;
    if ("pageSize" in props) {
      _pageSize = props.pageSize;
    }
    _current = Math.min(_current, calculatePage(_pageSize, void 0, props));
    _this.state = {
      current: _current,
      currentInputValue: _current,
      pageSize: _pageSize
    };
    return _this;
  }
  _createClass(Pagination3, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var prefixCls = this.props.prefixCls;
      if (prevState.current !== this.state.current && this.paginationNode) {
        var lastCurrentNode = this.paginationNode.querySelector(".".concat(prefixCls, "-item-").concat(prevState.current));
        if (lastCurrentNode && document.activeElement === lastCurrentNode) {
          lastCurrentNode.blur();
        }
      }
    }
  }, {
    key: "getValidValue",
    value: function getValidValue(e) {
      var inputValue = e.target.value;
      var allPages = calculatePage(void 0, this.state, this.props);
      var currentInputValue = this.state.currentInputValue;
      var value;
      if (inputValue === "") {
        value = inputValue;
      } else if (isNaN(Number(inputValue))) {
        value = currentInputValue;
      } else if (inputValue >= allPages) {
        value = allPages;
      } else {
        value = Number(inputValue);
      }
      return value;
    }
  }, {
    key: "getShowSizeChanger",
    value: function getShowSizeChanger() {
      var _this$props3 = this.props, showSizeChanger = _this$props3.showSizeChanger, total = _this$props3.total, totalBoundaryShowSizeChanger = _this$props3.totalBoundaryShowSizeChanger;
      if (typeof showSizeChanger !== "undefined") {
        return showSizeChanger;
      }
      return total > totalBoundaryShowSizeChanger;
    }
  }, {
    key: "renderPrev",
    value: function renderPrev(prevPage) {
      var _this$props4 = this.props, prevIcon = _this$props4.prevIcon, itemRender = _this$props4.itemRender;
      var prevButton = itemRender(prevPage, "prev", this.getItemIcon(prevIcon, "prev page"));
      var disabled = !this.hasPrev();
      return /* @__PURE__ */ react.exports.isValidElement(prevButton) ? /* @__PURE__ */ react.exports.cloneElement(prevButton, {
        disabled
      }) : prevButton;
    }
  }, {
    key: "renderNext",
    value: function renderNext(nextPage) {
      var _this$props5 = this.props, nextIcon = _this$props5.nextIcon, itemRender = _this$props5.itemRender;
      var nextButton = itemRender(nextPage, "next", this.getItemIcon(nextIcon, "next page"));
      var disabled = !this.hasNext();
      return /* @__PURE__ */ react.exports.isValidElement(nextButton) ? /* @__PURE__ */ react.exports.cloneElement(nextButton, {
        disabled
      }) : nextButton;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props6 = this.props, prefixCls = _this$props6.prefixCls, className = _this$props6.className, style = _this$props6.style, disabled = _this$props6.disabled, hideOnSinglePage = _this$props6.hideOnSinglePage, total = _this$props6.total, locale = _this$props6.locale, showQuickJumper = _this$props6.showQuickJumper, showLessItems = _this$props6.showLessItems, showTitle = _this$props6.showTitle, showTotal = _this$props6.showTotal, simple = _this$props6.simple, itemRender = _this$props6.itemRender, showPrevNextJumpers = _this$props6.showPrevNextJumpers, jumpPrevIcon = _this$props6.jumpPrevIcon, jumpNextIcon = _this$props6.jumpNextIcon, selectComponentClass = _this$props6.selectComponentClass, selectPrefixCls = _this$props6.selectPrefixCls, pageSizeOptions = _this$props6.pageSizeOptions;
      var _this$state2 = this.state, current = _this$state2.current, pageSize = _this$state2.pageSize, currentInputValue = _this$state2.currentInputValue;
      if (hideOnSinglePage === true && total <= pageSize) {
        return null;
      }
      var allPages = calculatePage(void 0, this.state, this.props);
      var pagerList = [];
      var jumpPrev = null;
      var jumpNext = null;
      var firstPager = null;
      var lastPager = null;
      var gotoButton = null;
      var goButton = showQuickJumper && showQuickJumper.goButton;
      var pageBufferSize = showLessItems ? 1 : 2;
      var prevPage = current - 1 > 0 ? current - 1 : 0;
      var nextPage = current + 1 < allPages ? current + 1 : allPages;
      var dataOrAriaAttributeProps = Object.keys(this.props).reduce(function(prev, key) {
        if (key.substr(0, 5) === "data-" || key.substr(0, 5) === "aria-" || key === "role") {
          prev[key] = _this2.props[key];
        }
        return prev;
      }, {});
      var totalText = showTotal && /* @__PURE__ */ jsx("li", {
        className: "".concat(prefixCls, "-total-text"),
        children: showTotal(total, [total === 0 ? 0 : (current - 1) * pageSize + 1, current * pageSize > total ? total : current * pageSize])
      });
      if (simple) {
        if (goButton) {
          if (typeof goButton === "boolean") {
            gotoButton = /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: this.handleGoTO,
              onKeyUp: this.handleGoTO,
              children: locale.jump_to_confirm
            });
          } else {
            gotoButton = /* @__PURE__ */ jsx("span", {
              onClick: this.handleGoTO,
              onKeyUp: this.handleGoTO,
              children: goButton
            });
          }
          gotoButton = /* @__PURE__ */ jsx("li", {
            title: showTitle ? "".concat(locale.jump_to).concat(current, "/").concat(allPages) : null,
            className: "".concat(prefixCls, "-simple-pager"),
            children: gotoButton
          });
        }
        return /* @__PURE__ */ jsxs("ul", {
          className: classNames(prefixCls, "".concat(prefixCls, "-simple"), _defineProperty({}, "".concat(prefixCls, "-disabled"), disabled), className),
          style,
          ref: this.savePaginationNode,
          ...dataOrAriaAttributeProps,
          children: [totalText, /* @__PURE__ */ jsx("li", {
            title: showTitle ? locale.prev_page : null,
            onClick: this.prev,
            tabIndex: this.hasPrev() ? 0 : null,
            onKeyPress: this.runIfEnterPrev,
            className: classNames("".concat(prefixCls, "-prev"), _defineProperty({}, "".concat(prefixCls, "-disabled"), !this.hasPrev())),
            "aria-disabled": !this.hasPrev(),
            children: this.renderPrev(prevPage)
          }), /* @__PURE__ */ jsxs("li", {
            title: showTitle ? "".concat(current, "/").concat(allPages) : null,
            className: "".concat(prefixCls, "-simple-pager"),
            children: [/* @__PURE__ */ jsx("input", {
              type: "text",
              value: currentInputValue,
              disabled,
              onKeyDown: this.handleKeyDown,
              onKeyUp: this.handleKeyUp,
              onChange: this.handleKeyUp,
              onBlur: this.handleBlur,
              size: "3"
            }), /* @__PURE__ */ jsx("span", {
              className: "".concat(prefixCls, "-slash"),
              children: "/"
            }), allPages]
          }), /* @__PURE__ */ jsx("li", {
            title: showTitle ? locale.next_page : null,
            onClick: this.next,
            tabIndex: this.hasPrev() ? 0 : null,
            onKeyPress: this.runIfEnterNext,
            className: classNames("".concat(prefixCls, "-next"), _defineProperty({}, "".concat(prefixCls, "-disabled"), !this.hasNext())),
            "aria-disabled": !this.hasNext(),
            children: this.renderNext(nextPage)
          }), gotoButton]
        });
      }
      if (allPages <= 3 + pageBufferSize * 2) {
        var pagerProps = {
          locale,
          rootPrefixCls: prefixCls,
          onClick: this.handleChange,
          onKeyPress: this.runIfEnter,
          showTitle,
          itemRender
        };
        if (!allPages) {
          pagerList.push(
            /* @__PURE__ */ react.exports.createElement(Pager, {
              ...pagerProps,
              key: "noPager",
              page: 1,
              className: "".concat(prefixCls, "-item-disabled")
            })
          );
        }
        for (var i = 1; i <= allPages; i += 1) {
          var active = current === i;
          pagerList.push(
            /* @__PURE__ */ react.exports.createElement(Pager, {
              ...pagerProps,
              key: i,
              page: i,
              active
            })
          );
        }
      } else {
        var prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
        var nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;
        if (showPrevNextJumpers) {
          jumpPrev = /* @__PURE__ */ jsx("li", {
            title: showTitle ? prevItemTitle : null,
            onClick: this.jumpPrev,
            tabIndex: "0",
            onKeyPress: this.runIfEnterJumpPrev,
            className: classNames("".concat(prefixCls, "-jump-prev"), _defineProperty({}, "".concat(prefixCls, "-jump-prev-custom-icon"), !!jumpPrevIcon)),
            children: itemRender(this.getJumpPrevPage(), "jump-prev", this.getItemIcon(jumpPrevIcon, "prev page"))
          }, "prev");
          jumpNext = /* @__PURE__ */ jsx("li", {
            title: showTitle ? nextItemTitle : null,
            tabIndex: "0",
            onClick: this.jumpNext,
            onKeyPress: this.runIfEnterJumpNext,
            className: classNames("".concat(prefixCls, "-jump-next"), _defineProperty({}, "".concat(prefixCls, "-jump-next-custom-icon"), !!jumpNextIcon)),
            children: itemRender(this.getJumpNextPage(), "jump-next", this.getItemIcon(jumpNextIcon, "next page"))
          }, "next");
        }
        lastPager = /* @__PURE__ */ jsx(Pager, {
          locale,
          last: true,
          rootPrefixCls: prefixCls,
          onClick: this.handleChange,
          onKeyPress: this.runIfEnter,
          page: allPages,
          active: false,
          showTitle,
          itemRender
        }, allPages);
        firstPager = /* @__PURE__ */ jsx(Pager, {
          locale,
          rootPrefixCls: prefixCls,
          onClick: this.handleChange,
          onKeyPress: this.runIfEnter,
          page: 1,
          active: false,
          showTitle,
          itemRender
        }, 1);
        var left = Math.max(1, current - pageBufferSize);
        var right = Math.min(current + pageBufferSize, allPages);
        if (current - 1 <= pageBufferSize) {
          right = 1 + pageBufferSize * 2;
        }
        if (allPages - current <= pageBufferSize) {
          left = allPages - pageBufferSize * 2;
        }
        for (var _i = left; _i <= right; _i += 1) {
          var _active = current === _i;
          pagerList.push(
            /* @__PURE__ */ jsx(Pager, {
              locale,
              rootPrefixCls: prefixCls,
              onClick: this.handleChange,
              onKeyPress: this.runIfEnter,
              page: _i,
              active: _active,
              showTitle,
              itemRender
            }, _i)
          );
        }
        if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
          pagerList[0] = /* @__PURE__ */ react.exports.cloneElement(pagerList[0], {
            className: "".concat(prefixCls, "-item-after-jump-prev")
          });
          pagerList.unshift(jumpPrev);
        }
        if (allPages - current >= pageBufferSize * 2 && current !== allPages - 2) {
          pagerList[pagerList.length - 1] = /* @__PURE__ */ react.exports.cloneElement(pagerList[pagerList.length - 1], {
            className: "".concat(prefixCls, "-item-before-jump-next")
          });
          pagerList.push(jumpNext);
        }
        if (left !== 1) {
          pagerList.unshift(firstPager);
        }
        if (right !== allPages) {
          pagerList.push(lastPager);
        }
      }
      var prevDisabled = !this.hasPrev() || !allPages;
      var nextDisabled = !this.hasNext() || !allPages;
      return /* @__PURE__ */ jsxs("ul", {
        className: classNames(prefixCls, className, _defineProperty({}, "".concat(prefixCls, "-disabled"), disabled)),
        style,
        ref: this.savePaginationNode,
        ...dataOrAriaAttributeProps,
        children: [totalText, /* @__PURE__ */ jsx("li", {
          title: showTitle ? locale.prev_page : null,
          onClick: this.prev,
          tabIndex: prevDisabled ? null : 0,
          onKeyPress: this.runIfEnterPrev,
          className: classNames("".concat(prefixCls, "-prev"), _defineProperty({}, "".concat(prefixCls, "-disabled"), prevDisabled)),
          "aria-disabled": prevDisabled,
          children: this.renderPrev(prevPage)
        }), pagerList, /* @__PURE__ */ jsx("li", {
          title: showTitle ? locale.next_page : null,
          onClick: this.next,
          tabIndex: nextDisabled ? null : 0,
          onKeyPress: this.runIfEnterNext,
          className: classNames("".concat(prefixCls, "-next"), _defineProperty({}, "".concat(prefixCls, "-disabled"), nextDisabled)),
          "aria-disabled": nextDisabled,
          children: this.renderNext(nextPage)
        }), /* @__PURE__ */ jsx(Options, {
          disabled,
          locale,
          rootPrefixCls: prefixCls,
          selectComponentClass,
          selectPrefixCls,
          changeSize: this.getShowSizeChanger() ? this.changePageSize : null,
          current,
          pageSize,
          pageSizeOptions,
          quickGo: this.shouldDisplayQuickJumper() ? this.handleChange : null,
          goButton
        })]
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var newState = {};
      if ("current" in props) {
        newState.current = props.current;
        if (props.current !== prevState.current) {
          newState.currentInputValue = newState.current;
        }
      }
      if ("pageSize" in props && props.pageSize !== prevState.pageSize) {
        var current = prevState.current;
        var newCurrent = calculatePage(props.pageSize, prevState, props);
        current = current > newCurrent ? newCurrent : current;
        if (!("current" in props)) {
          newState.current = current;
          newState.currentInputValue = current;
        }
        newState.pageSize = props.pageSize;
      }
      return newState;
    }
  }]);
  return Pagination3;
}(React.Component);
Pagination$2.defaultProps = {
  defaultCurrent: 1,
  total: 0,
  defaultPageSize: 10,
  onChange: noop,
  className: "",
  selectPrefixCls: "rc-select",
  prefixCls: "rc-pagination",
  selectComponentClass: null,
  hideOnSinglePage: false,
  showPrevNextJumpers: true,
  showQuickJumper: false,
  showLessItems: false,
  showTitle: true,
  onShowSizeChange: noop,
  locale: LOCALE,
  style: {},
  itemRender: defaultItemRender,
  totalBoundaryShowSizeChanger: 50
};
var MiniSelect = function MiniSelect2(props) {
  return /* @__PURE__ */ jsx(Select$1, {
    ...props,
    size: "small"
  });
};
var MiddleSelect = function MiddleSelect2(props) {
  return /* @__PURE__ */ jsx(Select$1, {
    ...props,
    size: "middle"
  });
};
MiniSelect.Option = Select$1.Option;
MiddleSelect.Option = Select$1.Option;
var __rest = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var Pagination = function Pagination2(_a) {
  var customizePrefixCls = _a.prefixCls, customizeSelectPrefixCls = _a.selectPrefixCls, className = _a.className, size = _a.size, customLocale = _a.locale, selectComponentClass = _a.selectComponentClass, responsive = _a.responsive, showSizeChanger = _a.showSizeChanger, restProps = __rest(_a, ["prefixCls", "selectPrefixCls", "className", "size", "locale", "selectComponentClass", "responsive", "showSizeChanger"]);
  var _useBreakpoint = useBreakpoint(responsive), xs = _useBreakpoint.xs;
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction, _React$useContext$pag = _React$useContext.pagination, pagination = _React$useContext$pag === void 0 ? {} : _React$useContext$pag;
  var prefixCls = getPrefixCls("pagination", customizePrefixCls);
  var mergedShowSizeChanger = showSizeChanger !== null && showSizeChanger !== void 0 ? showSizeChanger : pagination.showSizeChanger;
  var getIconsProps = function getIconsProps2() {
    var ellipsis = /* @__PURE__ */ jsx("span", {
      className: "".concat(prefixCls, "-item-ellipsis"),
      children: "\u2022\u2022\u2022"
    });
    var prevIcon = /* @__PURE__ */ jsx("button", {
      className: "".concat(prefixCls, "-item-link"),
      type: "button",
      tabIndex: -1,
      children: /* @__PURE__ */ jsx(LeftOutlined$1, {})
    });
    var nextIcon = /* @__PURE__ */ jsx("button", {
      className: "".concat(prefixCls, "-item-link"),
      type: "button",
      tabIndex: -1,
      children: /* @__PURE__ */ jsx(RightOutlined$1, {})
    });
    var jumpPrevIcon = /* @__PURE__ */ jsx("a", {
      className: "".concat(prefixCls, "-item-link"),
      children: /* @__PURE__ */ jsxs("div", {
        className: "".concat(prefixCls, "-item-container"),
        children: [/* @__PURE__ */ jsx(DoubleLeftOutlined$1, {
          className: "".concat(prefixCls, "-item-link-icon")
        }), ellipsis]
      })
    });
    var jumpNextIcon = /* @__PURE__ */ jsx("a", {
      className: "".concat(prefixCls, "-item-link"),
      children: /* @__PURE__ */ jsxs("div", {
        className: "".concat(prefixCls, "-item-container"),
        children: [/* @__PURE__ */ jsx(DoubleRightOutlined$1, {
          className: "".concat(prefixCls, "-item-link-icon")
        }), ellipsis]
      })
    });
    if (direction === "rtl") {
      var _ref = [nextIcon, prevIcon];
      prevIcon = _ref[0];
      nextIcon = _ref[1];
      var _ref2 = [jumpNextIcon, jumpPrevIcon];
      jumpPrevIcon = _ref2[0];
      jumpNextIcon = _ref2[1];
    }
    return {
      prevIcon,
      nextIcon,
      jumpPrevIcon,
      jumpNextIcon
    };
  };
  return /* @__PURE__ */ jsx(LocaleReceiver, {
    componentName: "Pagination",
    defaultLocale: enUS,
    children: function(contextLocale) {
      var _classNames;
      var locale = _extends(_extends({}, contextLocale), customLocale);
      var isSmall = size === "small" || !!(xs && !size && responsive);
      var selectPrefixCls = getPrefixCls("select", customizeSelectPrefixCls);
      var extendedClassName = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-mini"), isSmall), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === "rtl"), _classNames), className);
      return /* @__PURE__ */ jsx(Pagination$2, {
        ...getIconsProps(),
        ...restProps,
        prefixCls,
        selectPrefixCls,
        className: extendedClassName,
        selectComponentClass: selectComponentClass || (isSmall ? MiniSelect : MiddleSelect),
        locale,
        showSizeChanger: mergedShowSizeChanger
      });
    }
  });
};
const Pagination$1 = Pagination;
const index = "";
const getEventsWithFilter = async (contract, event, filter) => {
  const events = await getEventData(contract, event);
  const filtered = events.filter(
    (event2) => fromBigNumber(event2.args._positionID) == filter._positionID
  );
  return filtered;
};
const positionId = async (positionContract, poolAddress, userAddress) => {
  const id = await readContractLib({
    address: positionContract.address,
    abi: positionAbi,
    functionName: "getNftId",
    args: [poolAddress, userAddress]
  });
  return id;
};
const getEventData = async (contract, event) => {
  try {
    const provider = getEthersProvider(11155111);
    const batchSize = 5e4;
    const latestBlockNumber = await provider.getBlockNumber();
    const fetchBatch = async (fromBlock2, toBlock) => {
      const batchResult = await contract.queryFilter(event, fromBlock2, toBlock);
      return batchResult.map((item) => item);
    };
    const batchPromises = [];
    let fromBlock = 0;
    while (fromBlock <= latestBlockNumber) {
      const toBlock = Math.min(fromBlock + batchSize - 1, latestBlockNumber);
      batchPromises.push(fetchBatch(fromBlock, toBlock));
      fromBlock = toBlock + 1;
    }
    const result = [];
    await Promise.all(batchPromises).then((batchResults) => {
      batchResults.forEach((batchResult) => result.push(...batchResult));
    });
    return result;
  } catch (error) {
    return error;
  }
};
const allTransaction = async (coreContract, positionContract, userAddress, poollist, setTxtData, setIsPageLoading) => {
  const data = await getPastEvents(coreContract, "PoolCreated");
  const newData = data.map((event) => event.args.pool);
  let array = [];
  for (let i = 0; i < newData.length; i++) {
    const position = await positionId(
      positionContract,
      newData[i],
      userAddress
    );
    const poolInfo = poollist[newData[i]];
    const poolContract = await getEtherContract(newData[i], poolAbi, 11155111);
    const eventNames = ["Borrow", "Lend", "Redeem", "RepayBorrow"];
    const IspositionId = fromBigNumber(position);
    if (IspositionId != 0) {
      for (let j = 0; j < eventNames.length; j++) {
        const events = await getEventsWithFilter(poolContract, eventNames[j], {
          _positionID: `${position}`
        });
        const eventsWithPoolInfo = events.map(
          (el) => el = {
            ...el,
            poolInfo,
            event: el.event === "RepayBorrow" ? "Repay" : el.event
          }
        );
        array.push(...eventsWithPoolInfo);
      }
      array.sort(function(a, b) {
        if (a.blockNumber < b.blockNumber)
          return 1;
        if (a.blockNumber > b.blockNumber)
          return -1;
        return 0;
      });
    }
  }
  return array;
};
const txIcon = "/assets/tx.a2ccf426.svg";
const noTxt = "/assets/notxt.24a6f64d.svg";
const historySkeleton = "";
function HistorySkeleton() {
  return /* @__PURE__ */ jsx("div", {
    className: "history_skeleton",
    children: new Array(6).fill(0).map((_, i) => /* @__PURE__ */ jsx("div", {
      className: "row skeleton"
    }, i))
  });
}
const loader = "/assets/Eclipse-loader.02486981.gif";
function HistoryComponent() {
  const contracts = useSelector((state) => state?.contracts);
  const user = useSelector((state) => state?.user);
  const tokenList = useSelector((state) => state?.tokenList);
  const poolList = useSelector((state) => state?.poolList);
  const web3 = useSelector((state) => state?.web3);
  const navigate = useNavigate();
  const {
    chain
  } = useWalletHook();
  const [txtData, setTxtData] = react.exports.useState([]);
  const [graphHistory, setGraphHistory] = react.exports.useState([]);
  const [graphHistoryBackup, setGraphHistoryBackup] = react.exports.useState([]);
  const [txtDataBackup, setTxtDataBackup] = react.exports.useState([]);
  react.exports.useState(false);
  const [currentPage, setCurrentPage] = react.exports.useState(1);
  const [itemPerPage, setItemPerPage] = react.exports.useState(6);
  const [sortIndex, setSortIndex] = react.exports.useState(1);
  const [isPageLoading, setIsPageLoading] = react.exports.useState(true);
  const [isPolygon, setIsPolygon] = react.exports.useState(false);
  const [search, setSearch] = react.exports.useState("");
  const [poolsData, setPoolsData] = react.exports.useState({});
  const query = getHistoryGraphQuery(user?.address);
  const [called, setIsCalled] = react.exports.useState(false);
  const [historyLoading, setHistoryLoading] = react.exports.useState(false);
  const networksWithGraph = Object.values(supportedNetworks).filter((network) => network.graphAvailable && network.chainId).map((net) => net.chainId);
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery("history", async () => {
    const fetchedDATA = await fetchGraphQlData(chain?.id || user?.network?.id || 137, query);
    return fetchedDATA;
  });
  const getDateByTimeStamp = (timeStamp) => {
    const dateInstance = new Date(timeStamp * 1e3);
    const time = dateInstance.toLocaleTimeString();
    const date = dateInstance.toLocaleDateString();
    return `${date} : ${time}`;
  };
  react.exports.useEffect(() => {
    if (!user.isConnected) {
      navigate("/");
    }
    if (data && networksWithGraph.includes(user?.network.id)) {
      const pools = {};
      for (const key in poolList) {
        const pool = poolList[key];
        pools[String(pool.poolAddress).toUpperCase()] = pool;
      }
      setPoolsData(pools);
      setIsPolygon(true);
      if (data && Object.values(pools).length > 0) {
        const newArray = [...data.borrows, ...data.lends, ...data.redeems, ...data.repays];
        const sorted = sortByKey(newArray, "blockTimestamp", 1);
        setGraphHistory(sorted);
        setGraphHistoryBackup(sorted);
        setIsPageLoading(false);
        setHistoryLoading(false);
      }
    } else {
      setIsPolygon(false);
    }
  }, [data, poolList]);
  const handleSort = (index2) => {
    const sortTo = isPolygon ? graphHistory : txtData;
    let sort = sortTo;
    setSortIndex(index2);
    if (index2 === 1) {
      sort = sortTo.sort(function(a, b) {
        if (a.blockNumber < b.blockNumber)
          return 1;
        if (a.blockNumber > b.blockNumber)
          return -1;
        return 0;
      });
    } else if (index2 == 2) {
      sort = sortTo.sort(function(a, b) {
        if (a.blockNumber < b.blockNumber)
          return -1;
        if (a.blockNumber > b.blockNumber)
          return 1;
        return 0;
      });
    }
    setTxtData(sort);
    setTxtDataBackup(sort);
  };
  const handleSearch = (e) => {
    const value = String(e.target.value).toUpperCase().trim();
    setSearch(value);
    if (isPolygon) {
      let searched = graphHistoryBackup.filter((txt) => String(txt.pool).toUpperCase().includes(value) || String(txt.tokenSymbol).toUpperCase().includes(value) || String(txt.__typename).toUpperCase().includes(value) || String(txt.id).toUpperCase().includes(value) || String(txt.token.symbol).toUpperCase().includes(value));
      if (value == "") {
        searched = graphHistoryBackup;
      }
      setGraphHistory(searched);
    } else {
      txtDataBackup.filter((data2) => String(data2));
    }
  };
  const getTransactionData = async () => {
    if (!networksWithGraph.includes(user?.network.id) && !called) {
      try {
        setHistoryLoading(true);
        const txtArray = await allTransaction(contracts.coreContract, contracts.positionContract, user.address, poolList, setTxtData, setIsPageLoading);
        if (txtArray.length > 0) {
          const sort = txtArray.sort(function(a, b) {
            if (a.blockNumber < b.blockNumber)
              return 1;
            if (a.blockNumber > b.blockNumber)
              return -1;
            return 0;
          });
          setTxtData(sort);
          setTxtDataBackup(sort);
          setHistoryLoading(false);
        }
        setIsPageLoading(false);
      } catch (error2) {
        console.log("history data: error", error2);
        setIsPageLoading(false);
        setHistoryLoading(false);
      }
    }
  };
  react.exports.useEffect(() => {
    if (!user.isConnected) {
      navigate("/");
    }
    if (user.address && contracts?.coreContract?.address && !called) {
      getTransactionData();
      setIsCalled(true);
    }
  }, [contracts, user, web3]);
  const dropdownlist = [{
    text: "Transaction",
    fun: () => handleSort(1),
    icon: /* @__PURE__ */ jsx(ImArrowUp2, {})
  }, {
    text: "Transaction",
    fun: () => handleSort(2),
    icon: /* @__PURE__ */ jsx(ImArrowDown2, {})
  }];
  return /* @__PURE__ */ jsxs("div", {
    className: "history_table_container",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "action_container",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "input_container",
        children: [/* @__PURE__ */ jsx(FaSearch, {}), /* @__PURE__ */ jsx("input", {
          type: "text",
          placeholder: "Search Txt/Token/Type",
          value: search,
          onChange: handleSearch
        })]
      }), !historyLoading ? /* @__PURE__ */ jsx(DropDown, {
        list: dropdownlist
      }) : /* @__PURE__ */ jsxs("div", {
        className: "gif_loader",
        children: [/* @__PURE__ */ jsx("span", {
          children: "Loading"
        }), /* @__PURE__ */ jsx("img", {
          src: loader,
          alt: ""
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "table_header",
      children: [/* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("p", {
          children: "Pools"
        })
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("p", {
          children: "Token"
        })
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("p", {
          children: "Type"
        })
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("p", {
          children: "Amount"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "hide_for_mobile",
        children: /* @__PURE__ */ jsx("p", {
          children: "Time Stamp"
        })
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsx("p", {
          children: "Tx ID"
        })
      })]
    }), isPolygon ? /* @__PURE__ */ jsx("div", {
      className: "table_list_container",
      children: graphHistory.length > 0 && Object.values(poolsData).length > 0 && !isPageLoading && user.isConnected ? graphHistory.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage).map((txt, i) => /* @__PURE__ */ jsxs("div", {
        className: "table_item",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("img", {
              src: poolsData[String(txt.pool.pool).toUpperCase()].token0.logo,
              onError: imgError,
              alt: "token_icon"
            }), /* @__PURE__ */ jsx("img", {
              src: poolsData[String(txt.pool.pool).toUpperCase()].token1.logo,
              onError: imgError,
              alt: "token_icon"
            })]
          }), /* @__PURE__ */ jsx("a", {
            href: `pool/${txt.pool.pool}`,
            children: /* @__PURE__ */ jsx("p", {
              className: "hide_for_mobile hide_for_tab",
              children: txt.pool.token0.symbol + "/" + txt.pool.token1.symbol
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("p", {
            children: txt.token.symbol
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("p", {
            children: txt?.__typename
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(Tooltip, {
            title: Number(txt?.amount) / 10 ** Number(txt.token.decimals),
            children: /* @__PURE__ */ jsx("p", {
              children: truncateToDecimals(Number(txt?.amount) / 10 ** Number(txt.token.decimals), 6)
            })
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "hide_for_mobile",
          children: /* @__PURE__ */ jsx("p", {
            className: "success",
            children: getDateByTimeStamp(txt?.blockTimestamp)
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "hide_for_mobile",
          children: /* @__PURE__ */ jsx("p", {
            children: /* @__PURE__ */ jsx("a", {
              href: `${supportedNetworks[user?.network?.id].blockExplorerUrls[0]}/tx/${txt?.id}`,
              target: "_blank",
              children: shortenAddress(txt?.id)
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "tx_icon",
          children: [" ", /* @__PURE__ */ jsxs("a", {
            href: `${supportedNetworks[user?.network?.id].blockExplorerUrls[0]}/tx/${txt?.id}`,
            target: "_blank",
            children: [/* @__PURE__ */ jsx("img", {
              src: txIcon,
              alt: ""
            }), " "]
          })]
        })]
      }, i)) : isPageLoading && user.isConnected ? /* @__PURE__ */ jsx(HistorySkeleton, {}) : /* @__PURE__ */ jsxs("div", {
        className: "no_transaction",
        children: [/* @__PURE__ */ jsx("img", {
          src: noTxt,
          alt: ""
        }), /* @__PURE__ */ jsx("h1", {
          children: "No Transactions Found"
        })]
      })
    }) : /* @__PURE__ */ jsx("div", {
      className: "table_list_container",
      children: txtData.length > 0 && !isPageLoading && user.isConnected ? txtData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage).map((txt, i) => /* @__PURE__ */ jsxs("div", {
        className: "table_item",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("img", {
              src: poolList[txt.address]?.token0?.logo,
              onError: imgError,
              alt: poolList[txt.address]?.token0?.symbol
            }), /* @__PURE__ */ jsx("img", {
              src: poolList[txt.address]?.token1?.logo,
              onError: imgError,
              alt: poolList[txt.address]?.token1?.symbol
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "hide_for_mobile hide_for_tab",
            children: poolList[txt.address]?.token0?.symbol + "/" + poolList[txt.address]?.token1?.symbol
          })]
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("p", {
            children: tokenList[txt?.args?._asset]?.symbol
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("p", {
            children: txt.event
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx("p", {
            children: Number(fromBigNumber(txt?.args?._amount) / 10 ** 18).toFixed(2)
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "hide_for_mobile",
          children: /* @__PURE__ */ jsx("p", {
            className: "success",
            children: "-"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "hide_for_mobile",
          children: /* @__PURE__ */ jsx("p", {
            children: /* @__PURE__ */ jsx("a", {
              href: `${supportedNetworks[user?.network?.id].blockExplorerUrls[0]}/tx/${txt?.id}`,
              target: "_blank",
              children: shortenAddress(txt.transactionHash)
            })
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "tx_icon",
          children: /* @__PURE__ */ jsxs("a", {
            href: `${supportedNetworks[user?.network?.id].blockExplorerUrls[0]}/tx/${txt?.id}`,
            target: "_blank",
            children: [/* @__PURE__ */ jsx("img", {
              src: txIcon,
              alt: ""
            }), " "]
          })
        })]
      }, i)) : isPageLoading && user.isConnected ? /* @__PURE__ */ jsx(HistorySkeleton, {}) : /* @__PURE__ */ jsxs("div", {
        className: "no_transaction",
        children: [/* @__PURE__ */ jsx("img", {
          src: noTxt,
          alt: ""
        }), /* @__PURE__ */ jsx("h1", {
          children: "No Transactions Found"
        })]
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "pagination",
      children: /* @__PURE__ */ jsx(Pagination$1, {
        current: currentPage,
        onChange: (el) => setCurrentPage(el),
        pageSize: itemPerPage,
        size: "small",
        total: isPolygon ? graphHistory.length : txtData.length,
        showSizeChanger: false,
        hideOnSinglePage: true
      })
    })]
  });
}
function History() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(HistoryComponent, {})
  });
}
export {
  History as default
};
