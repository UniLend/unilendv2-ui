import BigNumber from "bignumber.js";
import { store } from "../store/Store";

const { contracts, user } = store.getState();

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

export function getBorrowMax(selectedToken, collateralToken, ltv) {
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
     (Number(collateralToken.lendBalanceFixed) * Number(collateralToken.price))
    : 0;

  const ltv = prevLTV + Number(inputBorrow) / (Number(collateralToken.lendBalanceFixed) * Number(collateralToken.price));

  const result = ltv > MaxLTV ? MaxLTV : ltv;

  return inputBorrow ? (ltv.toFixed(4) * 100).toFixed(2) : 0;
}

export function getCurrentLTV(selectedToken, collateralToken) {
  const prevLTV =
    Number(selectedToken.borrowBalanceFixed) > 0
      ? Number(selectedToken.borrowBalanceFixed) /
       (Number(collateralToken.lendBalanceFixed) * Number(collateralToken.price))
      : 0;

  return (prevLTV.toFixed(4) * 100).toFixed(2);
}

export const getActionBtn = (activeOperation, amount, selectedToken, collateralToken, collateral) => {
  let btn = {
    text: `${activeOperation} ${selectedToken?._symbol}`,
    disable: false,
  };
  if (amount <= 0) {
    btn = { text: "Enter Amount", disable: true };
  } else if (amount && activeOperation === lend) {
    if ( Number(selectedToken?.allowance) <= 0) {
      btn = { text: "Approve " + selectedToken?._symbol };
    } else if (amount > Number(selectedToken.balanceFixed)) {
      btn = { text: "Low Balance in Wallet", disable: true };
    }
  } else if (amount && activeOperation === borrow) {
    if ( Number(collateralToken?.allowance) <= 0) {
      btn = { text: "Approve " + collateralToken?._symbol };
    } else if (amount > Number(selectedToken.liquidityFixed)) {
      btn = { text: "Not Enough Liquidity", disable: true };
    } else if (amount > Number(collateralToken?.balanceFixed)){
      if (collateral > collateralToken?.balanceFixed) {
        console.log("borrow error",amount, (collateralToken));
        btn = { text: "Low Balance in Wallet " + collateralToken?._symbol, disable: true };
      }
    }
  } else if (amount && activeOperation === redeem) {
    if (amount > Number(selectedToken.lendBalanceFixed)) {
      btn = { text: "Not Enough Amount Lent", disable: true };
    } else if (amount > Number(selectedToken.liquidityFixed)) {
      btn = { text: "Not Enough Liquidity", disable: true };
    } else if (amount > Number(selectedToken.redeemBalance)) {
      btn = { text: "Not Enough Amount Lent", disable: true };
    }
  } else if (amount && activeOperation === repay) {
    if (amount > Number(selectedToken.balanceFixed)) {
      btn = { text: "Low Balance in Wallet", disable: true };
    }
  }

  return btn;
};

export const getAllContracts = async (contractAddress, abi, web3) => {
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};