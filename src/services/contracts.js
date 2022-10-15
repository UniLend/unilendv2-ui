export const getContract = async (web3, abi, address) => {
  const contract = await new web3.eth.Contract(abi, address);
  return contract;
};
