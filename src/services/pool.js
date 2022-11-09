import { erc20Abi } from '../core/contractData/abi';
import { contractAddress } from '../core/contractData/contracts_sepolia';
import {
  add,
  decimal2Fixed,
  div,
  fixed2Decimals,
  greaterThan,
  lessThan,
  mul,
  sub,
} from '../helpers/contracts';

/*
@dev 
redeem function here;
*/
export const redeem = async (amount, selectedToken, max, poolData, poolAddress, userAddr, contracts) => {
  let Amount = decimal2Fixed(amount, selectedToken.decimals);
  let maxAmount = selectedToken.lendShare;
  if (selectedToken.address == poolData.token0.address) {
    Amount = mul(Amount, -1);
    maxAmount = mul(maxAmount, -1);
  }
  let actnCont;
  if (max) {
    if (selectedToken.collateralBalance > '0') {
      maxAmount = selectedToken.redeemBalance;
      if (selectedToken.address == poolData.token0.address) {
        maxAmount = mul(maxAmount, -1);
      }
    }
    actnCont = await contracts.coreContract.methods.redeem(
      poolAddress,
      maxAmount,
      userAddr
    );
  } else {
    actnCont = await contracts.coreContract.methods.redeemUnderlying(
      poolAddress,
      Amount,
      userAddr
    );
  }

  actnCont
    .send({ from: userAddr })
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
/*
@dev 
 setting Allowance for selected and collateralToken;
*/
export const setAllowance = (token, userAddr) => {
  var ERC20 = new uWeb3.eth.Contract(erc20Abi, token.address);
  var maxAllow =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  ERC20.methods
    .approve(contractAddress.coreAddress, maxAllow)
    .send({ from: userAddr })
    .on('transactionHash', (hash) => {
      const txn = {
        method: 'approval',
        amount: amount,
        tokenAddress: selectedToken.address,
        tokenSymbol: selectedToken.symbol,
        poolAddress: params.slug,
        chainId: '',
        timestamp: timeStamp,
      };
      checkTxnStatus(hash, txn);
    })
    .on('error', function (error) {
      checkTxnError(error);
    });
};

export const getTabs = (token) => {
  if (token.lendBalance && token.lendBalance > 0) {
    return ['lend', 'redeem'];
  } else if (token.borrowBalance && token.borrowBalance > 0) {
    return ['borrow', 'repay'];
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
      const data = await contracts.helperContract.methods
        .getPoolTokensData(poolAddress, userAddr)
        .call();
      const pool = { ...poolData };
      pool.token0.balance = data._balance0;
      pool.token0.balanceFixed = fixed2Decimals(
        data._balance0,
        poolData.token0._decimals
      );

      pool.token1.balance = data._balance1;
      pool.token1.balanceFixed = fixed2Decimals(
        data._balance1,
        poolData.token1._decimals
      );

      pool.token0.allowance = data._allowance0;
      pool.token0.allowanceFixed = fixed2Decimals(
        data._allowance0,
        poolData.token0._decimals
      );

      pool.token1.allowance = data._allowance0;
      pool.token1.allowanceFixed = fixed2Decimals(
        data._allowance1,
        poolData.token1._decimals
      );

      pool.token0.tabs = getTabs(pool.token0);
      pool.token1.tabs = getTabs(pool.token1);

      return pool;
    } catch (error) {
      return error;
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
      const data = await contracts.coreContract.methods
        .getOraclePrice(
          poolData.token0._address,
          poolData.token1._address,
          decimal2Fixed(1, poolData.token0._decimals)
        )
        .call();
      const tmpPrice = fixed2Decimals(data, poolData.token0._decimals);
      const pool = { ...poolData };
      pool.token0.price = tmpPrice;
      pool.token1.price = (1 / tmpPrice).toString();
      pool.token0.collateralBalance = mul(
        mul(pool.token1.borrowBalance, pool.token1.price / pool.ltv),
        100
      );
      pool.token0.collateralBalanceFixed = fixed2Decimals(
        pool.token0.collateralBalance,
        pool.token0._decimals
      );
      pool.token1.collateralBalance = mul(
        mul(pool.token0.borrowBalance, pool.token0.price / pool.ltv),
        100
      );
      pool.token1.collateralBalanceFixed = fixed2Decimals(
        pool.token1.collateralBalance,
        pool.token1._decimals
      );

      let redeem0 = sub(
        poolData.token0.lendBalance,
        poolData.token0.collateralBalance
      );
      poolData.token0.redeemBalance = redeem0 >= 0 ? redeem0 : 0;

      poolData.token0.redeemBalanceFixed = fixed2Decimals(
        poolData.token0.redeemBalance,
        poolData.token0._decimals
      );

      let redeem1 = sub(
        poolData.token1.lendBalance,
        poolData.token1.collateralBalance
      );
      poolData.token1.redeemBalance = redeem1 >= 0 ? redeem1 : 0;
      poolData.token1.redeemBalanceFixed = fixed2Decimals(
        poolData.token1.redeemBalance,
        poolData.token1._decimals
      );
      return pool;
    } catch (error) {
      return error;
    }
  }
};

