import { coreAbi, erc20Abi, helperAbi } from "../core/contractData/abi";
import { getContract, readContract, fetchSigner, getProvider } from "@wagmi/core";
import {
  add,
  decimal2Fixed,
  div,
  fixed2Decimals,
  greaterThan,
  lessThan,
  mul,
  sub,
  toAPY,
  fromBigNumber,
  fixed2Decimals18
} from '../helpers/contracts';
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

export const getContractInstance = async ( contractAddr, abi ) => {

  try {
    const signer = await fetchSigner()
    const instance = getContract({
      address: contractAddr,
      abi: abi,
      signerOrProvider: signer
    })

  //  const hash = await instance.[fnName](...args)
  // const config = await prepareWriteContract({
  //   address: contractAddr,
  //   abi: abi,
  //   functionName: fnName,
  //   args: args,
  //   overrides:{
  //     gasLimit: 210000
  //   }
  // })
  // const { hash } = await writeContract(config)
  return instance;
} catch (error) {
    throw error
}
}

/*
@dev 
read data from contract function here;
*/

const handleRead = async (address, abi, fnName, args) => {
  const contract = await readContract({
     address: address,
     abi: abi,
     functionName: fnName,
     args: args
   })
   return contract;
 }


/*
@dev 
redeem function here;
*/



export const handleRedeem = async (
  amount,
  selectedToken,
  max,
  poolData,
  poolAddress,
  userAddr,
  contracts,
  checkTxnStatus,
  checkTxnError
) => {
  let Amount = decimal2Fixed(amount, selectedToken._decimals);
  let maxAmount = selectedToken.lendShare;
  if(Number(selectedToken.lendShare) > Number(selectedToken.liquidity)){
    maxAmount = selectedToken.liquidity;
  } 
  if (selectedToken._address == poolData.token0._address) {
    Amount = mul(Amount, -1);
    maxAmount = mul(maxAmount, -1);
  }
  let actnCont;
  let hash;
  try {

    const instance = await getContractInstance(contracts.coreContract.address, coreAbi)

    if (max) {
      if (selectedToken.collateralBalance > '0') {
        if(Number(selectedToken.redeemBalance) > Number(selectedToken.liquidity)){
          maxAmount = selectedToken.liquidity;
        } else {
          maxAmount = selectedToken.redeemBalance;
        }
        if (selectedToken._address == poolData.token0._address) {
          maxAmount = mul(maxAmount, -1);
        }
      }

 
   

      const txn = await instance.redeem(poolAddress, Math.trunc(Number(maxAmount)).toString(), userAddr)

      hash = txn?.hash
      // actnCont = await contracts.coreContract.methods.redeem(
      //   poolAddress,
      //   maxAmount,
      //   userAddr
      // );
    } else {
      const txn = await instance.redeemUnderlying(poolAddress, Math.trunc(Number(Amount)).toString(), userAddr)

      hash = txn?.hash
      // hash = await getContractInstance(contracts.coreContract.address, coreAbi, 'redeemUnderlying', [poolAddress, Amount, userAddr])
      // actnCont = await contracts.coreContract.methods.redeemUnderlying(
      //   poolAddress,
      //   Amount,
      //   userAddr
      // );
    }

    const txnData = {
      method: 'redeem',
      amount: amount,
      tokenAddress: selectedToken._address,
      tokenSymbol: selectedToken._symbol,
      poolAddress: poolAddress,
      chainId: '',
    };
    checkTxnStatus(hash, txnData);

    // actnCont
    //   .send({ from: userAddr })
    //   .on('transactionHash', (hash) => {

    //   })
    //   .on('error', function (error) {
    //     checkTxnError(error);
    //     throw error;
    //     //   checkTxnError(error);
    //   });
  } catch (error) {
   
    checkTxnError(error);
    throw error;
  }
};
/*
@dev 
 setting Allowance for selected and collateralToken;
*/
export const setAllowance = async (
  token,
  userAddr,
  amount,
  poolAddress,
  web3,
  checkTxnStatus,
  checkTxnError,
  contracts
) => {
  
  var maxAllow =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';
 try {
   
  const instance = await getContractInstance(token._address, erc20Abi)

  const { hash } = await instance.approve(contracts.coreContract.address, maxAllow);
 
        const txn = {
        method: 'approval',
        amount: amount,
        tokenAddress: token._address,
        tokenSymbol: token._symbol,
        poolAddress: poolAddress,
        chainId: '',
      };
      checkTxnStatus(hash, txn);

 } catch (error) {

      checkTxnError(error);
      throw error;
 }
  // ERC20.methods
  //   .approve(contractAddress.coreAddress, maxAllow)
  //   .send({ from: userAddr })
  //   .on('transactionHash', (hash) => {
  //     const txn = {
  //       method: 'approval',
  //       amount: amount,
  //       tokenAddress: token._address,
  //       tokenSymbol: token._symbol,
  //       poolAddress: poolAddress,
  //       chainId: '',
  //     };
  //     checkTxnStatus(hash, txn);
  //   })
  //   .on('error', function (error) {
  //     console.error('Aproove:', error);
  //     checkTxnError(error);
  //     throw error;
  //   });
};

