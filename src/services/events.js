import { poolAbi } from "../core/contractData/abi";
import { getAllContracts } from "../helpers/contracts";

export const getAllEvents = async (contract, event) => {
  try {
    const result = await contract.getPastEvents(
      event,
      {
        fromBlock: 0,
        toBlock: 'latest',
      },
      function (error, events) {
        if (error) {
          console.log(error);
        }
      }
    );
    return result.map((item) => item.returnValues);
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
    const poolContract = await getAllContracts(
      newData[i],
      poolAbi,
      web3
    );
    const eventNames = ['Borrow', 'Lend', 'Redeem', 'RepayBorrow'];
    for (let j = 0; j < eventNames.length; j++) {
     
      const events = await getEventsWithFilter(poolContract, eventNames[j], {
        _positionID: `${position}`,
      });
      array.push(...events);
   
    }
  }
  console.log("all array", array);
  return array;
};