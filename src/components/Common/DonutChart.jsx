import React, { useState, useEffect, memo } from "react";
import ReactDOM from "react-dom";
import { Pie } from "@ant-design/plots";

const DonutChart = memo(function DonutChartMemo({ data }) {
  const [pieData, setPieData] = useState([]);

  const config = {
    appendPadding: 20,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.4,
    legend: {
      itemName: {
        style: {
          fontSize: 12,
          fontWeight: 700,
        },
      },
    },
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
    label: {
      type: "spider",
      labelHeight: 40,
      content: "{value}%",
      // offset: "0%",
      style: {
        //   textAlign: "center",
        fontSize: "40px",
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
