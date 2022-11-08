import BigNumber from "bignumber.js";
import { store } from "../store/Store";

const { contracts, user } = store.getState();

// function timestamp() {
//     return Math.round(new Date().getTime()/1000);
// }

export function count_leading_zeros(x) {
  let splitted = x.split("");
  let i = 0;
  while (splitted.shift() == 0) {
    i += 1;
  }
  return i;
}

export function numberFormat(x, po) {
  var parts = x.toString().split(".");
  if (parts.length > 1) {
    if (parseInt(parts[0]) > 1000) {
      parts[1] = parts[1].substring(0, 0);
    } else if (parseInt(parts[0]) > 100) {
      parts[1] = parts[1].substring(0, 2);
    } else if (parseInt(parts[0]) > 10) {
      parts[1] = parts[1].substring(0, 3);
    } else if (parseInt(parts[0]) > 0) {
      parts[1] = parts[1].substring(0, 4);
    } else {
      var startingZeros = count_leading_zeros(parts[1]);
      parts[1] = parts[1].substring(0, startingZeros + 5);
    }
  }

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (parts[1]) {
    if (po > 0) {
      parts[1] = parts[1].substring(0, po);
    } else if (parts[1].length == 1) {
      parts[1] = parts[1] + "0";
    }
    return parts.join(".");
  } else {
    parts[1] = "00";
    return parts.join(".");
  }
}

export function add(amount, amount1) {
  return new BigNumber(amount).plus(amount1).toFixed();
}

export function sub(amount, amount1) {
  return new BigNumber(amount).minus(amount1).toFixed();
}

export function div(amount, amount1) {
  return new BigNumber(amount).dividedBy(amount1).toFixed();
}

export function mul(amount, amount1) {
  return new BigNumber(amount).multipliedBy(amount1).toFixed();
}

export function greaterEqto(amount, amount1) {
  return new BigNumber(amount).isGreaterThanOrEqualTo(amount1);
}

export function lessEqto(amount, amount1) {
  return new BigNumber(amount).isLessThanOrEqualTo(amount1);
}

export function lessThan(amount, amount1) {
  return new BigNumber(amount).isLessThan(amount1);
}

export function greaterThan(amount, amount1) {
  return new BigNumber(amount).isGreaterThan(amount1);
}

export function toDecimals(x, po) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (parts[1]) {
    parts[1] = parts[1].substring(0, po);
    return parts.join(".");
  } else {
    parts[1] = "00";
    return parts[0];
  }
}

export function decimal2Fixed(amount, decimals) {
  let newNum = new BigNumber(amount).multipliedBy(10 ** decimals).toFixed();
  if (newNum.indexOf(".") > -1) {
    newNum = newNum.split(".")[0];
  }
  return newNum;
}

export function fixed2Decimals(amount, decimals) {
  return new BigNumber(amount).dividedBy(10 ** decimals).toFixed();
}

export function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}

export function toAPY(n) {
  return numberFormat(mul(n, 4 * 60 * 24 * 365), 2);
}

export function lendAPY(token) {
  div(token.borrowApy, div(token.totLiqFull, token.totalBorrow));
}

export function utilRate() {}

export function totLiqFull(token, localDB) {
  return add(
    div(mul(token.tokenLiquidity, 100), localDB.rf),
    token.totalBorrow
  );
}

export function getBorrowMax(selectedToken, poolData, LTV = poolData.ltv) {
  const lendToken =
    poolData?.token0.address === selectedToken.address
      ? poolData?.token1
      : poolData?.token0;
  const borrowedToken = selectedToken;
  let result;
  result =
    Number(lendToken.lendBalanceFixed) * (Number(LTV) / 100) -
    Number(borrowedToken.borrowBalanceFixed);
  return result;
}