export const getTabs = (token) => {
  if (token.lendBalance && token.lendBalance > 0 && token.borrowBalance <=0) {
    return ['lend', 'redeem' ,'borrow' ];
  } else if (token.borrowBalance && token.borrowBalance > 0 && token.lendBalance <= 0) {
    return ['borrow', 'repay', 'lend'];
  }  else if (token.borrowBalance && token.borrowBalance > 0 && token.lendBalance && token.lendBalance > 0) {
    return ['borrow', 'repay','lend', 'redeem'];
  } else {
    return ['lend', 'borrow'];
  }
};

export const getTokenPrice = async (
  contracts,
  poolData,
  poolAddress,
  userAddr
) => {
  if (contracts.helperContract && contracts.coreContract) {
    try {
      // const data = await contracts.helperContract.methods
      //   .getPoolTokensData(poolAddress, userAddr)
      //   .call();
      //const data = await handleRead(contracts.helperContract.address, helperAbi, 'getPoolTokensData', [poolAddress, userAddr])  
      const data = await contracts.helperContract.getPoolTokensData(poolAddress, userAddr)
      // const etherProvider = new ethers.providers.getDefaultProvider("sepolia");
      // const instance = new ethers.Contract(contracts.helperContract.address, helperAbi, etherProvider)
      // const contractInstance = await instance.getPoolTokensData(poolAddress, userAddr)

      // // console.log("Contract", contractInstance);
      
      // console.log("Data", "Read", fromBigNumber(data._balance0), fromBigNumber(contractInstance._balance0));
  
      const pool = { ...poolData };
      pool.token0.balance = fromBigNumber(data._balance0);
      pool.token0.balanceFixed = fixed2Decimals(
        data._balance0,
        poolData.token0._decimals
      );

      pool.token1.balance = fromBigNumber(data._balance1);
      pool.token1.balanceFixed = fixed2Decimals(
        data._balance1,
        poolData.token1._decimals
      );
      pool.token0.allowance = fromBigNumber(data._allowance0);
      pool.token0.allowanceFixed = fixed2Decimals(
        data._allowance0,
        poolData.token0._decimals
      );

      pool.token1.allowance = fromBigNumber(data._allowance1);
      pool.token1.allowanceFixed = fixed2Decimals(
        data._allowance1,
        poolData.token1._decimals
      );

      pool.token0.tabs = getTabs(pool.token0);
      pool.token1.tabs = getTabs(pool.token1);
     // console.log("getPoolTokensData", pool);
      return pool;
    } catch (error) {
      throw error;
    }
  }
};

/*
@dev 
oracle data;
*/

