import React, { useState } from 'react';
import './styles/twittermodal.scss';

import gift from '../../assets/gift.svg';
import copyIcon from '../../assets/copyIcon.svg';
import { BsTwitter } from 'react-icons/bs';
import { message } from 'antd';
// import { TwitterShareButton, TwitterIcon } from "react-share";

const tweet =
  'Woohoo! I just tried @Unilend_Finance v2 for permissionless lending and borrowing.This is a new era for #DeFi in #Web3. Try out Unilend v2 and get a chance to win up to $5000 in $UFT. https://unilendv2-testnet.netlify.app/share';

export default function TwitterModal() {
  const [modalVisible, setModalVisible] = useState(true);
  const [copied, setCopied] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    message.success('Copied Successfully!');
  };
  const ModalBody = () => {
    return (
      <>
        <div className='modal-wrapper'>
          <h3>Welcome to the new era of DeFi</h3>

          <div className={`copy-text-container ${copied ? 'text_copy' : ''}`}>
            <p>{window.location.origin}</p>

            <img onClick={copyToClipboard} src={copyIcon} alt='' />
          </div>

          <div className='info-container'>
            <img src={gift} alt='' />

            <h2>Congratulations!!</h2>
            <p>
              Share your experience of using UniLend v2 and enter a chance to
              win upto $5000.
            </p>
          </div>
          <a
            href={`https://twitter.com/intent/tweet?text=Woohoo! I just tried @UniLend_Finance v2 for permissionless lending and borrowing%0A%0AThis is a new era for ${encodeURIComponent(
              '#Defi in #Web3',
            )}%0A%0ATry out UniLend v2 and get a chance to win up to $5000 in $UFT%0A%0ATestnet: https://testnet.unilend.finance%0A%0AParticipate: https://gleam.io/ABpVU/unilend-v2-launch-5000-in-uft-airdrop
%0A%0A${encodeURIComponent('#unilendV2')}`}
            target='_blank'
          >
            <div className='shareBtn'>
              <BsTwitter fontSize={24} />
              Share
            </div>
          </a>
        </div>
      </>
    );
  };
  return (
    <div>
      <ModalBody />
    </div>
  );
}
