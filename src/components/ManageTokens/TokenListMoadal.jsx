import React from 'react';
import { Modal } from "antd";
import { tokensBYSymbol } from "../../utils/constants";
import "./ManageToken.scss";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { sortByKey } from '../../helpers/dashboard';

export default function TokenListMoadal({openToken, handlePoolAndTokenSelect, selectedTokens}) {
    const { tokenList, poolList } = useSelector((state) => state)
    const container = React.useRef(null);
    const [selectedToken, setSelectedToken] = useState('')
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = useState('')
    const [tokenListBackup, setTokenListBackup] = useState(Object.values(tokenList) || [])
    const [tokensList, setTokensList] = useState({
      token0: [],
      token1: []
    })



  const handleSearchToken = (e) => {
    const input = String(e.target.value)
    setSearch(input);
    const filtered = Object.values(tokenList).filter(
      (el) =>
        el?.name?.toLowerCase().includes(input.toLowerCase()) ||
        el?.symbol?.toLowerCase().includes(input.toLowerCase()) ||
        el?.address?.toLowerCase().includes(input.toLowerCase())
    );
    console.log("handleSearchToken", filtered);
    setTokensList(filtered);
  };

  const selectToken = (symbol) => {
    handlePoolAndTokenSelect(selectedToken, symbol)
  }

    React.useEffect(() => {
      const poolsArray = Object.values(poolList);
      const tokensArray = Object.values(tokenList)
      if (poolsArray.length && tokensArray.length) {
   
      const tokensBySymbolObject0 = {}
      const tokensBySymbolObject1 = {}
     
      for(let i= 0; i<tokensArray.length; i++){
        tokensBySymbolObject0[tokensArray[i]?.symbol]= {...tokensArray[i], withPool: false}
        tokensBySymbolObject1[tokensArray[i]?.symbol]= {...tokensArray[i], withPool: false}
      }

   
     poolsArray
          .filter(
            (pool) =>
              pool.token0.symbol === selectedTokens.token0 ||
              pool.token1.symbol === selectedTokens.token0
          )
          .map((pool) => {
            if (pool.token0.symbol === selectedTokens.token0) {
              tokensBySymbolObject0[pool.token1.symbol] = {...tokensBySymbolObject0[pool.token1.symbol], withPool: true}
              return { token: pool.token1 };
            } else if (pool.token1.symbol === selectedTokens.token0) {
              tokensBySymbolObject0[pool.token0.symbol] = {...tokensBySymbolObject0[pool.token0.symbol], withPool: true}
              return { token: pool.token0 };
            }
          });
         poolsArray
         .filter(
          (pool) =>
            pool.token0.symbol === selectedTokens.token1 ||
            pool.token1.symbol === selectedTokens.token1
        ).map((pool) => {
            if (pool.token0.symbol === selectedTokens.token1) {
              tokensBySymbolObject1[pool.token1.symbol] = {...tokensBySymbolObject1[pool.token1.symbol], withPool: true}
              return { token: pool.token1, };
            } else if (pool.token1.symbol === selectedTokens.token1) {
              tokensBySymbolObject1[pool.token0.symbol] = {...tokensBySymbolObject1[pool.token0.symbol], withPool: true}
              return { token: pool.token0};
            }
          });
        // setTokensWithCreatedPools(poolsWithToken0);
       const withToken0 = sortByKey( Object.values(tokensBySymbolObject0), 'withPool', 1)
       const withToken1 = sortByKey( Object.values(tokensBySymbolObject1), 'withPool', 1)
       setTokensList({
        token1: withToken0,
        token0: withToken1
       })
    
      }
     


      container.current.addEventListener("scroll", () => {
        if (
          container.current.scrollTop + container.current.clientHeight >=
          container.current.scrollHeight
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });
 
      if(openToken.token0){
        setSelectedToken('token0')
      } else if (openToken.token1){
        setSelectedToken('token1')
      }

      console.log("poolAddressFound",'selected',  selectedTokens);
      // cleanup event listener when component unmounts
    //   return () => window.removeEventListener('resize', handleResize);

    }, [openToken, selectedTokens]);

    return (
      <div className="select_token_modal">
        <div className="search_token">
          <h3>Select {selectedToken} </h3>
          <input
            autoFocus
            type="text"
            value={search}
            placeholder="Search Tokens"
            onChange={handleSearchToken}
          />
        </div>
        <div ref={container} className="token_list">
          {/* {isFetching && <h2>Fetching...</h2>}
          {!isFetching && coinGeckoToken.length === 0 && (
            <h2>Tokens not listed</h2>
          )} */}
          {
           Array.isArray(tokensList[selectedToken]) && tokensList[selectedToken].length > 0 && tokensList[selectedToken].map(
              (token, i) =>
                i < page * 100 && (
                    <div onClick={() => selectToken(token.symbol)} key={i} className="token-card">
                    <img src={token?.logo} alt="" />
                    <div>
                      <h3>{token.symbol}</h3>
                      <span>
                        {token?.withPool?'pool Available': ''}
                      </span>
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    );
}


// export default function TokenListMoadal() {
//   return (
    
//     <Modal
//     className="antd_modal_overlay"
//     visible={true}
//     centered
//     footer={null}
//     closable={false}
//   >
//     {<TokenListModalBody />}
//   </Modal>
//   )
// }


