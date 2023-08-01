

import { getNetwork, getContract , getAccount, getWalletClient, getPublicClient} from "wagmi/actions";




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