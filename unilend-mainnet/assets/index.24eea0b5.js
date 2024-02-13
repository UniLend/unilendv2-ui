import { a$ as react, bM as _objectWithoutProperties, b1 as jsx, bP as classNames, bQ as _defineProperty, bY as _objectSpread2, bR as KeyCode, b7 as Fragment, bO as _slicedToArray, cc as _toConsumableArray, c7 as _typeof, bN as useMergedState, b0 as jsxs, cF as Tooltip, c6 as composeRef, c1 as wrapperRaf, bS as ConfigContext, cu as _extends, b4 as useSelector, b5 as React, b3 as sortByKey, bb as FaSearch, cL as useSearchParams, cM as useParams, bi as useNavigate, bh as useWalletHook, cN as getActionBtn, cO as getCurrentLTV, bj as imgError, bc as FaChevronDown, cG as truncateToDecimals, bn as Button, bd as Modal, cP as getSelectLTV, cQ as getBorrowMax, bs as waitForBlockConfirmation, bt as fromBigNumber } from "./index.a9e8707a.js";
import { g as getPoolBasicData, a as getPoolAllData, b as getOracleData, d as getTokenPrice, e as handleLend, f as handleRedeem, i as handleBorrow, j as handleRepay } from "./pool.3ee9169e.js";
import { N as NotificationMessage } from "./NotificationMessage.c0aa2d2d.js";
var shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
  if (ret !== void 0) {
    return !!ret;
  }
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];
    if (!bHasOwnProperty(key)) {
      return false;
    }
    var valueA = objA[key];
    var valueB = objB[key];
    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
    if (ret === false || ret === void 0 && valueA !== valueB) {
      return false;
    }
  }
  return true;
};
var SliderContext = /* @__PURE__ */ react.exports.createContext({
  min: 0,
  max: 0,
  direction: "ltr",
  step: 1,
  includedStart: 0,
  includedEnd: 0,
  tabIndex: 0
});
function getOffset(value, min, max) {
  return (value - min) / (max - min);
}
function getDirectionStyle(direction, value, min, max) {
  var offset = getOffset(value, min, max);
  var positionStyle = {};
  switch (direction) {
    case "rtl":
      positionStyle.right = "".concat(offset * 100, "%");
      positionStyle.transform = "translateX(50%)";
      break;
    case "btt":
      positionStyle.bottom = "".concat(offset * 100, "%");
      positionStyle.transform = "translateY(50%)";
      break;
    case "ttb":
      positionStyle.top = "".concat(offset * 100, "%");
      positionStyle.transform = "translateY(-50%)";
      break;
    default:
      positionStyle.left = "".concat(offset * 100, "%");
      positionStyle.transform = "translateX(-50%)";
      break;
  }
  return positionStyle;
}
function getIndex(value, index2) {
  return Array.isArray(value) ? value[index2] : value;
}
var _excluded$1 = ["prefixCls", "value", "valueIndex", "onStartMove", "style", "render", "dragging", "onOffsetChange"];
var Handle = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _classNames, _getIndex;
  var prefixCls = props.prefixCls, value = props.value, valueIndex = props.valueIndex, onStartMove = props.onStartMove, style = props.style, render = props.render, dragging = props.dragging, onOffsetChange = props.onOffsetChange, restProps = _objectWithoutProperties(props, _excluded$1);
  var _React$useContext = react.exports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, disabled = _React$useContext.disabled, range = _React$useContext.range, tabIndex = _React$useContext.tabIndex, ariaLabelForHandle = _React$useContext.ariaLabelForHandle, ariaLabelledByForHandle = _React$useContext.ariaLabelledByForHandle, ariaValueTextFormatterForHandle = _React$useContext.ariaValueTextFormatterForHandle;
  var handlePrefixCls = "".concat(prefixCls, "-handle");
  var onInternalStartMove = function onInternalStartMove2(e) {
    if (!disabled) {
      onStartMove(e, valueIndex);
    }
  };
  var onKeyDown = function onKeyDown2(e) {
    if (!disabled) {
      var offset = null;
      switch (e.which || e.keyCode) {
        case KeyCode.LEFT:
          offset = direction === "ltr" || direction === "btt" ? -1 : 1;
          break;
        case KeyCode.RIGHT:
          offset = direction === "ltr" || direction === "btt" ? 1 : -1;
          break;
        case KeyCode.UP:
          offset = direction !== "ttb" ? 1 : -1;
          break;
        case KeyCode.DOWN:
          offset = direction !== "ttb" ? -1 : 1;
          break;
        case KeyCode.HOME:
          offset = "min";
          break;
        case KeyCode.END:
          offset = "max";
          break;
        case KeyCode.PAGE_UP:
          offset = 2;
          break;
        case KeyCode.PAGE_DOWN:
          offset = -2;
          break;
      }
      if (offset !== null) {
        e.preventDefault();
        onOffsetChange(offset, valueIndex);
      }
    }
  };
  var positionStyle = getDirectionStyle(direction, value, min, max);
  var handleNode = /* @__PURE__ */ jsx("div", {
    ref,
    className: classNames(handlePrefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(handlePrefixCls, "-").concat(valueIndex + 1), range), _defineProperty(_classNames, "".concat(handlePrefixCls, "-dragging"), dragging), _classNames)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: onInternalStartMove,
    onTouchStart: onInternalStartMove,
    onKeyDown,
    tabIndex: disabled ? null : getIndex(tabIndex, valueIndex),
    role: "slider",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-disabled": disabled,
    "aria-label": getIndex(ariaLabelForHandle, valueIndex),
    "aria-labelledby": getIndex(ariaLabelledByForHandle, valueIndex),
    "aria-valuetext": (_getIndex = getIndex(ariaValueTextFormatterForHandle, valueIndex)) === null || _getIndex === void 0 ? void 0 : _getIndex(value),
    ...restProps
  });
  if (render) {
    handleNode = render(handleNode, {
      index: valueIndex,
      prefixCls,
      value,
      dragging
    });
  }
  return handleNode;
});
var _excluded = ["prefixCls", "style", "onStartMove", "onOffsetChange", "values", "handleRender", "draggingIndex"];
var Handles = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, style = props.style, onStartMove = props.onStartMove, onOffsetChange = props.onOffsetChange, values = props.values, handleRender = props.handleRender, draggingIndex = props.draggingIndex, restProps = _objectWithoutProperties(props, _excluded);
  var handlesRef = react.exports.useRef({});
  react.exports.useImperativeHandle(ref, function() {
    return {
      focus: function focus(index2) {
        var _handlesRef$current$i;
        (_handlesRef$current$i = handlesRef.current[index2]) === null || _handlesRef$current$i === void 0 ? void 0 : _handlesRef$current$i.focus();
      }
    };
  });
  return /* @__PURE__ */ jsx(Fragment, {
    children: values.map(function(value, index2) {
      return /* @__PURE__ */ jsx(Handle, {
        ref: function ref2(node) {
          if (!node) {
            delete handlesRef.current[index2];
          } else {
            handlesRef.current[index2] = node;
          }
        },
        dragging: draggingIndex === index2,
        prefixCls,
        style: getIndex(style, index2),
        value,
        valueIndex: index2,
        onStartMove,
        onOffsetChange,
        render: handleRender,
        ...restProps
      }, index2);
    })
  });
});
function getPosition(e) {
  var obj = "touches" in e ? e.touches[0] : e;
  return {
    pageX: obj.pageX,
    pageY: obj.pageY
  };
}
function useDrag(containerRef, direction, rawValues, min, max, formatValue, triggerChange, finishChange, offsetValues) {
  var _React$useState = react.exports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), draggingValue = _React$useState2[0], setDraggingValue = _React$useState2[1];
  var _React$useState3 = react.exports.useState(-1), _React$useState4 = _slicedToArray(_React$useState3, 2), draggingIndex = _React$useState4[0], setDraggingIndex = _React$useState4[1];
  var _React$useState5 = react.exports.useState(rawValues), _React$useState6 = _slicedToArray(_React$useState5, 2), cacheValues = _React$useState6[0], setCacheValues = _React$useState6[1];
  var _React$useState7 = react.exports.useState(rawValues), _React$useState8 = _slicedToArray(_React$useState7, 2), originValues = _React$useState8[0], setOriginValues = _React$useState8[1];
  var mouseMoveEventRef = react.exports.useRef(null);
  var mouseUpEventRef = react.exports.useRef(null);
  react.exports.useEffect(function() {
    if (draggingIndex === -1) {
      setCacheValues(rawValues);
    }
  }, [rawValues, draggingIndex]);
  react.exports.useEffect(function() {
    return function() {
      document.removeEventListener("mousemove", mouseMoveEventRef.current);
      document.removeEventListener("mouseup", mouseUpEventRef.current);
      document.removeEventListener("touchmove", mouseMoveEventRef.current);
      document.removeEventListener("touchend", mouseUpEventRef.current);
    };
  }, []);
  var flushValues = function flushValues2(nextValues, nextValue) {
    if (cacheValues.some(function(val, i) {
      return val !== nextValues[i];
    })) {
      if (nextValue !== void 0) {
        setDraggingValue(nextValue);
      }
      setCacheValues(nextValues);
      triggerChange(nextValues);
    }
  };
  var updateCacheValue = function updateCacheValue2(valueIndex, offsetPercent) {
    if (valueIndex === -1) {
      var startValue = originValues[0];
      var endValue = originValues[originValues.length - 1];
      var maxStartOffset = min - startValue;
      var maxEndOffset = max - endValue;
      var offset = offsetPercent * (max - min);
      offset = Math.max(offset, maxStartOffset);
      offset = Math.min(offset, maxEndOffset);
      var formatStartValue = formatValue(startValue + offset);
      offset = formatStartValue - startValue;
      var cloneCacheValues = originValues.map(function(val) {
        return val + offset;
      });
      flushValues(cloneCacheValues);
    } else {
      var offsetDist = (max - min) * offsetPercent;
      var cloneValues = _toConsumableArray(cacheValues);
      cloneValues[valueIndex] = originValues[valueIndex];
      var next = offsetValues(cloneValues, offsetDist, valueIndex, "dist");
      flushValues(next.values, next.value);
    }
  };
  var updateCacheValueRef = react.exports.useRef(updateCacheValue);
  updateCacheValueRef.current = updateCacheValue;
  var onStartMove = function onStartMove2(e, valueIndex) {
    e.stopPropagation();
    var originValue = rawValues[valueIndex];
    setDraggingIndex(valueIndex);
    setDraggingValue(originValue);
    setOriginValues(rawValues);
    var _getPosition = getPosition(e), startX = _getPosition.pageX, startY = _getPosition.pageY;
    var onMouseMove = function onMouseMove2(event) {
      event.preventDefault();
      var _getPosition2 = getPosition(event), moveX = _getPosition2.pageX, moveY = _getPosition2.pageY;
      var offsetX = moveX - startX;
      var offsetY = moveY - startY;
      var _containerRef$current = containerRef.current.getBoundingClientRect(), width = _containerRef$current.width, height = _containerRef$current.height;
      var offSetPercent;
      switch (direction) {
        case "btt":
          offSetPercent = -offsetY / height;
          break;
        case "ttb":
          offSetPercent = offsetY / height;
          break;
        case "rtl":
          offSetPercent = -offsetX / width;
          break;
        default:
          offSetPercent = offsetX / width;
      }
      updateCacheValueRef.current(valueIndex, offSetPercent);
    };
    var onMouseUp = function onMouseUp2(event) {
      event.preventDefault();
      document.removeEventListener("mouseup", onMouseUp2);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchend", onMouseUp2);
      document.removeEventListener("touchmove", onMouseMove);
      mouseMoveEventRef.current = null;
      mouseUpEventRef.current = null;
      setDraggingIndex(-1);
      finishChange();
    };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchend", onMouseUp);
    document.addEventListener("touchmove", onMouseMove);
    mouseMoveEventRef.current = onMouseMove;
    mouseUpEventRef.current = onMouseUp;
  };
  var returnValues = react.exports.useMemo(function() {
    var sourceValues = _toConsumableArray(rawValues).sort(function(a, b) {
      return a - b;
    });
    var targetValues = _toConsumableArray(cacheValues).sort(function(a, b) {
      return a - b;
    });
    return sourceValues.every(function(val, index2) {
      return val === targetValues[index2];
    }) ? cacheValues : rawValues;
  }, [rawValues, cacheValues]);
  return [draggingIndex, draggingValue, returnValues, onStartMove];
}
function Track(props) {
  var prefixCls = props.prefixCls, style = props.style, start = props.start, end = props.end, index2 = props.index, onStartMove = props.onStartMove;
  var _React$useContext = react.exports.useContext(SliderContext), direction = _React$useContext.direction, min = _React$useContext.min, max = _React$useContext.max, disabled = _React$useContext.disabled, range = _React$useContext.range;
  var trackPrefixCls = "".concat(prefixCls, "-track");
  var offsetStart = getOffset(start, min, max);
  var offsetEnd = getOffset(end, min, max);
  var onInternalStartMove = function onInternalStartMove2(e) {
    if (!disabled && onStartMove) {
      onStartMove(e, -1);
    }
  };
  var positionStyle = {};
  switch (direction) {
    case "rtl":
      positionStyle.right = "".concat(offsetStart * 100, "%");
      positionStyle.width = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    case "btt":
      positionStyle.bottom = "".concat(offsetStart * 100, "%");
      positionStyle.height = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    case "ttb":
      positionStyle.top = "".concat(offsetStart * 100, "%");
      positionStyle.height = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    default:
      positionStyle.left = "".concat(offsetStart * 100, "%");
      positionStyle.width = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
  }
  return /* @__PURE__ */ jsx("div", {
    className: classNames(trackPrefixCls, range && "".concat(trackPrefixCls, "-").concat(index2 + 1)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: onInternalStartMove,
    onTouchStart: onInternalStartMove
  });
}
function Tracks(props) {
  var prefixCls = props.prefixCls, style = props.style, values = props.values, startPoint = props.startPoint, onStartMove = props.onStartMove;
  var _React$useContext = react.exports.useContext(SliderContext), included = _React$useContext.included, range = _React$useContext.range, min = _React$useContext.min;
  var trackList = react.exports.useMemo(function() {
    if (!range) {
      if (values.length === 0) {
        return [];
      }
      var startValue = startPoint !== null && startPoint !== void 0 ? startPoint : min;
      var endValue = values[0];
      return [{
        start: Math.min(startValue, endValue),
        end: Math.max(startValue, endValue)
      }];
    }
    var list = [];
    for (var i = 0; i < values.length - 1; i += 1) {
      list.push({
        start: values[i],
        end: values[i + 1]
      });
    }
    return list;
  }, [values, range, startPoint, min]);
  return included ? trackList.map(function(_ref, index2) {
    var start = _ref.start, end = _ref.end;
    return /* @__PURE__ */ jsx(Track, {
      index: index2,
      prefixCls,
      style: getIndex(style, index2),
      start,
      end,
      onStartMove
    }, index2);
  }) : null;
}
function Mark(props) {
  var prefixCls = props.prefixCls, style = props.style, children = props.children, value = props.value, _onClick = props.onClick;
  var _React$useContext = react.exports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, includedStart = _React$useContext.includedStart, includedEnd = _React$useContext.includedEnd, included = _React$useContext.included;
  var textCls = "".concat(prefixCls, "-text");
  var positionStyle = getDirectionStyle(direction, value, min, max);
  return /* @__PURE__ */ jsx("span", {
    className: classNames(textCls, _defineProperty({}, "".concat(textCls, "-active"), included && includedStart <= value && value <= includedEnd)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: function onMouseDown(e) {
      e.stopPropagation();
    },
    onClick: function onClick() {
      _onClick(value);
    },
    children
  });
}
function Marks(props) {
  var prefixCls = props.prefixCls, marks = props.marks, onClick = props.onClick;
  var markPrefixCls = "".concat(prefixCls, "-mark");
  if (!marks.length) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", {
    className: markPrefixCls,
    children: marks.map(function(_ref) {
      var value = _ref.value, style = _ref.style, label = _ref.label;
      return /* @__PURE__ */ jsx(Mark, {
        prefixCls: markPrefixCls,
        style,
        value,
        onClick,
        children: label
      }, value);
    })
  });
}
function Dot(props) {
  var prefixCls = props.prefixCls, value = props.value, style = props.style, activeStyle = props.activeStyle;
  var _React$useContext = react.exports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, included = _React$useContext.included, includedStart = _React$useContext.includedStart, includedEnd = _React$useContext.includedEnd;
  var dotClassName = "".concat(prefixCls, "-dot");
  var active = included && includedStart <= value && value <= includedEnd;
  var mergedStyle = _objectSpread2(_objectSpread2({}, getDirectionStyle(direction, value, min, max)), typeof style === "function" ? style(value) : style);
  if (active) {
    mergedStyle = _objectSpread2(_objectSpread2({}, mergedStyle), typeof activeStyle === "function" ? activeStyle(value) : activeStyle);
  }
  return /* @__PURE__ */ jsx("span", {
    className: classNames(dotClassName, _defineProperty({}, "".concat(dotClassName, "-active"), active)),
    style: mergedStyle
  });
}
function Steps(props) {
  var prefixCls = props.prefixCls, marks = props.marks, dots = props.dots, style = props.style, activeStyle = props.activeStyle;
  var _React$useContext = react.exports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, step = _React$useContext.step;
  var stepDots = react.exports.useMemo(function() {
    var dotSet = /* @__PURE__ */ new Set();
    marks.forEach(function(mark) {
      dotSet.add(mark.value);
    });
    if (dots && step !== null) {
      var current = min;
      while (current <= max) {
        dotSet.add(current);
        current += step;
      }
    }
    return Array.from(dotSet);
  }, [min, max, step, dots, marks]);
  return /* @__PURE__ */ jsx("div", {
    className: "".concat(prefixCls, "-step"),
    children: stepDots.map(function(dotValue) {
      return /* @__PURE__ */ jsx(Dot, {
        prefixCls,
        value: dotValue,
        style,
        activeStyle
      }, dotValue);
    })
  });
}
function useOffset(min, max, step, markList, allowCross, pushable) {
  var formatRangeValue = react.exports.useCallback(function(val) {
    var formatNextValue = isFinite(val) ? val : min;
    formatNextValue = Math.min(max, val);
    formatNextValue = Math.max(min, formatNextValue);
    return formatNextValue;
  }, [min, max]);
  var formatStepValue = react.exports.useCallback(function(val) {
    if (step !== null) {
      var stepValue = min + Math.round((formatRangeValue(val) - min) / step) * step;
      var getDecimal = function getDecimal2(num) {
        return (String(num).split(".")[1] || "").length;
      };
      var maxDecimal = Math.max(getDecimal(step), getDecimal(max), getDecimal(min));
      var fixedValue = Number(stepValue.toFixed(maxDecimal));
      return min <= fixedValue && fixedValue <= max ? fixedValue : null;
    }
    return null;
  }, [step, min, max, formatRangeValue]);
  var formatValue = react.exports.useCallback(function(val) {
    var formatNextValue = formatRangeValue(val);
    var alignValues = markList.map(function(mark) {
      return mark.value;
    });
    if (step !== null) {
      alignValues.push(formatStepValue(val));
    }
    alignValues.push(min, max);
    var closeValue = alignValues[0];
    var closeDist = max - min;
    alignValues.forEach(function(alignValue) {
      var dist = Math.abs(formatNextValue - alignValue);
      if (dist <= closeDist) {
        closeValue = alignValue;
        closeDist = dist;
      }
    });
    return closeValue;
  }, [min, max, markList, step, formatRangeValue, formatStepValue]);
  var offsetValue = function offsetValue2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    if (typeof offset === "number") {
      var nextValue;
      var originValue = values[valueIndex];
      var targetDistValue = originValue + offset;
      var potentialValues = [];
      markList.forEach(function(mark) {
        potentialValues.push(mark.value);
      });
      potentialValues.push(min, max);
      potentialValues.push(formatStepValue(originValue));
      var sign = offset > 0 ? 1 : -1;
      if (mode === "unit") {
        potentialValues.push(formatStepValue(originValue + sign * step));
      } else {
        potentialValues.push(formatStepValue(targetDistValue));
      }
      potentialValues = potentialValues.filter(function(val) {
        return val !== null;
      }).filter(function(val) {
        return offset < 0 ? val <= originValue : val >= originValue;
      });
      if (mode === "unit") {
        potentialValues = potentialValues.filter(function(val) {
          return val !== originValue;
        });
      }
      var compareValue = mode === "unit" ? originValue : targetDistValue;
      nextValue = potentialValues[0];
      var valueDist = Math.abs(nextValue - compareValue);
      potentialValues.forEach(function(potentialValue) {
        var dist = Math.abs(potentialValue - compareValue);
        if (dist < valueDist) {
          nextValue = potentialValue;
          valueDist = dist;
        }
      });
      if (nextValue === void 0) {
        return offset < 0 ? min : max;
      }
      if (mode === "dist") {
        return nextValue;
      }
      if (Math.abs(offset) > 1) {
        var cloneValues = _toConsumableArray(values);
        cloneValues[valueIndex] = nextValue;
        return offsetValue2(cloneValues, offset - sign, valueIndex, mode);
      }
      return nextValue;
    } else if (offset === "min") {
      return min;
    } else if (offset === "max") {
      return max;
    }
  };
  var offsetChangedValue = function offsetChangedValue2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    var originValue = values[valueIndex];
    var nextValue = offsetValue(values, offset, valueIndex, mode);
    return {
      value: nextValue,
      changed: nextValue !== originValue
    };
  };
  var needPush = function needPush2(dist) {
    return pushable === null && dist === 0 || typeof pushable === "number" && dist < pushable;
  };
  var offsetValues = function offsetValues2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    var nextValues = values.map(formatValue);
    var originValue = nextValues[valueIndex];
    var nextValue = offsetValue(nextValues, offset, valueIndex, mode);
    nextValues[valueIndex] = nextValue;
    if (allowCross === false) {
      var pushNum = pushable || 0;
      if (valueIndex > 0 && nextValues[valueIndex - 1] !== originValue) {
        nextValues[valueIndex] = Math.max(nextValues[valueIndex], nextValues[valueIndex - 1] + pushNum);
      }
      if (valueIndex < nextValues.length - 1 && nextValues[valueIndex + 1] !== originValue) {
        nextValues[valueIndex] = Math.min(nextValues[valueIndex], nextValues[valueIndex + 1] - pushNum);
      }
    } else if (typeof pushable === "number" || pushable === null) {
      for (var i = valueIndex + 1; i < nextValues.length; i += 1) {
        var changed = true;
        while (needPush(nextValues[i] - nextValues[i - 1]) && changed) {
          var _offsetChangedValue = offsetChangedValue(nextValues, 1, i);
          nextValues[i] = _offsetChangedValue.value;
          changed = _offsetChangedValue.changed;
        }
      }
      for (var _i = valueIndex; _i > 0; _i -= 1) {
        var _changed = true;
        while (needPush(nextValues[_i] - nextValues[_i - 1]) && _changed) {
          var _offsetChangedValue2 = offsetChangedValue(nextValues, -1, _i - 1);
          nextValues[_i - 1] = _offsetChangedValue2.value;
          _changed = _offsetChangedValue2.changed;
        }
      }
      for (var _i2 = nextValues.length - 1; _i2 > 0; _i2 -= 1) {
        var _changed2 = true;
        while (needPush(nextValues[_i2] - nextValues[_i2 - 1]) && _changed2) {
          var _offsetChangedValue3 = offsetChangedValue(nextValues, -1, _i2 - 1);
          nextValues[_i2 - 1] = _offsetChangedValue3.value;
          _changed2 = _offsetChangedValue3.changed;
        }
      }
      for (var _i3 = 0; _i3 < nextValues.length - 1; _i3 += 1) {
        var _changed3 = true;
        while (needPush(nextValues[_i3 + 1] - nextValues[_i3]) && _changed3) {
          var _offsetChangedValue4 = offsetChangedValue(nextValues, 1, _i3 + 1);
          nextValues[_i3 + 1] = _offsetChangedValue4.value;
          _changed3 = _offsetChangedValue4.changed;
        }
      }
    }
    return {
      value: nextValues[valueIndex],
      values: nextValues
    };
  };
  return [formatValue, offsetValues];
}
var Slider$2 = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _classNames;
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-slider" : _props$prefixCls, className = props.className, style = props.style, _props$disabled = props.disabled, disabled = _props$disabled === void 0 ? false : _props$disabled, autoFocus = props.autoFocus, onFocus = props.onFocus, onBlur = props.onBlur, _props$min = props.min, min = _props$min === void 0 ? 0 : _props$min, _props$max = props.max, max = _props$max === void 0 ? 100 : _props$max, _props$step = props.step, step = _props$step === void 0 ? 1 : _props$step, value = props.value, defaultValue = props.defaultValue, range = props.range, count = props.count, onChange = props.onChange, onBeforeChange = props.onBeforeChange, onAfterChange = props.onAfterChange, _props$allowCross = props.allowCross, allowCross = _props$allowCross === void 0 ? true : _props$allowCross, _props$pushable = props.pushable, pushable = _props$pushable === void 0 ? false : _props$pushable, draggableTrack = props.draggableTrack, reverse = props.reverse, vertical = props.vertical, _props$included = props.included, included = _props$included === void 0 ? true : _props$included, startPoint = props.startPoint, trackStyle = props.trackStyle, handleStyle = props.handleStyle, railStyle = props.railStyle, dotStyle = props.dotStyle, activeDotStyle = props.activeDotStyle, marks = props.marks, dots = props.dots, handleRender = props.handleRender, _props$tabIndex = props.tabIndex, tabIndex = _props$tabIndex === void 0 ? 0 : _props$tabIndex, ariaLabelForHandle = props.ariaLabelForHandle, ariaLabelledByForHandle = props.ariaLabelledByForHandle, ariaValueTextFormatterForHandle = props.ariaValueTextFormatterForHandle;
  var handlesRef = react.exports.useRef();
  var containerRef = react.exports.useRef();
  var direction = react.exports.useMemo(function() {
    if (vertical) {
      return reverse ? "ttb" : "btt";
    }
    return reverse ? "rtl" : "ltr";
  }, [reverse, vertical]);
  var mergedMin = react.exports.useMemo(function() {
    return isFinite(min) ? min : 0;
  }, [min]);
  var mergedMax = react.exports.useMemo(function() {
    return isFinite(max) ? max : 100;
  }, [max]);
  var mergedStep = react.exports.useMemo(function() {
    return step !== null && step <= 0 ? 1 : step;
  }, [step]);
  var mergedPush = react.exports.useMemo(function() {
    if (pushable === true) {
      return mergedStep;
    }
    return pushable >= 0 ? pushable : false;
  }, [pushable, mergedStep]);
  var markList = react.exports.useMemo(function() {
    var keys = Object.keys(marks || {});
    return keys.map(function(key) {
      var mark = marks[key];
      var markObj = {
        value: Number(key)
      };
      if (mark && _typeof(mark) === "object" && !/* @__PURE__ */ react.exports.isValidElement(mark) && ("label" in mark || "style" in mark)) {
        markObj.style = mark.style;
        markObj.label = mark.label;
      } else {
        markObj.label = mark;
      }
      return markObj;
    }).filter(function(_ref) {
      var label = _ref.label;
      return label || typeof label === "number";
    }).sort(function(a, b) {
      return a.value - b.value;
    });
  }, [marks]);
  var _useOffset = useOffset(mergedMin, mergedMax, mergedStep, markList, allowCross, mergedPush), _useOffset2 = _slicedToArray(_useOffset, 2), formatValue = _useOffset2[0], offsetValues = _useOffset2[1];
  var _useMergedState = useMergedState(defaultValue, {
    value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedValue = _useMergedState2[0], setValue = _useMergedState2[1];
  var rawValues = react.exports.useMemo(function() {
    var valueList = mergedValue === null || mergedValue === void 0 ? [] : Array.isArray(mergedValue) ? mergedValue : [mergedValue];
    var _valueList = _slicedToArray(valueList, 1), _valueList$ = _valueList[0], val0 = _valueList$ === void 0 ? mergedMin : _valueList$;
    var returnValues = mergedValue === null ? [] : [val0];
    if (range) {
      returnValues = _toConsumableArray(valueList);
      if (count || mergedValue === void 0) {
        var pointCount = count >= 0 ? count + 1 : 2;
        returnValues = returnValues.slice(0, pointCount);
        while (returnValues.length < pointCount) {
          var _returnValues;
          returnValues.push((_returnValues = returnValues[returnValues.length - 1]) !== null && _returnValues !== void 0 ? _returnValues : mergedMin);
        }
      }
      returnValues.sort(function(a, b) {
        return a - b;
      });
    }
    returnValues.forEach(function(val, index2) {
      returnValues[index2] = formatValue(val);
    });
    return returnValues;
  }, [mergedValue, range, mergedMin, count, formatValue]);
  var rawValuesRef = react.exports.useRef(rawValues);
  rawValuesRef.current = rawValues;
  var getTriggerValue = function getTriggerValue2(triggerValues) {
    return range ? triggerValues : triggerValues[0];
  };
  var triggerChange = function triggerChange2(nextValues) {
    var cloneNextValues = _toConsumableArray(nextValues).sort(function(a, b) {
      return a - b;
    });
    if (onChange && !shallowequal(cloneNextValues, rawValuesRef.current)) {
      onChange(getTriggerValue(cloneNextValues));
    }
    setValue(cloneNextValues);
  };
  var changeToCloseValue = function changeToCloseValue2(newValue) {
    if (!disabled) {
      var valueIndex = 0;
      var valueDist = mergedMax - mergedMin;
      rawValues.forEach(function(val, index2) {
        var dist = Math.abs(newValue - val);
        if (dist <= valueDist) {
          valueDist = dist;
          valueIndex = index2;
        }
      });
      var cloneNextValues = _toConsumableArray(rawValues);
      cloneNextValues[valueIndex] = newValue;
      if (range && !rawValues.length && count === void 0) {
        cloneNextValues.push(newValue);
      }
      onBeforeChange === null || onBeforeChange === void 0 ? void 0 : onBeforeChange(getTriggerValue(cloneNextValues));
      triggerChange(cloneNextValues);
      onAfterChange === null || onAfterChange === void 0 ? void 0 : onAfterChange(getTriggerValue(cloneNextValues));
    }
  };
  var onSliderMouseDown = function onSliderMouseDown2(e) {
    e.preventDefault();
    var _containerRef$current = containerRef.current.getBoundingClientRect(), width = _containerRef$current.width, height = _containerRef$current.height, left = _containerRef$current.left, top = _containerRef$current.top, bottom = _containerRef$current.bottom, right = _containerRef$current.right;
    var clientX = e.clientX, clientY = e.clientY;
    var percent;
    switch (direction) {
      case "btt":
        percent = (bottom - clientY) / height;
        break;
      case "ttb":
        percent = (clientY - top) / height;
        break;
      case "rtl":
        percent = (right - clientX) / width;
        break;
      default:
        percent = (clientX - left) / width;
    }
    var nextValue = mergedMin + percent * (mergedMax - mergedMin);
    changeToCloseValue(formatValue(nextValue));
  };
  var _React$useState = react.exports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), keyboardValue = _React$useState2[0], setKeyboardValue = _React$useState2[1];
  var onHandleOffsetChange = function onHandleOffsetChange2(offset, valueIndex) {
    if (!disabled) {
      var next = offsetValues(rawValues, offset, valueIndex);
      onBeforeChange === null || onBeforeChange === void 0 ? void 0 : onBeforeChange(getTriggerValue(rawValues));
      triggerChange(next.values);
      onAfterChange === null || onAfterChange === void 0 ? void 0 : onAfterChange(getTriggerValue(next.values));
      setKeyboardValue(next.value);
    }
  };
  react.exports.useEffect(function() {
    if (keyboardValue !== null) {
      var valueIndex = rawValues.indexOf(keyboardValue);
      if (valueIndex >= 0) {
        handlesRef.current.focus(valueIndex);
      }
    }
    setKeyboardValue(null);
  }, [keyboardValue]);
  var mergedDraggableTrack = react.exports.useMemo(function() {
    if (draggableTrack && mergedStep === null) {
      return false;
    }
    return draggableTrack;
  }, [draggableTrack, mergedStep]);
  var finishChange = function finishChange2() {
    onAfterChange === null || onAfterChange === void 0 ? void 0 : onAfterChange(getTriggerValue(rawValuesRef.current));
  };
  var _useDrag = useDrag(containerRef, direction, rawValues, mergedMin, mergedMax, formatValue, triggerChange, finishChange, offsetValues), _useDrag2 = _slicedToArray(_useDrag, 4), draggingIndex = _useDrag2[0], draggingValue = _useDrag2[1], cacheValues = _useDrag2[2], onStartDrag = _useDrag2[3];
  var onStartMove = function onStartMove2(e, valueIndex) {
    onStartDrag(e, valueIndex);
    onBeforeChange === null || onBeforeChange === void 0 ? void 0 : onBeforeChange(getTriggerValue(rawValuesRef.current));
  };
  var dragging = draggingIndex !== -1;
  react.exports.useEffect(function() {
    if (!dragging) {
      var valueIndex = rawValues.lastIndexOf(draggingValue);
      handlesRef.current.focus(valueIndex);
    }
  }, [dragging]);
  var sortedCacheValues = react.exports.useMemo(function() {
    return _toConsumableArray(cacheValues).sort(function(a, b) {
      return a - b;
    });
  }, [cacheValues]);
  var _React$useMemo = react.exports.useMemo(function() {
    if (!range) {
      return [mergedMin, sortedCacheValues[0]];
    }
    return [sortedCacheValues[0], sortedCacheValues[sortedCacheValues.length - 1]];
  }, [sortedCacheValues, range, mergedMin]), _React$useMemo2 = _slicedToArray(_React$useMemo, 2), includedStart = _React$useMemo2[0], includedEnd = _React$useMemo2[1];
  react.exports.useImperativeHandle(ref, function() {
    return {
      focus: function focus() {
        handlesRef.current.focus(0);
      },
      blur: function blur() {
        var _document = document, activeElement = _document.activeElement;
        if (containerRef.current.contains(activeElement)) {
          activeElement === null || activeElement === void 0 ? void 0 : activeElement.blur();
        }
      }
    };
  });
  react.exports.useEffect(function() {
    if (autoFocus) {
      handlesRef.current.focus(0);
    }
  }, []);
  var context = react.exports.useMemo(function() {
    return {
      min: mergedMin,
      max: mergedMax,
      direction,
      disabled,
      step: mergedStep,
      included,
      includedStart,
      includedEnd,
      range,
      tabIndex,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaValueTextFormatterForHandle
    };
  }, [mergedMin, mergedMax, direction, disabled, mergedStep, included, includedStart, includedEnd, range, tabIndex, ariaLabelForHandle, ariaLabelledByForHandle, ariaValueTextFormatterForHandle]);
  return /* @__PURE__ */ jsx(SliderContext.Provider, {
    value: context,
    children: /* @__PURE__ */ jsxs("div", {
      ref: containerRef,
      className: classNames(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames, "".concat(prefixCls, "-vertical"), vertical), _defineProperty(_classNames, "".concat(prefixCls, "-horizontal"), !vertical), _defineProperty(_classNames, "".concat(prefixCls, "-with-marks"), markList.length), _classNames)),
      style,
      onMouseDown: onSliderMouseDown,
      children: [/* @__PURE__ */ jsx("div", {
        className: "".concat(prefixCls, "-rail"),
        style: railStyle
      }), /* @__PURE__ */ jsx(Tracks, {
        prefixCls,
        style: trackStyle,
        values: sortedCacheValues,
        startPoint,
        onStartMove: mergedDraggableTrack ? onStartMove : null
      }), /* @__PURE__ */ jsx(Steps, {
        prefixCls,
        marks: markList,
        dots,
        style: dotStyle,
        activeStyle: activeDotStyle
      }), /* @__PURE__ */ jsx(Handles, {
        ref: handlesRef,
        prefixCls,
        style: handleStyle,
        values: cacheValues,
        draggingIndex,
        onStartMove,
        onOffsetChange: onHandleOffsetChange,
        onFocus,
        onBlur,
        handleRender
      }), /* @__PURE__ */ jsx(Marks, {
        prefixCls,
        marks: markList,
        onClick: changeToCloseValue
      })]
    })
  });
});
var SliderTooltip = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var open = props.open;
  var innerRef = react.exports.useRef(null);
  var rafRef = react.exports.useRef(null);
  function cancelKeepAlign() {
    wrapperRaf.cancel(rafRef.current);
    rafRef.current = null;
  }
  function keepAlign() {
    rafRef.current = wrapperRaf(function() {
      var _a;
      (_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
      rafRef.current = null;
    });
  }
  react.exports.useEffect(function() {
    if (open) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }
    return cancelKeepAlign;
  }, [open, props.title]);
  return /* @__PURE__ */ jsx(Tooltip, {
    ref: composeRef(innerRef, ref),
    ...props
  });
});
const SliderTooltip$1 = SliderTooltip;
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
var Slider = /* @__PURE__ */ react.exports.forwardRef(function(props, ref) {
  var _React$useContext = react.exports.useContext(ConfigContext), getPrefixCls = _React$useContext.getPrefixCls, direction = _React$useContext.direction, getPopupContainer = _React$useContext.getPopupContainer;
  var _React$useState = react.exports.useState({}), _React$useState2 = _slicedToArray(_React$useState, 2), opens = _React$useState2[0], setOpens = _React$useState2[1];
  var toggleTooltipOpen = function toggleTooltipOpen2(index2, open) {
    setOpens(function(prev) {
      return _extends(_extends({}, prev), _defineProperty({}, index2, open));
    });
  };
  var getTooltipPlacement = function getTooltipPlacement2(tooltipPlacement, vertical) {
    if (tooltipPlacement) {
      return tooltipPlacement;
    }
    if (!vertical) {
      return "top";
    }
    return direction === "rtl" ? "left" : "right";
  };
  var customizePrefixCls = props.prefixCls, range = props.range, className = props.className, restProps = __rest(props, ["prefixCls", "range", "className"]);
  var prefixCls = getPrefixCls("slider", customizePrefixCls);
  var cls = classNames(className, _defineProperty({}, "".concat(prefixCls, "-rtl"), direction === "rtl"));
  if (direction === "rtl" && !restProps.vertical) {
    restProps.reverse = !restProps.reverse;
  }
  var _React$useMemo = react.exports.useMemo(function() {
    if (!range) {
      return [false];
    }
    return _typeof(range) === "object" ? [true, range.draggableTrack] : [true, false];
  }, [range]), _React$useMemo2 = _slicedToArray(_React$useMemo, 2), mergedRange = _React$useMemo2[0], draggableTrack = _React$useMemo2[1];
  var handleRender = function handleRender2(node, info) {
    var _a;
    var index2 = info.index, dragging = info.dragging;
    var rootPrefixCls = getPrefixCls();
    var _props$tooltip = props.tooltip, tooltip = _props$tooltip === void 0 ? {} : _props$tooltip, vertical = props.vertical;
    var tooltipProps = _extends({
      formatter: (_a = props.tipFormatter) !== null && _a !== void 0 ? _a : function(value) {
        return typeof value === "number" ? value.toString() : "";
      },
      open: props.tooltipVisible,
      placement: props.tooltipPlacement,
      getPopupContainer: props.getTooltipPopupContainer
    }, tooltip);
    var tooltipOpen = tooltipProps.open, tooltipPlacement = tooltipProps.placement, getTooltipPopupContainer = tooltipProps.getPopupContainer, customizeTooltipPrefixCls = tooltipProps.prefixCls, tipFormatter = tooltipProps.formatter;
    var isTipFormatter = tipFormatter ? opens[index2] || dragging : false;
    var open = tooltipOpen || tooltipOpen === void 0 && isTipFormatter;
    var passedProps = _extends(_extends({}, node.props), {
      onMouseEnter: function onMouseEnter() {
        return toggleTooltipOpen(index2, true);
      },
      onMouseLeave: function onMouseLeave() {
        return toggleTooltipOpen(index2, false);
      }
    });
    var tooltipPrefixCls = getPrefixCls("tooltip", customizeTooltipPrefixCls);
    return /* @__PURE__ */ jsx(SliderTooltip$1, {
      prefixCls: tooltipPrefixCls,
      title: tipFormatter ? tipFormatter(info.value) : "",
      open,
      placement: getTooltipPlacement(tooltipPlacement, vertical),
      transitionName: "".concat(rootPrefixCls, "-zoom-down"),
      overlayClassName: "".concat(prefixCls, "-tooltip"),
      getPopupContainer: getTooltipPopupContainer || getPopupContainer,
      children: /* @__PURE__ */ react.exports.cloneElement(node, passedProps)
    }, index2);
  };
  return /* @__PURE__ */ jsx(Slider$2, {
    ...restProps,
    step: restProps.step,
    range: mergedRange,
    draggableTrack,
    className: cls,
    ref,
    prefixCls,
    handleRender
  });
});
const Slider$1 = Slider;
const index = "";
const poolSkeleton = "";
function PoolSkeleton() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "pool_skeleton_container",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "token_header",
        children: [/* @__PURE__ */ jsx("div", {
          className: "skeleton"
        }), /* @__PURE__ */ jsx("div", {
          className: "skeleton"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "content_container",
        children: [/* @__PURE__ */ jsx("div", {
          className: "tabs skeleton"
        }), /* @__PURE__ */ jsx("div", {
          className: "input skeleton"
        }), /* @__PURE__ */ jsx("div", {
          className: "info skeleton"
        }), /* @__PURE__ */ jsx("div", {
          className: "button skeleton"
        })]
      })]
    })
  });
}
const twittermodal = "";
function TokenListMoadal({
  openToken,
  handlePoolAndTokenSelect,
  selectedTokens
}) {
  const {
    tokenList,
    poolList
  } = useSelector((state) => state);
  const container = React.useRef(null);
  const [selectedToken, setSelectedToken] = react.exports.useState("");
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = react.exports.useState("");
  const [tokenListBackup, setTokenListBackup] = react.exports.useState({
    token0: [],
    token1: []
  });
  const [tokensList, setTokensList] = react.exports.useState({
    token0: [],
    token1: []
  });
  const handleSearchToken = (e) => {
    const input = String(e.target.value);
    setSearch(input);
    const filtered = tokenListBackup[selectedToken].filter((el) => el?.name?.toLowerCase().includes(input.toLowerCase()) || el?.symbol?.toLowerCase().includes(input.toLowerCase()) || el?.address?.toLowerCase().includes(input.toLowerCase()));
    setTokensList({
      ...tokenListBackup,
      [`${selectedToken}`]: filtered
    });
  };
  const selectToken = (symbol) => {
    handlePoolAndTokenSelect(selectedToken, symbol);
  };
  React.useEffect(() => {
    const poolsArray = Object.values(poolList);
    const tokensArray = Object.values(tokenList);
    if (poolsArray.length && tokensArray.length) {
      const tokensBySymbolObject0 = {};
      const tokensBySymbolObject1 = {};
      for (let i = 0; i < tokensArray.length; i++) {
        tokensBySymbolObject0[tokensArray[i]?.symbol] = {
          ...tokensArray[i],
          withPool: false
        };
        tokensBySymbolObject1[tokensArray[i]?.symbol] = {
          ...tokensArray[i],
          withPool: false
        };
      }
      poolsArray.filter((pool) => pool.token0.symbol === selectedTokens.token0 || pool.token1.symbol === selectedTokens.token0).map((pool) => {
        if (pool.token0.symbol === selectedTokens.token0) {
          tokensBySymbolObject0[pool.token1.symbol] = {
            ...tokensBySymbolObject0[pool.token1.symbol],
            withPool: true
          };
          return {
            token: pool.token1
          };
        } else if (pool.token1.symbol === selectedTokens.token0) {
          tokensBySymbolObject0[pool.token0.symbol] = {
            ...tokensBySymbolObject0[pool.token0.symbol],
            withPool: true
          };
          return {
            token: pool.token0
          };
        }
      });
      poolsArray.filter((pool) => pool.token0.symbol === selectedTokens.token1 || pool.token1.symbol === selectedTokens.token1).map((pool) => {
        if (pool.token0.symbol === selectedTokens.token1) {
          tokensBySymbolObject1[pool.token1.symbol] = {
            ...tokensBySymbolObject1[pool.token1.symbol],
            withPool: true
          };
          return {
            token: pool.token1
          };
        } else if (pool.token1.symbol === selectedTokens.token1) {
          tokensBySymbolObject1[pool.token0.symbol] = {
            ...tokensBySymbolObject1[pool.token0.symbol],
            withPool: true
          };
          return {
            token: pool.token0
          };
        }
      });
      delete tokensBySymbolObject0[selectedTokens.token0];
      delete tokensBySymbolObject0[selectedTokens.token1];
      delete tokensBySymbolObject1[selectedTokens.token0];
      delete tokensBySymbolObject1[selectedTokens.token1];
      const withToken0 = sortByKey(Object.values(tokensBySymbolObject0), "withPool", 1);
      const withToken1 = sortByKey(Object.values(tokensBySymbolObject1), "withPool", 1);
      setTokensList({
        token1: withToken0,
        token0: withToken1
      });
      setTokenListBackup({
        token1: withToken0,
        token0: withToken1
      });
    }
    container.current.addEventListener("scroll", () => {
      if (container.current.scrollTop + container.current.clientHeight >= container.current.scrollHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (openToken.token0) {
      setSelectedToken("token0");
    } else if (openToken.token1) {
      setSelectedToken("token1");
    }
  }, [openToken, selectedTokens]);
  return /* @__PURE__ */ jsxs("div", {
    className: "select_token_modal",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "search_token",
      children: [/* @__PURE__ */ jsxs("h3", {
        className: "paragraph02",
        children: ["Select ", selectedToken, " "]
      }), /* @__PURE__ */ jsxs("div", {
        className: "input_container",
        children: [/* @__PURE__ */ jsx(FaSearch, {}), /* @__PURE__ */ jsx("input", {
          autoFocus: true,
          type: "text",
          value: search,
          placeholder: "Search Tokens",
          onChange: handleSearchToken
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      ref: container,
      className: "token_list",
      children: Array.isArray(tokensList[selectedToken]) && tokensList[selectedToken].length > 0 && tokensList[selectedToken]?.map((token, i) => i < page * 100 && /* @__PURE__ */ jsxs("div", {
        onClick: () => selectToken(token.symbol),
        className: "token-card",
        children: [/* @__PURE__ */ jsx("img", {
          src: token?.logo,
          alt: ""
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h3", {
            children: token.symbol
          }), /* @__PURE__ */ jsx("span", {
            children: token?.withPool ? "pool Available" : ""
          })]
        })]
      }, i))
    })]
  });
}
const lend = "lend";
const borrow = "borrow";
const redeem = "redeem";
const repay = "repay";
function PoolComponent() {
  const contracts = useSelector((state) => state?.contracts);
  const user = useSelector((state) => state?.user);
  const web3 = useSelector((state) => state?.web3);
  const poolList = useSelector((state) => state?.poolList);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeToken, setActiveToken] = react.exports.useState(0);
  const [selectedToken, setSelectedToken] = react.exports.useState(null);
  const [collateralToken, setCollaterralToken] = react.exports.useState(null);
  const [activeOperation, setActiveOperation] = react.exports.useState(lend);
  const [selectLTV, setSelectLTV] = react.exports.useState(5);
  const [poolData, setPoolData] = react.exports.useState({});
  const [amount, setAmount] = react.exports.useState("");
  const [max, setMax] = react.exports.useState(false);
  const [isOperationLoading, setIsOperationLoading] = react.exports.useState(false);
  const [isPageLoading, setIsPageLoading] = react.exports.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = react.exports.useState(false);
  const [showSelectTokenModal, setShowSelectTokenModal] = react.exports.useState(false);
  const [isMoreThanPoolLTV, setIsMoreThanPoolLTV] = react.exports.useState(false);
  const [colleteral, setColleteral] = react.exports.useState(0);
  const [methodLoaded, setMethodLoaded] = react.exports.useState({
    getPoolData: false,
    getPoolFullData: false,
    getOraclePrice: false,
    getPoolTokensData: false
  });
  const [reFetching, setReFetching] = react.exports.useState(false);
  const [openToken0, setOpenToken0] = react.exports.useState(false);
  const [openToken1, setOpenToken1] = react.exports.useState(false);
  const [selectedTokens, setSelectedTokens] = react.exports.useState({
    token0: "",
    token1: ""
  });
  react.exports.useState([]);
  react.exports.useState(null);
  const {
    poolAddress
  } = useParams();
  const [selectedPool, setSelectedPool] = react.exports.useState(poolAddress);
  const navigate = useNavigate();
  const {
    isConnected,
    chain
  } = useWalletHook();
  const liquidityText = {
    lend: "Your Liquidity",
    redeem: "Redeemable Amount",
    borrow: "Borrowed Amount",
    repay: "Repay Amount"
  };
  const getLiquidityAmount = {
    lend: selectedToken?.lendBalanceFixed,
    borrow: selectedToken?.borrowBalanceFixed,
    redeem: selectedToken?.redeemBalanceFixed,
    repay: selectedToken?.borrowBalanceFixed
  };
  const buttonAction = getActionBtn(activeOperation, amount, selectedToken, collateralToken, colleteral, reFetching);
  react.exports.useEffect(() => {
    const reloadParam = searchParams.get("reload");
    if (reloadParam) {
      window.location.reload();
      setSearchParams((params) => params.set("reload", false));
    }
  }, [searchParams]);
  const handleAmount = (e) => {
    const value = e.target.value;
    const parsedValue = value === "." ? "0" + value : value;
    if (/^[.]?[0-9]*[.]?[0-9]*$/.test(parsedValue) || parsedValue === "") {
      setAmount(parsedValue);
    }
    setMax(false);
    const LtvBasedOnAmount = getSelectLTV(selectedToken, collateralToken, e.target.value, poolData);
    if (LtvBasedOnAmount > poolData.ltv) {
      setIsMoreThanPoolLTV(true);
    } else {
      setIsMoreThanPoolLTV(false);
    }
    const LTV = LtvBasedOnAmount > poolData.ltv ? poolData.ltv : LtvBasedOnAmount;
    setSelectLTV(LTV);
  };
  const getCollateral = () => {
    let colleteral2;
    if (amount > 0) {
      colleteral2 = (Number(amount) + Number(selectedToken.borrowBalanceFixed)) * Number(selectedToken.price) / (selectLTV / 100) - Number(collateralToken.lendBalanceFixed);
      colleteral2 = colleteral2 > 1 * 10 * -10 && isMoreThanPoolLTV ? colleteral2 : 0;
      setColleteral(colleteral2);
    } else {
      setColleteral(0);
    }
  };
  react.exports.useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
    if (selectedToken && collateralToken) {
      getCollateral();
    }
  }, [amount, selectLTV]);
  const checkTxnStatus = (hash, txnData) => {
    waitForBlockConfirmation(hash).then((res) => {
      const [receipt, currentBlockNumber] = res;
      const trasactionBlock = fromBigNumber(receipt.blockNumber);
      const currentblock = fromBigNumber(currentBlockNumber);
      if (receipt.status == "success" && currentblock - trasactionBlock > 2) {
        setReFetching(true);
        if (txnData.method !== "approval") {
          const msg = `Transaction for ${txnData.method} of ${Number(txnData.amount).toFixed(4)} for token ${txnData.tokenSymbol}`;
          NotificationMessage("success", msg);
          setAmount("");
          setTimeout(() => {
            setMethodLoaded({
              getPoolData: false,
              getPoolFullData: false,
              getOraclePrice: false,
              getPoolTokensData: false
            });
          }, 8e3);
        } else {
          NotificationMessage("success", "Approval Successfull");
          setTimeout(() => {
            setMethodLoaded({
              getPoolData: true,
              getPoolFullData: true,
              getOraclePrice: true,
              getPoolTokensData: false
            });
          }, 5e3);
        }
        setMax(false);
        setIsOperationLoading(false);
      } else {
        setTimeout(function() {
          checkTxnStatus(hash, txnData);
        }, 1e3);
      }
    }).catch((error) => {
      setTimeout(function() {
        checkTxnStatus(hash, txnData);
      }, 1e3);
    });
  };
  const checkTxnError = (error) => {
    setAmount("");
    setMax(false);
    setIsOperationLoading(false);
    const errorText = String(error.reason);
    error?.message ? errorText : "Error: Transaction Error";
    const msg = error?.code === "ACTION_REJECTED" ? "Transaction Denied" : "Something went wrong, Refresh and Try again";
    NotificationMessage("error", msg);
  };
  const handleOperation = () => {
    try {
      (async () => {
        setIsOperationLoading(true);
        if (contracts.coreContract) {
          if (activeOperation === lend) {
            handleLend(amount, selectedToken, poolData, contracts, user.address, selectedPool, web3, checkTxnStatus, checkTxnError);
          } else if (activeOperation === redeem) {
            handleRedeem(amount, selectedToken, max, poolData, selectedPool, user.address, contracts, checkTxnStatus, checkTxnError);
          } else if (activeOperation === borrow) {
            handleBorrow(selectedToken, user.address, collateralToken, poolData, contracts, colleteral, amount, web3, checkTxnStatus, checkTxnError);
          } else if (activeOperation === repay) {
            handleRepay(amount, selectedToken, poolData, max, contracts, selectedPool, user.address, web3, checkTxnStatus, checkTxnError);
          }
        }
      })();
    } catch (error) {
    }
  };
  react.exports.useEffect(() => {
    if (selectedToken && collateralToken) {
      const ltv = getCurrentLTV(selectedToken, collateralToken);
      setSelectLTV(ltv);
    }
  }, [selectedToken, collateralToken]);
  const toggleToken = (token) => {
    setActiveToken(token);
    setAmount("");
    if (token === 0) {
      setSelectedToken(poolData.token0);
      setCollaterralToken(poolData.token1);
    } else {
      setSelectedToken(poolData.token1);
      setCollaterralToken(poolData.token0);
    }
  };
  const toggleOperation = (operation) => {
    if (selectedToken?.tabs?.includes(operation)) {
      setActiveOperation(operation);
      setAmount("");
    }
  };
  const handleLTVSlider = (value) => {
    setSelectLTV(value);
    if (colleteral <= 0) {
      const amountBasedOnLtv = getBorrowMax(selectedToken, collateralToken, value);
      const trunc = truncateToDecimals(amountBasedOnLtv, selectedToken._decimals);
      setAmount(trunc);
    }
  };
  const fetchPoolDATA = async () => {
    try {
      if (!methodLoaded.getPoolData) {
        const pool = await getPoolBasicData(contracts, selectedPool, poolData, poolList[selectedPool]);
        if (pool?.token0 && pool?.token1) {
          setPoolData(pool);
          setMethodLoaded({
            ...methodLoaded,
            getPoolData: true
          });
        }
      } else if (methodLoaded.getPoolData && !methodLoaded.getPoolFullData) {
        const pool = await getPoolAllData(contracts, poolData, selectedPool, user.address);
        if (pool?.token0 && pool?.token1) {
          setMethodLoaded({
            ...methodLoaded,
            getPoolFullData: true
          });
          setPoolData(pool);
        }
      } else if (methodLoaded.getPoolData && methodLoaded.getPoolFullData && !methodLoaded.getOraclePrice) {
        const pool = await getOracleData(contracts, poolData);
        if (pool?.token0 && pool?.token1) {
          setPoolData(pool);
          setMethodLoaded({
            ...methodLoaded,
            getOraclePrice: true
          });
        }
      } else if (methodLoaded.getPoolData && methodLoaded.getPoolFullData && methodLoaded.getOraclePrice && !methodLoaded.getPoolTokensData) {
        const poolTokensPrice = await getTokenPrice(contracts, poolData, selectedPool, user.address);
        if (poolTokensPrice?.token0 && poolTokensPrice?.token1) {
          setPoolData(poolTokensPrice);
          setMethodLoaded({
            ...methodLoaded,
            getPoolTokensData: true
          });
        }
      }
    } catch (error) {
      if (error.code == "CALL_EXCEPTION") {
        fetchPoolDATA();
      }
      throw error;
    }
  };
  react.exports.useEffect(() => {
    if (selectedToken === null)
      setIsPageLoading(true);
    const isAllTrue = Object.values(methodLoaded).find((el) => el === false) === void 0 ? true : false;
    if (contracts.helperContract && contracts.coreContract && Object.values(poolList).length > 0 && isAllTrue == false) {
      try {
        fetchPoolDATA();
      } catch (error) {
        fetchPoolDATA();
      }
    }
    if (isAllTrue && selectedToken !== null && selectedToken?._symbol === poolData?.token0?._symbol) {
      setSelectedToken(poolData?.token0);
      setCollaterralToken(poolData?.token1);
      setReFetching(false);
      setActiveToken(0);
      setIsPageLoading(false);
      setSelectedTokens({
        token0: poolData?.token0?.symbol,
        token1: poolData?.token1?.symbol
      });
    } else if (isAllTrue && selectedToken !== null) {
      setSelectedToken(poolData?.token1);
      setCollaterralToken(poolData?.token0);
      setIsPageLoading(false);
      setReFetching(false);
      setSelectedTokens({
        token0: poolData?.token0?.symbol,
        token1: poolData?.token1?.symbol
      });
    } else if (isAllTrue) {
      setSelectedToken(poolData?.token0);
      setCollaterralToken(poolData?.token1);
      setActiveToken(0);
      setIsPageLoading(false);
      setReFetching(false);
      setSelectedTokens({
        token0: poolData?.token0?.symbol,
        token1: poolData?.token1?.symbol
      });
    }
  }, [contracts, methodLoaded, user, poolList, selectedPool, poolData]);
  const maxTrigger = () => {
    setMax(true);
    let amountToSet = "";
    switch (activeOperation) {
      case lend:
        amountToSet = truncateToDecimals(selectedToken.balanceFixed, selectedToken._decimals);
        break;
      case borrow:
        const maxBorrow = getBorrowMax(selectedToken, collateralToken, poolData.ltv);
        amountToSet = truncateToDecimals(maxBorrow, selectedToken._decimals);
        setSelectLTV(poolData.ltv);
        break;
      case redeem:
        amountToSet = Number(selectedToken.liquidityFixed) > Number(selectedToken.redeemBalanceFixed) ? selectedToken.redeemBalanceFixed : selectedToken.liquidityFixed;
        amountToSet = truncateToDecimals(amountToSet, selectedToken._decimals);
        break;
      case repay:
        amountToSet = selectedToken.borrowBalanceFixed;
        break;
      default:
        setAmount("");
    }
    setAmount(amountToSet);
  };
  const handleCloseModals = () => {
    setIsOpenConfirmModal(false);
  };
  const handleOperationWithConfirmation = () => {
    if (colleteral > 0 && activeOperation === borrow && !isOpenConfirmModal && !buttonAction.text.includes("Approve")) {
      setIsOpenConfirmModal(true);
    } else {
      handleOperation();
      handleCloseModals();
    }
  };
  const ConfirmationModal = () => {
    return /* @__PURE__ */ jsxs("div", {
      className: "ConfirmModel",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "collateral_icon",
        children: [/* @__PURE__ */ jsx("img", {
          className: "ticker_img",
          src: collateralToken?.logo
        }), collateralToken?._symbol]
      }), /* @__PURE__ */ jsxs("h1", {
        children: [" ", Number(colleteral).toFixed(4)]
      }), /* @__PURE__ */ jsxs("p", {
        children: ["Additional Collateral Required ", /* @__PURE__ */ jsx("br", {}), " From Wallet"]
      }), /* @__PURE__ */ jsxs("div", {
        className: "buttons",
        children: [/* @__PURE__ */ jsx("button", {
          onClick: handleCloseModals,
          children: "Cancel"
        }), /* @__PURE__ */ jsx("button", {
          onClick: handleOperationWithConfirmation,
          children: "Confirm"
        })]
      })]
    });
  };
  const handlePoolAndTokenSelect = (key, token) => {
    const tokens = {
      ...selectedTokens,
      [key]: token
    };
    setSelectedTokens(tokens);
    setShowSelectTokenModal(false);
    if (tokens.token0 && tokens.token1) {
      let poolAddress2;
      const poolsArray = Object.values(poolList);
      for (let i = 0; i < poolsArray.length; i++) {
        const pool = poolsArray[i];
        if (poolsArray[i].token0.symbol == tokens.token0 && poolsArray[i].token1.symbol == tokens.token1 || poolsArray[i].token0.symbol == tokens.token1 && poolsArray[i].token1.symbol == tokens.token0) {
          poolAddress2 = pool.poolAddress;
          navigate(`/pool/${pool.poolAddress}`);
          setMethodLoaded({
            getPoolData: false,
            getPoolFullData: false,
            getOraclePrice: false,
            getPoolTokensData: false
          });
          setSelectedPool(pool.poolAddress);
          setIsPageLoading(true);
          setSelectedToken(null);
          break;
        }
      }
      if (poolAddress2 == void 0) {
        setSelectedTokens({
          token0: poolData?.token0?.symbol,
          token1: poolData?.token1?.symbol
        });
      }
    }
  };
  const handleOpenSelectTokenMoadal = (bool, token) => {
    setAmount("");
    if (token === "token0") {
      setOpenToken0(true);
      setOpenToken1(false);
    } else if (token === "token1") {
      setOpenToken1(true);
      setOpenToken0(false);
    }
    setShowSelectTokenModal(bool);
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: isPageLoading && selectedToken == null ? /* @__PURE__ */ jsx(PoolSkeleton, {}) : /* @__PURE__ */ jsxs("div", {
      className: "pool_container",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "token_container",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            onClick: () => toggleToken(0),
            className: `token_tab ${activeToken === 0 ? " active" : ""}`,
            children: [/* @__PURE__ */ jsx("img", {
              src: poolData?.token0?.logo,
              onError: imgError,
              alt: ""
            }), /* @__PURE__ */ jsx("h2", {
              children: poolData?.token0?._symbol
            })]
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => handleOpenSelectTokenMoadal(true, "token0"),
            className: "dropdown",
            children: /* @__PURE__ */ jsx(FaChevronDown, {
              className: "dropicon"
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            onClick: () => toggleToken(1),
            className: `token_tab ${activeToken === 1 ? " active" : ""}`,
            children: [/* @__PURE__ */ jsx("img", {
              src: poolData?.token1?.logo,
              onError: imgError,
              alt: ""
            }), /* @__PURE__ */ jsx("h2", {
              children: poolData?.token1?._symbol
            })]
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => handleOpenSelectTokenMoadal(true, "token1"),
            className: "dropdown",
            children: /* @__PURE__ */ jsx(FaChevronDown, {
              className: "dropicon"
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "content",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "oparation_tab",
          children: [/* @__PURE__ */ jsx("div", {
            onClick: () => toggleOperation(lend),
            className: activeOperation === lend ? "active" : selectedToken?.tabs?.includes("lend") ? "" : "disable_tab",
            children: "Lend"
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => toggleOperation(redeem),
            className: activeOperation === redeem ? "active" : selectedToken?.tabs?.includes("redeem") ? "" : "disable_tab",
            children: "Redeem"
          }), /* @__PURE__ */ jsx(Tooltip, {
            title: selectedToken?.tabs?.includes("borrow") ? "" : "Oracle is not set",
            defaultOpen: true,
            children: /* @__PURE__ */ jsx("div", {
              onClick: () => toggleOperation(borrow),
              className: activeOperation === borrow ? "active" : selectedToken?.tabs?.includes("borrow") ? "" : "disable_tab",
              children: "Borrow"
            })
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => toggleOperation(repay),
            className: activeOperation === repay ? "active" : selectedToken?.tabs?.includes("repay") ? "" : "disable_tab",
            children: "Repay"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "user_liquidity",
          children: [/* @__PURE__ */ jsx("p", {
            className: "paragraph06",
            children: liquidityText[activeOperation]
          }), /* @__PURE__ */ jsx(Tooltip, {
            title: getLiquidityAmount[activeOperation],
            trigger: "hover",
            children: /* @__PURE__ */ jsx("h1", {
              className: "heading02",
              children: selectedToken ? truncateToDecimals(getLiquidityAmount[activeOperation], 6) : 0
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "token_balance_container",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "lable",
            children: [/* @__PURE__ */ jsx("p", {
              className: "paragraph05",
              children: activeOperation
            }), /* @__PURE__ */ jsxs("div", {
              children: [" ", /* @__PURE__ */ jsx("a", {
                href: `https://chaindrop.org/?chainid=${user?.network?.id}&token=${selectedToken?._address}`,
                target: "_blank",
                children: " "
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "token_balance",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("img", {
                src: selectedToken?.logo,
                alt: ""
              }), /* @__PURE__ */ jsx("p", {
                className: "paragraph04",
                children: selectedToken?._symbol
              })]
            }), /* @__PURE__ */ jsx(Tooltip, {
              title: selectedToken?.balanceFixed,
              children: /* @__PURE__ */ jsxs("p", {
                className: "paragraph06",
                children: ["Balance:", " ", Number(truncateToDecimals(selectedToken?.balanceFixed, 6))]
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "input_container",
          children: [/* @__PURE__ */ jsx("input", {
            value: amount !== null ? amount : "",
            onChange: handleAmount,
            type: "text",
            placeholder: "0.0"
          }), /* @__PURE__ */ jsx("button", {
            onClick: maxTrigger,
            className: "max_btn",
            children: "MAX"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: `colleteral_req ${activeOperation === borrow && colleteral > 0 ? "show_colleteral_req" : "hide_colleteral_req"}`,
          children: [/* @__PURE__ */ jsx("p", {
            children: "Additional Collateral Required From Wallet"
          }), /* @__PURE__ */ jsx(Tooltip, {
            title: colleteral,
            children: /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h5", {
                children: Number(truncateToDecimals(colleteral, 6))
              }), /* @__PURE__ */ jsx("img", {
                src: collateralToken?.logo,
                alt: ""
              }), /* @__PURE__ */ jsx("p", {
                children: collateralToken?._symbol
              })]
            })
          })]
        }), activeOperation === borrow && /* @__PURE__ */ jsxs("div", {
          className: "ltv_container",
          children: [/* @__PURE__ */ jsxs("p", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Current LTV"
            }), /* @__PURE__ */ jsxs("span", {
              children: [getCurrentLTV(selectedToken, collateralToken), "%"]
            })]
          }), /* @__PURE__ */ jsxs("p", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Select LTV"
            }), /* @__PURE__ */ jsxs("span", {
              children: [" ", /* @__PURE__ */ jsxs("span", {
                children: [selectLTV, "%/"]
              }), poolData.ltv, "%", " "]
            })]
          }), /* @__PURE__ */ jsx(Slider$1, {
            value: Number(selectLTV),
            defaultValue: Number(selectLTV),
            onChange: handleLTVSlider,
            min: 5,
            max: Number(poolData.ltv),
            className: "ltv_slider"
          })]
        }), (activeOperation === redeem || activeOperation === borrow) && /* @__PURE__ */ jsxs("div", {
          className: "liquidity_factors",
          children: [/* @__PURE__ */ jsxs("p", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Liquidity"
            }), /* @__PURE__ */ jsx(Tooltip, {
              title: selectedToken?.liquidityFixed,
              children: /* @__PURE__ */ jsxs("span", {
                children: [isNaN(Number(selectedToken?.liquidityFixed).toFixed(6)) ? 0 : Number(truncateToDecimals(selectedToken?.liquidityFixed, 6)), " ", selectedToken?._symbol]
              })
            })]
          }), /* @__PURE__ */ jsxs("p", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Utilization"
            }), /* @__PURE__ */ jsxs("span", {
              children: [isNaN(selectedToken?.utilRate) ? 0 : selectedToken?.utilRate, "%", " "]
            })]
          }), /* @__PURE__ */ jsxs("p", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Oracle"
            }), isNaN(poolData.token0.price) ? /* @__PURE__ */ jsx("span", {
              className: "skeleton loader"
            }) : /* @__PURE__ */ jsxs("span", {
              children: ["1 ", poolData.token0._symbol, " =", " ", Number(poolData.token0.price), " ", poolData.token1._symbol, " "]
            })]
          })]
        }), (activeOperation === lend || activeOperation === borrow) && /* @__PURE__ */ jsxs("div", {
          className: "analytics",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("span", {
              children: [activeOperation, " APY"]
            }), /* @__PURE__ */ jsxs("h3", {
              className: "paragraph04",
              children: [activeOperation === lend ? isNaN(Number(selectedToken?.lendAPY).toFixed(4)) ? 0 : Number(selectedToken?.lendAPY).toFixed(4) : isNaN(Number(selectedToken?.borrowAPY).toFixed(4)) ? 0 : Number(selectedToken?.borrowAPY).toFixed(4), "%"]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Utilization rate"
            }), /* @__PURE__ */ jsxs("h3", {
              className: "paragraph04",
              children: [isNaN(selectedToken?.utilRate) ? 0 : selectedToken?.utilRate, "%"]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("span", {
              children: "Health Factor"
            }), /* @__PURE__ */ jsx("h3", {
              className: "paragraph04",
              children: selectedToken?.healthFactorFixed > 100 ? 100 : Number(selectedToken?.healthFactorFixed).toFixed(2)
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "operation_btn",
          children: /* @__PURE__ */ jsx(Button, {
            onClick: handleOperationWithConfirmation,
            loading: isOperationLoading || reFetching,
            disabled: buttonAction.disable,
            children: buttonAction.text
          })
        })]
      }), /* @__PURE__ */ jsx(Modal, {
        className: "antd_modal_overlay",
        open: isOpenConfirmModal,
        centered: true,
        onCancel: handleCloseModals,
        footer: null,
        closable: false,
        children: /* @__PURE__ */ jsx(ConfirmationModal, {})
      }), /* @__PURE__ */ jsx(Modal, {
        className: "antd_modal_overlay",
        open: showSelectTokenModal,
        centered: true,
        onCancel: () => setShowSelectTokenModal(false),
        footer: null,
        closable: false,
        children: /* @__PURE__ */ jsx(TokenListMoadal, {
          openToken: {
            token0: openToken0,
            token1: openToken1
          },
          handlePoolAndTokenSelect,
          selectedTokens
        })
      })]
    })
  });
}
function Pool() {
  return /* @__PURE__ */ jsx(PoolComponent, {});
}
export {
  Pool as default
};
