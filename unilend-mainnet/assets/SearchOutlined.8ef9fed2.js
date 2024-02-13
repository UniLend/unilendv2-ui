import { cI as index, ch as _inherits, ci as _createSuper, cj as _classCallCheck, ck as _createClass, a$ as react, b1 as jsx, cJ as supportRef, c6 as composeRef, bY as _objectSpread2, cl as findDOMNode, cg as toArray, cK as tuple, bP as classNames, bQ as _defineProperty, bX as AntdIcon } from "./index.a9e8707a.js";
var elementListeners = /* @__PURE__ */ new Map();
function onResize(entities) {
  entities.forEach(function(entity) {
    var _elementListeners$get;
    var target = entity.target;
    (_elementListeners$get = elementListeners.get(target)) === null || _elementListeners$get === void 0 ? void 0 : _elementListeners$get.forEach(function(listener) {
      return listener(target);
    });
  });
}
var resizeObserver = new index(onResize);
function observe(element, callback) {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, /* @__PURE__ */ new Set());
    resizeObserver.observe(element);
  }
  elementListeners.get(element).add(callback);
}
function unobserve(element, callback) {
  if (elementListeners.has(element)) {
    elementListeners.get(element).delete(callback);
    if (!elementListeners.get(element).size) {
      resizeObserver.unobserve(element);
      elementListeners.delete(element);
    }
  }
}
var DomWrapper = /* @__PURE__ */ function(_React$Component) {
  _inherits(DomWrapper2, _React$Component);
  var _super = _createSuper(DomWrapper2);
  function DomWrapper2() {
    _classCallCheck(this, DomWrapper2);
    return _super.apply(this, arguments);
  }
  _createClass(DomWrapper2, [{
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return DomWrapper2;
}(react.exports.Component);
var CollectionContext = /* @__PURE__ */ react.exports.createContext(null);
function Collection(_ref) {
  var children = _ref.children, onBatchResize = _ref.onBatchResize;
  var resizeIdRef = react.exports.useRef(0);
  var resizeInfosRef = react.exports.useRef([]);
  var onCollectionResize = react.exports.useContext(CollectionContext);
  var onResize2 = react.exports.useCallback(function(size, element, data) {
    resizeIdRef.current += 1;
    var currentId = resizeIdRef.current;
    resizeInfosRef.current.push({
      size,
      element,
      data
    });
    Promise.resolve().then(function() {
      if (currentId === resizeIdRef.current) {
        onBatchResize === null || onBatchResize === void 0 ? void 0 : onBatchResize(resizeInfosRef.current);
        resizeInfosRef.current = [];
      }
    });
    onCollectionResize === null || onCollectionResize === void 0 ? void 0 : onCollectionResize(size, element, data);
  }, [onBatchResize, onCollectionResize]);
  return /* @__PURE__ */ jsx(CollectionContext.Provider, {
    value: onResize2,
    children
  });
}
function SingleObserver(props, ref) {
  var children = props.children, disabled = props.disabled;
  var elementRef = react.exports.useRef(null);
  var wrapperRef = react.exports.useRef(null);
  var onCollectionResize = react.exports.useContext(CollectionContext);
  var isRenderProps = typeof children === "function";
  var mergedChildren = isRenderProps ? children(elementRef) : children;
  var sizeRef = react.exports.useRef({
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1
  });
  var canRef = !isRenderProps && /* @__PURE__ */ react.exports.isValidElement(mergedChildren) && supportRef(mergedChildren);
  var originRef = canRef ? mergedChildren.ref : null;
  var mergedRef = react.exports.useMemo(function() {
    return composeRef(originRef, elementRef);
  }, [originRef, elementRef]);
  var getDom = function getDom2() {
    return findDOMNode(elementRef.current) || findDOMNode(wrapperRef.current);
  };
  react.exports.useImperativeHandle(ref, function() {
    return getDom();
  });
  var propsRef = react.exports.useRef(props);
  propsRef.current = props;
  var onInternalResize = react.exports.useCallback(function(target) {
    var _propsRef$current = propsRef.current, onResize2 = _propsRef$current.onResize, data = _propsRef$current.data;
    var _target$getBoundingCl = target.getBoundingClientRect(), width = _target$getBoundingCl.width, height = _target$getBoundingCl.height;
    var offsetWidth = target.offsetWidth, offsetHeight = target.offsetHeight;
    var fixedWidth = Math.floor(width);
    var fixedHeight = Math.floor(height);
    if (sizeRef.current.width !== fixedWidth || sizeRef.current.height !== fixedHeight || sizeRef.current.offsetWidth !== offsetWidth || sizeRef.current.offsetHeight !== offsetHeight) {
      var size = {
        width: fixedWidth,
        height: fixedHeight,
        offsetWidth,
        offsetHeight
      };
      sizeRef.current = size;
      var mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
      var mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
      var sizeInfo = _objectSpread2(_objectSpread2({}, size), {}, {
        offsetWidth: mergedOffsetWidth,
        offsetHeight: mergedOffsetHeight
      });
      onCollectionResize === null || onCollectionResize === void 0 ? void 0 : onCollectionResize(sizeInfo, target, data);
      if (onResize2) {
        Promise.resolve().then(function() {
          onResize2(sizeInfo, target);
        });
      }
    }
  }, []);
  react.exports.useEffect(function() {
    var currentElement = getDom();
    if (currentElement && !disabled) {
      observe(currentElement, onInternalResize);
    }
    return function() {
      return unobserve(currentElement, onInternalResize);
    };
  }, [elementRef.current, disabled]);
  return /* @__PURE__ */ jsx(DomWrapper, {
    ref: wrapperRef,
    children: canRef ? /* @__PURE__ */ react.exports.cloneElement(mergedChildren, {
      ref: mergedRef
    }) : mergedChildren
  });
}
var RefSingleObserver = /* @__PURE__ */ react.exports.forwardRef(SingleObserver);
var INTERNAL_PREFIX_KEY = "rc-observer-key";
function ResizeObserver(props, ref) {
  var children = props.children;
  var childNodes = typeof children === "function" ? [children] : toArray(children);
  return childNodes.map(function(child, index2) {
    var key = (child === null || child === void 0 ? void 0 : child.key) || "".concat(INTERNAL_PREFIX_KEY, "-").concat(index2);
    return /* @__PURE__ */ react.exports.createElement(RefSingleObserver, {
      ...props,
      key,
      ref: index2 === 0 ? ref : void 0
    }, child);
  });
}
var RefResizeObserver = /* @__PURE__ */ react.exports.forwardRef(ResizeObserver);
RefResizeObserver.Collection = Collection;
tuple("warning", "error", "");
function getStatusClassNames(prefixCls, status, hasFeedback) {
  var _classNames;
  return classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-status-success"), status === "success"), _defineProperty(_classNames, "".concat(prefixCls, "-status-warning"), status === "warning"), _defineProperty(_classNames, "".concat(prefixCls, "-status-error"), status === "error"), _defineProperty(_classNames, "".concat(prefixCls, "-status-validating"), status === "validating"), _defineProperty(_classNames, "".concat(prefixCls, "-has-feedback"), hasFeedback), _classNames));
}
var getMergedStatus = function getMergedStatus2(contextStatus, customStatus) {
  return customStatus || contextStatus;
};
var SearchOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" } }] }, "name": "search", "theme": "outlined" };
const SearchOutlinedSvg = SearchOutlined$2;
var SearchOutlined = function SearchOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: SearchOutlinedSvg
    })
  });
};
SearchOutlined.displayName = "SearchOutlined";
const SearchOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(SearchOutlined);
export {
  RefResizeObserver as R,
  SearchOutlined$1 as S,
  getMergedStatus as a,
  getStatusClassNames as g
};