export const getOracleData = async (contracts, poolData) => {
  if (contracts.helperContract && contracts.coreContract) {
    try {
      // const data = await contracts.coreContract.methods
      //   .getOraclePrice(
      //     poolData.token0._address,
      //     poolData.token1._address,
      //     decimal2Fixed(1, poolData.token0._decimals)
      //   )
      //   .call();
      //  const data = await handleRead(contracts.coreContract.address, coreAbi, 'getOraclePrice', [  poolData.token0._address,
      //   poolData.token1._address,
      //   decimal2Fixed(1, poolData.token0._decimals)])

        const data = await contracts.coreContract.getOraclePrice(
          poolData.token0._address,
            poolData.token1._address,
            decimal2Fixed(1, poolData.token0._decimals)
         )
      
      const tmpPrice = fixed2Decimals(data, poolData.token0._decimals);
      const pool = { ...poolData };
      pool.token0.price = tmpPrice;
      pool.token1.price = (1 / tmpPrice).toString();
      pool.token0.collateralBalance = mul(
        mul(pool.token1.borrowBalance, pool.token1.price) / pool.ltv,
        100
      );
      pool.token0.collateralBalanceFixed = new BigNumber(pool.token0.collateralBalance).dividedBy(10 ** pool.token0._decimals).toFixed();

      pool.token1.collateralBalance = mul(
        mul(pool.token0.borrowBalance, pool.token0.price) / pool.ltv,
        100
      );
      pool.token1.collateralBalanceFixed = new BigNumber(pool.token1.collateralBalance).dividedBy(10 ** pool.token1._decimals).toFixed();
      let redeem0 = sub(
        poolData.token0.lendBalance,
        poolData.token0.collateralBalance
      );
      poolData.token0.redeemBalance = redeem0 >= 0 ? redeem0 : 0;

      poolData.token0.redeemBalanceFixed = new BigNumber(poolData.token0.redeemBalance).dividedBy(10 ** poolData.token0._decimals).toFixed();

      let redeem1 = sub(
        poolData.token1.lendBalance,
        poolData.token1.collateralBalance
      );
      poolData.token1.redeemBalance = redeem1 >= 0 ? redeem1 : 0;
      poolData.token1.redeemBalanceFixed = new BigNumber(poolData.token1.redeemBalance).dividedBy(10 ** poolData.token1._decimals).toFixed();

      return pool;
    } catch (error) {
      throw error;
    }
  }
};

/*
@dev 
pool basic data;
*/

export const getPoolBasicData = async (
  contracts,
  poolAddress,
  poolData,
  poolTokens
) => {
  let pool;
  if (contracts.helperContract && contracts.coreContract) {


    try {
      // const data = await contracts.helperContract.methods
      //   .getPoolData(poolAddress)
      //   .call();
      //const data = await handleRead(contracts.helperContract.address, helperAbi, 'getPoolData', [poolAddress]  )
      const data = await contracts.helperContract.getPoolData(poolAddress);
      
     
      pool = {
        ...poolData,
        _address: poolAddress,
        ltv:  Number(data.ltv - 0.01),
        lb: fromBigNumber(data.lb),
        rf: fromBigNumber(data.rf),
        token0: {
          _symbol: data._symbol0,
          _address: data._token0,
          _decimals: fromBigNumber(data._decimals0),
          liquidity: fromBigNumber(data._token0Liquidity),
          liquidityFixed: fixed2Decimals(
            data._token0Liquidity,
            data._decimals0
          ),
          ...poolTokens.token0,
        },
        token1: {
          _symbol: data._symbol1,
          _address: data._token1,
          _decimals: fromBigNumber( data._decimals1),
          liquidity: fromBigNumber(data._token1Liquidity),
          liquidityFixed: fixed2Decimals(
            data._token1Liquidity,
            data._decimals1
          ),
          ...poolTokens.token1,
        },
      };
      return pool;
    } catch (error) {
      
      // console.error(error);
      throw error;
    }
  }
};

