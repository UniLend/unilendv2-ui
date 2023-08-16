import * as React from 'react'
import { type WalletClient, type PublicClient , useWalletClient } from 'wagmi'

import { getPublicClient, getWalletClient, getNetwork } from 'wagmi/actions'
import { providers, ethers } from 'ethers'
import { type HttpTransport } from 'viem'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = getPublicClient({ chainId })
  return publicClientToProvider(publicClient)
}






export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient


  
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }

  
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { chain } = getNetwork()
  const walletClient = await getWalletClient({ chainId: chain?.id })
  if (!walletClient) return undefined
  return walletClientToSigner(walletClient)
}


export async function getEtherContract (address: any, abi: any) {

  const signer = await getEthersSigner()

  const contract = new ethers.Contract(address, abi , signer)
  // console.log("contract", contract);
  
return contract;

}


export const getEtherContractWithProvider = (address: any, abi: any, provider: any) => {
  const contract = new ethers.Contract(address, abi , provider)
return contract;
}