import { getTokenLogo } from "../utils";
import { gql } from "@apollo/client";
import { fetchBalance, getContract, getProvider } from "@wagmi/core";
import { erc20Abi } from "../core/contractData/abi";
import { fromBigNumber } from "./contracts";
import { ethers } from "ethers";


export const findTokenPrice = (list, address) => {
 const price = list[String(address).toUpperCase()] ? list[String(address).toUpperCase()].pricePerToken : 1
 return Number(price)
}

export const getChartData = (data, tokenList) => {
  const final = {
    lends: {},
    borrows: {},
  };
  const chart = {
    lends: {},
    borrows: {},
    redeems: {},
    repayBorrows: {},
  };

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const actions = ["lends", "borrows", "redeems", "repays"];
      for (const item of actions) {
        const actionObjects = data[item];
        let total = 0;
        const sub = {};
        //const totalAmount = Object.values(actionObjects).map((el) => Number(el.amount)).reduce((ac, el) => ac + el)
        for (const action of actionObjects) {
          sub[action.token.symbol] =
            (sub[action.token.symbol] || 0) + (fixedToShort(action.amount)  );
          total = total + (fixedToShort(action.amount) );
        }
        chart[item] = sub;
        chart[item]["total"] = total;
      }
    }
  }

  const lendValues = {};
  const borrowValues = {};
  const donutLends = [];
  const donutBorrows = [];
  for (const action in chart) {
    if (action == "redeems") {
      const lendsObj = chart.lends;
      const redeemObj = chart.redeems;
      for (const token in lendsObj) {
        const value = lendsObj[token] - (redeemObj[token] || 0);
        lendValues[token] = value > 0 ? value : 0;
        // lendValues['total'] = value > 0 ? Number(value) : 0;
      }
    }
    if (action == "repayBorrows") {
      const borrowObj = chart.borrows;
      const repayObj = chart.repayBorrows;
      for (const token in borrowObj) {
        const value = borrowObj[token] - (repayObj[token] || 0);
        borrowValues[token] = value > 0 ? value : 0;
        // borrowValues['total'] = value > 0 ? value : 0;
      }
    }
  }

  
  const sortedLend = Object.entries(lendValues)
  .sort(([,a],[,b]) => b-a)
  .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const sortedBorrow = Object.entries(borrowValues)
  .sort(([,a],[,b]) => b-a)
  .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});



  for (const lend in sortedLend) {
    const payload = {
      type: lend,
      value: getPercent(sortedLend[lend], sortedLend["total"]),
    };
    if (lend !== "total" && sortedLend[lend] > 0) {
      donutLends.push(payload);
    }
  }

  for (const borrow in sortedBorrow) {
    const payload = {
      type: borrow,
      value: getPercent(sortedBorrow[borrow], sortedBorrow["total"]),
    };
    if (borrow !== "total" && sortedBorrow[borrow] > 0) {
      donutBorrows.push(payload);
    }
  }
   
  console.log("Chart",chart);

  return { lendValues, borrowValues, donutLends, donutBorrows };
};

export const convertPrice = (price) =>{
  return Number(price) == 1 ? Number(price) : Number(price) / 10**8
}
export const getPieChartValues = (positions) => {

  const lendValues ={
    total: 0
  } 
  const borrowValues={
    total : 0
  }
  const donutLends = []
  const donutBorrows =[]

  for (const action of positions.lendArray) {
    lendValues[action.tokenSymbol] = (lendValues[action.tokenSymbol] || 0 )+ Number(action.LendBalance) * convertPrice(action.token.priceUSD)
    lendValues['total'] = (lendValues['total'] || 0)+ Number(action.LendBalance) * convertPrice(action.token.priceUSD)
  }

  for (const action of positions.borrowArray) {
    borrowValues[action.tokenSymbol] = (borrowValues[action.tokenSymbol] || 0) + Number(action.borrowBalance) * convertPrice(action.token.priceUSD)
    borrowValues['total'] = (borrowValues['total'] || 0)+ Number(action.borrowBalance) * convertPrice(action.token.priceUSD)
 }


 const sortedLend = Object.entries(lendValues)
 .sort(([,a],[,b]) => b-a)
 .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

 const sortedBorrow = Object.entries(borrowValues)
 .sort(([,a],[,b]) => b-a)
 .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});



 for (const lend in sortedLend) {
   const payload = {
     type: lend,
     value: getPercent(sortedLend[lend], sortedLend["total"]),
   };
   if (lend !== "total" && sortedLend[lend] > 0) {
     donutLends.push(payload);
   }
 }

 for (const borrow in sortedBorrow) {
   const payload = {
     type: borrow,
     value: getPercent(sortedBorrow[borrow], sortedBorrow["total"]),
   };
   if (borrow !== "total" && sortedBorrow[borrow] > 0) {
     donutBorrows.push(payload);
   }
 }
  

 return { lendValues, borrowValues, donutLends, donutBorrows };
}

