export const getContract = async (web3, abi, address) => {
  const contract = await new web3.eth.Contract(abi, address);
  return contract;
};

export const getERC20Logo = async (web3, abi, address) => {
  const contract = await new web3.eth.Contract(abi, address);
//  const symbol = await contract.methods.symbol().call();
//   console.log("ERC", symbol);
  return contract;
};
