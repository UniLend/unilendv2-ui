import React from 'react';
import { Modal } from "antd";
import { tokensBYSymbol } from "../../utils/constants";
import "./ManageToken.scss";
import { useState } from 'react';

export default function TokenListMoadal({openToken, handlePoolAndTokenSelect}) {
    const container = React.useRef(null);
    const [selectedToken, setSelectedToken] = useState('')
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = useState('')
    const [tokenListBackup, setTokenListBackup] = useState(Object.values(tokensBYSymbol) || [])
    const [tokenList, setTokenList] = useState(Object.values(tokensBYSymbol) || [])



  const handleSearchToken = (e) => {
    const input = String(e.target.value)
    setSearch(input);
    const filtered = Object.values(tokensBYSymbol).filter(
      (el) =>
        el?.name?.toLowerCase().includes(input.toLowerCase()) ||
        el?.symbol?.toLowerCase().includes(input.toLowerCase()) ||
        el?.address?.toLowerCase().includes(input.toLowerCase())
    );
  
    setTokenList(filtered);
  };

  const selectToken = (symbol) => {
    handlePoolAndTokenSelect(selectedToken, symbol)
  }

    React.useEffect(() => {
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


      // cleanup event listener when component unmounts
    //   return () => window.removeEventListener('resize', handleResize);

    }, [openToken]);

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
            tokenList.map(
              (token, i) =>
                i < page * 100 && (
                    <div onClick={() => selectToken(token.symbol)} key={i} className="token-card">
                    <img src={token.logo} alt="" />
                    <div>
                      <h3>{token.symbol}</h3>
                      <span>
                        {token?.name??''}
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


