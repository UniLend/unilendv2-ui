import React, { useState, useRef, useEffect } from "react";
import "./styles/index.scss";
import { setTheme, setUser, setWeb3 } from "../../store/Action";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet, getweb3Instance, changeNetwork} from "../../services/wallet";
import { shortenAddress } from "../../helpers/shortenAddress";
import { networks } from "../../core/networks/networks";
import { getFromLocalStorage } from "../../utills";

// Images
import mobileLogo from "../../assets/mobileLogo.svg";
import gitbook from "../../assets/gitbook.svg";
import doc from "../../assets/document.svg";
import career from "../../assets/career.svg";
import faq from "../../assets/faq.svg";

// React Icons
import { FiLock } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "../../assets/logo.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { MiniPopup } from "../MiniPopup";

export default function Navbar() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [extendNavBar, setExtendNavbar] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const { address, balance, network } = state.user;

  console.log(address, balance, network);

  const ref = useRef();

  const handleConnectWallet = async () => {
    const web3 = await getweb3Instance();
    const userData = await connectWallet(web3);
    dispatch(setUser(userData));
  };

  console.log("web3 from state", state.user);

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
        {address === "0x" ? (
          <>
            <button onClick={handleConnectWallet} className="connectButton">
              connect wallet
            </button>
          </>
        ) : (
          <>
            <button className="NetworkIndicator" onClick={() => changeNetwork("5")}>
              Ethereum
              <RiArrowDropDownLine style={{ fontSize: "18px" }} />
            </button>

            <div className="user_info">
              <span>{balance}</span>
              <span
                className="user_address"
                onClick={() => setPopupVisible(!popupVisible)}
              >
                {shortenAddress(address)}
              </span>
            </div>
          </>
        )}
      </div>
      <div>{popupVisible && <MiniPopup address={address} />}</div>

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
