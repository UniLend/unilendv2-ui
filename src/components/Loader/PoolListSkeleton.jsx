import React from "react";
import "./styles/poolList.scss";

export default function PoolListSkeleton() {
  return (
    <div className="pool_list_skeleton_container">
      {new Array(9).fill(9).map((el, i) => (
        <div key={i} className="skeleton_card">
          <div className="pool_icons">
            <div className="div">
              <div className="skeleton"></div>
              <div className="skeleton"></div>
            </div>
          </div>

          <div className="pool_data">
            <div className="div1">
              <div className="skeleton"></div>
            </div>
            <div className="div1">
              <div className="skeleton"></div>
            </div>
          </div>
          <div className="pool_footer">
            <div className="skeleton"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
