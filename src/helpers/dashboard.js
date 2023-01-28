import { getTokenLogo } from "../utils";

export const getChartData = (data) => {

 const final = {
    lends :{},
    borrows: {}
 }
 const chart = {
    lends:{},
    borrows:{},
    redeems:{},
    repayBorrows:{}
}

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
  
            const actions = ['lends','borrows', 'redeems', 'repayBorrows']
            for (const item of actions) {
                const actionObjects = data[item];
                let total = 0;
                const sub  = {}
               //const totalAmount = Object.values(actionObjects).map((el) => Number(el.amount)).reduce((ac, el) => ac + el)
               for (const action of actionObjects) {
                //console.log("action", action);
                 sub[action.tokenSymbol] = (sub[action.tokenSymbol] || 0) + Number(action.amount) / (10**18)
                 total = total + Number(action.amount) / (10**18);
               }
               //console.log("actions", sub);
               chart[item] = sub;
               chart[item]['total'] =  total;
               
            }

        }

    }

    // console.log("element", "chart", chart);
    const lendValues ={}
    const borrowValues ={}
    const donutLends = []
    const donutBorrows = []
    for (const action in chart) {
      if(action == 'redeems'){
        const lendsObj = chart.lends;
        const redeemObj = chart.redeems
        for (const token in lendsObj) {
            const value = lendsObj[token] - ( redeemObj[token]  || 0)
           lendValues[token] =  value > 0 ? value.toFixed(3) : 0
        }

      }
      if(action == 'repayBorrows'){
        const borrowObj = chart.borrows;
        const repayObj = chart.repayBorrows
        for (const token in borrowObj) {
            const value = borrowObj[token] - (repayObj[token] || 0)
            borrowValues[token] = value > 0 ? value.toFixed(3) : 0
        }
      }
    }

    for (const lend in lendValues) {
       const payload = {
        type: lend,
        value: getPercent(lendValues[lend], lendValues['total'])
       }
       if(lend !== 'total' && lendValues[lend] > 0){
           donutLends.push(payload)
       }
    }

    for (const borrow in borrowValues) {
        const payload = {
         type: borrow,
         value: getPercent(borrowValues[borrow], borrowValues['total'])
        }
        if(borrow !== 'total' && borrowValues[borrow] > 0){
            donutBorrows.push(payload)
        }
     }

    // console.log("element", "Lendschart", lendValues, borrowValues, donutLends);

  return { lendValues, borrowValues, donutLends, donutBorrows }

}


const getPercent = (x, y) => {
   return  Number( ((x / y) * 100).toFixed(2));
}