const getPercent = (x, y) => {

  const percent = Number(((x / y) * 100).toFixed(2));
  return percent > 100 ? 0: percent
};

export const getPositionData = (data) => {
  const position = data["positions"];

  const positionArray = [];

  const lendArray = [];
  const borrowArray = [];

  for (const object of position) {
    if (object.borrowBalance0 > 0 && object.borrowBalance1 == 0) {
      const BorrowObj = {};

      BorrowObj.borrowBalance = fixedToShort(object.borrowBalance0);
      BorrowObj.tokenSymbol = object.pool.token0.symbol;
      BorrowObj.token = object.pool.token0
      BorrowObj.pool = object.pool;
      BorrowObj.apy = object.pool.borrowApy0;
      BorrowObj.healthFactor = object.healthFactor0;
      BorrowObj.currentLTV = object.currentLTV;
      BorrowObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      borrowArray.push(BorrowObj);

      const LendObj = {};

      LendObj.LendBalance = fixedToShort(object.lendBalance1);
      LendObj.tokenSymbol = object.pool.token1.symbol;
      LendObj.pool = object.pool;
      LendObj.token = object.pool.token1
      LendObj.apy = object.pool.lendApy1;
      LendObj.healthFactor = object.healthFactor1;
      LendObj.currentLTV = object.currentLTV;
      LendObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      LendObj.interestEarned = fixedToShort(object.pool.interest1);
      lendArray.push(LendObj);
     
    } else if (object.borrowBalance1 > 0 && object.borrowBalance0 == 0) {
      const BorrowObj = {};

      BorrowObj.borrowBalance = fixedToShort(object.borrowBalance1);
      BorrowObj.tokenSymbol = object.pool.token1.symbol;
      BorrowObj.token = object.pool.token1
      BorrowObj.pool = object.pool;
      BorrowObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      BorrowObj.apy = object.pool.borrowApy1;
      BorrowObj.healthFactor = object.healthFactor1;
      BorrowObj.currentLTV = object.currentLTV;
      borrowArray.push(BorrowObj);

      const LendObj = {};

      LendObj.LendBalance = fixedToShort(object.lendBalance0);
      LendObj.tokenSymbol = object.pool.token0.symbol;
      LendObj.pool = object.pool;
      LendObj.token = object.pool.token1
      LendObj.apy = object.pool.lendApy0;
      LendObj.healthFactor = object.healthFactor0;
      LendObj.currentLTV = object.currentLTV;
      LendObj.interestEarned = fixedToShort(object.pool.interest0);
      LendObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      lendArray.push(LendObj);
    } else if (object.lendBalance0 > 0 && object.lendBalance1 == 0) {
      const LendObj = {};

    
      LendObj.LendBalance = fixedToShort(object.lendBalance0);
      LendObj.tokenSymbol = object.pool.token0.symbol;
      LendObj.token = object.pool.token0
      LendObj.pool = object.pool;
      LendObj.apy = object.pool.lendApy0;
      LendObj.healthFactor = object.healthFactor0;
      LendObj.currentLTV = object.currentLTV;
      LendObj.interestEarned = fixedToShort(object.pool.interest0);
      LendObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      lendArray.push(LendObj);
    } else if (object.lendBalance1 > 0 && object.lendBalance0 == 0) {
      const LendObj = {};

      LendObj.LendBalance = fixedToShort(object.lendBalance1);
      LendObj.tokenSymbol = object.pool.token1.symbol;
      LendObj.pool = object.pool;
      LendObj.token = object.pool.token1
      LendObj.apy = object.pool.lendApy1;
      LendObj.healthFactor = object.healthFactor1;
      LendObj.currentLTV = object.currentLTV;
      LendObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      LendObj.interestEarned = fixedToShort(object.pool.interest1);
      lendArray.push(LendObj);
    } else if (object.lendBalance1 > 0 && object.lendBalance0 > 0) {
      const LendObj1 = {};

      LendObj1.LendBalance = fixedToShort(object.lendBalance0);
      LendObj1.tokenSymbol = object.pool.token0.symbol;
      LendObj1.pool = object.pool;
      LendObj1.token = object.pool.token0
      LendObj1.apy = object.pool.lendApy0;
      LendObj1.healthFactor = object.healthFactor0;
      LendObj1.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      LendObj1.currentLTV = object.currentLTV;
      LendObj1.interestEarned = fixedToShort(object.pool.interest0);
      lendArray.push(LendObj1);

      const LendObj2 = {};

      LendObj2.LendBalance = fixedToShort(object.lendBalance1);
      LendObj2.tokenSymbol = object.pool.token1.symbol;
      LendObj2.pool = object.pool;
      LendObj2.token = object.pool.token1
      LendObj2.apy = object.pool.lendApy1;
      LendObj2.healthFactor = object.healthFactor1;
      LendObj2.currentLTV = object.currentLTV;
      LendObj2.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      LendObj2.interestEarned = fixedToShort(object.pool.interest1);
      lendArray.push(LendObj2);
    }
  }


  return { borrowArray, lendArray };
};

