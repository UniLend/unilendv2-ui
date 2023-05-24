import { getTokenLogo } from "../utils";
import { gql } from "@apollo/client";
import { fetchBalance, getContract, getProvider } from "@wagmi/core";
import { erc20Abi } from "../core/contractData/abi";
import { add, decimal2Fixed, div, fixed2Decimals, fromBigNumber, greaterThan, mul, toAPY } from "./contracts";
import { ethers } from "ethers";

export const findTokenPrice = (list, address) => {
  const price = list[String(address).toUpperCase()]
    ? list[String(address).toUpperCase()].pricePerToken
    : 1;
  return Number(price);
};

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
            (sub[action.token.symbol] || 0) + fixedToShort(action.amount);
          total = total + fixedToShort(action.amount);
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
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const sortedBorrow = Object.entries(borrowValues)
    .sort(([, a], [, b]) => b - a)
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

  console.log("Chart", chart);

  return { lendValues, borrowValues, donutLends, donutBorrows };
};

export const convertPrice = (price) => {
  return Number(price) == 1 ? Number(price) : Number(price) / 10 ** 8;
};
export const getPieChartValues = (positions) => {
  const lendValues = {
    total: 0,
  };
  const borrowValues = {
    total: 0,
  };
  const donutLends = [];
  const donutBorrows = [];

  for (const action of positions.lendArray) {
    lendValues[action.tokenSymbol] =
      (lendValues[action.tokenSymbol] || 0) +
      Number(action.LendBalance) * convertPrice(action.token.priceUSD);
    lendValues["total"] =
      (lendValues["total"] || 0) +
      Number(action.LendBalance) * convertPrice(action.token.priceUSD);
  }

  for (const action of positions.borrowArray) {
    borrowValues[action.tokenSymbol] =
      (borrowValues[action.tokenSymbol] || 0) +
      Number(action.borrowBalance) * convertPrice(action.token.priceUSD);
    borrowValues["total"] =
      (borrowValues["total"] || 0) +
      Number(action.borrowBalance) * convertPrice(action.token.priceUSD);
  }

  const sortedLend = Object.entries(lendValues)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const sortedBorrow = Object.entries(borrowValues)
    .sort(([, a], [, b]) => b - a)
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
};

const getPercent = (x, y) => {
  const percent = Number(((x / y) * 100).toFixed(2));
  return percent > 100 ? 0 : percent;
};

const calculateCurrentLTV = (borrow0, lend1, price1) => {
  const prevLTV =
    Number(borrow0) > 0
      ? Number(borrow0) /
       (Number(lend1) * Number(price1))
      : 0;

  return (prevLTV.toFixed(4) * 100).toFixed(2);
}