export const getPositionData = (data, poolList, tokenList) => {
const position = data['positions'];

const positionArray = []

const lendArray = []
const borrowArray =[]

for (const object of position) {
  
console.log("pool", tokenList['0x5093af5df5eafd96b518a11cfb32c37da2f8f0c3']);
    if(object.borrowBalance0 > 0  && object.borrowBalance1 == 0){

        const BorrowObj = {
        }

        BorrowObj.borrowBalance = fixedToShort( object.borrowBalance0 )
        BorrowObj.tokenSymbol = object.token0Symbol
        BorrowObj.pool = object.poolData
        BorrowObj.apy = object.borrowApy0
        BorrowObj.healthFactor = object.healthFactor0
        BorrowObj.currentLTV = object.currentLTV
        BorrowObj.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        borrowArray.push(BorrowObj)


        const LendObj = {
        }

        LendObj.LendBalance = fixedToShort(object.lendBalance1)
        LendObj.tokenSymbol = object.token1Symbol
        LendObj.pool = object.poolData
        LendObj.apy = "lend"
        LendObj.healthFactor = object.healthFactor1
        LendObj.currentLTV = object.currentLTV
        LendObj.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        LendObj.interestEarned = fixedToShort(object.poolData.interest1)
        lendArray.push(LendObj)
    } else if (object.borrowBalance1 > 0  && object.borrowBalance0 == 0) {

        const BorrowObj = {
        }

        BorrowObj.borrowBalance = fixedToShort(object.borrowBalance1)
        BorrowObj.tokenSymbol = object.token1Symbol
        BorrowObj.pool = object.poolData
        BorrowObj.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        BorrowObj.apy = object.borrowApy1
        BorrowObj.healthFactor = object.healthFactor1
        BorrowObj.currentLTV = object.currentLTV
        borrowArray.push(BorrowObj)


        const LendObj = {
        }

        LendObj.LendBalance = fixedToShort(object.lendBalance0)
        LendObj.tokenSymbol = object.token0Symbol
        LendObj.pool = object.poolData
        LendObj.apy = "lend"
        LendObj.healthFactor = object.healthFactor0
        LendObj.currentLTV = object.currentLTV
        LendObj.interestEarned = fixedToShort(object.poolData.interest0)
        LendObj.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        lendArray.push(LendObj)

    } else if (object.lendBalance0 > 0 && object.lendBalance1 == 0 ) {
        const LendObj = {
        }

        LendObj.LendBalance = fixedToShort( object.lendBalance0 )
        LendObj.tokenSymbol = object.token0Symbol
        LendObj.pool = object.poolData
        LendObj.apy = "lend"
        LendObj.healthFactor = object.healthFactor0
        LendObj.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        LendObj.currentLTV = object.currentLTV
        LendObj.interestEarned = fixedToShort(object.poolData.interest0)
        lendArray.push(LendObj)

    } else if (object.lendBalance1 > 0 && object.lendBalance0 == 0){
        const LendObj = {
        }

        LendObj.LendBalance = fixedToShort(object.lendBalance1)
        LendObj.tokenSymbol = object.token1Symbol
        LendObj.pool = object.poolData
        LendObj.apy = "lend"
        LendObj.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        LendObj.healthFactor = object.healthFactor1
        LendObj.currentLTV = object.currentLTV
        LendObj.interestEarned = fixedToShort(object.poolData.interest1)
        lendArray.push(LendObj)

    } else if (object.lendBalance1 > 0 && object.lendBalance0 > 0){
        const LendObj1 = {
        }

        LendObj1.LendBalance = fixedToShort( object.lendBalance0)
        LendObj1.tokenSymbol = object.token0Symbol
        LendObj1.pool = object.poolData
        LendObj1.apy = "lend"
        LendObj1.healthFactor = object.healthFactor0
        LendObj1.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        LendObj1.currentLTV = object.currentLTV
        LendObj1.interestEarned = fixedToShort(object.poolData.interest0)
        lendArray.push(LendObj1)



        const LendObj2 = {
        }

        LendObj2.LendBalance = fixedToShort( object.lendBalance1 )
        LendObj2.tokenSymbol = object.token1Symbol
        LendObj2.pool = object.poolData
        LendObj2.apy = "lend"
        LendObj2.healthFactor = object.healthFactor1
        LendObj2.poolInfo = {
            token0Symbol : object.token0Symbol,
            token0Logo : getTokenLogo(object.token0Symbol),
            token1Symbol: object.token1Symbol,
            token1Logo : getTokenLogo(object.token1Symbol)
        }
        LendObj2.currentLTV = object.currentLTV
        LendObj2.interestEarned = fixedToShort(object.poolData.interest1)
        lendArray.push(LendObj2)

    }

}

console.log("Positions", borrowArray, lendArray, poolList);

return { borrowArray, lendArray }

}

const fixedToShort = (value) => {
  return Number(value) / (10 **18)
}

export const getAverage = (data, percent, balance) => {

    let numerator = 0
    let denominator = 0

    for (const pool of data) {
        numerator += pool[percent] * pool[balance]
        denominator += pool[balance]
    }

    return numerator / denominator

}

export const getNetHealthFactor = (positions) => {
 console.log("HealthFactor", positions);
 let value = 0
 let counter = 0

 for (const pool of positions) {
    const hf1 = fixedToShort(pool?.healthFactor0)
    const hf2 = fixedToShort(pool?.healthFactor0) > 100 ? 100 : fixedToShort(pool?.healthFactor0)
    value += (hf1 + hf2)/2
    counter++
 }

 return value/counter

}