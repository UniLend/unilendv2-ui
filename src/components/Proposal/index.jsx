import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./styles/index.scss";

export default function ProposalComponent() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  console.log("PROPOSAL_ID", proposalId);

  const handleMoveToProposal = () => {
    navigate("/vote");
  };
  return (
    <main className="proposal_component">
      <div className="proposal_nav">
        <div role="presentation" onClick={handleMoveToProposal}>
          <FiArrowLeft className="item" />
          <p className="item paragraph04">All Proposals</p>
        </div>
        <p className="item executed">Executed</p>
      </div>

      <div className="proposal_title">
        <h2 className="heading05">Deploy Uniswap V3 on Scroll</h2>
        <p className="paragraph04">
          Voting ended November 7, 2023 at 11:09 AM GMT+5:30
        </p>
      </div>

      <div className="voting_data">
        <p className="paragraph04 voting_for">
          <span>For</span> <span>52,273,199 / 40,000,000</span>
        </p>
        <p className="paragraph04 voting_against">
          <span>Against</span> <span>190</span>
        </p>
      </div>

      <h4>Details</h4>
      <p className="paragraph05">
        1: <a href="">ENS Public Resolver</a>,
        0x0b9638d2c5bd4528d603562a1fa1e734fe1b88e680f448d779531e9bc2b55f12,
        534352, 0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367,
        0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919
      </p>
      <h4>Description</h4>
      <h1 className="heading05">Deploy Uniswap V3 on Scroll</h1>

      <p>
        After a successful temperature check as well as deployments of Uniswap
        V3 on both our Alpha and Sepolia testnets, Scroll looks to move towards
        a final governance proposal to officially approve Scroll’s Uniswap V3
        deployment on its newly launched mainnet.
      </p>
    </main>
  );
}
