import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

export default function DonutChart ({data}) {
  const [pieData, setPieData] = useState([])
  // const data = [
  //   {
  //     type: 'UFT',
  //     value: 70,
  //   },
  //   {
  //     type: 'ETH',
  //     value: 20,
  //   },
  //   {
  //     type: 'MATIC',
  //     value: 5,
  //   },
  //   {
  //     type: 'OTHERS',
  //     value: 5,
  //   }
  // ];

  useEffect(() => {
  //  console.log("PieData", data);
  }, [data])

  const config = {
    appendPadding: 5,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.4,
    meta: {
        value: {
          formatter: (v) => `${v} %`,
        },
      },
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 10,
      },
    },
    theme : {
        colors10: [
          '#0045FF',
          '#818BA1',
          '#F5AC37',
          '#8F00FF',
          '#76523B',
          '#DAD5B5',
          '#0E8E89',
          '#E19348',
          '#F383A2',
          '#247FEA',
        ]
      },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
  };
  return <Pie {...config} />;
};