/*
@dev 
pool basic data;
*/

export const getPoolBasicData = async (contracts, poolAddress, poolData) => {
  let pool;
  if (contracts.helperContract && contracts.coreContract) {
    try {
      const data = await contracts.helperContract.methods
        .getPoolData(poolAddress)
        .call();
      pool = {
        ...poolData,
        _address: poolAddress,
        ltv: data.ltv,
        lb: data.lb,
        rf: data.rf,
        token0: {
          _symbol: data._symbol0,
          _address: data._token0,
          _decimals: data._decimals0,
          _liquidity: data._token0Liquidity,
        },
        token1: {
          _symbol: data._symbol1,
          _address: data._token1,
          _decimals: data._decimals1,
          _liquidity: data._token1Liquidity,
        },
      };
      return pool;
    } catch (error) {
      return error;
    }
  }
};

export const getPoolAllData = async (
  contracts,
  poolData,
  positionAddr,
  poolAddress,
  userAddr
) => {
  if (contracts.helperContract && contracts.coreContract) {
    try {
      const data = await contracts.helperContract.methods
        .getPoolFullData(positionAddr, poolAddress, userAddr)
        .call();
      const pool = {
        ...poolData,
        token0: {
          ...poolData?.token0,
          borrowBalance: data._borrowBalance0,
          borrowBalanceFixed: fixed2Decimals(
            data._borrowBalance0,
            poolData.token0._decimals
          ),

          borrowShare: data._borrowShare0,
          borrowShare: fixed2Decimals(
            data._borrowShare0,
            poolData.token0._decimals
          ),

          healthFactor18: data._healthFactor0,
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

          interest: data._interest0,
          interestFixed: fixed2Decimals(
            data._interest0,
            poolData.token0._decimals
          ),

          lendBalance: data._lendBalance0,
          lendBalanceFixed: fixed2Decimals(
            data._lendBalance0,
            poolData.token0._decimals
          ),

          lendShare: data._lendShare0,
          lendShareFixed: fixed2Decimals(
            data._lendShare0,
            poolData.token0._decimals
          ),

          totalBorrow: data._totalBorrow0,
          totalBorrowFixed: fixed2Decimals(
            data._totalBorrow0,
            poolData.token0._decimals
          ),

          totalBorrowShare: data._totalBorrowShare0,
          totalBorrowShareFixed: fixed2Decimals(
            data._totalBorrowShare0,
            poolData.token0._decimals
          ),

          totalLendShare: data._totalLendShare0,
          totalLendShareFixed: fixed2Decimals(
            data._totalLendShare0,
            poolData.token0._decimals
          ),
        },
        token1: {
          ...poolData?.token1,
          borrowBalance: data._borrowBalance1,
          borrowBalanceFixed: fixed2Decimals(
            data._borrowBalance1,
            poolData.token1._decimals
          ),

          borrowShare: data._borrowShare1,
          borrowShare: fixed2Decimals(
            data._borrowShare1,
            poolData.token1._decimals
          ),

          healthFactor18: data._healthFactor1,
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

          interest: data._interest1,
          interestFixed: fixed2Decimals(
            data._interest0,
            poolData.token0._decimals
          ),

          lendBalance: data._lendBalance1,
          lendBalanceFixed: fixed2Decimals(
            data._lendBalance1,
            poolData.token1._decimals
          ),

          lendShare: data._lendShare1,
          lendShareFixed: fixed2Decimals(
            data._lendShare1,
            poolData.token1._decimals
          ),

          totalBorrow: data._totalBorrow1,
          totalBorrowFixed: fixed2Decimals(
            data._totalBorrow1,
            poolData.token1._decimals
          ),

          totalBorrowShare: data._totalBorrowShare1,
          totalBorrowShareFixed: fixed2Decimals(
            data._totalBorrowShare1,
            poolData.token1._decimals
          ),

          totalLendShare: data._totalLendShare1,
          totalLendShareFixed: fixed2Decimals(
            data._totalLendShare1,
            poolData.token1._decimals
          ),
        },
      };
      return pool;
    } catch (error) {
      return error;
    }
  }
};