export const fixedToShort = (value) => {
  return Number(value) / 10 ** 18;
};

export const getAverage = (data, percent, balance) => {
  let numerator = 0;
  let denominator = 0;

  for (const pool of data) {
    numerator += pool[percent] * pool[balance];
    denominator += pool[balance];
  }
  return numerator / denominator;
};

export const getNetHealthFactor = (positions) => {
  let value = 0;
  let counter = 0;

  for (const pool of positions) {
    const hf1 =
      fixedToShort(pool?.healthFactor0) > 100
        ? 100
        : fixedToShort(pool?.healthFactor0);
    const hf2 =
      fixedToShort(pool?.healthFactor0) > 100
        ? 100
        : fixedToShort(pool?.healthFactor0);

    value += (hf1 + hf2) / 2;
    counter = counter + 1;
  }

  return (value / counter).toFixed(2);
};

export const getTokensFromUserWallet = async (data, usdlist, tokenList) => {
  const tokensArray = data?.tokenBalances.map((token) => token.contractAddress);

  const tokensObject = [];
const provider = getProvider()
  for (const tokenAddress of tokensArray) {

    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider)
     
  //  const symbol = await contract.symbol()
  //  const name = await contract.name()
  //  const balance = await contract.balanceOf(data?.address)
  // console.log("Contract", contract, symbol, name, balance);
    const res = await Promise.all([
      contract.symbol(),
      contract.name(),
      contract.balanceOf(data?.address),
    ]);
    const resInstance = {
      symbol: res[0],
      address: tokenAddress,
      name: res[1],
      balance: (fromBigNumber(res[2]) / 10 ** 18).toFixed(2),
      logo: getTokenLogo(res[0]),

    };
    tokensObject.push(resInstance);
   }

  return tokensObject;
};


export const getBorrowedPowerUsed = (Positions) => {
  let num = 0;
  let deno = 0;
  for (const position of Positions) {
    const cureentLTV = position.currentLTV > 1 ? position.currentLTV /100 : position.currentLTV
   
    const usedInPer =
      (Number(cureentLTV * 100) / position.pool.ltv) * 100;
    num += usedInPer * position.LendBalance;
    deno += position.LendBalance;
  }

  const usedPower = (num / deno).toFixed(2);

  return usedPower > 100 ? 100 : usedPower;
};

