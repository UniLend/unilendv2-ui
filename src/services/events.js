import { poolAbi, positionAbi } from "../core/contractData/abi";
import { fromBigNumber, getAllContracts } from "../helpers/contracts";
import { readContract, getContract, getProvider } from "@wagmi/core";
import Web3 from "web3";

// export const getAllEvents = async (contract, event) => {
//   try {

//     const result = await contract.queryFilter(event);
//     return result.map((item) => item.args);
//   } catch (error) {
//     return error;
//   }
// };
export const getAllEvents = async (contract, event, batchSize) => {
  try {
    const provider = getProvider();
    const latestBlockNumber = await provider.getBlockNumber();
    const events = [];
    const fetchEventsFromBlock = async (fromBlock, toBlock) => {
      const result = await contract.queryFilter(event, fromBlock, toBlock);
      return result.map((item) => item.args);
    };

    const batchPromises = [];
    let fromBlock = 0;

    while (fromBlock <= latestBlockNumber) {
      const toBlock = Math.min(fromBlock + batchSize - 1, latestBlockNumber);
      batchPromises.push(fetchEventsFromBlock(fromBlock, toBlock));
      fromBlock = toBlock + 1;
    }

    const eventBatches = await Promise.all(batchPromises);
    events.push(...eventBatches.flat());
    return events;
  } catch (error) {
    throw error;
  }
};

export const getEventsWithFilter = async (contract, event, filter) => {
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