/*
@dev 
lend function
*/

export const lend = (
  amount,
  selectedToken,
  poolData,
  contracts,
  userAddr,
  poolAddress
) => {
  if (callToAction.disabled) {
    return;
  }
  setLoading(true);
  let Amount = decimal2Fixed(amount, selectedToken.decimals);
  if (selectedToken.address == poolData.token0.address) {
    Amount = mul(Amount, -1);
  }

  // if (contracts.coreContract) {
    if (greaterThan(selectedToken.allowance, amount)) {
      contracts.coreContract.methods
        .lend(poolData.pool, Amount)
        .send({ from: userAddr })
        .on('transactionHash', (hash) => {
          const txn = {
            method: 'lend',
            amount: amount,
            tokenAddress: selectedToken.address,
            tokenSymbol: selectedToken.symbol,
            poolAddress: poolAddress,
            chainId: '',
            timestamp: timeStamp,
          }; //will hold the value of the transaction
          checkTxnStatus(hash, txn);
        })
        .on('error', function (error) {
          checkTxnError(error);
        });
    } else {
      setAllowance(selectedToken);
    }
  // }
  setMax(false);
};

/* 
@dev
borrow
*/

export const borrow = (
  userAddr,
  collateralToken,
  poolData,
  contracts,
  collateral,
  amount
) => {
  if (callToAction.disabled) {
    return;
  }
  setLoading(true);
  handleCloseModals();
  let Amount = decimal2Fixed(amount, selectedToken.decimals);
  let Collateral = decimal2Fixed(collateral, collateralToken.decimals);
  if (selectedToken.address == poolData.token0.address) {
    Amount = mul(Amount, -1);
  }
  // if (contracts.coreContract) {
    if (greaterThan(collateralToken.allowance, collateral)) {
      contracts.coreContract.methods
        .borrow(poolAddress, Amount, Collateral, userAddr)
        .send({ from: userAddr })
        .on('transactionHash', (hash) => {
          const txn = {
            method: 'borrow',
            amount: amount,
            tokenAddress: selectedToken.address,
            tokenSymbol: selectedToken.symbol,
            poolAddress: poolAddress,
            chainId: '',
            timestamp: timeStamp,
          };
          checkTxnStatus(hash, txn);
        })
        .on('error', function (error) {
          checkTxnError(error);
        });
    } else {
      setAllowance(collateralToken);
    }
  // }
  setMax(false);
};

/*
@dev
repay
*/
export const repay = (
  amount,
  selectedToken,
  poolData,
  max,
  contracts,
  poolAddress,
  userAddr
) => {
  if (callToAction.disabled) {
    return;
  }
  setLoading(true);
  let Max =
    '57896044618658097711785492504343953926634992332820282019728792003956564819967';
  let Amount = decimal2Fixed(amount, selectedToken.decimals);
  if (selectedToken.address == poolData.token0.address) {
    Amount = mul(Amount, -1);
    Max = new BigNumber(
      '-57896044618658097711785492504343953926634992332820282019728792003956564819967'
    );
  }
  if (max) {
    Amount = Max;
  }
  // if (contracts.coreContract) {
    if (greaterThan(selectedToken.allowance, amount)) {
      contracts.coreContract.methods
        .repay(poolAddress, Amount, userAddr)
        .send({ from: userAddr })
        .on('transactionHash', (hash) => {
          const txn = {
            method: 'repay',
            amount: amount,
            tokenAddress: selectedToken.address,
            tokenSymbol: selectedToken.symbol,
            poolAddress: poolAddress,
            chainId: '',
            timestamp: timeStamp,
          };
          checkTxnStatus(hash, txn);
        })
        .on('error', function (error) {
          checkTxnError(error);
        });
    } else {
      setAllowance(selectedToken);
    }
  // }
  setMax(false);
};

export const getCollateralNeeded = (selectedToken, poolData, collateralToken, amount,selectLTV) => {
  // require state here
  setCollateralToken(
    selectedToken.index == 0 ? poolData.token1 : poolData.token0
  );
  let collateralNeeded = 0;

  if (amount && collateralToken) {
    collateralNeeded = 
      div(
        mul(
          mul(
            selectedToken.price,
            add(amount, selectedToken.borrowBalanceFixed)
          ),
          100
        ),
        selectLTV
      )
    if (greaterThan(collateralToken.lendBalanceFixed , 0)) {
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