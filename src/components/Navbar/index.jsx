import React, { useState, useRef, useEffect } from "react";
import "./styles/index.scss";
import { FiLock } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";

import logo from "../../assets/logo.svg";
import mobileLogo from "../../assets/mobileLogo.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import gitbook from "../../assets/gitbook.svg";
import doc from "../../assets/document.svg";
import career from "../../assets/career.svg";
import faq from "../../assets/faq.svg";

export default function Navbar() {
  const [extendNavBar, setExtendNavbar] = useState(false);

  const ref = useRef();

  useEffect(() => {
    const closeDropDown = (event) => {
      if (!ref.current.contains(event.target)) {
        setExtendNavbar(false);
      }
    };
    document.addEventListener("mousedown", closeDropDown);

    return () => document.body.removeEventListener("mousedown", closeDropDown);
  }, []);

  return (
    <div className="nav_container">
      <img src={logo} alt="" />
      <img src={mobileLogo} alt="" className="mobileLogo" />

      <nav>
        <a href="#" className="active">
          Pools
        </a>

        <a href="#">
          Dashboard
          <FiLock style={{ marginLeft: "10px" }} />
        </a>

        <a href="#">
          Vote
          <FiLock style={{ marginLeft: "10px" }} />
        </a>

        <a href="#">
          Reward
          <FiLock style={{ marginLeft: "10px" }} />
        </a>

        <a href="#" className="active">
          History
        </a>
      </nav>

      <div className="userInfo-wrapper">
        <button className="NetworkIndicator">
          Ethereum
          <RiArrowDropDownLine style={{ fontSize: "18px" }} />
        </button>

        <div className="user_info">
          <span>balance</span>
          <span className="user_address">Address</span>
        </div>
      </div>

      <div className="openMenu">
        <GiHamburgerMenu
          style={{ fontSize: "24px" }}
          onClick={() => {
            setExtendNavbar((prev) => !prev);
          }}
        />
      </div>

      {extendNavBar && (
        <div className="overlay">
          <div className="navigation" ref={ref}>
            <li>
              <span>Gitbook</span>
              <img src={gitbook} />
            </li>
            <li>
              <span>Documentation</span>
              <img src={doc} />
            </li>
            <li>
              <span>Career</span>
              <img src={career} />
            </li>
            <li>
              <span>FAQ</span>
              <img src={faq} />
            </li>
          </div>
        </div>
      )}
    </div>
  );
}
