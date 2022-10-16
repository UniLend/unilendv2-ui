import React, { useState } from "react";
import "./styles/index.scss";
import { Link } from "react-router-dom";
import { shortenAddress } from "../../helpers/shortenAddress";

// Imaged
import copyIcon from "../../assets/copyIcon.svg";
import viewExplorer from "../../assets/viewExplorerIcon.svg";

export const MiniPopup = (props) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.address);
    setCopied(true);
  };

  return (
    <div className="popover-content">
      <div className="disconnect">
        <div className="outer-radial">
          <div className="inner-radial"></div>
        </div>
        <h4>{shortenAddress(props.address)}</h4>
        <button className="disconnectButton">Disconnect</button>
      </div>
      <div className="explorer">
        <div onClick={copyToClipboard} className={copied && "copied"}>
          <div className="copy-wrapper">
            <img src={copyIcon} alt="copyicon" className="copyIcon" />
            <p> {copied ? "Copied ✅" : "Copy address"}</p>
          </div>
        </div>
        <Link to="/history">
          <div className="explore-wrapper">
            <img
              src={viewExplorer}
              alt="viewExplorericon"
              className="exploreIcon"
            />
            <p>TXN History</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
