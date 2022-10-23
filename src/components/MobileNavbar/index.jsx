import React, { useState, useEffect, useRef } from "react";
import "./styles/index.scss";

import { GiHamburgerMenu } from "react-icons/gi";

import gitbook from "../../assets/gitbook.svg";
import doc from "../../assets/document.svg";
import career from "../../assets/career.svg";
import faq from "../../assets/faq.svg";

export default function MobileNav() {
  const [extendNavBar, setExtendNavbar] = useState(false);
  const ref = useRef();


  useEffect(() => {
    const closeDropDown = (event) => {
      if (!ref?.current?.contains(event.target)) {
        setExtendNavbar(false);
      }
    };
    document.addEventListener("mousedown", closeDropDown);

    return () => document.body.removeEventListener("mousedown", closeDropDown);
  }, []);

  return (
    <div>
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
