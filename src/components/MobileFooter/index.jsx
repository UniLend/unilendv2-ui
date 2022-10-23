import React from "react";
import "./styles/index.scss";
import { Link } from "react-router-dom";


import { FiLock } from "react-icons/fi";

export default function MobileFooter() {
  return (
    <div>
      <div className="mobile-footer">
        <ul>
          <Link to="/">
            <li className="active-tab">Pools</li>
          </Link>
          <li>
            <span>Tokens</span>
            <FiLock width={10} height={10} />
          </li>

          <li>
            <span>Market</span>
            <FiLock width={10} height={10} />
          </li>
          <li>
            <span>Reward</span>
            <FiLock width={10} height={10} />
          </li>
          <Link to="/history">
            <li className="active-tab">Txn History</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
