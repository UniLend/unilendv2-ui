import { poolAbi, positionAbi, coreAbi } from "../core/contractData/abi";
import { fromBigNumber, getAllContracts } from "../helpers/contracts";
import { getEtherContract } from "../lib/fun/wagmi";
import { getPastEvents, readContractLib } from "../lib/fun/functions";


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
  const id = await readContractLib({
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
  const data = await getPastEvents(coreContract.address, coreAbi, "PoolCreated");



  // array of all pools address
  const newData = data.map((event) => event.args.pool);
 
  let array = [];
  console.log("history", 'newData', newData, data);
  for (let i = 0; i < newData.length; i++) {
    const position = await positionId(
      positionContract,
      newData[i],
      userAddress
    );
  
    const poolInfo = poollist[newData[i]];

    const poolContract = await getEtherContract(
     newData[i],
      poolAbi
    );
    console.log("history", poolContract);
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
