export const checkTxnStatus =  (hash, txnData, web3, methodCallBack) => {
  if (web3) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (receipt) {
        // change txnId to actual id from receipt
        // setNotification({
        //   message: `Transaction for ${txnData.method} of ${txnData.amount} for token ${txnData.tokenSymbol}`,
        //   txnId: receipt,
        //   data: txnData,
        //   visible: true,
        //   date: date,
        // });
        // if (txnData.method !== 'approval') {
        //   setShareModal(true);
        // }

        // setLoading(false);

        if(methodCallBack){
          methodCallBack("checkTxnStatus", {})
        }
      
      } else {
        setTimeout(function () {
          checkTxnStatus(hash, txnData, web3);
        }, 1000);
      }
    });
  }
};

export const checkTxnError = (error) => {
    setLoading(false);
    setAmount('');
  };
