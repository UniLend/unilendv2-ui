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
    const txtData = {
        message: `Wrap and Delegate ${amount} UFT `
    }
    checkTxnStatus(txs?.hash, txtData);
  } catch (error) {
    console.error("Wrap:", error);
    console.log({ error });
  }
};

export const checkAllowance = async (tokenAddress, abi, owner, spender) => {
  try {
    const instance = await getContractInstance(tokenAddress, abi);
    // const delegatesAddress = await instance.delegates(owner)
    const allowance = await instance.allowance(owner, spender);
    return {allowance};
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

export const handleUnWrap = async (governanceAddress, govABI, amount, checkTxnStatus) => {
    try {
        const fixedAmount = decimal2Fixed(amount, 18)
        const instance = await getContractInstance(governanceAddress, govABI);
        const total = await instance.totalSupply()
        const frombig = fromBigNumber(total)
        console.log("Contract", {
            amount : amount,
            fixedAmount: fixedAmount,
            fixedAmountTodec: fixedAmount / (10**18),
            TotalSupply: frombig,
            TotalSupplyDec: frombig/(10**18),
            Differance: (frombig - fixedAmount),
            DifferanceDec: (frombig- fixedAmount)/(10**18)
        });
        const txs = await instance.unwrap(fixedAmount, {
          gasLimit: 210000,
        });
        const txtData = {
            message: `Unwrap ${amount} UFTG `
        }
        checkTxnStatus(txs?.hash, txtData);
    } catch (error) {
        
    }
};

export const handleUpdateDelegate = async (
  governanceAddress,
  govABI,
  delegateAddress,
  checkTxnStatus
) => {

    try {
        const instance = await getContractInstance(governanceAddress, govABI);
        console.log("Contract", instance);
        const txs = await instance.delegate(delegateAddress, {
          gasLimit: 210000,
        });
        const txtData = {
           message: `Delegation Updated to ${delegateAddress} `
        }
        checkTxnStatus(txs?.hash, txtData);
    } catch (error) {
        
    }


};
