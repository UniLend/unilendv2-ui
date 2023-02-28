import { coreAbi, erc20Abi, helperAbi } from "../core/contractData/abi";
import { getContract, readContract, fetchSigner } from "@wagmi/core";
import {
  add,
  decimal2Fixed,
  div,
  fixed2Decimals,
  greaterThan,
  lessThan,
  mul,
  sub,
  toAPY,
  fromBigNumber,
} from "../helpers/contracts";
import BigNumber from "bignumber.js";
import { getContractInstance } from "./pool";

export const handleWrapAndDelegate = async (
  governanceAddress,
  govABI,
  delegateAddress,
  amount,
  checkTxnStatus
) => {
  const fixedAmount = decimal2Fixed(amount, 18);
  try {
    const instance = await getContractInstance(governanceAddress, govABI);
    const txs = await instance.wrap(delegateAddress, fixedAmount, {
      gasLimit: 210000,
    });
    checkTxnStatus(txs?.hash);
  } catch (error) {
    console.error("Wrap:", error);
    console.log({ error });
  }
};

export const checkAllowance = async (tokenAddress, abi, owner, spender) => {
  try {
    const instance = await getContractInstance(tokenAddress, abi);
    const txs = await instance.allowance(owner, spender);
    return txs;
  } catch (error) {
    console.error("Allowance:", error);
  }
};

export const setApproval = async (contractAddress, abi, userAddress) => {
  try {
    var maxAllow =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const instance = await getContractInstance(contractAddress, abi);

    const txs = await instance.approve(userAddress, maxAllow, {
      gasLimit: 210000,
    });
  } catch (error) {}
};

const handleUnWrap = async (governanceAddress, govABI, delegateAddress, amount) => {
    try {
        
        const instance = await getContractInstance(governanceAddress, govABI);
        const txs = await instance.wrap(delegateAddress, fixedAmount, {
          gasLimit: 210000,
        });
    } catch (error) {
        
    }
};

const handleUpdateDelegate = (
  governanceAddress,
  govABI,
  delegateAddress,
  amount
) => {
  const instance = getContractInstance(governanceAddress, govABI);
};
