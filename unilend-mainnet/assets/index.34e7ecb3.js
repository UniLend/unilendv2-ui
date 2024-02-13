import { a$ as react, b0 as jsxs, b1 as jsx, b2 as GenIcon, b3 as sortByKey, b4 as useSelector } from "./index.a9e8707a.js";
import { P as PoolCard, M as ManageToken, N as NoPoolFound } from "./index.ec559e5d.js";
import { D as DropDown, I as ImArrowUp2, a as ImArrowDown2 } from "./DropDown.74bf9039.js";
import "./pool.3ee9169e.js";
import "./index.aa1badc2.js";
import "./NotificationMessage.c0aa2d2d.js";
const banner = "/assets/bannermainnet.19be43d8.svg";
const index = "";
function c(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(t2) {
      return Object.getOwnPropertyDescriptor(e, t2).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function d(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = null != arguments[t] ? arguments[t] : {};
    t % 2 ? c(Object(n), true).forEach(function(t2) {
      a(e, t2, n[t2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : c(Object(n)).forEach(function(t2) {
      Object.defineProperty(e, t2, Object.getOwnPropertyDescriptor(n, t2));
    });
  }
  return e;
}
function a(e, t, n) {
  return (t = function(e2) {
    var t2 = function(e3, t3) {
      if ("object" != typeof e3 || null === e3)
        return e3;
      var n2 = e3[Symbol.toPrimitive];
      if (void 0 !== n2) {
        var r = n2.call(e3, t3 || "default");
        if ("object" != typeof r)
          return r;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t3 ? String : Number)(e3);
    }(e2, "string");
    return "symbol" == typeof t2 ? t2 : String(t2);
  }(t)) in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[t] = n, e;
}
function s() {
  return s = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, s.apply(this, arguments);
}
function u(e, t) {
  if (null == e)
    return {};
  var n, r, i = function(e2, t2) {
    if (null == e2)
      return {};
    var n2, r2, i2 = {}, o2 = Object.keys(e2);
    for (r2 = 0; r2 < o2.length; r2++)
      n2 = o2[r2], t2.indexOf(n2) >= 0 || (i2[n2] = e2[n2]);
    return i2;
  }(e, t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    for (r = 0; r < o.length; r++)
      n = o[r], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
  }
  return i;
}
function v(e, t) {
  return function(e2) {
    if (Array.isArray(e2))
      return e2;
  }(e) || function(e2, t2) {
    var n = null == e2 ? null : "undefined" != typeof Symbol && e2[Symbol.iterator] || e2["@@iterator"];
    if (null != n) {
      var r, i, o, l, c2 = [], d2 = true, a2 = false;
      try {
        if (o = (n = n.call(e2)).next, 0 === t2) {
          if (Object(n) !== n)
            return;
          d2 = false;
        } else
          for (; !(d2 = (r = o.call(n)).done) && (c2.push(r.value), c2.length !== t2); d2 = true)
            ;
      } catch (e3) {
        a2 = true, i = e3;
      } finally {
        try {
          if (!d2 && null != n.return && (l = n.return(), Object(l) !== l))
            return;
        } finally {
          if (a2)
            throw i;
        }
      }
      return c2;
    }
  }(e, t) || m(e, t) || function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function f(e) {
  return function(e2) {
    if (Array.isArray(e2))
      return h(e2);
  }(e) || function(e2) {
    if ("undefined" != typeof Symbol && null != e2[Symbol.iterator] || null != e2["@@iterator"])
      return Array.from(e2);
  }(e) || m(e) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function m(e, t) {
  if (e) {
    if ("string" == typeof e)
      return h(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? h(e, t) : void 0;
  }
}
function h(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++)
    r[n] = e[n];
  return r;
}
var p = ["responsiveProps"], b = ["minWidth", "maxWidth"], y = ["style"], w = ["style"], x = ["style", "onTransitionEnd"], S = ["children", "show"], g = ["children", "show"], E = ["className", "style"], T = ["className", "style"], I = ["className", "onClick", "style"], O = ["props"];
function L(t) {
  var c2 = t.responsiveProps, a2 = void 0 === c2 ? [] : c2, m2 = u(t, p), h2 = v(react.exports.useState(0), 2), L2 = h2[0], j2 = h2[1], k = v(react.exports.useState(m2.activeSlideIndex), 2), P = k[0], C = k[1], M = react.exports.useRef(null), W = react.exports.useRef(null), A = react.exports.useRef(null), N = react.exports.useRef(false), X = react.exports.useRef(0), F = react.exports.useRef(false), V = react.exports.useRef(""), D = react.exports.useRef(null), z = react.exports.useRef(null), B = react.exports.useRef(0), R = react.exports.useRef(P), q = a2.reduce(function(e) {
    var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = t2.minWidth, r = void 0 === n ? 0 : n, i = t2.maxWidth, o = void 0 === i ? null : i, l = u(t2, b);
    return L2 > r && (!o || L2 <= o) ? d(d({}, e), l) : e;
  }, m2), H = react.exports.Children.toArray(q.children), U = L2 ? d(d({}, q), {}, {
    activeSlideIndex: Math.max(0, Math.min(q.activeSlideIndex, H.length - 1)),
    itemsToShow: Math.min(H.length, q.itemsToShow || 0),
    itemsToScroll: Math.min(H.length, q.itemsToScroll || 1)
  }) : m2, $ = U.containerProps, G = void 0 === $ ? {} : $, J = G.style, K = void 0 === J ? {} : J, Q = u(G, y), Y = U.innerProps, Z = void 0 === Y ? {} : Y, _ = Z.style, ee = void 0 === _ ? {} : _, te = u(Z, w), ne = U.itemsListProps, re = void 0 === ne ? {} : ne, ie = re.style, oe = void 0 === ie ? {} : ie, le = re.onTransitionEnd, ce = void 0 === le ? void 0 : le, de = u(re, x), ae = U.backwardBtnProps, se = void 0 === ae ? {} : ae, ue = se.children, ve = void 0 === ue ? null : ue, fe = se.show, me = void 0 === fe || fe, he = u(se, S), pe = U.forwardBtnProps, be = void 0 === pe ? {} : pe, ye = be.children, we = void 0 === ye ? null : ye, xe = be.show, Se = void 0 === xe || xe, ge = u(be, g), Ee = U.activeSlideProps, Te = void 0 === Ee ? {} : Ee, Ie = Te.className, Oe = void 0 === Ie ? "" : Ie, Le = Te.style, je = void 0 === Le ? {} : Le, ke = u(Te, E), Pe = U.visibleSlideProps, Ce = void 0 === Pe ? {} : Pe, Me = Ce.className, We = void 0 === Me ? "" : Me, Ae = Ce.style, Ne = void 0 === Ae ? {} : Ae, Xe = u(Ce, T), Fe = U.updateOnItemClick, Ve = void 0 !== Fe && Fe, De = U.activeSlideIndex, ze = U.onRequestChange, Be = U.speed, Re = void 0 === Be ? 0 : Be, qe = U.delay, He = void 0 === qe ? 0 : qe, Ue = U.easing, $e = void 0 === Ue ? "linear" : Ue, Ge = U.itemsToShow, Je = void 0 === Ge ? 0 : Ge, Ke = U.itemsToScroll, Qe = void 0 === Ke ? 1 : Ke, Ye = U.children, Ze = U.onAfterChange, _e = U.autoplay, et = void 0 !== _e && _e, tt = U.autoplayDirection, nt = void 0 === tt ? "forward" : tt, rt = U.disableNavIfAllVisible, it = void 0 === rt || rt, ot = U.hideNavIfAllVisible, lt = void 0 === ot || ot, ct = U.centerMode, dt = void 0 !== ct && ct, at = U.infinite, st = void 0 === at || at, ut = U.disableNavIfEdgeVisible, vt = void 0 === ut || ut, ft = U.disableNavIfEdgeActive, mt = void 0 === ft || ft, ht = U.dotsNav, pt = void 0 === ht ? {} : ht, bt = U.persistentChangeCallbacks, yt = void 0 !== bt && bt, wt = U.autoplayDelay, xt = void 0 === wt ? 0 : wt, St = U.preventScrollOnSwipe, gt = void 0 !== St && St, Et = U.disableSwipeByMouse, Tt = void 0 !== Et && Et, It = U.disableSwipeByTouch, Ot = void 0 !== It && It, Lt = U.touchSwipeTreshold, jt = U.mouseSwipeTreshold, kt = U.swipeTreshold, Pt = U.touchSwipeRatio, Ct = U.mouseSwipeRatio, Mt = U.swipeRatio, Wt = void 0 === Mt ? 1 : Mt, At = pt || {}, Nt = At.show, Xt = void 0 !== Nt && Nt, Ft = At.containerProps, Vt = void 0 === Ft ? {} : Ft, Dt = At.itemBtnProps, zt = void 0 === Dt ? {} : Dt, Bt = At.activeItemBtnProps, Rt = void 0 === Bt ? {} : Bt, qt = react.exports.Children.count(Ye) - 1, Ht = Je === H.length, Ut = lt && Ht, $t = it && Ht, Gt = De - P == 0 || !Re && !He ? "none" : "transform ".concat(Re, "ms ").concat($e, " ").concat(He, "ms"), Jt = react.exports.useCallback(function(e) {
    var t2, n = e.correctionSlideIndex, r = e.prevCorrectionSlideIndex, i = e.curActiveSlideIndex, o = A.current.offsetWidth, l = A.current.children, c3 = l.length, d2 = st ? f(l).slice(c3 / 3 - r, c3 / 3 - r + c3 / 3) : f(l), a3 = null === (t2 = d2[i]) || void 0 === t2 ? void 0 : t2.offsetWidth, s2 = Je ? d2.reduce(function(e2, t3, n2) {
      return n2 >= i && n2 < i + Je || n2 < i && n2 < i + Je - d2.length ? e2 + t3.offsetWidth : e2;
    }, 0) : W.current.offsetWidth, u2 = Math.min(s2, W.current.offsetWidth), v2 = o - u2, m3 = dt && st ? -(u2 - a3) / 2 : 0, h3 = st ? o / 3 : 0, p2 = n - i == 0 ? 0 : "forward" === V.current && i < n ? h3 : "backward" === V.current && i > n ? -h3 : 0, b2 = i - n != 0, y2 = function(e2) {
      var t3 = d2.reduce(function(t4, n2, r2) {
        return r2 >= e2 ? t4 : t4 + (n2.offsetWidth || 0);
      }, 0);
      return st ? t3 : Math.min(v2, t3);
    }, w2 = b2 && st ? y2(n) : 0, x2 = b2 || !st ? y2(i) : 0, S2 = $t ? 0 : x2 - w2 + m3 + p2 + h3, g2 = "translateX(-".concat(S2, "px)"), E2 = st ? h3 + m3 : Math.min(v2, d2.reduce(function(e2, t3, n2) {
      return n2 < i ? e2 + t3.offsetWidth : e2;
    }, 0)), T2 = E2 + u2, I2 = d2.map(function(e2, t3) {
      return {
        slideIndex: t3,
        htmlElement: e2
      };
    }), O2 = st ? [].concat(f(d2.slice(i).map(function(e2, t3) {
      return {
        slideIndex: t3 + i,
        htmlElement: e2
      };
    })), f(I2), f(I2), f(d2.slice(0, i).map(function(e2, t3) {
      return {
        slideIndex: t3,
        htmlElement: e2
      };
    }))) : I2, L3 = O2.reduce(function(e2, t3) {
      var n2 = t3.slideIndex, r2 = t3.htmlElement.offsetWidth;
      return (e2.summ >= E2 && e2.summ < T2 || e2.summ + r2 > E2 && e2.summ + r2 <= T2) && e2.items.push({
        slideIndex: n2,
        isFullyVisible: e2.summ + r2 <= T2 && e2.summ >= E2
      }), e2.summ += r2, e2;
    }, {
      summ: 0,
      items: []
    }), j3 = !!L3.items.find(function(e2) {
      return 0 === e2.slideIndex;
    }), k2 = !!L3.items.find(function(e2) {
      return e2.slideIndex === d2.length - 1;
    });
    return {
      slidesHTMLElements: d2,
      innerMaxWidth: s2,
      itemsListMaxTranslateX: v2,
      activeSlideWidth: a3,
      offsetCorrectionForCenterMode: m3,
      offsetCorrectionForInfiniteMode: h3,
      itemsListTranslateX: S2,
      itemsListTransform: g2,
      visibleSlides: L3.items,
      isFirstSlideVisible: j3,
      isLastSlideVisible: k2
    };
  }, [dt, $t, st, Je]), Kt = L2 ? Jt({
    prevCorrectionSlideIndex: R.current,
    curActiveSlideIndex: De,
    correctionSlideIndex: P
  }) : {}, Qt = Kt.innerMaxWidth, Yt = void 0 === Qt ? 0 : Qt, Zt = Kt.itemsListMaxTranslateX, _t = void 0 === Zt ? 0 : Zt, en = Kt.activeSlideWidth, tn = void 0 === en ? 0 : en, nn = Kt.offsetCorrectionForCenterMode, rn = void 0 === nn ? 0 : nn, on = Kt.offsetCorrectionForInfiniteMode, ln = void 0 === on ? 0 : on, cn = Kt.itemsListTranslateX, dn = void 0 === cn ? 0 : cn, an = Kt.itemsListTransform, sn = void 0 === an ? "none" : an, un = Kt.visibleSlides, vn = void 0 === un ? [] : un, fn = react.exports.useCallback(function(e) {
    if ("forward" === e) {
      var t2 = De + Qe;
      return t2 > qt ? st ? t2 - qt - 1 : qt : t2;
    }
    if ("backward" === e) {
      var n = De - Qe;
      return n < 0 ? st ? qt + 1 + n : 0 : n;
    }
    return De;
  }, [De, Qe, qt, st]), mn = react.exports.useCallback(function(e, t2) {
    if (V.current = t2, A.current.style.transition = Re || He ? "transform ".concat(Re, "ms ").concat($e, " ").concat(He, "ms") : "none", e !== De || yt) {
      var n;
      clearTimeout(D.current);
      var r = Jt({
        correctionSlideIndex: P,
        prevCorrectionSlideIndex: P,
        curActiveSlideIndex: e
      }), i = r.visibleSlides, o = r.isFirstSlideVisible, l = r.isLastSlideVisible, c3 = r.itemsListTransform;
      e !== De && (null === (n = A.current) || void 0 === n ? void 0 : n.style.transform) === c3 && (N.current = true), A.current.style.transform = c3, ze(e, {
        visibleSlides: i,
        isFirstSlideVisible: o,
        isLastSlideVisible: l
      });
    } else
      A.current.style.transform = "translateX(-".concat(rn + ln + (st ? 0 : dn), "px)");
  }, [yt, De, rn, He, $e, Re, ze, ln, st, dn, P, Jt]), hn = react.exports.useCallback(function() {
    et && (clearTimeout(D.current), D.current = setTimeout(function() {
      mn(fn(nt), nt);
    }, xt || He));
  }, [et, nt, xt, mn, fn, He]), pn = react.exports.useCallback(function() {
    mn(fn("backward"), "backward");
  }, [mn, fn]), bn = react.exports.useCallback(function(e) {
    C(De), ce && ce(e);
  }, [De, ce]), yn = react.exports.useCallback(function() {
    mn(fn("forward"), "forward");
  }, [mn, fn]), wn = function(e, t2, n) {
    return e.map(function(e2, r) {
      var i = e2.props, o = void 0 === i ? {} : i, l = o.className, c3 = void 0 === l ? "" : l, a3 = o.onClick, s2 = void 0 === a3 ? null : a3, v2 = o.style, f2 = void 0 === v2 ? {} : v2, m3 = u(o, I), h3 = u(e2, O), p2 = st ? B.current >= H.length ? "forward" : "backward" : r >= De ? "forward" : "backward", b2 = r + t2 === De, y2 = vn.find(function(e3) {
        return e3.slideIndex === r + t2;
      }), w2 = "".concat(c3, " ").concat(b2 ? Oe : "", " ").concat(y2 ? We : "").trim() || void 0, x2 = d(d(d(d({}, f2), y2 ? Ne : {}), b2 ? je : {}), {}, {
        boxSizing: "border-box",
        margin: 0
      }), S2 = !n && Ve ? function(e3) {
        var t3 = e3.direction, n2 = e3.index, r2 = e3.onClick;
        return function(e4) {
          mn(n2, t3 || (De < n2 ? "forward" : "") || (De > n2 ? "backward" : "")), r2 && r2(e4);
        };
      }({
        direction: p2,
        index: r + t2,
        onClick: s2
      }) : s2, g2 = d(d(d({
        role: "tabpanel",
        className: w2,
        style: x2,
        onClick: S2
      }, m3), y2 ? Xe : {}), b2 ? ke : {});
      return B.current += 1, d({
        props: g2
      }, h3);
    });
  };
  return react.exports.useEffect(function() {
    var e = A.current;
    function t2(e2) {
      e2.preventDefault(), e2.stopPropagation();
    }
    function n(e2) {
      var t3, n2;
      F.current = true;
      var r2 = !(null === (t3 = e2.touches) || void 0 === t3 || !t3[0]), i2 = r2 ? null === (n2 = e2.touches) || void 0 === n2 ? void 0 : n2[0].clientX : e2.clientX, o = (X.current - i2) * ((r2 ? Pt : Ct) || Wt) + rn + ln + (st ? 0 : dn), l = A.current.offsetWidth, c3 = Math.max(-o, -l);
      A.current.style.transition = "none", A.current.style.transform = "translateX(".concat(c3, "px)");
    }
    function r(e2) {
      if (document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", r), document.removeEventListener("touchmove", n), document.removeEventListener("touchend", r), F.current) {
        var i2, o;
        null === (i2 = e2.target) || void 0 === i2 || i2.addEventListener("click", t2);
        var l = !(null === (o = e2.changedTouches) || void 0 === o || !o[0]), c3 = l ? e2.changedTouches[e2.changedTouches.length - 1].clientX : e2.clientX, d2 = (X.current - c3) * ((l ? Pt : Ct) || Wt), a3 = (l ? Lt : jt) || kt || tn / 2, s2 = d2 > a3 ? {
          index: fn("forward"),
          direction: "forward"
        } : d2 < -a3 ? {
          index: fn("backward"),
          direction: "backward"
        } : {
          index: De,
          direction: "forward"
        };
        mn(s2.index, s2.direction);
      } else {
        var u2;
        null === (u2 = e2.target) || void 0 === u2 || u2.removeEventListener("click", t2);
      }
      X.current = 0, F.current = false;
    }
    function i(e2) {
      var t3, i2;
      clearTimeout(D.current);
      var o = !(null === (t3 = e2.touches) || void 0 === t3 || !t3[0]);
      X.current = o ? null === (i2 = e2.touches) || void 0 === i2 ? void 0 : i2[0].clientX : e2.clientX, o ? (document.addEventListener("touchmove", n), document.addEventListener("touchend", r)) : (document.addEventListener("mousemove", n), document.addEventListener("mouseup", r));
    }
    return $t || (Tt || null == e || e.addEventListener("mousedown", i), Ot || null == e || e.addEventListener("touchstart", i, {
      passive: true
    }), Tt && Ot || null == e || e.addEventListener("dragstart", r)), function() {
      F.current = false, X.current = 0, null == e || e.removeEventListener("mousedown", i), null == e || e.removeEventListener("touchstart", i), null == e || e.removeEventListener("dragstart", r), document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", r), document.removeEventListener("touchmove", n), document.removeEventListener("touchend", r);
    };
  }, [st, dn, sn, rn, ln, De, tn, fn, mn, $t, Tt, Ot, Lt, jt, kt, Pt, Ct, Wt]), react.exports.useEffect(function() {
    return De !== P ? (!Re && !He || N.current) && (N.current = false, C(De)) : (Ze && Ze(De, P), (st || "forward" === nt && De !== qt || "backward" === nt && 0 !== De) && hn()), function() {
      clearTimeout(D.current);
    };
  }, [P, De, Ze, Re, He, hn, st, qt, nt]), react.exports.useEffect(function() {
    return L2 && hn(), function() {
      clearTimeout(D.current);
    };
  }, [L2]), react.exports.useEffect(function() {
    function e() {
      clearTimeout(z.current), clearTimeout(D.current), z.current = setTimeout(function() {
        L2 !== window.innerWidth && j2(window.innerWidth);
      }, 400);
    }
    return L2 !== window.innerWidth && j2(window.innerWidth), window.addEventListener("resize", e), function() {
      clearTimeout(z.current), window.removeEventListener("resize", e);
    };
  }, [L2]), B.current = 0, R.current = P, /* @__PURE__ */ jsxs("div", {
    ...s({
      style: d({
        display: "flex",
        flexFlow: "row wrap",
        boxSizing: "border-box",
        justifyContent: "center",
        width: "100%"
      }, K)
    }, Q, {
      ref: M
    }),
    children: [me && !Ut && /* @__PURE__ */ jsx("button", {
      ...s({}, he, {
        type: "button",
        onClick: (0 === dn && vt || 0 === De && mt) && !st ? void 0 : pn,
        disabled: "boolean" == typeof he.disabled ? he.disabled : !(!(0 === dn && vt || 0 === De && mt) || st)
      }),
      children: ve
    }), /* @__PURE__ */ jsx("div", {
      ...s({}, te, {
        style: d(d({
          width: "100%"
        }, ee), {}, {
          display: "flex",
          boxSizing: "border-box",
          flexFlow: "row wrap",
          padding: "0",
          overflow: "hidden",
          maxWidth: Yt ? "".concat(Yt, "px") : void 0,
          flex: Yt ? void 0 : "1 0"
        }),
        ref: W
      }),
      children: /* @__PURE__ */ jsxs("div", {
        ...s({}, de, {
          style: d(d({}, oe), {}, {
            display: "flex",
            boxSizing: "border-box",
            outline: "none",
            transition: Gt,
            transform: sn,
            touchAction: gt ? "none" : "auto"
          }),
          onTransitionEnd: Re || He ? bn : ce,
          tabIndex: -1,
          role: "presentation",
          ref: A
        }),
        children: [st && wn(H.slice(P), P, $t), wn(H, 0, $t), st && wn(H, 0, $t), st && wn(H.slice(0, P), 0, $t)]
      })
    }), Se && !Ut && /* @__PURE__ */ jsx("button", {
      ...s({}, ge, {
        type: "button",
        onClick: (dn === _t && vt || De === qt && mt) && !st ? void 0 : yn,
        disabled: "boolean" == typeof ge.disabled ? ge.disabled : !(!(dn === _t && vt || De === qt && mt) || st)
      }),
      children: we
    }), !!Xt && /* @__PURE__ */ jsx("div", {
      ...s({
        style: {
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }
      }, Vt),
      children: Array.from({
        length: Math.ceil(H.length / Qe)
      }).map(function(t2, n) {
        return /* @__PURE__ */ jsx("button", {
          ...s({
            type: "button",
            key: n,
            title: "".concat(n)
          }, zt, De >= n * Qe && De < Math.min(Qe * (n + 1), qt + 1) ? Rt : {}, {
            onClick: function() {
              mn(Math.min(n * Qe, H.length - 1), Math.min(n * Qe, H.length - 1) > De ? "forward" : "backward");
            }
          })
        });
      })
    })]
  });
}
var j = react.exports.memo(L);
function RiArrowLeftSLine(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" } }] })(props);
}
function RiArrowRightSLine(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z" } }] })(props);
}
function PoolCardSkeleton() {
  return /* @__PURE__ */ jsxs("div", {
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
  });
}
function PoolCarousel({
  pools,
  isLoading
}) {
  const [activeSlide1, setActiveSlide1] = react.exports.useState(0);
  const [activeSlide2, setActiveSlide2] = react.exports.useState(0);
  const [poolDataByTime, setPoolDataByTime] = react.exports.useState([]);
  const [poolDataByLiquidity, setPoolDataByLiquidity] = react.exports.useState([]);
  const handleSort = (key, order) => {
    const poolsObjectArray = Array.isArray(pools) && pools.filter((pool) => pool.hide == false);
    const sortBy = sortByKey(poolsObjectArray, key, order);
    if (key == "blockTimestamp") {
      setPoolDataByTime(sortBy);
    } else if (key == "totalLiquidity") {
      setPoolDataByLiquidity(sortBy);
    }
  };
  const blocktimeSortList = [{
    text: "Created",
    fun: () => handleSort("blockTimestamp", 1),
    icon: /* @__PURE__ */ jsx(ImArrowUp2, {})
  }, {
    text: "Created",
    fun: () => handleSort("blockTimestamp", 2),
    icon: /* @__PURE__ */ jsx(ImArrowDown2, {})
  }];
  const liquiditySortList = [{
    text: "Liquidity",
    fun: () => handleSort("totalLiquidity", 1),
    icon: /* @__PURE__ */ jsx(ImArrowUp2, {})
  }, {
    text: "Liquidity",
    fun: () => handleSort("totalLiquidity", 2),
    icon: /* @__PURE__ */ jsx(ImArrowDown2, {})
  }];
  react.exports.useEffect(() => {
    handleSort("blockTimestamp", 1);
    handleSort("totalLiquidity", 1);
  }, [pools]);
  return /* @__PURE__ */ jsx("div", {
    className: "pool_carousel_container",
    children: /* @__PURE__ */ jsxs("div", {
      className: "carousel_row",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "title_sort_container",
        children: [/* @__PURE__ */ jsx("h2", {
          children: "New Pools"
        }), /* @__PURE__ */ jsx(DropDown, {
          list: blocktimeSortList
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "carousel_container ",
        children: /* @__PURE__ */ jsx(j, {
          containerProps: {
            className: "containerProps"
          },
          activeSlideIndex: activeSlide1,
          onRequestChange: setActiveSlide1,
          infinite: false,
          innerProps: {
            className: "innerclass"
          },
          forwardBtnProps: {
            children: /* @__PURE__ */ jsx(RiArrowRightSLine, {
              style: {
                fontSize: "25px",
                fontWeight: 700,
                position: "relative",
                right: "5px"
              }
            }),
            className: "forwardBtnProps"
          },
          backwardBtnProps: {
            children: /* @__PURE__ */ jsx(RiArrowLeftSLine, {
              style: {
                fontSize: "25px",
                fontWeight: 700,
                position: "relative",
                right: "5px"
              }
            }),
            className: "backwardBtnProps"
          },
          itemsToShow: 1,
          speed: 400,
          children: poolDataByTime.length > 0 && isLoading ? poolDataByTime.map((pool, i) => /* @__PURE__ */ jsxs("div", {
            className: "poolcard_div",
            children: [" ", /* @__PURE__ */ jsx(PoolCard, {
              pool
            }), " "]
          }, i)) : new Array(5).fill(0).map((pool, i) => /* @__PURE__ */ jsxs("div", {
            className: "poolcard_div",
            children: [" ", /* @__PURE__ */ jsx(PoolCardSkeleton, {}, i), " "]
          }, i))
        })
      }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsxs("div", {
        className: "title_sort_container",
        children: [/* @__PURE__ */ jsx("h2", {
          children: "High Liquidity Pools"
        }), /* @__PURE__ */ jsx(DropDown, {
          list: liquiditySortList
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "carousel_container",
        children: /* @__PURE__ */ jsx(j, {
          containerProps: {
            className: "containerProps"
          },
          activeSlideIndex: activeSlide2,
          onRequestChange: setActiveSlide2,
          infinite: false,
          innerProps: {
            className: "innerclass"
          },
          forwardBtnProps: {
            children: /* @__PURE__ */ jsx(RiArrowRightSLine, {
              style: {
                fontSize: "25px",
                fontWeight: 700,
                position: "relative",
                right: "5px"
              }
            }),
            className: "forwardBtnProps"
          },
          backwardBtnProps: {
            children: /* @__PURE__ */ jsx(RiArrowLeftSLine, {
              style: {
                fontSize: "25px",
                fontWeight: 700,
                position: "relative",
                right: "5px"
              }
            }),
            className: "backwardBtnProps"
          },
          itemsToShow: 3,
          speed: 400,
          children: poolDataByLiquidity.length > 0 && isLoading ? poolDataByLiquidity.map((pool, i) => /* @__PURE__ */ jsxs("div", {
            className: "poolcard_div",
            children: [" ", /* @__PURE__ */ jsx(PoolCard, {
              pool
            }, i), " "]
          }, i)) : new Array(5).fill(0).map((pool, i) => /* @__PURE__ */ jsxs("div", {
            className: "poolcard_div",
            children: [" ", /* @__PURE__ */ jsx(PoolCardSkeleton, {}, i), " "]
          }, i))
        })
      })]
    })
  });
}
function HeroComponent() {
  useSelector((state) => state.theme);
  const poolList = useSelector((state) => state.poolList);
  const isLoadingPoolData = useSelector((state) => state.isLoadingPoolData);
  const [token1, setToken1] = react.exports.useState({});
  const [token2, setToken2] = react.exports.useState({});
  const [pools, setPools] = react.exports.useState({});
  const [filteredPools, setFilteredPools] = react.exports.useState([]);
  const [poolBackup, setPoolBackup] = react.exports.useState({});
  react.exports.useEffect(() => {
    if (Object.values(poolList).length > 0) {
      setPools(Object.values(poolList));
      setPoolBackup(Object.values(poolList));
    }
  }, [poolList]);
  react.exports.useEffect(() => {
  }, []);
  react.exports.useEffect(() => {
    if (token1?.symbol && !token2?.symbol) {
      const filtered = Array.isArray(poolBackup) && poolBackup.filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token1.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token1.symbol)));
      setFilteredPools(filtered);
    } else if (token2?.symbol && !token1?.symbol) {
      const filtered = Array.isArray(poolBackup) && poolBackup.filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token2.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token2.symbol)));
      setFilteredPools(filtered);
    } else if (token1?.symbol && token2?.symbol) {
      const filtered = Array.isArray(poolBackup) && poolBackup.filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token1.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token1.symbol))).filter((pool) => String(pool?.token0.symbol).toUpperCase().includes(String(token2.symbol)) || String(pool?.token1.symbol).toUpperCase().includes(String(token2.symbol)));
      setFilteredPools(filtered);
    } else {
      setFilteredPools([]);
    }
  }, [token1, token2]);
  const handleTokens = (token, selectedToken) => {
    if (selectedToken === "token1") {
      setToken1(token);
    } else if (selectedToken === "token2") {
      setToken2(token);
    } else {
      setToken1({});
      setToken2({});
    }
  };
  const updateToken = (token12, token22) => {
    setToken1(token12);
    setToken2(token22);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "hallofpools_container",
    children: [/* @__PURE__ */ jsx("div", {
      className: "banner",
      children: /* @__PURE__ */ jsx("img", {
        src: banner,
        alt: "v2-banner"
      })
    }), /* @__PURE__ */ jsx(ManageToken, {
      handleTokens,
      tokens: {
        token1,
        token2
      },
      pools
    }), filteredPools.length > 0 ? /* @__PURE__ */ jsx("div", {
      className: "poolcard_container",
      children: filteredPools.map((pool, i) => /* @__PURE__ */ jsx(PoolCard, {
        pool
      }, i))
    }) : token1.symbol || token2.symbol ? /* @__PURE__ */ jsx("div", {
      className: "no_pool_container",
      children: /* @__PURE__ */ jsx(NoPoolFound, {
        token1,
        token2,
        updateToken
      })
    }) : /* @__PURE__ */ jsx(PoolCarousel, {
      pools,
      isLoading: !isLoadingPoolData
    })]
  });
}
function HeroPage() {
  return /* @__PURE__ */ jsxs("div", {
    children: [" ", /* @__PURE__ */ jsx(HeroComponent, {}), " "]
  });
}
export {
  HeroPage as default
};