export function getLTV(selectedToken, poolData, inputBorrow) {
  const lendToken =
    poolData?.token0.address === selectedToken.address
      ? poolData?.token1
      : poolData?.token0;
  const borrowedToken = selectedToken;
  const prevLTV =
    Number(borrowedToken.borrowBalanceFixed) > 0
      ? Number(borrowedToken.borrowBalanceFixed) /
        Number(lendToken.lendBalanceFixed)
      : 0;
  const currentLTV = Number(inputBorrow) / Number(lendToken.lendBalanceFixed);
  let result = prevLTV + currentLTV;

  if (result >= Number(poolData.ltv) / 100) {
    return (result = Number(poolData.ltv));
  }
  return inputBorrow ? (result.toFixed(4) * 100).toFixed(2) : 0;
}

export function getCurrentLTV(selectedToken, poolData) {
  const lendToken =
    poolData?.token0.address === selectedToken.address
      ? poolData?.token1
      : poolData?.token0;
  const borrowedToken = selectedToken;
  const prevLTV =
    Number(borrowedToken.borrowBalanceFixed) > 0
      ? Number(borrowedToken.borrowBalanceFixed) /
        Number(lendToken.lendBalanceFixed)
      : 0;

  return (prevLTV.toFixed(4) * 100).toFixed(2);
}

export const getTabs = (token) => {
    if (token.lendBalance && token.lendBalance >0) {
      return [ 'lend', 'redeem'];
    } else if (token.borrowBalance && token.borrowBalance > 0) {
      return [ 'borrow', 'repay'];
    } else {
      return [ 'lend', 'borrow'];
    }
  };

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


