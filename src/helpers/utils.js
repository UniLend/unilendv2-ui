export const fromWei = (web3, val) => {
  const result = web3.utils.fromWei(val, 'ether');
  return result;
};
