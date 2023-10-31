import React, { useState, useEffect, memo } from "react";
import ReactDOM from "react-dom";
import { Pie, G2 } from "@ant-design/plots";

const DonutChart = memo(function DonutChartMemo({ data }) {

  const G = G2.getEngine("canvas");

  // show first 5 data and remaining are in others;
  const selectedData = (data) => {
    if (data.length > 5) {
      const firstFive = data.slice(0, 5);
      const othersValue = data
        .slice(5)
        .reduce((acc, curr) => acc + curr.value, 0);
      const others = { key: "Others", value: othersValue };
      return [...firstFive, others];
    } else {
      return data;
    }
  };
  // setPieData(selectedData(data));

  const config = {
    appendPadding: 20,
    data: selectedData(data),
    // data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.4,
    // legend: {
    //   itemName: {
    //     style: {
    //       fontSize: 12,
    //       fontWeight: 700,
    //     },
    //   },
    // },
    meta: {
      value: {
        formatter: (v) => `${v} %`,
      },
    },
    // label: {
    //   type: 'inner',
    //   offset: '-50%',
    //   content: '{value}%',
    //   style: {
    //     textAlign: 'center',
    //     fontSize: 10,
    //   },
    // },
    legend: false,
    label: {
      type: "spider",
      labelHeight: 40,
      formatter: (data, mappingData) => {
        const group = new G.Group({});
        group.addShape({
          type: "circle",
          attrs: {
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            r: 3,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: "text",
          attrs: {
            x: 10,
            y: 6,
            text: `${data.type}`,
            fill: mappingData.color,
            // fontSize: "40px",
          },
        });
        group.addShape({
          type: "text",
          attrs: {
            x: 6,
            y: 20,
            text: `${data.value}%`,
            // fill: "#fff",
            // fill: `${theme === "dark" ? "#fff" : "#0045FF"}`,
            fill: "#99959c",
          },
        });
        return group;
      },
    },
    theme: {
      colors10: [
        "#0045FF",
        "#F5AC37",
        "#8F00FF",
        "#76523B",
        "#818BA1",
        "#DAD5B5",
        "#0E8E89",
        "#E19348",
        "#F383A2",
        "#247FEA",
      ],
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: 800,
        },
        content: "",
      },
    },
  };
  return <Pie {...config} />;
});

export default DonutChart;
