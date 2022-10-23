import React, { useState, useEffect } from "react";
import "./styles/index.scss";
import { setTheme, setUser, setWeb3 } from "../../store/Action";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet, getweb3Instance, changeNetwork} from "../../services/wallet";
import { shortenAddress } from "../../helpers/shortenAddress";
import { networks } from "../../core/networks/networks";
import { getFromLocalStorage } from "../../utills";
import MobileNav from "../MobileNavbar";


// Images
import mobileLogo from "../../assets/mobileLogo.svg";

// React Icons
import { FiLock } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import logo from "../../assets/logo.svg";
import { MiniPopup } from "../MiniPopup";


export default function Navbar() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [popupVisible, setPopupVisible] = useState(false);

  const { address, balance, network } = state.user;

  console.log(address, balance, network);


  const handleConnectWallet = async () => {
    const web3 = await getweb3Instance();
    const userData = await connectWallet(web3);
    dispatch(setUser(userData));
  };

  console.log("web3 from state", state.user);



  
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

      <MobileNav />
    </div>
  );
}
