import { a$ as react, b1 as jsx, bX as AntdIcon, bY as _objectSpread2, bS as ConfigContext, bP as classNames, bQ as _defineProperty, ct as FormItemInputContext, cu as _extends, b0 as jsxs, c7 as _typeof, bM as _objectWithoutProperties, bN as useMergedState, bO as _slicedToArray, cn as omit, cc as _toConsumableArray, b7 as Fragment, b5 as React, cs as useCompactItemContext, bT as SizeContext, bU as DisabledContext, c6 as composeRef, cX as NoCompactStyle, cY as NoFormStyle, cq as CloseCircleFilled, cp as ConfigConsumer, cZ as cloneElement, bn as Button, c4 as useLayoutEffect, c1 as wrapperRaf, ch as _inherits, ci as _createSuper, cj as _classCallCheck, ck as _createClass, cK as tuple } from "./index.a9e8707a.js";
import { a as getMergedStatus, g as getStatusClassNames, S as SearchOutlined, R as RefResizeObserver } from "./SearchOutlined.8ef9fed2.js";
var EyeOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" } }] }, "name": "eye", "theme": "outlined" };
const EyeOutlinedSvg = EyeOutlined$2;
var EyeOutlined = function EyeOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: EyeOutlinedSvg
    })
  });
};
EyeOutlined.displayName = "EyeOutlined";
const EyeOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(EyeOutlined);
var Group = function Group2(props) {
  var _classNames;
  var _useContext = react.exports.useContext(ConfigContext), getPrefixCls = _useContext.getPrefixCls, direction = _useContext.direction;
  var customizePrefixCls = props.prefixCls, _props$className = props.className, className = _props$className === void 0 ? "" : _props$className;
  var prefixCls = getPrefixCls("input-group", customizePrefixCls);
  var cls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-lg"), props.size === "large"), _defineProperty(_classNames, "".concat(prefixCls, "-sm"), props.size === "small"), _defineProperty(_classNames, "".concat(prefixCls, "-compact"), props.compact), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === "rtl"), _classNames), className);
  var formItemContext = react.exports.useContext(FormItemInputContext);
  var groupFormItemContext = react.exports.useMemo(function() {
    return _extends(_extends({}, formItemContext), {
      isFormItemInput: false
    });
  }, [formItemContext]);
  return /* @__PURE__ */ jsx("span", {
    className: cls,
    style: props.style,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    children: /* @__PURE__ */ jsx(FormItemInputContext.Provider, {
      value: groupFormItemContext,
      children: props.children
    })
  });
};
const Group$1 = Group;
function hasAddon$1(props) {
  return !!(props.addonBefore || props.addonAfter);
}
function hasPrefixSuffix$1(props) {
  return !!(props.prefix || props.suffix || props.allowClear);
}
function resolveOnChange$1(target, e, onChange, targetValue) {
  if (!onChange) {
    return;
  }
  var event = e;
  if (e.type === "click") {
    var currentTarget = target.cloneNode(true);
    event = Object.create(e, {
      target: {
        value: currentTarget
      },
      currentTarget: {
        value: currentTarget
      }
    });
    currentTarget.value = "";
    onChange(event);
    return;
  }
  if (targetValue !== void 0) {
    event = Object.create(e, {
      target: {
        value: target
      },
      currentTarget: {
        value: target
      }
    });
    target.value = targetValue;
    onChange(event);
    return;
  }
  onChange(event);
}
function triggerFocus$1(element, option) {
  if (!element)
    return;
  element.focus(option);
  var _ref = option || {}, cursor = _ref.cursor;
  if (cursor) {
    var len = element.value.length;
    switch (cursor) {
      case "start":
        element.setSelectionRange(0, 0);
        break;
      case "end":
        element.setSelectionRange(len, len);
        break;
      default:
        element.setSelectionRange(0, len);
    }
  }
}
function fixControlledValue$1(value) {
  if (typeof value === "undefined" || value === null) {
    return "";
  }
  return String(value);
}
var BaseInput = function BaseInput2(props) {
  var inputElement = props.inputElement, prefixCls = props.prefixCls, prefix = props.prefix, suffix = props.suffix, addonBefore = props.addonBefore, addonAfter = props.addonAfter, className = props.className, style = props.style, affixWrapperClassName = props.affixWrapperClassName, groupClassName = props.groupClassName, wrapperClassName = props.wrapperClassName, disabled = props.disabled, readOnly = props.readOnly, focused = props.focused, triggerFocus2 = props.triggerFocus, allowClear = props.allowClear, value = props.value, handleReset = props.handleReset, hidden = props.hidden;
  var containerRef = react.exports.useRef(null);
  var onInputClick = function onInputClick2(e) {
    var _containerRef$current;
    if ((_containerRef$current = containerRef.current) !== null && _containerRef$current !== void 0 && _containerRef$current.contains(e.target)) {
      triggerFocus2 === null || triggerFocus2 === void 0 ? void 0 : triggerFocus2();
    }
  };
  var getClearIcon = function getClearIcon2() {
    var _classNames;
    if (!allowClear) {
      return null;
    }
    var needClear = !disabled && !readOnly && value;
    var clearIconCls = "".concat(prefixCls, "-clear-icon");
    var iconNode = _typeof(allowClear) === "object" && allowClear !== null && allowClear !== void 0 && allowClear.clearIcon ? allowClear.clearIcon : "\u2716";
    return /* @__PURE__ */ jsx("span", {
      onClick: handleReset,
      onMouseDown: function onMouseDown(e) {
        return e.preventDefault();
      },
      className: classNames(clearIconCls, (_classNames = {}, _defineProperty(_classNames, "".concat(clearIconCls, "-hidden"), !needClear), _defineProperty(_classNames, "".concat(clearIconCls, "-has-suffix"), !!suffix), _classNames)),
      role: "button",
      tabIndex: -1,
      children: iconNode
    });
  };
  var element = /* @__PURE__ */ react.exports.cloneElement(inputElement, {
    value,
    hidden
  });
  if (hasPrefixSuffix$1(props)) {
    var _classNames2;
    var affixWrapperPrefixCls = "".concat(prefixCls, "-affix-wrapper");
    var affixWrapperCls = classNames(affixWrapperPrefixCls, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(affixWrapperPrefixCls, "-disabled"), disabled), _defineProperty(_classNames2, "".concat(affixWrapperPrefixCls, "-focused"), focused), _defineProperty(_classNames2, "".concat(affixWrapperPrefixCls, "-readonly"), readOnly), _defineProperty(_classNames2, "".concat(affixWrapperPrefixCls, "-input-with-clear-btn"), suffix && allowClear && value), _classNames2), !hasAddon$1(props) && className, affixWrapperClassName);
    var suffixNode = (suffix || allowClear) && /* @__PURE__ */ jsxs("span", {
      className: "".concat(prefixCls, "-suffix"),
      children: [getClearIcon(), suffix]
    });
    element = /* @__PURE__ */ jsxs("span", {
      className: affixWrapperCls,
      style,
      hidden: !hasAddon$1(props) && hidden,
      onClick: onInputClick,
      ref: containerRef,
      children: [prefix && /* @__PURE__ */ jsx("span", {
        className: "".concat(prefixCls, "-prefix"),
        children: prefix
      }), /* @__PURE__ */ react.exports.cloneElement(inputElement, {
        style: null,
        value,
        hidden: null
      }), suffixNode]
    });
  }
  if (hasAddon$1(props)) {
    var wrapperCls = "".concat(prefixCls, "-group");
    var addonCls = "".concat(wrapperCls, "-addon");
    var mergedWrapperClassName = classNames("".concat(prefixCls, "-wrapper"), wrapperCls, wrapperClassName);
    var mergedGroupClassName = classNames("".concat(prefixCls, "-group-wrapper"), className, groupClassName);
    return /* @__PURE__ */ jsx("span", {
      className: mergedGroupClassName,
      style,
      hidden,
      children: /* @__PURE__ */ jsxs("span", {
        className: mergedWrapperClassName,
        children: [addonBefore && /* @__PURE__ */ jsx("span", {
          className: addonCls,
          children: addonBefore
        }), /* @__PURE__ */ react.exports.cloneElement(element, {
          style: null,
          hidden: null
        }), addonAfter && /* @__PURE__ */ jsx("span", {
          className: addonCls,
          children: addonAfter
        })]
      })
    });
  }
  return element;
};
var _excluded$1 = ["autoComplete", "onChange", "onFocus", "onBlur", "onPressEnter", "onKeyDown", "prefixCls", "disabled", "htmlSize", "className", "maxLength", "suffix", "showCount", "type", "inputClassName"];
var Input$3 = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var autoComplete = props.autoComplete, onChange = props.onChange, onFocus = props.onFocus, onBlur = props.onBlur, onPressEnter = props.onPressEnter, onKeyDown = props.onKeyDown, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-input" : _props$prefixCls, disabled = props.disabled, htmlSize = props.htmlSize, className = props.className, maxLength = props.maxLength, suffix = props.suffix, showCount = props.showCount, _props$type = props.type, type = _props$type === void 0 ? "text" : _props$type, inputClassName = props.inputClassName, rest = _objectWithoutProperties(props, _excluded$1);
  var _useMergedState = useMergedState(props.defaultValue, {
    value: props.value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), value = _useMergedState2[0], setValue = _useMergedState2[1];
  var _useState = react.exports.useState(false), _useState2 = _slicedToArray(_useState, 2), focused = _useState2[0], setFocused = _useState2[1];
  var inputRef = react.exports.useRef(null);
  var focus = function focus2(option) {
    if (inputRef.current) {
      triggerFocus$1(inputRef.current, option);
    }
  };
  react.exports.useImperativeHandle(ref, function() {
    return {
      focus,
      blur: function blur() {
        var _inputRef$current;
        (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.blur();
      },
      setSelectionRange: function setSelectionRange(start, end, direction) {
        var _inputRef$current2;
        (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.setSelectionRange(start, end, direction);
      },
      select: function select() {
        var _inputRef$current3;
        (_inputRef$current3 = inputRef.current) === null || _inputRef$current3 === void 0 ? void 0 : _inputRef$current3.select();
      },
      input: inputRef.current
    };
  });
  react.exports.useEffect(function() {
    setFocused(function(prev) {
      return prev && disabled ? false : prev;
    });
  }, [disabled]);
  var handleChange = function handleChange2(e) {
    if (props.value === void 0) {
      setValue(e.target.value);
    }
    if (inputRef.current) {
      resolveOnChange$1(inputRef.current, e, onChange);
    }
  };
  var handleKeyDown = function handleKeyDown2(e) {
    if (onPressEnter && e.key === "Enter") {
      onPressEnter(e);
    }
    onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
  };
  var handleFocus = function handleFocus2(e) {
    setFocused(true);
    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
  };
  var handleBlur = function handleBlur2(e) {
    setFocused(false);
    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  var handleReset = function handleReset2(e) {
    setValue("");
    focus();
    if (inputRef.current) {
      resolveOnChange$1(inputRef.current, e, onChange);
    }
  };
  var getInputElement = function getInputElement2() {
    var otherProps = omit(props, [
      "prefixCls",
      "onPressEnter",
      "addonBefore",
      "addonAfter",
      "prefix",
      "suffix",
      "allowClear",
      "defaultValue",
      "showCount",
      "affixWrapperClassName",
      "groupClassName",
      "inputClassName",
      "wrapperClassName",
      "htmlSize"
    ]);
    return /* @__PURE__ */ jsx("input", {
      autoComplete,
      ...otherProps,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: classNames(prefixCls, _defineProperty({}, "".concat(prefixCls, "-disabled"), disabled), inputClassName, !hasAddon$1(props) && !hasPrefixSuffix$1(props) && className),
      ref: inputRef,
      size: htmlSize,
      type
    });
  };
  var getSuffix = function getSuffix2() {
    var hasMaxLength = Number(maxLength) > 0;
    if (suffix || showCount) {
      var val = fixControlledValue$1(value);
      var valueLength = _toConsumableArray(val).length;
      var dataCount = _typeof(showCount) === "object" ? showCount.formatter({
        value: val,
        count: valueLength,
        maxLength
      }) : "".concat(valueLength).concat(hasMaxLength ? " / ".concat(maxLength) : "");
      return /* @__PURE__ */ jsxs(Fragment, {
        children: [!!showCount && /* @__PURE__ */ jsx("span", {
          className: classNames("".concat(prefixCls, "-show-count-suffix"), _defineProperty({}, "".concat(prefixCls, "-show-count-has-suffix"), !!suffix)),
          children: dataCount
        }), suffix]
      });
    }
    return null;
  };
  return /* @__PURE__ */ jsx(BaseInput, {
    ...rest,
    prefixCls,
    className,
    inputElement: getInputElement(),
    handleReset,
    value: fixControlledValue$1(value),
    focused,
    triggerFocus: focus,
    suffix: getSuffix(),
    disabled
  });
});
function useRemovePasswordTimeout(inputRef, triggerOnMount) {
  var removePasswordTimeoutRef = react.exports.useRef([]);
  var removePasswordTimeout = function removePasswordTimeout2() {
    removePasswordTimeoutRef.current.push(setTimeout(function() {
      var _a, _b, _c, _d;
      if (((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.input) && ((_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.input.getAttribute("type")) === "password" && ((_c = inputRef.current) === null || _c === void 0 ? void 0 : _c.input.hasAttribute("value"))) {
        (_d = inputRef.current) === null || _d === void 0 ? void 0 : _d.input.removeAttribute("value");
      }
    }));
  };
  react.exports.useEffect(function() {
    if (triggerOnMount) {
      removePasswordTimeout();
    }
    return function() {
      return removePasswordTimeoutRef.current.forEach(function(timer) {
        if (timer) {
          clearTimeout(timer);
        }
      });
    };
  }, []);
  return removePasswordTimeout;
}
function hasPrefixSuffix(props) {
  return !!(props.prefix || props.suffix || props.allowClear);
}
var __rest$3 = globalThis && globalThis.__rest || function(s, e) {
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
function fixControlledValue(value) {
  if (typeof value === "undefined" || value === null) {
    return "";
  }
  return String(value);
}
function resolveOnChange(target, e, onChange, targetValue) {
  if (!onChange) {
    return;
  }
  var event = e;
  if (e.type === "click") {
    var currentTarget = target.cloneNode(true);
    event = Object.create(e, {
      target: {
        value: currentTarget
      },
      currentTarget: {
        value: currentTarget
      }
    });
    currentTarget.value = "";
    onChange(event);
    return;
  }
  if (targetValue !== void 0) {
    event = Object.create(e, {
      target: {
        value: target
      },
      currentTarget: {
        value: target
      }
    });
    target.value = targetValue;
    onChange(event);
    return;
  }
  onChange(event);
}
function triggerFocus(element, option) {
  if (!element) {
    return;
  }
  element.focus(option);
  var _ref = option || {}, cursor = _ref.cursor;
  if (cursor) {
    var len = element.value.length;
    switch (cursor) {
      case "start":
        element.setSelectionRange(0, 0);
        break;
      case "end":
        element.setSelectionRange(len, len);
        break;
      default:
        element.setSelectionRange(0, len);
        break;
    }
  }
}
var Input$2 = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _classNames, _classNames2, _classNames4;
  var customizePrefixCls = props.prefixCls, _props$bordered = props.bordered, bordered = _props$bordered === void 0 ? true : _props$bordered, customStatus = props.status, customSize = props.size, customDisabled = props.disabled, onBlur = props.onBlur, onFocus = props.onFocus, suffix = props.suffix, allowClear = props.allowClear, addonAfter = props.addonAfter, addonBefore = props.addonBefore, className = props.className, onChange = props.onChange, rest = __rest$3(props, ["prefixCls", "bordered", "status", "size", "disabled", "onBlur", "onFocus", "suffix", "allowClear", "addonAfter", "addonBefore", "className", "onChange"]);
  var _React$useContext = React.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction, input = _React$useContext.input;
  var prefixCls = getPrefixCls("input", customizePrefixCls);
  var inputRef = react.exports.useRef(null);
  var _useCompactItemContex = useCompactItemContext(prefixCls, direction), compactSize = _useCompactItemContex.compactSize, compactItemClassnames = _useCompactItemContex.compactItemClassnames;
  var size = React.useContext(SizeContext);
  var mergedSize = compactSize || customSize || size;
  var disabled = React.useContext(DisabledContext);
  var mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  var _useContext = react.exports.useContext(FormItemInputContext), contextStatus = _useContext.status, hasFeedback = _useContext.hasFeedback, feedbackIcon = _useContext.feedbackIcon;
  var mergedStatus = getMergedStatus(contextStatus, customStatus);
  var inputHasPrefixSuffix = hasPrefixSuffix(props) || !!hasFeedback;
  var prevHasPrefixSuffix = react.exports.useRef(inputHasPrefixSuffix);
  react.exports.useEffect(function() {
    if (inputHasPrefixSuffix && !prevHasPrefixSuffix.current)
      ;
    prevHasPrefixSuffix.current = inputHasPrefixSuffix;
  }, [inputHasPrefixSuffix]);
  var removePasswordTimeout = useRemovePasswordTimeout(inputRef, true);
  var handleBlur = function handleBlur2(e) {
    removePasswordTimeout();
    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  var handleFocus = function handleFocus2(e) {
    removePasswordTimeout();
    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
  };
  var handleChange = function handleChange2(e) {
    removePasswordTimeout();
    onChange === null || onChange === void 0 ? void 0 : onChange(e);
  };
  var suffixNode = (hasFeedback || suffix) && /* @__PURE__ */ jsxs(Fragment, {
    children: [suffix, hasFeedback && feedbackIcon]
  });
  var mergedAllowClear;
  if (_typeof(allowClear) === "object" && (allowClear === null || allowClear === void 0 ? void 0 : allowClear.clearIcon)) {
    mergedAllowClear = allowClear;
  } else if (allowClear) {
    mergedAllowClear = {
      clearIcon: /* @__PURE__ */ jsx(CloseCircleFilled, {})
    };
  }
  return /* @__PURE__ */ jsx(Input$3, {
    ref: composeRef(ref, inputRef),
    prefixCls,
    autoComplete: input === null || input === void 0 ? void 0 : input.autoComplete,
    ...rest,
    disabled: mergedDisabled || void 0,
    onBlur: handleBlur,
    onFocus: handleFocus,
    suffix: suffixNode,
    allowClear: mergedAllowClear,
    className: classNames(className, compactItemClassnames),
    onChange: handleChange,
    addonAfter: addonAfter && /* @__PURE__ */ jsx(NoCompactStyle, {
      children: /* @__PURE__ */ jsx(NoFormStyle, {
        override: true,
        status: true,
        children: addonAfter
      })
    }),
    addonBefore: addonBefore && /* @__PURE__ */ jsx(NoCompactStyle, {
      children: /* @__PURE__ */ jsx(NoFormStyle, {
        override: true,
        status: true,
        children: addonBefore
      })
    }),
    inputClassName: classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-sm"), mergedSize === "small"), _defineProperty(_classNames, "".concat(prefixCls, "-lg"), mergedSize === "large"), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === "rtl"), _defineProperty(_classNames, "".concat(prefixCls, "-borderless"), !bordered), _classNames), !inputHasPrefixSuffix && getStatusClassNames(prefixCls, mergedStatus)),
    affixWrapperClassName: classNames((_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-sm"), mergedSize === "small"), _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-lg"), mergedSize === "large"), _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-rtl"), direction === "rtl"), _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-borderless"), !bordered), _classNames2), getStatusClassNames("".concat(prefixCls, "-affix-wrapper"), mergedStatus, hasFeedback)),
    wrapperClassName: classNames(_defineProperty({}, "".concat(prefixCls, "-group-rtl"), direction === "rtl")),
    groupClassName: classNames((_classNames4 = {}, _defineProperty(_classNames4, "".concat(prefixCls, "-group-wrapper-sm"), mergedSize === "small"), _defineProperty(_classNames4, "".concat(prefixCls, "-group-wrapper-lg"), mergedSize === "large"), _defineProperty(_classNames4, "".concat(prefixCls, "-group-wrapper-rtl"), direction === "rtl"), _classNames4), getStatusClassNames("".concat(prefixCls, "-group-wrapper"), mergedStatus, hasFeedback))
  });
});
const InternalInput = Input$2;
var EyeInvisibleOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z" } }, { "tag": "path", "attrs": { "d": "M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z" } }] }, "name": "eye-invisible", "theme": "outlined" };
const EyeInvisibleOutlinedSvg = EyeInvisibleOutlined$2;
var EyeInvisibleOutlined = function EyeInvisibleOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: EyeInvisibleOutlinedSvg
    })
  });
};
EyeInvisibleOutlined.displayName = "EyeInvisibleOutlined";
const EyeInvisibleOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(EyeInvisibleOutlined);
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
var defaultIconRender = function defaultIconRender2(visible) {
  return visible ? /* @__PURE__ */ jsx(EyeOutlined$1, {}) : /* @__PURE__ */ jsx(EyeInvisibleOutlined$1, {});
};
var ActionMap = {
  click: "onClick",
  hover: "onMouseOver"
};
var Password = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _props$visibilityTogg = props.visibilityToggle, visibilityToggle = _props$visibilityTogg === void 0 ? true : _props$visibilityTogg;
  var visibilityControlled = _typeof(visibilityToggle) === "object" && visibilityToggle.visible !== void 0;
  var _useState = react.exports.useState(function() {
    return visibilityControlled ? visibilityToggle.visible : false;
  }), _useState2 = _slicedToArray(_useState, 2), visible = _useState2[0], setVisible = _useState2[1];
  var inputRef = react.exports.useRef(null);
  react.exports.useEffect(function() {
    if (visibilityControlled) {
      setVisible(visibilityToggle.visible);
    }
  }, [visibilityControlled, visibilityToggle]);
  var removePasswordTimeout = useRemovePasswordTimeout(inputRef);
  var onVisibleChange = function onVisibleChange2() {
    var disabled = props.disabled;
    if (disabled) {
      return;
    }
    if (visible) {
      removePasswordTimeout();
    }
    setVisible(function(prevState) {
      var _a;
      var newState = !prevState;
      if (_typeof(visibilityToggle) === "object") {
        (_a = visibilityToggle.onVisibleChange) === null || _a === void 0 ? void 0 : _a.call(visibilityToggle, newState);
      }
      return newState;
    });
  };
  var getIcon = function getIcon2(prefixCls) {
    var _iconProps;
    var _props$action = props.action, action = _props$action === void 0 ? "click" : _props$action, _props$iconRender = props.iconRender, iconRender = _props$iconRender === void 0 ? defaultIconRender : _props$iconRender;
    var iconTrigger = ActionMap[action] || "";
    var icon = iconRender(visible);
    var iconProps = (_iconProps = {}, _defineProperty(_iconProps, iconTrigger, onVisibleChange), _defineProperty(_iconProps, "className", "".concat(prefixCls, "-icon")), _defineProperty(_iconProps, "key", "passwordIcon"), _defineProperty(_iconProps, "onMouseDown", function onMouseDown(e) {
      e.preventDefault();
    }), _defineProperty(_iconProps, "onMouseUp", function onMouseUp(e) {
      e.preventDefault();
    }), _iconProps);
    return /* @__PURE__ */ react.exports.cloneElement(/* @__PURE__ */ react.exports.isValidElement(icon) ? icon : /* @__PURE__ */ jsx("span", {
      children: icon
    }), iconProps);
  };
  var renderPassword = function renderPassword2(_ref) {
    var getPrefixCls = _ref.getPrefixCls;
    var className = props.className, customizePrefixCls = props.prefixCls, customizeInputPrefixCls = props.inputPrefixCls, size = props.size, restProps = __rest$2(props, ["className", "prefixCls", "inputPrefixCls", "size"]);
    var inputPrefixCls = getPrefixCls("input", customizeInputPrefixCls);
    var prefixCls = getPrefixCls("input-password", customizePrefixCls);
    var suffixIcon = visibilityToggle && getIcon(prefixCls);
    var inputClassName = classNames(prefixCls, className, _defineProperty({}, "".concat(prefixCls, "-").concat(size), !!size));
    var omittedProps = _extends(_extends({}, omit(restProps, ["suffix", "iconRender", "visibilityToggle"])), {
      type: visible ? "text" : "password",
      className: inputClassName,
      prefixCls: inputPrefixCls,
      suffix: suffixIcon
    });
    if (size) {
      omittedProps.size = size;
    }
    return /* @__PURE__ */ jsx(InternalInput, {
      ref: composeRef(ref, inputRef),
      ...omittedProps
    });
  };
  return /* @__PURE__ */ jsx(ConfigConsumer, {
    children: renderPassword
  });
});
const Password$1 = Password;
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
var Search = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _classNames;
  var customizePrefixCls = props.prefixCls, customizeInputPrefixCls = props.inputPrefixCls, className = props.className, customizeSize = props.size, suffix = props.suffix, _props$enterButton = props.enterButton, enterButton = _props$enterButton === void 0 ? false : _props$enterButton, addonAfter = props.addonAfter, loading = props.loading, disabled = props.disabled, customOnSearch = props.onSearch, customOnChange = props.onChange, onCompositionStart = props.onCompositionStart, onCompositionEnd = props.onCompositionEnd, restProps = __rest$1(props, ["prefixCls", "inputPrefixCls", "className", "size", "suffix", "enterButton", "addonAfter", "loading", "disabled", "onSearch", "onChange", "onCompositionStart", "onCompositionEnd"]);
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction;
  var contextSize = react.exports.useContext(SizeContext);
  var composedRef = react.exports.useRef(false);
  var prefixCls = getPrefixCls("input-search", customizePrefixCls);
  var inputPrefixCls = getPrefixCls("input", customizeInputPrefixCls);
  var _useCompactItemContex = useCompactItemContext(prefixCls, direction), compactSize = _useCompactItemContex.compactSize;
  var size = compactSize || customizeSize || contextSize;
  var inputRef = react.exports.useRef(null);
  var onChange = function onChange2(e) {
    if (e && e.target && e.type === "click" && customOnSearch) {
      customOnSearch(e.target.value, e);
    }
    if (customOnChange) {
      customOnChange(e);
    }
  };
  var onMouseDown = function onMouseDown2(e) {
    var _a;
    if (document.activeElement === ((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.input)) {
      e.preventDefault();
    }
  };
  var onSearch = function onSearch2(e) {
    var _a, _b;
    if (customOnSearch) {
      customOnSearch((_b = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.value, e);
    }
  };
  var onPressEnter = function onPressEnter2(e) {
    if (composedRef.current || loading) {
      return;
    }
    onSearch(e);
  };
  var searchIcon = typeof enterButton === "boolean" ? /* @__PURE__ */ jsx(SearchOutlined, {}) : null;
  var btnClassName = "".concat(prefixCls, "-button");
  var button;
  var enterButtonAsElement = enterButton || {};
  var isAntdButton = enterButtonAsElement.type && enterButtonAsElement.type.__ANT_BUTTON === true;
  if (isAntdButton || enterButtonAsElement.type === "button") {
    button = cloneElement(enterButtonAsElement, _extends({
      onMouseDown,
      onClick: function onClick(e) {
        var _a, _b;
        (_b = (_a = enterButtonAsElement === null || enterButtonAsElement === void 0 ? void 0 : enterButtonAsElement.props) === null || _a === void 0 ? void 0 : _a.onClick) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        onSearch(e);
      },
      key: "enterButton"
    }, isAntdButton ? {
      className: btnClassName,
      size
    } : {}));
  } else {
    button = /* @__PURE__ */ jsx(Button, {
      className: btnClassName,
      type: enterButton ? "primary" : void 0,
      size,
      disabled,
      onMouseDown,
      onClick: onSearch,
      loading,
      icon: searchIcon,
      children: enterButton
    }, "enterButton");
  }
  if (addonAfter) {
    button = [button, cloneElement(addonAfter, {
      key: "addonAfter"
    })];
  }
  var cls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === "rtl"), _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), !!size), _defineProperty(_classNames, "".concat(prefixCls, "-with-button"), !!enterButton), _classNames), className);
  var handleOnCompositionStart = function handleOnCompositionStart2(e) {
    composedRef.current = true;
    onCompositionStart === null || onCompositionStart === void 0 ? void 0 : onCompositionStart(e);
  };
  var handleOnCompositionEnd = function handleOnCompositionEnd2(e) {
    composedRef.current = false;
    onCompositionEnd === null || onCompositionEnd === void 0 ? void 0 : onCompositionEnd(e);
  };
  return /* @__PURE__ */ jsx(InternalInput, {
    ref: composeRef(inputRef, ref),
    onPressEnter,
    ...restProps,
    size,
    onCompositionStart: handleOnCompositionStart,
    onCompositionEnd: handleOnCompositionEnd,
    prefixCls: inputPrefixCls,
    addonAfter: button,
    suffix,
    onChange,
    className: cls,
    disabled
  });
});
const Search$1 = Search;
var HIDDEN_TEXTAREA_STYLE = "\n  min-height:0 !important;\n  max-height:none !important;\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important;\n  pointer-events: none !important;\n";
var SIZING_STYLE = ["letter-spacing", "line-height", "padding-top", "padding-bottom", "font-family", "font-weight", "font-size", "font-variant", "text-rendering", "text-transform", "width", "text-indent", "padding-left", "padding-right", "border-width", "box-sizing", "word-break"];
var computedStyleCache = {};
var hiddenTextarea;
function calculateNodeStyling(node) {
  var useCache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var nodeRef = node.getAttribute("id") || node.getAttribute("data-reactid") || node.getAttribute("name");
  if (useCache && computedStyleCache[nodeRef]) {
    return computedStyleCache[nodeRef];
  }
  var style = window.getComputedStyle(node);
  var boxSizing = style.getPropertyValue("box-sizing") || style.getPropertyValue("-moz-box-sizing") || style.getPropertyValue("-webkit-box-sizing");
  var paddingSize = parseFloat(style.getPropertyValue("padding-bottom")) + parseFloat(style.getPropertyValue("padding-top"));
  var borderSize = parseFloat(style.getPropertyValue("border-bottom-width")) + parseFloat(style.getPropertyValue("border-top-width"));
  var sizingStyle = SIZING_STYLE.map(function(name) {
    return "".concat(name, ":").concat(style.getPropertyValue(name));
  }).join(";");
  var nodeInfo = {
    sizingStyle,
    paddingSize,
    borderSize,
    boxSizing
  };
  if (useCache && nodeRef) {
    computedStyleCache[nodeRef] = nodeInfo;
  }
  return nodeInfo;
}
function calculateAutoSizeStyle(uiTextNode) {
  var useCache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var minRows = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
  var maxRows = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    hiddenTextarea.setAttribute("tab-index", "-1");
    hiddenTextarea.setAttribute("aria-hidden", "true");
    document.body.appendChild(hiddenTextarea);
  }
  if (uiTextNode.getAttribute("wrap")) {
    hiddenTextarea.setAttribute("wrap", uiTextNode.getAttribute("wrap"));
  } else {
    hiddenTextarea.removeAttribute("wrap");
  }
  var _calculateNodeStyling = calculateNodeStyling(uiTextNode, useCache), paddingSize = _calculateNodeStyling.paddingSize, borderSize = _calculateNodeStyling.borderSize, boxSizing = _calculateNodeStyling.boxSizing, sizingStyle = _calculateNodeStyling.sizingStyle;
  hiddenTextarea.setAttribute("style", "".concat(sizingStyle, ";").concat(HIDDEN_TEXTAREA_STYLE));
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || "";
  var minHeight = void 0;
  var maxHeight = void 0;
  var overflowY;
  var height = hiddenTextarea.scrollHeight;
  if (boxSizing === "border-box") {
    height += borderSize;
  } else if (boxSizing === "content-box") {
    height -= paddingSize;
  }
  if (minRows !== null || maxRows !== null) {
    hiddenTextarea.value = " ";
    var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows;
      if (boxSizing === "border-box") {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows;
      if (boxSizing === "border-box") {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      overflowY = height > maxHeight ? "" : "hidden";
      height = Math.min(maxHeight, height);
    }
  }
  var style = {
    height,
    overflowY,
    resize: "none"
  };
  if (minHeight) {
    style.minHeight = minHeight;
  }
  if (maxHeight) {
    style.maxHeight = maxHeight;
  }
  return style;
}
var _excluded = ["prefixCls", "onPressEnter", "defaultValue", "value", "autoSize", "onResize", "className", "style", "disabled", "onChange", "onInternalAutoSize"];
var RESIZE_START = 0;
var RESIZE_MEASURING = 1;
var RESIZE_STABLE = 2;
var ResizableTextArea = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-textarea" : _props$prefixCls;
  props.onPressEnter;
  var defaultValue = props.defaultValue, value = props.value, autoSize = props.autoSize, onResize = props.onResize, className = props.className, style = props.style, disabled = props.disabled, onChange = props.onChange;
  props.onInternalAutoSize;
  var restProps = _objectWithoutProperties(props, _excluded);
  var _useMergedState = useMergedState(defaultValue, {
    value,
    postState: function postState(val) {
      return val !== null && val !== void 0 ? val : "";
    }
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedValue = _useMergedState2[0], setMergedValue = _useMergedState2[1];
  var onInternalChange = function onInternalChange2(event) {
    setMergedValue(event.target.value);
    onChange === null || onChange === void 0 ? void 0 : onChange(event);
  };
  var textareaRef = react.exports.useRef();
  react.exports.useImperativeHandle(ref, function() {
    return {
      textArea: textareaRef.current
    };
  });
  var _React$useMemo = react.exports.useMemo(function() {
    if (autoSize && _typeof(autoSize) === "object") {
      return [autoSize.minRows, autoSize.maxRows];
    }
    return [];
  }, [autoSize]), _React$useMemo2 = _slicedToArray(_React$useMemo, 2), minRows = _React$useMemo2[0], maxRows = _React$useMemo2[1];
  var needAutoSize = !!autoSize;
  var fixFirefoxAutoScroll = function fixFirefoxAutoScroll2() {
    try {
      if (document.activeElement === textareaRef.current) {
        var _textareaRef$current = textareaRef.current, selectionStart = _textareaRef$current.selectionStart, selectionEnd = _textareaRef$current.selectionEnd, scrollTop = _textareaRef$current.scrollTop;
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
        textareaRef.current.scrollTop = scrollTop;
      }
    } catch (e) {
    }
  };
  var _React$useState = react.exports.useState(RESIZE_STABLE), _React$useState2 = _slicedToArray(_React$useState, 2), resizeState = _React$useState2[0], setResizeState = _React$useState2[1];
  var _React$useState3 = react.exports.useState(), _React$useState4 = _slicedToArray(_React$useState3, 2), autoSizeStyle = _React$useState4[0], setAutoSizeStyle = _React$useState4[1];
  var startResize = function startResize2() {
    setResizeState(RESIZE_START);
  };
  useLayoutEffect(function() {
    if (needAutoSize) {
      startResize();
    }
  }, [value, minRows, maxRows, needAutoSize]);
  useLayoutEffect(function() {
    if (resizeState === RESIZE_START) {
      setResizeState(RESIZE_MEASURING);
    } else if (resizeState === RESIZE_MEASURING) {
      var textareaStyles = calculateAutoSizeStyle(textareaRef.current, false, minRows, maxRows);
      setResizeState(RESIZE_STABLE);
      setAutoSizeStyle(textareaStyles);
    } else {
      fixFirefoxAutoScroll();
    }
  }, [resizeState]);
  var resizeRafRef = react.exports.useRef();
  var cleanRaf = function cleanRaf2() {
    wrapperRaf.cancel(resizeRafRef.current);
  };
  var onInternalResize = function onInternalResize2(size) {
    if (resizeState === RESIZE_STABLE) {
      onResize === null || onResize === void 0 ? void 0 : onResize(size);
      if (autoSize) {
        cleanRaf();
        resizeRafRef.current = wrapperRaf(function() {
          startResize();
        });
      }
    }
  };
  react.exports.useEffect(function() {
    return cleanRaf;
  }, []);
  var mergedAutoSizeStyle = needAutoSize ? autoSizeStyle : null;
  var mergedStyle = _objectSpread2(_objectSpread2({}, style), mergedAutoSizeStyle);
  if (resizeState === RESIZE_START || resizeState === RESIZE_MEASURING) {
    mergedStyle.overflowY = "hidden";
    mergedStyle.overflowX = "hidden";
  }
  return /* @__PURE__ */ jsx(RefResizeObserver, {
    onResize: onInternalResize,
    disabled: !(autoSize || onResize),
    children: /* @__PURE__ */ jsx("textarea", {
      ...restProps,
      ref: textareaRef,
      style: mergedStyle,
      className: classNames(prefixCls, className, _defineProperty({}, "".concat(prefixCls, "-disabled"), disabled)),
      disabled,
      value: mergedValue,
      onChange: onInternalChange
    })
  });
});
var TextArea$2 = /* @__PURE__ */ function(_React$Component) {
  _inherits(TextArea2, _React$Component);
  var _super = _createSuper(TextArea2);
  function TextArea2(props) {
    var _this;
    _classCallCheck(this, TextArea2);
    _this = _super.call(this, props);
    _this.resizableTextArea = void 0;
    _this.focus = function() {
      _this.resizableTextArea.textArea.focus();
    };
    _this.saveTextArea = function(resizableTextArea) {
      _this.resizableTextArea = resizableTextArea;
    };
    _this.handleChange = function(e) {
      var onChange = _this.props.onChange;
      _this.setValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };
    _this.handleKeyDown = function(e) {
      var _this$props = _this.props, onPressEnter = _this$props.onPressEnter, onKeyDown = _this$props.onKeyDown;
      if (e.keyCode === 13 && onPressEnter) {
        onPressEnter(e);
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };
    var value = typeof props.value === "undefined" || props.value === null ? props.defaultValue : props.value;
    _this.state = {
      value
    };
    return _this;
  }
  _createClass(TextArea2, [{
    key: "setValue",
    value: function setValue(value, callback) {
      if (!("value" in this.props)) {
        this.setState({
          value
        }, callback);
      }
    }
  }, {
    key: "blur",
    value: function blur() {
      this.resizableTextArea.textArea.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return /* @__PURE__ */ jsx(ResizableTextArea, {
        ...this.props,
        value: this.state.value,
        onKeyDown: this.handleKeyDown,
        onChange: this.handleChange,
        ref: this.saveTextArea
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      if ("value" in nextProps) {
        return {
          value: nextProps.value
        };
      }
      return null;
    }
  }]);
  return TextArea2;
}(react.exports.Component);
var ClearableInputType = tuple("text", "input");
function hasAddon(props) {
  return !!(props.addonBefore || props.addonAfter);
}
var ClearableLabeledInput = /* @__PURE__ */ function(_React$Component) {
  _inherits(ClearableLabeledInput2, _React$Component);
  var _super = _createSuper(ClearableLabeledInput2);
  function ClearableLabeledInput2() {
    _classCallCheck(this, ClearableLabeledInput2);
    return _super.apply(this, arguments);
  }
  _createClass(ClearableLabeledInput2, [{
    key: "renderClearIcon",
    value: function renderClearIcon(prefixCls) {
      var _classNames;
      var _this$props = this.props, value = _this$props.value, disabled = _this$props.disabled, readOnly = _this$props.readOnly, handleReset = _this$props.handleReset, suffix = _this$props.suffix;
      var needClear = !disabled && !readOnly && value;
      var className = "".concat(prefixCls, "-clear-icon");
      return /* @__PURE__ */ jsx(CloseCircleFilled, {
        onClick: handleReset,
        onMouseDown: function onMouseDown(e) {
          return e.preventDefault();
        },
        className: classNames((_classNames = {}, _defineProperty(_classNames, "".concat(className, "-hidden"), !needClear), _defineProperty(_classNames, "".concat(className, "-has-suffix"), !!suffix), _classNames), className),
        role: "button"
      });
    }
  }, {
    key: "renderTextAreaWithClearIcon",
    value: function renderTextAreaWithClearIcon(prefixCls, element, statusContext) {
      var _classNames2;
      var _this$props2 = this.props, value = _this$props2.value, allowClear = _this$props2.allowClear, className = _this$props2.className, focused = _this$props2.focused, style = _this$props2.style, direction = _this$props2.direction, bordered = _this$props2.bordered, hidden = _this$props2.hidden, customStatus = _this$props2.status;
      var contextStatus = statusContext.status, hasFeedback = statusContext.hasFeedback;
      if (!allowClear) {
        return cloneElement(element, {
          value
        });
      }
      var affixWrapperCls = classNames("".concat(prefixCls, "-affix-wrapper"), "".concat(prefixCls, "-affix-wrapper-textarea-with-clear-btn"), getStatusClassNames("".concat(prefixCls, "-affix-wrapper"), getMergedStatus(contextStatus, customStatus), hasFeedback), (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-focused"), focused), _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-rtl"), direction === "rtl"), _defineProperty(_classNames2, "".concat(prefixCls, "-affix-wrapper-borderless"), !bordered), _defineProperty(_classNames2, "".concat(className), !hasAddon(this.props) && className), _classNames2));
      return /* @__PURE__ */ jsxs("span", {
        className: affixWrapperCls,
        style,
        hidden,
        children: [cloneElement(element, {
          style: null,
          value
        }), this.renderClearIcon(prefixCls)]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      return /* @__PURE__ */ jsx(FormItemInputContext.Consumer, {
        children: function(statusContext) {
          var _this$props3 = _this.props, prefixCls = _this$props3.prefixCls, inputType = _this$props3.inputType, element = _this$props3.element;
          if (inputType === ClearableInputType[0]) {
            return _this.renderTextAreaWithClearIcon(prefixCls, element, statusContext);
          }
        }
      });
    }
  }]);
  return ClearableLabeledInput2;
}(react.exports.Component);
const ClearableLabeledInput$1 = ClearableLabeledInput;
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
function fixEmojiLength(value, maxLength) {
  return _toConsumableArray(value || "").slice(0, maxLength).join("");
}
function setTriggerValue(isCursorInEnd, preValue, triggerValue, maxLength) {
  var newTriggerValue = triggerValue;
  if (isCursorInEnd) {
    newTriggerValue = fixEmojiLength(triggerValue, maxLength);
  } else if (_toConsumableArray(preValue || "").length < triggerValue.length && _toConsumableArray(triggerValue || "").length > maxLength) {
    newTriggerValue = preValue;
  }
  return newTriggerValue;
}
var TextArea = /* @__PURE__ */ react.exports.forwardRef(function(_a, ref) {
  var _classNames;
  var customizePrefixCls = _a.prefixCls, _a$bordered = _a.bordered, bordered = _a$bordered === void 0 ? true : _a$bordered, _a$showCount = _a.showCount, showCount = _a$showCount === void 0 ? false : _a$showCount, maxLength = _a.maxLength, className = _a.className, style = _a.style, customizeSize = _a.size, customDisabled = _a.disabled, onCompositionStart = _a.onCompositionStart, onCompositionEnd = _a.onCompositionEnd, onChange = _a.onChange, onFocus = _a.onFocus, onBlur = _a.onBlur, customStatus = _a.status, props = __rest(_a, ["prefixCls", "bordered", "showCount", "maxLength", "className", "style", "size", "disabled", "onCompositionStart", "onCompositionEnd", "onChange", "onFocus", "onBlur", "status"]);
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction;
  var size = react.exports.useContext(SizeContext);
  var disabled = react.exports.useContext(DisabledContext);
  var mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  var _React$useContext2 = react.exports.useContext(FormItemInputContext), contextStatus = _React$useContext2.status, hasFeedback = _React$useContext2.hasFeedback, isFormItemInput = _React$useContext2.isFormItemInput, feedbackIcon = _React$useContext2.feedbackIcon;
  var mergedStatus = getMergedStatus(contextStatus, customStatus);
  var innerRef = react.exports.useRef(null);
  var clearableInputRef = react.exports.useRef(null);
  var _React$useState = react.exports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), compositing = _React$useState2[0], setCompositing = _React$useState2[1];
  var _React$useState3 = react.exports.useState(false), _React$useState4 = _slicedToArray(_React$useState3, 2), focused = _React$useState4[0], setFocused = _React$useState4[1];
  var oldCompositionValueRef = react.exports.useRef();
  var oldSelectionStartRef = react.exports.useRef(0);
  var _useMergedState = useMergedState(props.defaultValue, {
    value: props.value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), value = _useMergedState2[0], setValue = _useMergedState2[1];
  var hidden = props.hidden;
  var handleSetValue = function handleSetValue2(val2, callback) {
    if (props.value === void 0) {
      setValue(val2);
      callback === null || callback === void 0 ? void 0 : callback();
    }
  };
  var hasMaxLength = Number(maxLength) > 0;
  var onInternalCompositionStart = function onInternalCompositionStart2(e) {
    setCompositing(true);
    oldCompositionValueRef.current = value;
    oldSelectionStartRef.current = e.currentTarget.selectionStart;
    onCompositionStart === null || onCompositionStart === void 0 ? void 0 : onCompositionStart(e);
  };
  var onInternalCompositionEnd = function onInternalCompositionEnd2(e) {
    var _a2;
    setCompositing(false);
    var triggerValue = e.currentTarget.value;
    if (hasMaxLength) {
      var isCursorInEnd = oldSelectionStartRef.current >= maxLength + 1 || oldSelectionStartRef.current === ((_a2 = oldCompositionValueRef.current) === null || _a2 === void 0 ? void 0 : _a2.length);
      triggerValue = setTriggerValue(isCursorInEnd, oldCompositionValueRef.current, triggerValue, maxLength);
    }
    if (triggerValue !== value) {
      handleSetValue(triggerValue);
      resolveOnChange(e.currentTarget, e, onChange, triggerValue);
    }
    onCompositionEnd === null || onCompositionEnd === void 0 ? void 0 : onCompositionEnd(e);
  };
  var handleChange = function handleChange2(e) {
    var triggerValue = e.target.value;
    if (!compositing && hasMaxLength) {
      var isCursorInEnd = e.target.selectionStart >= maxLength + 1 || e.target.selectionStart === triggerValue.length || !e.target.selectionStart;
      triggerValue = setTriggerValue(isCursorInEnd, value, triggerValue, maxLength);
    }
    handleSetValue(triggerValue);
    resolveOnChange(e.currentTarget, e, onChange, triggerValue);
  };
  var handleBlur = function handleBlur2(e) {
    setFocused(false);
    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  var handleFocus = function handleFocus2(e) {
    setFocused(true);
    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
  };
  react.exports.useEffect(function() {
    setFocused(function(prev) {
      return !mergedDisabled && prev;
    });
  }, [mergedDisabled]);
  var handleReset = function handleReset2(e) {
    var _a2, _b, _c;
    handleSetValue("");
    (_a2 = innerRef.current) === null || _a2 === void 0 ? void 0 : _a2.focus();
    resolveOnChange((_c = (_b = innerRef.current) === null || _b === void 0 ? void 0 : _b.resizableTextArea) === null || _c === void 0 ? void 0 : _c.textArea, e, onChange);
  };
  var prefixCls = getPrefixCls("input", customizePrefixCls);
  react.exports.useImperativeHandle(ref, function() {
    var _a2;
    return {
      resizableTextArea: (_a2 = innerRef.current) === null || _a2 === void 0 ? void 0 : _a2.resizableTextArea,
      focus: function focus(option) {
        var _a3, _b;
        triggerFocus((_b = (_a3 = innerRef.current) === null || _a3 === void 0 ? void 0 : _a3.resizableTextArea) === null || _b === void 0 ? void 0 : _b.textArea, option);
      },
      blur: function blur() {
        var _a3;
        return (_a3 = innerRef.current) === null || _a3 === void 0 ? void 0 : _a3.blur();
      }
    };
  });
  var textArea = /* @__PURE__ */ jsx(TextArea$2, {
    ...omit(props, ["allowClear"]),
    disabled: mergedDisabled,
    className: classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-borderless"), !bordered), _defineProperty(_classNames, className, className && !showCount), _defineProperty(_classNames, "".concat(prefixCls, "-sm"), size === "small" || customizeSize === "small"), _defineProperty(_classNames, "".concat(prefixCls, "-lg"), size === "large" || customizeSize === "large"), _classNames), getStatusClassNames(prefixCls, mergedStatus)),
    style: showCount ? {
      resize: style === null || style === void 0 ? void 0 : style.resize
    } : style,
    prefixCls,
    onCompositionStart: onInternalCompositionStart,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onCompositionEnd: onInternalCompositionEnd,
    ref: innerRef
  });
  var val = fixControlledValue(value);
  if (!compositing && hasMaxLength && (props.value === null || props.value === void 0)) {
    val = fixEmojiLength(val, maxLength);
  }
  var textareaNode = /* @__PURE__ */ jsx(ClearableLabeledInput$1, {
    disabled: mergedDisabled,
    focused,
    ...props,
    prefixCls,
    direction,
    inputType: "text",
    value: val,
    element: textArea,
    handleReset,
    ref: clearableInputRef,
    bordered,
    status: customStatus,
    style: showCount ? void 0 : style
  });
  if (showCount || hasFeedback) {
    var _classNames2;
    var valueLength = _toConsumableArray(val).length;
    var dataCount = "";
    if (_typeof(showCount) === "object") {
      dataCount = showCount.formatter({
        value: val,
        count: valueLength,
        maxLength
      });
    } else {
      dataCount = "".concat(valueLength).concat(hasMaxLength ? " / ".concat(maxLength) : "");
    }
    return /* @__PURE__ */ jsxs("div", {
      hidden,
      className: classNames("".concat(prefixCls, "-textarea"), (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-textarea-rtl"), direction === "rtl"), _defineProperty(_classNames2, "".concat(prefixCls, "-textarea-show-count"), showCount), _defineProperty(_classNames2, "".concat(prefixCls, "-textarea-in-form-item"), isFormItemInput), _classNames2), getStatusClassNames("".concat(prefixCls, "-textarea"), mergedStatus, hasFeedback), className),
      style,
      "data-count": dataCount,
      children: [textareaNode, hasFeedback && /* @__PURE__ */ jsx("span", {
        className: "".concat(prefixCls, "-textarea-suffix"),
        children: feedbackIcon
      })]
    });
  }
  return textareaNode;
});
const TextArea$1 = TextArea;
var Input = InternalInput;
Input.Group = Group$1;
Input.Search = Search$1;
Input.TextArea = TextArea$1;
Input.Password = Password$1;
const Input$1 = Input;
export {
  Input$1 as I
};
