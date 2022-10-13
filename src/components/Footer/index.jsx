import React from "react";
import "./styles/index.scss";
import {
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import { FiLock } from "react-icons/fi";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="poolFooter-copyright">
        <p>©2022 UniLend. All Rights Reserved.</p>
      </div>

      <div className="poolFooter-content">
        <ul>
          <li>Gitbook</li>
          <li>Github</li>
          <li>Tutorial</li>
        </ul>
      </div>

      <div className="poolFooter-socials">
        <ul>
          <li>
            <FaLinkedinIn size={20} className="icon" />
          </li>
          <li>
            <FaTwitter size={20} />
          </li>
          <li>
            <FaInstagram size={20} />
          </li>
          <li>
            <FaTelegramPlane size={20} />
          </li>
        </ul>
      </div>

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
    </footer>
  );
}