export const getPoolAllData = async (
  contracts,
  poolData,
  poolAddress,
  userAddr
) => {
  if (contracts.helperContract && contracts.coreContract) {
    try {
      // const data = await contracts.helperContract.methods
      //   .getPoolFullData(positionAddr, poolAddress, userAddr)
      //   .call();
       // const data = await handleRead(contracts.helperContract.address, helperAbi, 'getPoolFullData', [contracts.positionContract.address, poolAddress, userAddr]  )
        const data = await contracts.helperContract.getPoolFullData(contracts.positionContract.address, poolAddress, userAddr)

       
        const totLiqFull0 = add(
        div(mul(poolData.token0.liquidity, 100), poolData.rf),
       fromBigNumber(data._totalBorrow0)
      );
     
      const totLiqFull1 = add(
        div(mul(poolData.token1.liquidity, 100), poolData.rf),
        fromBigNumber(data._totalBorrow1)
      );
      
     
      const pool = {
        ...poolData,
        token0: {
          ...poolData?.token0,
          borrowBalance: fromBigNumber(data._borrowBalance0),
          borrowBalanceFixed: fixed2Decimals(
            data._borrowBalance0,
            poolData.token0._decimals
          ),

          borrowShare: fromBigNumber(data._borrowShare0),
          borrowShare: fixed2Decimals(
            data._borrowShare0,
            poolData.token0._decimals
          ),

          healthFactor18: fromBigNumber(data._healthFactor0),
          healthFactorFixed: fixed2Decimals(
            data._healthFactor0,
            poolData.token0._decimals
          ),
          healthFactor: greaterThan(
            fixed2Decimals(data._healthFactor0, poolData.token0._decimals),
            100
          )
            ? '100'
            : Number(
                fixed2Decimals(data._healthFactor0, poolData.token0._decimals)
              ).toFixed(2),

          interest: fromBigNumber(data._interest0),
          interestFixed: fixed2Decimals(
            data._interest0,
            poolData.token0._decimals
          ),

          lendBalance: fromBigNumber(data._lendBalance0),
          lendBalanceFixed: fixed2Decimals(
            data._lendBalance0,
            poolData.token0._decimals
          ),

          lendShare: fromBigNumber(data._lendShare0),
          lendShareFixed: fixed2Decimals(
            data._lendShare0,
            poolData.token0._decimals
          ),

          totalBorrow: fromBigNumber(data._totalBorrow0),
          totalBorrowFixed: fixed2Decimals(
            data._totalBorrow0,
            poolData.token0._decimals
          ),

          totalBorrowShare: fromBigNumber(data._totalBorrowShare0),
          totalBorrowShareFixed: fixed2Decimals(
            data._totalBorrowShare0,
            poolData.token0._decimals
          ),

          totalLendShare: fromBigNumber(data._totalLendShare0),
          totalLendShareFixed: fixed2Decimals(
            data._totalLendShare0,
            poolData.token0._decimals
          ),
          totalLiqFull: totLiqFull0,
          utilRate: Number(
            mul(div(fromBigNumber(data._totalBorrow0), totLiqFull0), 100)
          ).toFixed(2),
          borrowAPY: toAPY(
            fixed2Decimals( data._interest0, poolData.token0._decimals)
          ),
         
          lendAPY: div(
            toAPY(fixed2Decimals(data._interest0, poolData.token0._decimals)),
            div(totLiqFull0, fromBigNumber(data._totalBorrow0))
          ),
        },
        token1: {
          ...poolData?.token1,
          borrowBalance: fromBigNumber(data._borrowBalance1),
          borrowBalanceFixed: fixed2Decimals(
            data._borrowBalance1,
            poolData.token1._decimals
          ),

          borrowShare: fromBigNumber(data._borrowShare1),
          borrowShare: fixed2Decimals(
            data._borrowShare1,
            poolData.token1._decimals
          ),

          healthFactor18: fromBigNumber(data._healthFactor1),
          healthFactorFixed: fixed2Decimals(
            data._healthFactor1,
            poolData.token1._decimals
          ),
          healthFactor: greaterThan(
            fixed2Decimals(data._healthFactor1, poolData.token1._decimals),
            100
          )
            ? '100'
            : Number(
                fixed2Decimals(data._healthFactor1, poolData.token1._decimals)
              ).toFixed(2),

          interest: fromBigNumber(data._interest1),
          interestFixed: fixed2Decimals(
            data._interest0,
            poolData.token0._decimals
          ),

          lendBalance: fromBigNumber(data._lendBalance1),
          lendBalanceFixed: fixed2Decimals(
            data._lendBalance1,
            poolData.token1._decimals
          ),

          lendShare: fromBigNumber(data._lendShare1),
          lendShareFixed: fixed2Decimals(
            data._lendShare1,
            poolData.token1._decimals
          ),

          totalBorrow: fromBigNumber(data._totalBorrow1),
          totalBorrowFixed: fixed2Decimals(
            data._totalBorrow1,
            poolData.token1._decimals
          ),

          totalBorrowShare: fromBigNumber(data._totalBorrowShare1),
          totalBorrowShareFixed: fixed2Decimals(
            data._totalBorrowShare1,
            poolData.token1._decimals
          ),

          totalLendShare: fromBigNumber(data._totalLendShare1),
          totalLendShareFixed: fixed2Decimals(
            data._totalLendShare1,
            poolData.token1._decimals
          ),
          totalLiqFull: totLiqFull1,
          utilRate: Number(
            mul(div(fromBigNumber(data._totalBorrow1), totLiqFull1), 100)
          ).toFixed(4),
          borrowAPY: toAPY(
            fixed2Decimals(data._interest1, poolData.token1._decimals)
          ),
          lendAPY: div(
            toAPY(fixed2Decimals(data._interest1, poolData.token1._decimals)),
            div(totLiqFull1, fromBigNumber(data._totalBorrow1))
          ),
        },
      };
      return pool;
    } catch (error) {
    
      throw error;
    }
  }
};

