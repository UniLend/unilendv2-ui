import React, { memo, useEffect, useState } from 'react';
// import {
//   FaArrowLeft,
//   FaChevronDown,
//   FaChevronUp,
//   FaSearch,
// } from "react-icons/fa";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
} from 'react-icons/fi';
import { Popover, Input, Modal, Button, Switch } from 'antd';
import './styles/index.scss';
import { imgError } from '../../utils';
import { useSelector } from 'react-redux';
export default function GovernanceComponent() {
  const { tokenList } = useSelector((state) => state);

  const [showProposal, setShowProposal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [proposalAction, setProposalAction] = useState('Select an action');
  const [amount, setAmount] = useState(null);
  const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
  const [availableToken, setAvailableToken] = useState(
    Object.values(tokenList),
  );
  const [selectedToken, setSelectedToken] = useState(availableToken[0]);
  const [serachTokenFromList, setSerachTokenFromList] = useState('');
  const [tokenBackup, setTokenBackup] = React.useState(
    Object.values(tokenList),
  );

  const handleCreateProposal = () => {
    setShowProposal(!showProposal);
  };

  const handleShowCancelled = (checked) => {
  };

  const handleShowActionModal = (visible) => {
    setShowActionModal(visible);
  };

  const handleSeclectProposalAction = (action) => {
    setProposalAction(action);
    setShowActionModal(false);
  };

  const handleOpenSelectTokenMoadal = () => {
    setAmount('');
    setShowSelectTokenModal(true);
  };

  const handleSearchToken = (e) => {
    setSerachTokenFromList(e.target.value);
    const filtered = tokenBackup.filter(
      (el) =>
        el.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        el.symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
        el.address.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setAvailableToken(filtered);
  };

  const handleCloseModals = () => {
    setShowSelectTokenModal(false);
    setSerachTokenFromList('');
  };

  useEffect(() => {
    const list = Object.values(tokenList);
    setAvailableToken(list);
    setTokenBackup(list);
    setSelectedToken(list[0]);
  }, [tokenList]);

  const SelectAction = memo(() => {
    return (
      <div className='select_action_popover'>
        <h3>Select an action</h3>

        <p
          onClick={() => handleSeclectProposalAction('Transfer token')}
          className='paragraph03'
        >
          Transfer token
        </p>
        <p
          onClick={() => handleSeclectProposalAction('Approve token')}
          className='paragraph03'
        >
          Approve token
        </p>
      </div>
    );
  });

  const TokenCard = React.memo(({ token, index }) => {
    const handleTokensList = () => {
      handleCloseModals();
      setSelectedToken(token);
    };

    return (
      <div onClick={handleTokensList} className='token_card'>
        <img src={token.logoURI || token.logo} alt='' />
        <div>
          <h3>{token.name}</h3>
          <span>{token.symbol}</span>
        </div>
      </div>
    );
  });

  const TokenListModalBody = React.memo(() => {
    const container = React.useRef(null);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
      container.current.addEventListener('scroll', () => {
        if (
          container.current.scrollTop + container.current.clientHeight >=
          container.current.scrollHeight
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    }, []);

    return (
      <div className='select_token_modal'>
        <div className='search_token'>
          <h3 className='paragraph02'>Select Token</h3>
          <div className='input_container'>
            <FiSearch />
            <input
              autoFocus
              type='text'
              placeholder='Search Tokens'
              value={serachTokenFromList}
              onChange={handleSearchToken}
            />
          </div>
        </div>
        <div ref={container} className='token_list'>
          {showSelectTokenModal &&
            availableToken.map(
              (token, i) =>
                i < page * 100 && <TokenCard key={i} token={token} index={i} />,
            )}
        </div>
      </div>
    );
  });

  return (
    <div className='governance_component'>
      {!showProposal ? (
        <div className='governance'>
          <div className='create'>
            <h2>Proposals</h2>
            <button onClick={handleCreateProposal}>Create proposal</button>
          </div>

          <div className='show_cancel_container'>
            <p>Show cancelled</p>
            <Switch onChange={handleShowCancelled} />
          </div>

          <div className='proposals_list'>
            {new Array(10).fill(0).map((_, ind) => {
              return (
                <a href={`/vote/${ind}`} className='' key={ind}>
                  <span>1.11</span>
                  <span>proposal title</span>
                  <span>execute</span>
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <main className='create_proposal_container'>
          <div
            role='button'
            className='create_proposal_nav'
            onClick={handleCreateProposal}
          >
            <FiArrowLeft />
            <p className='paragraph02'> Create Proposal</p>
          </div>
          <div className='create_proposal_requirements'>
            <p className='proposal_tip'>
              <strong>Tip: </strong>
              &nbsp;Select an action and describe your proposal for the
              community. The proposal cannot be modified after submission, so
              please verify all information before submitting. The voting period
              will begin immediately and last for 7 days. To propose a custom
              action, &nbsp;
              <a target='_blank' rel='noopener noreferrer' href=''>
                read the docs
              </a>
              .
            </p>
            <section className='proposal_action field'>
              <p className='label paragraph05'>Proposed action</p>
              <Popover
                content={<SelectAction />}
                trigger='click'
                overlayClassName='proposal_action_dropdown'
                placement='bottomLeft'
                open={showActionModal}
                onOpenChange={handleShowActionModal}
              >
                <div className='proposal_action_data'>
                  <p className='paragraph02'>{proposalAction}</p>
                  {showActionModal ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </Popover>
            </section>
            <section className='proposal_address field'>
              <p className='label paragraph05'>To</p>
              <Input type='text' placeholder='Wallet Address or ENS name' />
            </section>
            <section className='proposal_amount field'>
              <Input type='number' placeholder='0' />
              <div
                className='token_container'
                onClick={handleOpenSelectTokenMoadal}
              >
                <img
                  src={selectedToken?.logo}
                  onError={imgError}
                  alt={selectedToken?.symbol}
                />
                <h2>{selectedToken?.symbol}</h2>
                <FiChevronDown className='dropicon' />
              </div>
            </section>
            <section className='proposal field'>
              <p className='label paragraph05'>Proposal</p>
              <input type='text' placeholder='Proposal Title' />
              <hr />
              <textarea
                placeholder={`## Summry \nInsert your summary here \n## Methodology \nInsert your methodology here \n## Conclusion \nInsert your conclusion here`}
              ></textarea>
            </section>
          </div>
          <Button className='proposal_btn'>
            You must have 2,500,000 votes to submit a proposal
          </Button>
          <p className='paragraph05 proposal_note'>
            Don’t have 2.5M votes? Anyone can create an autonomous proposal
            using <a href='#'>fish.vote</a>
          </p>
          <Modal
            className='antd_modal_overlay'
            open={showSelectTokenModal}
            centered
            onCancel={() => setShowSelectTokenModal(false)}
            footer={null}
            closable={false}
          >
            {<TokenListModalBody />}
          </Modal>
        </main>
      )}
    </div>
  );
}
