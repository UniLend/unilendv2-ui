import { a$ as react, b1 as jsx, bX as AntdIcon, bY as _objectSpread2, b2 as GenIcon, bZ as Popover, b0 as jsxs } from "./index.a9e8707a.js";
var DownOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" } }] }, "name": "down", "theme": "outlined" };
const DownOutlinedSvg = DownOutlined$2;
var DownOutlined = function DownOutlined2(props, ref) {
  return /* @__PURE__ */ jsx(AntdIcon, {
    ..._objectSpread2(_objectSpread2({}, props), {}, {
      ref,
      icon: DownOutlinedSvg
    })
  });
};
DownOutlined.displayName = "DownOutlined";
const DownOutlined$1 = /* @__PURE__ */ react.exports.forwardRef(DownOutlined);
function ImArrowUp2(props) {
  return GenIcon({ "tag": "svg", "attr": { "version": "1.1", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "M13.707 6.293l-5-5c-0.39-0.391-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.293-3.293v9.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-9.586l3.293 3.293c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293c0.391-0.391 0.391-1.024 0-1.414z" } }] })(props);
}
function ImArrowDown2(props) {
  return GenIcon({ "tag": "svg", "attr": { "version": "1.1", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "M13.707 9.707l-5 5c-0.39 0.391-1.024 0.391-1.414 0l-5-5c-0.391-0.391-0.391-1.024 0-1.414s1.024-0.391 1.414 0l3.293 3.293v-9.586c0-0.552 0.448-1 1-1s1 0.448 1 1v9.586l3.293-3.293c0.195-0.195 0.451-0.293 0.707-0.293s0.512 0.098 0.707 0.293c0.391 0.391 0.391 1.024 0 1.414z" } }] })(props);
}
const dropdown = "";
function DropDown({
  list,
  active = 0,
  title = "Sort By"
}) {
  const [visible, setVisible] = react.exports.useState(false);
  const [actionIndex, setActiveIndex] = react.exports.useState(active);
  const handleVisible = (bool) => {
    setVisible(bool);
  };
  const handleList = (callback, index) => {
    callback();
    setActiveIndex(index);
  };
  const SortContent = () => {
    return /* @__PURE__ */ jsx("div", {
      className: "sort_popover",
      children: list.map((el, i) => {
        return /* @__PURE__ */ jsxs("p", {
          className: `${actionIndex === i ? "activeSort" : ""} `,
          onClick: () => handleList(el.fun, i),
          children: [" ", /* @__PURE__ */ jsxs("span", {
            children: [" ", el.icon, "  "]
          }), " ", /* @__PURE__ */ jsx("span", {
            children: el?.text
          }), "   "]
        }, i);
      })
    });
  };
  return /* @__PURE__ */ jsx(Popover, {
    content: /* @__PURE__ */ jsx(SortContent, {}),
    trigger: "click",
    overlayClassName: "sort_dropDown",
    placement: "bottomLeft",
    open: visible,
    onOpenChange: handleVisible,
    children: /* @__PURE__ */ jsxs("div", {
      className: `sortBy`,
      children: [/* @__PURE__ */ jsx("p", {
        children: title
      }), /* @__PURE__ */ jsx(DownOutlined$1, {})]
    })
  });
}
export {
  DropDown as D,
  ImArrowUp2 as I,
  ImArrowDown2 as a,
  DownOutlined$1 as b
};
