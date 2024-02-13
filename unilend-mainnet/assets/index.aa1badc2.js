import { a$ as react, bM as _objectWithoutProperties, bN as useMergedState, bO as _slicedToArray, bP as classNames, bQ as _defineProperty, b0 as jsxs, b1 as jsx, bR as KeyCode, bS as ConfigContext, bT as SizeContext, bU as DisabledContext, bV as Wave, bW as LoadingOutlined } from "./index.a9e8707a.js";
var Switch$2 = react.exports.forwardRef(function(_ref, ref) {
  var _classNames;
  var _ref$prefixCls = _ref.prefixCls, prefixCls = _ref$prefixCls === void 0 ? "rc-switch" : _ref$prefixCls, className = _ref.className, checked = _ref.checked, defaultChecked = _ref.defaultChecked, disabled = _ref.disabled, loadingIcon = _ref.loadingIcon, checkedChildren = _ref.checkedChildren, unCheckedChildren = _ref.unCheckedChildren, onClick = _ref.onClick, onChange = _ref.onChange, onKeyDown = _ref.onKeyDown, restProps = _objectWithoutProperties(_ref, ["prefixCls", "className", "checked", "defaultChecked", "disabled", "loadingIcon", "checkedChildren", "unCheckedChildren", "onClick", "onChange", "onKeyDown"]);
  var _useMergedState = useMergedState(false, {
    value: checked,
    defaultValue: defaultChecked
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), innerChecked = _useMergedState2[0], setInnerChecked = _useMergedState2[1];
  function triggerChange(newChecked, event) {
    var mergedChecked = innerChecked;
    if (!disabled) {
      mergedChecked = newChecked;
      setInnerChecked(mergedChecked);
      onChange === null || onChange === void 0 ? void 0 : onChange(mergedChecked, event);
    }
    return mergedChecked;
  }
  function onInternalKeyDown(e) {
    if (e.which === KeyCode.LEFT) {
      triggerChange(false, e);
    } else if (e.which === KeyCode.RIGHT) {
      triggerChange(true, e);
    }
    onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
  }
  function onInternalClick(e) {
    var ret = triggerChange(!innerChecked, e);
    onClick === null || onClick === void 0 ? void 0 : onClick(ret, e);
  }
  var switchClassName = classNames(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-checked"), innerChecked), _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _classNames));
  return /* @__PURE__ */ jsxs("button", {
    ...Object.assign({}, restProps, {
      type: "button",
      role: "switch",
      "aria-checked": innerChecked,
      disabled,
      className: switchClassName,
      ref,
      onKeyDown: onInternalKeyDown,
      onClick: onInternalClick
    }),
    children: [loadingIcon, /* @__PURE__ */ jsx("span", {
      className: "".concat(prefixCls, "-inner"),
      children: innerChecked ? checkedChildren : unCheckedChildren
    })]
  });
});
Switch$2.displayName = "Switch";
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
var Switch = /* @__PURE__ */ react.exports.forwardRef(function(_a, ref) {
  var _classNames;
  var customizePrefixCls = _a.prefixCls, customizeSize = _a.size, customDisabled = _a.disabled, loading = _a.loading, _a$className = _a.className, className = _a$className === void 0 ? "" : _a$className, props = __rest(_a, ["prefixCls", "size", "disabled", "loading", "className"]);
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction;
  var size = react.exports.useContext(SizeContext);
  var disabled = react.exports.useContext(DisabledContext);
  var mergedDisabled = (customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled) || loading;
  var prefixCls = getPrefixCls("switch", customizePrefixCls);
  var loadingIcon = /* @__PURE__ */ jsx("div", {
    className: "".concat(prefixCls, "-handle"),
    children: loading && /* @__PURE__ */ jsx(LoadingOutlined, {
      className: "".concat(prefixCls, "-loading-icon")
    })
  });
  var classes = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-small"), (customizeSize || size) === "small"), _defineProperty(_classNames, "".concat(prefixCls, "-loading"), loading), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === "rtl"), _classNames), className);
  return /* @__PURE__ */ jsx(Wave, {
    insertExtraNode: true,
    children: /* @__PURE__ */ jsx(Switch$2, {
      ...props,
      prefixCls,
      className: classes,
      disabled: mergedDisabled,
      ref,
      loadingIcon
    })
  });
});
Switch.__ANT_SWITCH = true;
const Switch$1 = Switch;
export {
  Switch$1 as S
};
