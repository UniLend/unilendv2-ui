

import { getContract ,   getAccount,
  getNetwork,
  disconnect,
 fetchBalance , getWalletClient, getPublicClient, readContract, fetchToken, switchNetwork, waitForTransaction} from "wagmi/actions";
import { getEthersProvider } from "./wagmi";

export const getNetworkLib =  (props) => {
  const network =  getNetwork(props);
  return network
}
export const fetchBalanceLib = async (props) =>{
const bal = await fetchBalance(props)
return bal;
}

export const getAccountLib =  (props) => {
  const account=  getAccount(props);
  return account
}

export const disconnectLib = async(props)=>{
  try{
    disconnect(props)
  } catch (err){
    throw err
  }

}


export const getContractLib = async({address, abi}) => {
    const walletClient = await getWalletClient()
    const publicClient =  getPublicClient()

  const contract =  getContract({
    address: address || "",
    abi: abi,
    walletClient: walletClient,
    publicClient: publicClient
  })

  return contract
}


export const getPastEvents = async ( contractInstance,  event) => {
  // const contractInstance =  await getEtherContract(address, abi)

  try {
    const fromBlock = 4444453;
    const provider = getEthersProvider({chainId: 11155111})
    const latestBlock = provider._lastBlockNumber
    const events = await contractInstance.queryFilter(event, fromBlock, latestBlock);

    return events
  } catch (error) {
    throw error
  }


}


export const readContractLib = async (props) => {
  const data = await readContract(props)
  return data
}

export const fetchTokenLib = async (props) =>  {
   const token = await fetchToken(props)

   return token
}

export const switchNetworkLib = async (props) => {
  try {
    const data = await switchNetwork(props)
    return data;
  } catch (error) {
    throw error
  } 
 
}

export const waitForTransactionLib = async (props)=> {
  const txHash = await waitForTransaction(props);
  return txHash
}