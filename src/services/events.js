import { poolAbi, positionAbi, coreAbi } from "../core/contractData/abi";
import { fromBigNumber } from "../helpers/contracts";
import { getEtherContract, getEthersProvider } from "../lib/fun/wagmi";
import { getPastEvents, readContractLib } from "../lib/fun/functions";



export const getEventsWithFilter = async (contract, event, filter) => {

  const events =  await getEventData(contract, event);
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
  const id = await readContractLib({
    address: positionContract.address,
    abi: positionAbi,
    functionName: "getNftId",
    args: [poolAddress, userAddress],
  });
  return id;


};


export const getEventData = async (contract, event) => {
  try {
    const provider = getEthersProvider(11155111);
    const batchSize = 50000;
    const latestBlockNumber = await provider.getBlockNumber();

    const fetchBatch = async (fromBlock, toBlock) => {
      const batchResult = await contract.queryFilter(event, fromBlock, toBlock);
      return batchResult.map((item) => item);
    };

    const batchPromises = [];
    let fromBlock = 0;
    while (fromBlock <= latestBlockNumber) {
      const toBlock = Math.min(fromBlock + batchSize - 1, latestBlockNumber);
      batchPromises.push(fetchBatch(fromBlock, toBlock));
      fromBlock = toBlock + 1;
    }

    const result = [];
    await Promise.all(batchPromises).then((batchResults) => {
      batchResults.forEach((batchResult) => result.push(...batchResult));
    });

    return result;
  } catch (error) {
    return error;
  }
};

export const allTransaction = async (
  coreContract,
  positionContract,
  userAddress,
  poollist,
  setTxtData,
  setIsPageLoading
) => {
  const data = await getEventData(coreContract, "PoolCreated");



  console.log("history data:", data);

  // array of all pools address
  const newData = data.map((event) => event.args.pool);
 
  let array = [];

  for (let i = 0; i < newData.length; i++) {
    const position = await positionId(
      positionContract,
      newData[i],
      userAddress
    );
  
    const poolInfo = poollist[newData[i]];

    const poolContract = await getEtherContract(
     newData[i],
      poolAbi,
      11155111
    );

     const eventNames = ["Borrow", "Lend", "Redeem", "RepayBorrow"];
    //const eventNames = ["Borrow"];
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
