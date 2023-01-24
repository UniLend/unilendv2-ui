import { poolAbi } from "../core/contractData/abi";
import { getAllContracts } from "../helpers/contracts";
import { poolDataByAddr } from "../utils/constants";

export const getAllEvents = async (contract, event) => {
  try {
    // const result = await contract.getPastEvents(
    //   event,
    //   {
    //     fromBlock: 0,
    //     toBlock: 'latest',
    //   },
    //   function (error, events) {
    //     if (error) {
    //       console.log(error);
    //     }
    //   }
    // );

    const result = await contract.queryFilter('PoolCreated')
   console.log("PoolCreated", "result", result);
    return result.map((item) => item.args);
  } catch (error) {
    return error;
  }
};

export const getEventsWithFilter = (contract, event, filter) => {
  const events = contract
    .getPastEvents(
      event,
      {
        filter: filter,
        fromBlock: 0,
        toBlock: 'latest',
      },
      function (error, events) {
        if (error) {
          console.log(error);
        }
      }
    )
    .then((events) => {
      
      return events;
    });
    return events;
};

export const positionId = async (
  positionContract,
  poolAddress,
  userAddress
) => {
  const id = await positionContract.methods
    .getNftId(poolAddress, userAddress)
    .call();
  return id;
};

export const allTransaction = async (
  coreContract,
  positionContract,
  userAddress,
  web3
) => {
  const data = await getAllEvents(coreContract, 'PoolCreated');
  // array of all pools address
  const newData = data.map((event) => event.pool);
  let array = [];
  for (let i = 0; i < newData.length; i++) {
    const position = await positionId(
      positionContract,
      newData[i],
      userAddress
    );
    const poolInfo = poolDataByAddr[newData[i]];
    const poolContract = await getAllContracts(
      newData[i],
      poolAbi,
      web3
    );
    
    poolContract.poolInfo = poolInfo;
    
    const eventNames = ['Borrow', 'Lend', 'Redeem', 'RepayBorrow'];
    for (let j = 0; j < eventNames.length; j++) {
     
      const events = await getEventsWithFilter(poolContract, eventNames[j], {
        _positionID: `${position}`,
      });
      const eventsWithPoolInfo = events.map((el)=> el = {...el, poolInfo: poolInfo, event: el.event === 'RepayBorrow'? 'Repay': el.event})
      array.push(...eventsWithPoolInfo);
   
    }
  }
  // console.log("all array", array);
  return array;
};