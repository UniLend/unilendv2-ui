

import { getNetwork, getContract , getAccount, getWalletClient} from "wagmi/actions";


export const getContractLib = async({address, abi}) => {
    const walletClient = await getWalletClient()

  const contract = await getContract({
    address: address || "",
    abi: abi,
    walletClient: walletClient
  })

  return contract
}