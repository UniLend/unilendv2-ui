export const checkTxnStatus = (hash, txnData, web3) => {
  if (web3) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (receipt) {
        setLoadingFull(true);
        setAmount('');
        // change txnId to actual id from receipt
        setNotification({
          message: `Transaction for ${txnData.method} of ${txnData.amount} for token ${txnData.tokenSymbol}`,
          txnId: receipt,
          data: txnData,
          visible: true,
          date: date,
        });
        if (txnData.method !== 'approval') {
          setShareModal(true);
        }

        setLoading(false);
      } else {
        setTimeout(function () {
          checkTxnStatus(hash, txnData);
        }, 1000);
      }
    });
  }
};

export const checkTxnError = (error) => {
    setLoading(false);
    setAmount('');
  };
