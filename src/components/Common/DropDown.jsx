import React from "react";
import { Popover } from "antd";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import './styles/dropdown.scss'
export default function DropDown({list}) {

const [visible, setVisible] = useState(false);
const [actionIndex, setActiveIndex] = useState()


const handleVisible = (bool) => {
  setVisible(bool)
}

const handleList = (callback, index) => {
  callback()
  setActiveIndex(index)
}


  const SortContent = () => {
    return (
      <div className="sort_popover">
      {
         list.map((el, i) => {
          return(
          <p className={`${actionIndex === i ? "activeSort" : ""} `} onClick={ () => handleList(el.fun, i)} > <span> {el.icon}  </span> <span>{el?.text}</span>   </p>
          )
        })
      }
      </div>
    );
  };

  return (
    <Popover
      content={<SortContent />}
      trigger="click"
      overlayClassName="sort_dropDown"
      placement="bottomLeft"
      open={visible}
      onOpenChange={handleVisible}
    >
      <div className={`sortBy`}>
        <p>Sort By</p>
        <DownOutlined />
      </div>
    </Popover>
  );
}
