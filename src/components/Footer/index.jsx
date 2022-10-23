import React from "react";
import "./styles/index.scss";
import {
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";

import MobileFooter from "../MobileFooter";

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

      <MobileFooter />
    </footer>
  );
}