export const userDashBoardQuery = (address) => {
  const FILMS_QUERY = gql`
    {
       positions(where: {owner: "${address}"}) {
        id
        owner
        pool {
          id
          pool
          interest0
          interest1
          lendApy0
          lendApy1
          borrowApy0
          borrowApy1
          liquidity0
          liquidity1
          maxLTV
          totalBorrow0
          totalBorrow1
          token0 {
            id
            symbol
            priceUSD
          }
          token1 {
            id
            priceUSD
            symbol
          }
        }
        lendBalance0
        lendBalance1
        borrowBalance0
        borrowBalance1
        currentLTV
        healthFactor0
        healthFactor1
        liquidationCount
      }

      borrows(where: {sender: "${address}"}) {
        amount
        blockNumber
        blockTimestamp
        id
        sender
        transactionHash
        token {
          id
          priceUSD
          symbol
        }
        pool {
          id
          pool
          token0 {
            symbol
            id
          }
          token1 {
            id
            symbol
          }
        }
        positionId
      }
      lends(where: {sender: "${address}"}) {
        amount
        blockNumber
        blockTimestamp
        id
        sender
        positionId
        token {
          id
          priceUSD
          symbol
        }
        pool {
          id
          pool
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
      }
      redeems(where: {sender: "${address}"}) {
        amount
        blockNumber
        blockTimestamp
        id
        sender
        positionId
        token {
          id
          priceUSD
          symbol
        }
        pool {
          id
          pool
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
      }
      repays(where: {sender: "${address}"}) {
        amount
        blockNumber
        blockTimestamp
        id
        sender
        positionId
        token {
          id
          priceUSD
          symbol
        }
        pool {
          id
          pool
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
    }

    }
  `;
  return FILMS_QUERY;
};

export const sortByKey = (data, key, order) => {
  let sort = data;
 if(order === 1){
 sort = Array.isArray(data) && data.sort(function (a, b) {
    // Compare the 2 blocknumbers
    if (a[key] < b[key]) return 1;
    if (a[key] > b[key]) return -1;
    return 0;
  });
 } else if (order == 2){
  sort = Array.isArray(data) && data.sort(function (a, b) {
    // Compare the 2 blocknumbers
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
 }
return sort;
}

export const getHistoryGraphQuery = (address) => {
  const query = gql`
  {
    borrows(where: {sender: "${address}"}) {
      amount
      blockNumber
      blockTimestamp
      id
      sender
      transactionHash
      pool {
        id
        pool
        token0 {
          symbol
          id
        }
        token1 {
          id
          symbol
        }
      }
      positionId
    }
    lends(where: {sender: "${address}"}) {
      amount
      blockNumber
      blockTimestamp
      id
      sender
      positionId
      pool {
        id
        pool
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
    }
    redeems(where: {sender: "${address}"}) {
      amount
      blockNumber
      blockTimestamp
      id
      sender
      positionId
      pool {
        id
        pool
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
    }
    repays(where: {sender: "${address}"}) {
      amount
      blockNumber
      blockTimestamp
      id
      sender
      positionId
      pool {
        id
        pool
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
  }
}
  `
  return query;
}

export const getPoolCreatedGraphQuery = (address) => {
  const query = gql`
  {
    positions(where: {owner: "${address}"}) {
      id
      owner
      pool {
        id
        pool
      }
      lendBalance0
      lendBalance1
    }
    pools {
      blockNumber
      blockTimestamp
      borrowApy0
      borrowApy1
      fullLiquidity0
      id
      interest0
      interest1
      lB
      lendApy0
      lendApy1
      lendingPositionCount
      liquidity0
      liquidity1
      maxLTV
      openPositionCount
      pool
      poolNo
      positionCount
      rf
      token1 {
        borrowCount
        decimals
        id
        lentCount
        poolCount
        priceUSD
        symbol
        totalPoolsLiquidity
        totalPoolsLiquidityUSD
        txCount
      }
      totalBorrow0
      totalBorrow1
      totalBorrowBalanceUSD
      totalLendBalanceUSD
      totalValueLockedUSD
      transactionHash
      txCount
      token0 {
        symbol
        priceUSD
        poolCount
        lentCount
        borrowCount
        id
        txCount
        totalPoolsLiquidityUSD
        totalPoolsLiquidity
        decimals
      }
      cumulativeuLendUSD
      cumulativeLiquidateUSD
      cumulativeBorrowUSD
    }
  }
  `
  return query;
}

export const checkOpenPosition = (position) => {
  if(( Number(position.lendBalance0) > 0 || Number(position.lendBalance1)) > 0 ){
    return true
  }
  return false
}

export const getTokenPrice = (data, address) =>{
  return data[String(address).toUpperCase()] ? data[String(address).toUpperCase()]: 1
}