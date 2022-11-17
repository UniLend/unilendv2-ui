import React , {useEffect, useState}from 'react';
import './styles/index.scss';
import { Popover, Pagination} from 'antd';
import { DownOutlined  } from '@ant-design/icons'
import { shortenAddress } from '../../utils';
import txIcon from '../../assets/tx.svg';

export default function HistoryComponent(props) {
    const { contracts, user, web3 } = props;
   const newArray = new Array(50).fill(0).map((el, i) => i +1) 
   const [visible, setVisible] = useState(false);
   const [currentPage, setCurrentPage] = useState(2)
   const [itemPerPage, setItemPerPage] = useState(6)
 
   const handleVisibleChange = (newVisible) => {
     setVisible(newVisible);
   };

 

   const getTransactionData = async () => {
   
   }

useEffect(() => {
  if ((user.address && contracts?.coreContract?._address, web3?.version)) {
    getTransactionData();
  }
}, [contracts, user, web3]);

const ousdcImg =
'https://assets.trustwalletapp.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png';

const uftImg =
'https://assets.trustwalletapp.com/blockchains/ethereum/assets/0x0202Be363B8a4820f3F4DE7FaF5224fF05943AB1/logo.png';

const SortContent = () => {
  return (
    <div className="sort_popover">
      <p> new to old </p>
      <p> old to new</p>
    </div>
  );
};

  return (
    <div className='history_table_container'>
        <div className='action_container'>
           <div className='input_container'>
             <input type="text" placeholder = "Search Txt/Token/Type" />
           </div>
           <Popover
                content={<SortContent />}
                trigger="click"
                overlayClassName="sort_dropDown"
                placement="bottomLeft"
                open={visible}
                onOpenChange={handleVisibleChange}
              >
           <div className='sortBy'>
            <p>Sort By</p>
            <DownOutlined />
           </div>
           </Popover>
        </div>
        <div className='table_header'>
          <div><p>Pools</p></div>
          <div><p>Token</p></div>
          <div><p>Type</p></div>
          <div><p>Amount</p></div>
          <div className='hide_for_mobile'><p>Tx Status</p></div>
          <div><p>Tx ID</p></div>
        </div>
        <div className='table_list_container'>
            {
                newArray.slice((currentPage-1) * itemPerPage, currentPage * itemPerPage).map((el, i) =>(
                <div className='table_item'>
                <div >
                    <div>
                        <img src={ousdcImg} alt="" />
                        <img src={uftImg} alt="" />
                    </div>
                    <p className='hide_for_mobile hide_for_tab'>USDC/UFT{el}</p>
                </div>
                <div><p>Dai</p></div>
                <div><p>Borrow</p></div>
                <div><p>10.000</p></div>
                <div className='hide_for_mobile'><p className='success' >Complete</p></div>
                <div className='hide_for_mobile' ><p> {shortenAddress("0xiblkjljklkjkjl5315613516846164/81435168")} </p></div>
                <div className='tx_icon' > <img  src={txIcon} alt="" /> </div>
              </div>
                )
              )
            }
        </div>
        <div className='pagination'>
        <Pagination current={currentPage} onChange={(el) => setCurrentPage(el)} pageSize={itemPerPage} size="small" total={50} />
        </div>
    </div>
  )
}
