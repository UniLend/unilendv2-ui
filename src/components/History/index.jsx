import React , {useEffect, useState}from 'react';
import './styles/index.scss';
import { Popover, Pagination} from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa'
import { shortenAddress, imgError } from '../../utils';
import { allTransaction } from '../../services/events';
import { poolDataByAddr, tokensByAddress } from '../../utils/constants';
import txIcon from '../../assets/tx.svg';
import noTxt from '../../assets/notxt.svg'
import { fixed2Decimals, fromBigNumber } from '../../helpers/contracts';
import HistorySkeleton from '../Loader/HistorySkeleton';

export default function HistoryComponent(props) {
    const { contracts, user, web3, poolList, tokenList } = props;
   const newArray = new Array(50).fill(0).map((el, i) => i +1) 
   const [txtData, setTxtData] = useState([])
   const [txtDataBackup, setTxtDataBackup] = useState([])
   const [visible, setVisible] = useState(false);
   const [currentPage, setCurrentPage] = useState(1)
   const [itemPerPage, setItemPerPage] = useState(6)
   const [sortIndex, setSortIndex] = useState(1)
   const [isPageLoading, setIsPageLoading] = useState(true)
   const [search, setSearch] = useState("")
const navigate = useNavigate() 
   const handleVisibleChange = (newVisible) => {
     setVisible(newVisible);
   };


  const handleSort = (index) => {
    let sort = txtData;
    setSortIndex(index)
   if(index === 1){
   sort = txtData.sort(function (a, b) {
      // Compare the 2 blocknumbers
      if (a.blockNumber < b.blockNumber) return 1;
      if (a.blockNumber > b.blockNumber) return -1;
      return 0;
    });
   } else if (index == 2){
    sort = txtData.sort(function (a, b) {
      // Compare the 2 blocknumbers
      if (a.blockNumber < b.blockNumber) return -1;
      if (a.blockNumber > b.blockNumber) return 1;
      return 0;
    });
   }
   setTxtData(sort);
   setTxtDataBackup(sort)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value);
    const newData = txtDataBackup.filter((data) => {
      if (value === '') {
        return data;
      } else if (
        tokenList[data.returnValues._asset]
          ['symbol'].toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        data.transactionHash.toLowerCase().includes(search.toLocaleLowerCase()) ||
        data.event.toLowerCase().includes(search.toLocaleLowerCase())
      ) {
        return data;
      }
    });
    setTxtData(newData);
  };

   const getTransactionData = async () => {
    try {
    setIsPageLoading(true)
     const txtArray = await allTransaction(
      contracts.coreContract,
      contracts.positionContract,
      user.address,
      poolList
     )
     if (txtArray.length > 0) {
      const sort = txtArray.sort(function (a, b) {
        // Compare the 2 dates
        if (a.blockNumber < b.blockNumber) return 1;
        if (a.blockNumber > b.blockNumber) return -1;
        return 0;
      });

      setTxtData(sort)
      setTxtDataBackup(sort)
   }
   setIsPageLoading(false)
  } catch (error) {
    setIsPageLoading(false)
  }
  }

useEffect(() => {
  // if(!user.isConnected){
  //   navigate('/')
  // }
  if ((user.address && contracts?.coreContract?.address)) {

    getTransactionData();
  }
}, [contracts, user, web3]);


const SortContent = () => {
  return (
    <div className="sort_popover">
      <p className={`${sortIndex === 1 ? 'activeSort': ''} `} onClick={()=> handleSort(1)}> NEW TO OLD </p>
      <p className={`${sortIndex === 2 ? 'activeSort': ''} `} onClick={()=> handleSort(2)}> OLD TO NEW</p>
    </div>
  );
};

  return (
    <div className="history_table_container">
      <div className="action_container">
        <div className="input_container">
          <input type="text" disabled={txtData.length === 0 && !search} placeholder="Search Txt/Token/Type" value={search} onChange={handleSearch} />
        </div>
        <Popover
          content={<SortContent />}
          trigger="click"
          overlayClassName="sort_dropDown"
          placement="bottomLeft"
          open={ txtData.length > 0 && visible}
          onOpenChange={handleVisibleChange}
        >
          <div className={`sortBy ${txtData.length ===0 ? 'disableSort': ''}`}>
            <p>Sort By</p>
            <FaChevronDown />
          </div>
        </Popover>
      </div>
      <div className="table_header">
        <div>
          <p>Pools</p>
        </div>
        <div>
          <p>Token</p>
        </div>
        <div>
          <p>Type</p>
        </div>
        <div>
          <p>Amount</p>
        </div>
        <div className="hide_for_mobile">
          <p>Tx Status</p>
        </div>
        <div>
          <p>Tx ID</p>
        </div>
      </div>
      <div className="table_list_container">
        {(txtData.length > 0 && !isPageLoading && user.isConnected)? (
          txtData
            .slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
            .map((txt, i) => (
              <div key={i} className="table_item">
                <div>
                  <div> 
                    <img src={poolList[txt.address]?.token0?.logo}  onError={imgError} alt={poolList[txt.address]?.token0?.symbol} />
                    <img src={poolList[txt.address]?.token1?.logo}  onError={imgError} alt={poolList[txt.address]?.token1?.symbol} />
                  </div>
                  <p className="hide_for_mobile hide_for_tab">
                    {/* {poolList[txt.address]?.token0?.symbol + "/" + poolList[txt.address]?.token1?.symbol} */}
                  </p>
                </div>
                <div>
                  <p>{tokenList[txt?.args?._asset]?.symbol}</p>
                </div>
                <div>
                  <p>{txt.event}</p>
                </div>
                <div>
                  <p>
                    { Number( fromBigNumber(txt?.args?._amount)/10**18 ).toFixed(4) }
                    {/* {(Number(txt.returnValues._amount) / 10 ** 18).toFixed(4)} */}
                  </p>
                </div>
                <div className="hide_for_mobile">
                  <p className="success">Complete</p>
                </div>
                <div className="hide_for_mobile">
                  <p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txt.transactionHash}`}
                      target="_blank"
                    >
                      {shortenAddress(txt.transactionHash)}
                    </a>
                  </p>
                </div>
                <div className="tx_icon">
                  {" "}
                  <img src={txIcon} alt="" />{" "}
                </div>
              </div>
            ))
        ) : isPageLoading && user.isConnected? (

          <HistorySkeleton />
        ):
        <div className='no_transaction'>
          <img src={noTxt} alt="" />
          <h1>No Transactions Found</h1>
        </div>
        }
      </div>
      <div className="pagination">
        <Pagination
          current={currentPage}
          onChange={(el) => setCurrentPage(el)}
          pageSize={itemPerPage}
          size="small"
          total={txtData.length}
          showSizeChanger={false}
          hideOnSinglePage={true}
        />
      </div>
    </div>
  );
}