export const getPoolAllData = async (contracts, poolData, positionAddr, poolAddress, userAddr) => {
    if(contracts.helperContract && contracts.coreContract) {
        try {
            
      const data = await contracts.helperContract.methods.getPoolFullData(positionAddr, poolAddress, userAddr).call()
      const pool = {
        ...poolData,
        token0: {
          ...poolData?.token0,
          borrowBalance: data._borrowBalance0,
          borrowBalanceFixed: fixed2Decimals(data._borrowBalance0, poolData.token0._decimals),
  
          borrowShare: data._borrowShare0,
          borrowShare: fixed2Decimals(data._borrowShare0, poolData.token0._decimals),
  
          healthFactor18: data._healthFactor0,
          healthFactorFixed: fixed2Decimals(data._healthFactor0, poolData.token0._decimals),
          healthFactor: greaterThan(fixed2Decimals(data._healthFactor0, poolData.token0._decimals), 100) ? '100': Number(fixed2Decimals(data._healthFactor0, poolData.token0._decimals)).toFixed(2),
  
          interest: data._interest0,
          interestFixed: fixed2Decimals(data._interest0, poolData.token0._decimals),
  
          lendBalance: data._lendBalance0,
          lendBalanceFixed: fixed2Decimals(data._lendBalance0, poolData.token0._decimals),
  
          lendShare: data._lendShare0,
          lendShareFixed: fixed2Decimals(data._lendShare0, poolData.token0._decimals),
  
          totalBorrow: data._totalBorrow0,
          totalBorrowFixed: fixed2Decimals(data._totalBorrow0, poolData.token0._decimals),
  
          totalBorrowShare: data._totalBorrowShare0,
          totalBorrowShareFixed: fixed2Decimals(data._totalBorrowShare0, poolData.token0._decimals),
  
          totalLendShare: data._totalLendShare0,
          totalLendShareFixed: fixed2Decimals(data._totalLendShare0, poolData.token0._decimals),
        },
        token1:{
          ...poolData?.token1,
          borrowBalance: data._borrowBalance1,
          borrowBalanceFixed: fixed2Decimals(data._borrowBalance1, poolData.token1._decimals),
  
          borrowShare: data._borrowShare1,
          borrowShare: fixed2Decimals(data._borrowShare1, poolData.token1._decimals),
  
          healthFactor18: data._healthFactor1,
          healthFactorFixed: fixed2Decimals(data._healthFactor1, poolData.token1._decimals),
          healthFactor: greaterThan(fixed2Decimals(data._healthFactor1, poolData.token1._decimals), 100) ? '100': Number(fixed2Decimals(data._healthFactor1, poolData.token1._decimals)).toFixed(2),
  
          interest: data._interest1,
          interestFixed: fixed2Decimals(data._interest0, poolData.token0._decimals),
  
          lendBalance: data._lendBalance1,
          lendBalanceFixed: fixed2Decimals(data._lendBalance1, poolData.token1._decimals),
  
          lendShare: data._lendShare1,
          lendShareFixed: fixed2Decimals(data._lendShare1, poolData.token1._decimals),
  
          totalBorrow: data._totalBorrow1,
          totalBorrowFixed: fixed2Decimals(data._totalBorrow1, poolData.token1._decimals),
  
          totalBorrowShare: data._totalBorrowShare1,
          totalBorrowShareFixed: fixed2Decimals(data._totalBorrowShare1, poolData.token1._decimals),
  
          totalLendShare: data._totalLendShare1,
          totalLendShareFixed: fixed2Decimals(data._totalLendShare1, poolData.token1._decimals),
        }
       };
       return pool;
    } catch (error) {
          return error;  
    }
  }
  }

  export const getTokenPrice = async (contracts, poolData, poolAddress, userAddr) => {
    if(contracts.helperContract && contracts.coreContract) {
        try {
            
      const data = await contracts.helperContract.methods.getPoolTokensData(poolAddress, userAddr).call();
     const pool = {...poolData};
     pool.token0.balance = data._balance0
    pool.token0.balanceFixed = fixed2Decimals(data._balance0, poolData.token0._decimals)

    pool.token1.balance = data._balance1
    pool.token1.balanceFixed = fixed2Decimals(data._balance1, poolData.token1._decimals)

    pool.token0.allowance = data._allowance0;
    pool.token0.allowanceFixed = fixed2Decimals(data._allowance0, poolData.token0._decimals)

    pool.token1.allowance = data._allowance0;
    pool.token1.allowanceFixed = fixed2Decimals(data._allowance1, poolData.token1._decimals)

    pool.token0.tabs = getTabs(pool.token0);
    pool.token1.tabs = getTabs(pool.token1);

     
     return pool;
    } catch (error) {
        return error;
    }
  }
  }

 export const getOracleData = async (contracts, poolData ) => {
    if(contracts.helperContract && contracts.coreContract) {
        try {
     const data = await contracts.coreContract.methods.getOraclePrice(
        poolData.token0._address,
        poolData.token1._address,
        decimal2Fixed(1, poolData.token0._decimals)
      ).call();
      const tmpPrice = fixed2Decimals(data, poolData.token0._decimals);
      const pool = {...poolData};
      pool.token0.price = tmpPrice;
      pool.token1.price = (1/tmpPrice).toString();
      pool.token0.collateralBalance = mul(mul(pool.token1.borrowBalance,  pool.token1.price / pool.ltv  ), 100)
      pool.token0.collateralBalanceFixed = fixed2Decimals(pool.token0.collateralBalance, pool.token0._decimals)
      pool.token1.collateralBalance = mul(mul(pool.token0.borrowBalance,  pool.token0.price / pool.ltv  ), 100)
      pool.token1.collateralBalanceFixed = fixed2Decimals(pool.token1.collateralBalance, pool.token1._decimals)

      let redeem0 = sub(
        poolData.token0.lendBalance,
        poolData.token0.collateralBalance
      );
      poolData.token0.redeemBalance = redeem0 >= 0 ? redeem0 : 0;

      poolData.token0.redeemBalanceFixed =  fixed2Decimals(
        poolData.token0.redeemBalance,
        poolData.token0._decimals
      ) ;

      let redeem1 = sub(
        poolData.token1.lendBalance ,
        poolData.token1.collateralBalance 
      )
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
}
  