import React from 'react';
import { Modal, Button, message } from 'antd';
import {  WalletFilled } from '@ant-design/icons';
import downoutline from "../../assets/downoutline.svg";
import './styles/index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet } from '../../services/wallet';
import { setUser } from '../../store/Action';
import { handleCreatePool } from '../../services/pool';

export default function NoPoolFound({ token1, token2, createPool }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const {user,contracts} =  useSelector((state) => state); 
    const dispatch = useDispatch()

    const handleCloseModal = () => {
      setIsCreateModalOpen(false);
    };
  
    const handleCreate = async () => {
      // await createPool();
     
     await handleCreatePool(contracts)
    };

    const handleConnect = async () => {
      const user = await connectWallet()
      dispatch(setUser(user))
    }
  
    const handleOpenModal = () => {
      if (token1.symbol && token2.symbol) {
        setIsCreateModalOpen(true);
      } else {
        message.info('Please select two tokens');
      }
    };
  
    return (
      <>
        <div className='no_pool_container'>
          <div className='no_pool_component'>
            <h1>No Pool Found</h1>
            <p>
              With Market, you can maximize your yield, contribute to risk
              management and create unparalleled opportunities to make the most of
              DeFi.
            </p>
  
           { user.address == '0x'?   <Button
              icon={<WalletFilled />}
              size='large'
              className='btn_class'
              onClick={handleConnect}
            >
              Connect Wallet
            </Button> :  <Button onClick={handleOpenModal} className='btn_class'>
              Create Pool
            </Button>}
          </div>
        </div>
        {isCreateModalOpen && (
          <Modal
            className='antd_modal_overlay'
            open={isCreateModalOpen}
            centered
            onCancel={handleCloseModal}
            footer={null}
            closable={false}
          >
            <div className='create_pool_modal'>
              <h1>Create New Pool</h1>
              <div className='selected_tokens'>
                <div className='token_div'>
                    <div>
                  <img src={token1.logoURI} alt='logo' />
                  <h3>{token1.symbol}</h3>
                  </div>
                  <img src={downoutline} alt="" />
                </div>
                <div className='token_div'>
                    <div>
                  <img src={token2.logoURI} alt='logo' />
                  <h3>{token2.symbol}</h3>
                  </div>
                  <img src={downoutline} alt="" />
                </div>
              </div>
              <Button  disabled  className='btn_class'>
                Create Pool Coming Soon
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
}