/*
@dev 
lend function
*/

export const handleLend = async (
  amount,
  selectedToken,
  poolData,
  contracts,
  userAddr,
  poolAddress,
  web3,
  checkTxnStatus,
  checkTxnError
) => {
  let Amount = decimal2Fixed(amount, selectedToken._decimals);
  if (selectedToken._address == poolData.token0._address) {
    Amount = mul(Amount, -1);
  }

  try {
    if (fixed2Decimals18(selectedToken.allowance, selectedToken._decimals) >= amount) {

       const instance  = await getContractInstance(contracts.coreContract.address, coreAbi)
      // const signer = await fetchSigner()
      // const instance = getContract({
      //   address: contracts.coreContract.address,
      //   abi: coreAbi,
      //   signerOrProvider: signer
      // })


      const transaction = await instance.lend(poolData._address, Math.trunc(Number(Amount)).toString())


               const txn = {
            method: 'lend',
            amount: amount,
            tokenAddress: selectedToken._address,
            tokenSymbol: selectedToken._symbol,
            poolAddress: poolAddress,
            chainId: '',
          }; //will hold the value of the transaction
          checkTxnStatus(transaction?.hash, txn);

      // contracts.coreContract.methods
      //   .lend(poolData._address, Amount)
      //   .send({ from: userAddr })
      //   .on('transactionHash', (hash) => {
      //     const txn = {
      //       method: 'lend',
      //       amount: amount,
      //       tokenAddress: selectedToken._address,
      //       tokenSymbol: selectedToken._symbol,
      //       poolAddress: poolAddress,
      //       chainId: '',
      //     }; //will hold the value of the transaction
      //     checkTxnStatus(hash, txn);
      //   })
      //   .on('error', function (error) {
      //     checkTxnError(error);
      //     throw error;
      //   });
    } else {
      setAllowance(
        selectedToken,
        userAddr,
        amount,
        poolAddress,
        web3,
        checkTxnStatus,
        checkTxnError,
        contracts
      );
    }
  } catch (error) {


    checkTxnError(error);
    throw error;
  }
};

/* 
@dev
borrow
*/

export const handleBorrow = async (
  selectedToken,
  userAddr,
  collateralToken,
  poolData,
  contracts,
  collateral,
  amount,
  web3,
  checkTxnStatus,
  checkTxnError
) => {
  let Amount = decimal2Fixed(amount, selectedToken._decimals);
  let Collateral = decimal2Fixed(collateral, collateralToken._decimals);
  if (selectedToken._address == poolData.token0._address) {
    Amount = mul(Amount, -1);
  }
  try {
    if (fixed2Decimals18(collateralToken.allowance, collateralToken._decimals) >= collateral) {
      const instance = await getContractInstance(contracts.coreContract.address, coreAbi)

      const transaction = await instance.borrow(poolData._address, Math.trunc(Number(Amount)).toString() , Math.trunc(Number(Collateral)).toString() , userAddr);
                const txn = {
            method: 'borrow',
            amount: amount,
            tokenAddress: selectedToken._address,
            tokenSymbol: selectedToken._symbol,
            poolAddress: poolData._address,
            chainId: '',
          };

          checkTxnStatus(transaction?.hash, txn);

      // contracts.coreContract.methods
      //   .borrow(poolData._address, Amount, Collateral, userAddr)
      //   .send({ from: userAddr })
      //   .on('transactionHash', (hash) => {
      //     const txn = {
      //       method: 'borrow',
      //       amount: amount,
      //       tokenAddress: selectedToken._address,
      //       tokenSymbol: selectedToken._symbol,
      //       poolAddress: poolData._address,
      //       chainId: '',
      //     };
      //     checkTxnStatus(hash, txn);
      //   })
      //   .on('error', function (error) {
      //     checkTxnError(error);
      //     throw error;
      //   });
    } else {
      setAllowance(
        collateralToken,
        userAddr,
        amount,
        poolData._address,
        web3,
        checkTxnStatus,
        checkTxnError,
        contracts
      );
    }
  } catch (error) {

    checkTxnError(error);
    throw error;
  }
};

