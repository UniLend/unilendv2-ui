

import { getNetwork, getContract , getAccount, getWalletClient, getPublicClient, readContract} from "wagmi/actions";
import { getEtherContract } from "./wagmi";




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


export const getPastEvents = async ( address, abi,  event) => {
  const contractInstance =  await getEtherContract(address, abi)

  const events = await contractInstance.queryFilter(event);

  return events
}


export const readContractLib = async (props) => {
  const data = await readContract(props)
  return data
}