export const getPositionData = async (data, contracts) => {
  const position = data["positions"];

  const lendArray = [];
  const borrowArray = [];

  for (const object of position) {
    const positionPoolAddress = object.pool.pool;

    const [ realTimePoolData, priceInBigNumber , poolBasicData] = await Promise.all([
      contracts.helperContract.getPoolFullData(
        contracts.positionContract.address,
        positionPoolAddress,
        object.owner
      ),
      contracts.coreContract.getOraclePrice(
        object.pool.token0.id,
        object.pool.token1.id,
          decimal2Fixed(1, 18)
       ),
       contracts.helperContract.getPoolData(positionPoolAddress)
      ]
    ) 

    const token0Liq = fromBigNumber(poolBasicData._token0Liquidity)
    const token1Liq = fromBigNumber(poolBasicData._token1Liquidity)
    const decimals0 = fromBigNumber(poolBasicData._decimals0)
    const decimals1 = fromBigNumber(poolBasicData._decimals1)
    const totLiqFull0 = add(
      div(mul(token0Liq, 100), fromBigNumber(poolBasicData.rf)),
     fromBigNumber(realTimePoolData._totalBorrow0)
    );

    const totLiqFull1 = add(
      div(mul(token1Liq, 100), fromBigNumber(poolBasicData.rf)),
      fromBigNumber(realTimePoolData._totalBorrow1)
    );

    // const realTimePoolData = await contracts.helperContract.getPoolFullData(
    //   contracts.positionContract.address,
    //   positionPoolAddress,
    //   object.owner
    // );

    // const data = await contracts.coreContract.getOraclePrice(
    //   object.pool.token0.id,
    //   object.pool.token1.id,
    //     decimal2Fixed(1, 18)
    //  )
  
  const price0 = Number(fixed2Decimals(priceInBigNumber, 18));
  const price1 = Number(1 / price0);
    // console.log(
    //   "getPositionData",
    //   "pooldata",
    //   realTimePoolData,
    //   poolBasicData
    // )

    if(fromBigNumber(realTimePoolData._borrowBalance0) > 0){
            const BorrowObj = {};

      BorrowObj.borrowBalance = fixedToShort(
        fromBigNumber(realTimePoolData._borrowBalance0)
      );
      BorrowObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance1));
      BorrowObj.tokenSymbol = object.pool.token0.symbol;
      BorrowObj.token = object.pool.token0;
      BorrowObj.pool = object.pool;
      BorrowObj.apy = toAPY(
        fixed2Decimals(realTimePoolData._interest0, 18)
      )//object.pool.borrowApy0;
      BorrowObj.healthFactor = greaterThan(
        fixed2Decimals(realTimePoolData._healthFactor0, 18),
        100
      )
        ? "100"
        : Number(fixed2Decimals(realTimePoolData._healthFactor0, 18)).toFixed(2);
      BorrowObj.currentLTV = calculateCurrentLTV(fixedToShort(
        fromBigNumber(realTimePoolData._borrowBalance0)
      ), fixedToShort(
        fromBigNumber(realTimePoolData._lendBalance1)
      ), price1);
      BorrowObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      borrowArray.push(BorrowObj);
    }

    if( fromBigNumber(realTimePoolData._borrowBalance1) >0){
            const BorrowObj = {}
      BorrowObj.borrowBalance = fixedToShort(
        fromBigNumber(realTimePoolData._borrowBalance1)
      );
      BorrowObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance0));
      BorrowObj.tokenSymbol = object.pool.token1.symbol;
      BorrowObj.token = object.pool.token1;
      BorrowObj.pool = object.pool;
      BorrowObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      BorrowObj.apy = toAPY(
        fixed2Decimals(realTimePoolData._interest1, 18)
      );
      BorrowObj.healthFactor = greaterThan(
        fixed2Decimals(realTimePoolData._healthFactor1, 18),
        100
      )
        ? "100"
        : Number(fixed2Decimals(realTimePoolData._healthFactor1, 18)).toFixed(2);
      BorrowObj.currentLTV = calculateCurrentLTV(fixedToShort(
        fromBigNumber(realTimePoolData._borrowBalance1)
      ), fixedToShort(
        fromBigNumber(realTimePoolData._lendBalance0)
      ), price0);
      borrowArray.push(BorrowObj);
    }

    if(fromBigNumber(realTimePoolData._lendBalance0) > 0){
      const LendObj = {};
      LendObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance0));
      LendObj.tokenSymbol = object.pool.token0.symbol;
      LendObj.token = object.pool.token0;
      LendObj.pool = object.pool;
      LendObj.apy = div(
        toAPY(fixed2Decimals(realTimePoolData._interest0, 18)),
        div(totLiqFull0, fromBigNumber(realTimePoolData._totalBorrow0))
      );
      LendObj.currentLTV = calculateCurrentLTV(fixedToShort(
        fromBigNumber(realTimePoolData._borrowBalance1)
      ), fixedToShort(
        fromBigNumber(realTimePoolData._lendBalance0)
      ), price0);
      LendObj.healthFactor = greaterThan(
        fixed2Decimals(realTimePoolData._healthFactor0, 18),
        100
      )
        ? "100"
        : Number(fixed2Decimals(realTimePoolData._healthFactor0, 18)).toFixed(
            2
          );
     
      LendObj.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest0));
      LendObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      lendArray.push(LendObj);
    }

    if(fromBigNumber(realTimePoolData._lendBalance1) > 0){
            const LendObj = {};

      LendObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance1));
      LendObj.tokenSymbol = object.pool.token1.symbol;
      LendObj.pool = object.pool;
      LendObj.token = object.pool.token1;
      LendObj.apy = div(
        toAPY(fixed2Decimals(realTimePoolData._interest1, 18)),
        div(totLiqFull1, fromBigNumber(realTimePoolData._totalBorrow1))
      );
      LendObj.currentLTV = calculateCurrentLTV(fixedToShort(
        fromBigNumber(realTimePoolData._borrowBalance0)
      ), fixedToShort(
        fromBigNumber(realTimePoolData._lendBalance1)
      ), price1);
      LendObj.healthFactor = greaterThan(
        fixed2Decimals(realTimePoolData._healthFactor1, 18),
        100
      )
        ? "100"
        : Number(fixed2Decimals(realTimePoolData._healthFactor1, 18)).toFixed(
            2
          );
    
      LendObj.poolInfo = {
        token0Symbol: object.pool.token0.symbol,
        token0Logo: getTokenLogo(object.pool.token0.symbol),
        token1Symbol: object.pool.token1.symbol,
        token1Logo: getTokenLogo(object.pool.token1.symbol),
      };
      LendObj.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest1));
      lendArray.push(LendObj);
    }
   
    // if (object.borrowBalance0 > 0 && object.borrowBalance1 == 0) {
    //   const BorrowObj = {};

    //   BorrowObj.borrowBalance = fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance0)
    //   );
    //   BorrowObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance1));
    //   BorrowObj.tokenSymbol = object.pool.token0.symbol;
    //   BorrowObj.token = object.pool.token0;
    //   BorrowObj.pool = object.pool;
    //   BorrowObj.apy = toAPY(
    //     fixed2Decimals(realTimePoolData._interest0, 18)
    //   )//object.pool.borrowApy0;
    //   BorrowObj.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor0, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor0, 18)).toFixed(2);
    //   BorrowObj.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance0)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance1)
    //   ), price1);
    //   BorrowObj.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   borrowArray.push(BorrowObj);

    //   const LendObj = {};

    //   LendObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance1));
    //   LendObj.tokenSymbol = object.pool.token1.symbol;
    //   LendObj.pool = object.pool;
    //   LendObj.token = object.pool.token1;
    //   LendObj.apy = div(
    //     toAPY(fixed2Decimals(realTimePoolData._interest1, 18)),
    //     div(totLiqFull1, fromBigNumber(realTimePoolData._totalBorrow1))
    //   );
    //   LendObj.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance0)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance1)
    //   ), price1);
    //   LendObj.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor1, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor1, 18)).toFixed(
    //         2
    //       );
     
    //   LendObj.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   LendObj.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest1));
    //   lendArray.push(LendObj);

    // } else if (object.borrowBalance1 > 0 && object.borrowBalance0 == 0) {
    //   const BorrowObj = {};

    //   BorrowObj.borrowBalance = fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance1)
    //   );
    //   BorrowObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance0));
    //   BorrowObj.tokenSymbol = object.pool.token1.symbol;
    //   BorrowObj.token = object.pool.token1;
    //   BorrowObj.pool = object.pool;
    //   BorrowObj.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   BorrowObj.apy = toAPY(
    //     fixed2Decimals(realTimePoolData._interest1, 18)
    //   );
    //   BorrowObj.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor1, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor1, 18)).toFixed(2);
    //   BorrowObj.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance1)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance0)
    //   ), price0);
    //   borrowArray.push(BorrowObj);

    //   const LendObj = {};

    //   LendObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance0));
    //   LendObj.tokenSymbol = object.pool.token0.symbol;
    //   LendObj.pool = object.pool;
    //   LendObj.token = object.pool.token0;
    //   LendObj.apy = div(
    //     toAPY(fixed2Decimals(realTimePoolData._interest0, 18)),
    //     div(totLiqFull0, fromBigNumber(realTimePoolData._totalBorrow0))
    //   );
    //   LendObj.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance1)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance0)
    //   ), price0);
    //   LendObj.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor0, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor0, 18)).toFixed(
    //         2
    //       );
      
    //   LendObj.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest0));
    //   LendObj.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   lendArray.push(LendObj);
    // } else if (fromBigNumber(realTimePoolData._lendBalance0) > 0 && fromBigNumber(realTimePoolData._lendBalance1) == 0) {
    //   const LendObj = {};

    //   LendObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance0));
    //   LendObj.tokenSymbol = object.pool.token0.symbol;
    //   LendObj.token = object.pool.token0;
    //   LendObj.pool = object.pool;
    //   LendObj.apy = div(
    //     toAPY(fixed2Decimals(realTimePoolData._interest0, 18)),
    //     div(totLiqFull0, fromBigNumber(realTimePoolData._totalBorrow0))
    //   );
    //   LendObj.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance1)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance0)
    //   ), price0);
    //   LendObj.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor0, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor0, 18)).toFixed(
    //         2
    //       );
     
    //   LendObj.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest0));
    //   LendObj.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   lendArray.push(LendObj);
    // } else if (fromBigNumber(realTimePoolData._lendBalance1) > 0 && fromBigNumber(realTimePoolData._lendBalance0) == 0) {
    //   const LendObj = {};

    //   LendObj.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance1));
    //   LendObj.tokenSymbol = object.pool.token1.symbol;
    //   LendObj.pool = object.pool;
    //   LendObj.token = object.pool.token1;
    //   LendObj.apy = div(
    //     toAPY(fixed2Decimals(realTimePoolData._interest1, 18)),
    //     div(totLiqFull1, fromBigNumber(realTimePoolData._totalBorrow1))
    //   );
    //   LendObj.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance0)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance1)
    //   ), price1);
    //   LendObj.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor1, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor1, 18)).toFixed(
    //         2
    //       );
    
    //   LendObj.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   LendObj.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest1));
    //   lendArray.push(LendObj);
    // } else if (fromBigNumber(realTimePoolData._lendBalance1) > 0 && fromBigNumber(realTimePoolData._lendBalance0) > 0) {
    //   const LendObj1 = {};

    //   LendObj1.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance0));
    //   LendObj1.tokenSymbol = object.pool.token0.symbol;
    //   LendObj1.pool = object.pool;
    //   LendObj1.token = object.pool.token0;
    //   LendObj1.apy = div(
    //     toAPY(fixed2Decimals(realTimePoolData._interest0, 18)),
    //     div(totLiqFull0, fromBigNumber(realTimePoolData._totalBorrow0))
    //   );
    //   LendObj1.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance1)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance0)
    //   ), price0);
    //   LendObj1.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor0, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor0, 18)).toFixed(
    //         2
    //       );
    //   LendObj1.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
     
    //   LendObj1.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest0));
    //   lendArray.push(LendObj1);

    //   const LendObj2 = {};

    //   LendObj2.LendBalance = fixedToShort(fromBigNumber(realTimePoolData._lendBalance1));
    //   LendObj2.tokenSymbol = object.pool.token1.symbol;
    //   LendObj2.pool = object.pool;
    //   LendObj2.token = object.pool.token1;
    //   LendObj2.apy = div(
    //     toAPY(fixed2Decimals(realTimePoolData._interest1, 18)),
    //     div(totLiqFull1, fromBigNumber(realTimePoolData._totalBorrow1))
    //   );
    //   LendObj2.currentLTV = calculateCurrentLTV(fixedToShort(
    //     fromBigNumber(realTimePoolData._borrowBalance0)
    //   ), fixedToShort(
    //     fromBigNumber(realTimePoolData._lendBalance1)
    //   ), price1);


    //   LendObj2.healthFactor = greaterThan(
    //     fixed2Decimals(realTimePoolData._healthFactor1, 18),
    //     100
    //   )
    //     ? "100"
    //     : Number(fixed2Decimals(realTimePoolData._healthFactor1, 18)).toFixed(
    //         2
    //       );
      
    //   LendObj2.poolInfo = {
    //     token0Symbol: object.pool.token0.symbol,
    //     token0Logo: getTokenLogo(object.pool.token0.symbol),
    //     token1Symbol: object.pool.token1.symbol,
    //     token1Logo: getTokenLogo(object.pool.token1.symbol),
    //   };
    //   LendObj2.interestEarned = fixedToShort(fromBigNumber(realTimePoolData._interest1));
    //   lendArray.push(LendObj2);
    // }
  }
  console.log(
    "getPositionData",
    "pooldata",
    
    borrowArray, lendArray
  )


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
  const provider = getProvider();
  for (const tokenAddress of tokensArray) {
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);

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
     const curentLTV = position.currentLTV;

    const tokenUsedInPercentage =
      (Number(curentLTV) /  Number(position.pool.maxLTV)) * 100;
      console.log("tokenUsedInPercentage", (tokenUsedInPercentage > 100 ? 100: tokenUsedInPercentage) ,position.currentLTV,  position.LendBalance);
    num += (tokenUsedInPercentage > 100 ? 100: tokenUsedInPercentage) * position.LendBalance;
    deno += position.LendBalance;
 
  }

  const usedPower = (num / deno).toFixed(2);

  return isNaN(usedPower) ? 0 : usedPower > 100 ? 100 : usedPower;
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
        interestEarned0
        interestEarned1
        intersetPaid0
        intersetPaid1
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
  if (order === 1) {
    sort =
      Array.isArray(data) &&
      data.sort(function (a, b) {
        // Compare the 2 blocknumbers
        if (a[key] < b[key]) return 1;
        if (a[key] > b[key]) return -1;
        return 0;
      });
  } else if (order == 2) {
    sort =
      Array.isArray(data) &&
      data.sort(function (a, b) {
        // Compare the 2 blocknumbers
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
  }
  return sort;
};

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
  return query;
};

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
        token1 {
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
        borrowApy0
        borrowApy1
        UtilizationRate0
        UtilizationRate1
        blockNumber
        blockTimestamp
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
        rf
        totalBorrow0
        totalBorrow1
        transactionHash
        txCount
      }
    }
  `;
  return query;
};

export const checkOpenPosition = (position) => {
  if (
    (Number(position.lendBalance0) > 0 || Number(position.lendBalance1)) > 0
  ) {
    return true;
  }
  return false;
};

export const getTokenPrice = (data, address) => {
  return data[String(address).toUpperCase()]
    ? data[String(address).toUpperCase()]
    : 1;
};
