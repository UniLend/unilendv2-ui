import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import './styles/index.scss';

export default function ProposalComponent() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  console.log('PROPOSAL_ID', proposalId);

  const [markupText, setMarkupText] = useState('');

  const mdText = `
### Details

1: [ENS Public Resolver](https://example.com), 0x0b9638d2c5bd4528d603562a1fa1e734fe1b88e680f448d779531e9bc2b55f12,
534352, 0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367,
0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919.

### Description
## Deploy Uniswap V3 on Scroll

After a successful temperature check as well as deployments of Uniswap
V3 on both our Alpha and Sepolia testnets, Scroll looks to move towards
a final governance proposal to officially approve Scroll’s Uniswap V3
deployment on its newly launched mainnet.

- Scroll is a bytecode-compatible zk-rollup, a native zkEVM scaling
solution for Ethereum.

- Scroll is an open-source project developed in collaboration with the
Ethereum Foundation Privacy and Scaling Explorations organization. It
was built with the community, for the community.

- Our community ethos and vision are aligned with Ethereum. We are
committed to a secure, decentralized, censorship-resistant, and
efficient future that Ethereum offers through our plans to
decentralize Scroll sequencers and provers.

- **Proposers:** Scroll Foundation
`;

  const handleMoveToProposal = () => {
    navigate('/vote');
  };

  useEffect(() => {
    // fetch(MarkdownFile)
    //   .then((response) => response.text())
    //   .then((text) => setMarkupText(text));
    // const text = requires("./markdown.md").default;
    // setMarkupText(text);
  }, []);
  return (
    <main className='proposal_component'>
      <div className='proposal_nav'>
        <div role='presentation' onClick={handleMoveToProposal}>
          <FiArrowLeft />
          <p className='paragraph04'>All Proposals</p>
        </div>
        <p className='executed'>Executed</p>
      </div>

      <div className='proposal_title'>
        <h2>Deploy Uniswap V3 on Scroll</h2>
        <p className='paragraph04'>
          Voting ended November 7, 2023 at 11:09 AM GMT+5:30
        </p>
      </div>

      <div className='voting_data'>
        <p className='paragraph04 voting_for'>
          <span>For</span> <span>52,273,199 / 40,000,000</span>
        </p>
        <p className='paragraph04 voting_against'>
          <span>Against</span> <span>190</span>
        </p>
      </div>

      {/* Markdown data */}
      <ReactMarkdown>{mdText}</ReactMarkdown>

      {/* <h4>Details</h4>
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
      <ul>
        <li>
          Scroll is a bytecode-compatible zk-rollup, a native zkEVM scaling
          solution for Ethereum.
        </li>
        <li>
          Scroll is an open-source project developed in collaboration with the
          Ethereum Foundation Privacy and Scaling Explorations organization. It
          was built with the community, for the community.
        </li>
        <li>
          Our community ethos and vision are aligned with Ethereum. We are
          committed to a secure, decentralized, censorship-resistant, and
          efficient future that Ethereum offers through our plans to
          decentralize Scroll sequencers and provers.
        </li>
        <li>
          <strong>Proposers:</strong> Scroll Foundation
        </li>
      </ul> */}
    </main>
  );
}
