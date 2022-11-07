const redeem = async (amount, selectedToken, max) => {
  let Amount = decimal2Fixed(amount, selectedToken.decimals);
  let maxAmount = selectedToken.lendShare;
  if (selectedToken.address == localDB.token0.address) {
    Amount = mul(Amount, -1);
    maxAmount = mul(maxAmount, -1);
  }
  let actnCont;
  if (max) {
    if (selectedToken.collateralBalance > '0') {
      paLendBal = selectedToken.redeemBalance;
      if (selectedToken.address == localDB.token0.address) {
        paLendBal = mul(paLendBal, -1);
      }
    }
    actnCont = await uV2Core.methods.redeem(
      localDB.pool,
      paLendBal,
      currentAccount
    );
  } else {
    actnCont = await uV2Core.methods.redeemUnderlying(
      localDB.pool,
      paAmount,
      currentAccount
    );
  }

  actnCont
    .send({ from: currentAccount })
    .on('transactionHash', (hash) => {
      const txnData = {
        method: 'redeem',
        amount: amount,
        tokenAddress: selectedToken.address,
        tokenSymbol: selectedToken.symbol,
        poolAddress: params.slug,
        chainId: '',
        timestamp: timeStamp,
      };
      return { hash, txnData };
      // handle notification outside
      //   checkTxnStatus(hash, txnData);
    })
    .on('error', function (error) {
      return error;
      //   checkTxnError(error);
    });
};
