import BigNumber from "bignumber.js";

import { ethers } from "ethers";

// function timestamp() {
//     return Math.round(new Date().getTime()/1000);
// }
const lend = "lend";
const borrow = "borrow";
const redeem = "redeem";
const repay = "repay";

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

export const shortNumber = (num) => {
  return Number(num).toFixed(4);
};

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
  // let newNum = new BigNumber(amount).multipliedBy(10 ** decimals).toFixed();
  let newNum = BigInt(Math.trunc(Number(amount) * 10 ** decimals));
  // return bigint.toString();
  // if (newNum.indexOf(".") > -1) {
  //   newNum = newNum.split(".")[0];
  // }
  // if(newNum.toString().length > decimals){
  //   console.log("decimal2Fixed", newNum.toString(), decimals, amount, newNum);
  //   return '0'
  // }

  return newNum.toString();
}

export function decimal2Fixed2(amount, decimals){
  let newNum = new BigNumber(amount).multipliedBy(10 ** decimals).toFixed();
  //let newNum = BigInt(Math.trunc(Number(amount) * 10 ** decimals));
  // return bigint.toString();
  if (newNum.indexOf(".") > -1) {
    newNum = newNum.split(".")[0];
  }

  return newNum.toString();
}

export function fixedTrunc(numberString){
  let truncatedNumber = numberString;
    if (numberString.indexOf(".") > -1) {
    truncatedNumber = numberString.split(".")[0];
  }
  return truncatedNumber;
}

//Truncate Number 
export function truncateToDecimals(number, decimal) {
  const powerOf10 = Math.pow(10, decimal);
  const truncatedNumber = Math.floor(number * powerOf10) / powerOf10;
  return truncatedNumber;
}


export function fixed2Decimals(amount, decimals = 18) {
  return new BigNumber(amount?._hex).dividedBy(10 ** decimals).toFixed();
}

export function fixed2Decimals18(amount, decimals = 18) {
  return new BigNumber(amount).dividedBy(10 ** decimals).toFixed();
}

export function reduceLastDecimalByOne(number) {

const a = BigNumber(number).minus(1)
console.log("result", number, a.toString());
    return a.toString();
}

export function fromBigNumber(bignumber) {
  return ethers.BigNumber.from(bignumber).toString();
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

export function getBorrowMax(selectedToken, collateralToken, ltv) {
  // console.log("borrow", collateralToken.lendBalanceFixed, collateralToken.price, (Number(ltv) / 100));
  const result =
    Number(collateralToken.lendBalanceFixed * collateralToken.price) *
      (Number(ltv) / 100) -
    Number(selectedToken.borrowBalanceFixed);
  return result > 0 ? result : 0;
}

export function getSelectLTV(
  selectedToken,
  collateralToken,
  inputBorrow,
  poolData
) {
  const MaxLTV = poolData.ltv / 100;

  const prevLTV =
    Number(selectedToken.borrowBalanceFixed) > 0
      ? Number(selectedToken.borrowBalanceFixed) /
        (Number(collateralToken.lendBalanceFixed) *
          Number(collateralToken.price))
      : 0;

  const ltv =
    prevLTV +
    Number(inputBorrow) /
      (Number(collateralToken.lendBalanceFixed) *
        Number(collateralToken.price));

  const result = ltv > MaxLTV ? MaxLTV : ltv;

  return inputBorrow ? (ltv.toFixed(4) * 100).toFixed(2) : 0;
}

export function getCurrentLTV(selectedToken, collateralToken) {
  const prevLTV =
    Number(selectedToken.borrowBalanceFixed) > 0
      ? Number(selectedToken.borrowBalanceFixed) /
        (Number(collateralToken.lendBalanceFixed) *
          Number(collateralToken.price))
      : 0;

  return (prevLTV.toFixed(4) * 100).toFixed(2);
}

export const getActionBtn = (
  activeOperation,
  amount,
  selectedToken,
  collateralToken,
  collateral,
  reFetching
) => {
  let btn = {
    text: `${activeOperation} ${selectedToken?._symbol}`,
    disable: false,
  };
  if (reFetching) {
    return { text: "Fetching Data", disable: false };
  }
  let decimalAmount =0
  let newNum =0
  if(amount && selectedToken){
     newNum = BigInt(Math.trunc(Number(amount) * 10 ** selectedToken?._decimals));
     decimalAmount = newNum.toString().length > selectedToken?._decimals ? 0 : newNum.toString();
  }

const minimumValue = selectedToken?._decimals == 18 ? 0.000000000000000001 : 0.000001;

const countDecimals = String(amount).split('.')[1]?.length

 
  if (amount <= minimumValue  && Number(decimalAmount) <= 1 ) {
    return { text: "Enter Amount", disable: true };
  } else if (amount && activeOperation === lend) {
    if (
      fixed2Decimals18(selectedToken?.allowance, selectedToken?._decimals) <
      amount
    ) {
      return { text: "Approve " + selectedToken?._symbol };
    } else if (amount > Number(selectedToken.balanceFixed)) {
      return { text: "Low Balance in Wallet", disable: true };
    }
  } else if (amount && activeOperation === borrow) {
    if (
      collateral > 0 &&
      fixed2Decimals18(collateralToken?.allowance, collateralToken._decimals) <=
        collateral
    ) {
      return { text: "Approve " + collateralToken?._symbol };
    } else if (amount > Number(selectedToken.liquidityFixed)) {
      return { text: "Not Enough Liquidity", disable: true };
    } else if (collateral > Number(collateralToken?.balanceFixed)) {
      return {
        text: "Low Balance in Wallet " + collateralToken?._symbol,
        disable: true,
      };
    }
  } else if (amount && activeOperation === redeem) {
    if (amount > Number(selectedToken.lendBalanceFixed)) {
      return { text: "Not Enough Amount Lent", disable: true };
    } else if (amount > Number(selectedToken.liquidityFixed)) {
      return { text: "Not Enough Liquidity", disable: true };
    } else if (amount > Number(selectedToken.redeemBalanceFixed)) {
      return { text: "Exceeds Redeemable Amount", disable: true };
    }
  } else if (amount && activeOperation === repay) {
    if (
      Number(
        fixed2Decimals18(selectedToken?.allowance, selectedToken._decimals)
      ) < Number(amount)
    ) {
      return { text: "Approve " + selectedToken?._symbol };
    } else if (amount > Number(selectedToken.borrowBalanceFixed)) {
      return { text: "Exceeds Borrowed Amount", disable: true };
    } else if (amount > Number(selectedToken.balanceFixed)) {
      return { text: "Low Balance in Wallet", disable: true };
    }
  }

  return btn;
};

export const getAllContracts = async (contractAddress, abi, web3) => {
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};

export const getTokenUSDPrice = (price) => {
  return Number(price) == 1 ? 1 : Number(price) / 10 ** 8;
};
