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

 