/*
@dev
repay
*/
export const handleRepay = async (
  amount,
  selectedToken,
  poolData,
  max,
  contracts,
  poolAddress,
  userAddr,
  web3,
  checkTxnStatus,
  checkTxnError
) => {
  let Max =
    '57896044618658097711785492504343953926634992332820282019728792003956564819967';
  let Amount = decimal2Fixed(amount, selectedToken._decimals);
  if (selectedToken._address == poolData.token0._address) {
    Amount = Math.trunc(Number( mul(Amount, -1))).toString();
    Max = '-57896044618658097711785492504343953926634992332820282019728792003956564819967';
  }
  if (max) {
    Amount = Max;
  }
  try {
    if (fixed2Decimals18(selectedToken.allowance, selectedToken._decimals) >= amount) {

      const instance = await getContractInstance(contracts.coreContract.address, coreAbi)
     const {hash} = await instance.repay(poolAddress,Amount, userAddr)
          const txn = {
            method: 'repay',
            amount: amount,
            tokenAddress: selectedToken._address,
            tokenSymbol: selectedToken._symbol,
            poolAddress: poolAddress,
            chainId: '',
          };
          checkTxnStatus(hash, txn);
      // contracts.coreContract.methods
      //   .repay(poolAddress, Amount, userAddr)
      //   .send({ from: userAddr })
      //   .on('transactionHash', (hash) => {
      //     const txn = {
      //       method: 'repay',
      //       amount: amount,
      //       tokenAddress: selectedToken._address,
      //       tokenSymbol: selectedToken._symbol,
      //       poolAddress: poolAddress,
      //       chainId: '',
      //     };
      //     checkTxnStatus(hash, txn);
      //   })
      //   .on('error', function (error) {
      //     checkTxnError(error);
      //     throw error;
      //   });
    } else {
      setAllowance(
        selectedToken,
        userAddr,
        amount,
        poolAddress,
        web3,
        checkTxnStatus,
        checkTxnError,
        contracts
      );
    }
  } catch (error) {

    checkTxnError(error);
    throw error;
  }
};

export const getCollateralNeeded = (
  selectedToken,
  poolData,
  collateralToken,
  amount,
  selectLTV
) => {
  // require state here
  setCollateralToken(
    selectedToken.index == 0 ? poolData.token1 : poolData.token0
  );
  let collateralNeeded = 0;

  if (amount && collateralToken) {
    collateralNeeded = div(
      mul(
        mul(selectedToken.price, add(amount, selectedToken.borrowBalanceFixed)),
        100
      ),
      selectLTV
    );
    if (greaterThan(collateralToken.lendBalanceFixed, 0)) {
      if (
        lessThan(collateralToken.lendBalanceFixed, String(collateralNeeded))
      ) {
        collateralNeeded = sub(
          collateralNeeded,
          collateralToken.lendBalanceFixed
        );
      } else {
        collateralNeeded = 0;
      }
    }
  }
  setCollateral(collateralNeeded);
};

export const handleCreatePool = async (contracts) => {
 try {
  const instance = await getContractInstance(contracts.coreContract.address, coreAbi)
  const length = await instance.poolLength()
  
  const {hash} = await instance.createPool('0x4127976420204dF0869Ca3ED1C2f62c04F6cb137','0x8C57273241C2b4f4a295ccf3D1Feb29A08225A08', {
    gasLimit: 2100000
  })

 } catch (error) {
  console.log("handleCreatePool", "error", {error});
 }

}