import { createClient, configureChains, getContract as gotContract, getProvider, readContract, fetchToken, watchContractEvent, waitForTransaction } from "@wagmi/core";
export const getContract = async (web3, abi, address) => {
  // const contract = await new web3.eth.Contract(abi, address);
  const contract = gotContract({
    address: address,
    abi: abi
  })
  return contract;
};

export const getERC20Logo = async (web3, abi, address) => {
  // const contract = await new web3.eth.Contract(abi, address);
  const contract = getContract({
    address: address,
    abi: abi
  })
//  const symbol = await contract.methods.symbol().call();
  return contract;
};
