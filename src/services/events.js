import { poolAbi, positionAbi } from "../core/contractData/abi";
import { fromBigNumber, getAllContracts } from "../helpers/contracts";
import { readContract, getContract, getProvider } from "@wagmi/core";
import { watchContractEvent } from 'wagmi/actions'
import Web3 from "web3";

export const getAllEvents = async (contract, abi, event) => {
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

    // const result = await contract.watchEvent.get('_',event)  ;
    console.log("pool",    {
      address: contract.address,
      abi: abi,
      eventName: event,
    } );
    const unwatch = watchContractEvent(
      {
        address: contract.address,
        abi: abi,
        eventName: event,
      
      },
      (log) => console.log(log),
    )
    // return result.map((item) => item.args);
  } catch (error) {
    return error;
  }
};

export const getEventsWithFilter = async (contract, event, filter) => {
  // const events = await contract
  //   .getPastEvents(
  //     event,
  //     {
  //       filter: filter,
  //       fromBlock: 0,
  //       toBlock: 'latest',
  //     },
  //     function (error, events) {
  //       if (error) {
  //         console.log("eventFilter",error);
  //       }
  //     }
  //   )

  // .then((events) => {
  //   console.log("eventFilter", events);
  //   return events;
  // });

  const events = await contract.queryFilter(event);
  const filtered = events.filter(
    (event) => fromBigNumber(event.args._positionID) == filter._positionID
  );

  return filtered;
};

export const positionId = async (
  positionContract,
  poolAddress,
  userAddress
) => {
  // const id = await positionContract.methods
  //   .getNftId(poolAddress, userAddress)
  //   .call();
  const id = await readContract({
    address: positionContract.address,
    abi: positionAbi,
    functionName: "getNftId",
    args: [poolAddress, userAddress],
  });
  return id;
};

export const allTransaction = async (
  coreContract,
  positionContract,
  userAddress,
  poollist,
  setTxtData,
  setIsPageLoading
) => {
  const data = await getAllEvents(coreContract, "PoolCreated");
  // array of all pools address
  const newData = data.map((event) => event.pool);
 
  let array = [];
  for (let i = 0; i < newData.length; i++) {
    const position = await positionId(
      positionContract,
      newData[i],
      userAddress
    );

    const poolInfo = poollist[newData[i]];

    const poolContract = getContract({
      address: newData[i],
      abi: poolAbi,
      signerOrProvider: getProvider(),
    });
   
    const eventNames = ["Borrow", "Lend", "Redeem", "RepayBorrow"];
    const IspositionId = fromBigNumber(position);
    if (IspositionId != 0) {
      for (let j = 0; j < eventNames.length; j++) {
        const events = await getEventsWithFilter(poolContract, eventNames[j], {
          _positionID: `${position}`,
        });
        const eventsWithPoolInfo = events.map(
          (el) =>
            (el = {
              ...el,
              poolInfo: poolInfo,
              event: el.event === "RepayBorrow" ? "Repay" : el.event,
            })
        );
      
        array.push(...eventsWithPoolInfo);
      }
      const sort = array.sort(function (a, b) {
        // Compare the 2 dates
        if (a.blockNumber < b.blockNumber) return 1;
        if (a.blockNumber > b.blockNumber) return -1;
        return 0;
      });
      // setTxtData(sort);
      // setIsPageLoading(false);
    }
  }

  return array;
};
