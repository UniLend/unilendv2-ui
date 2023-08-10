import React from 'react'
import { useAccount, useNetwork } from 'wagmi'

export default function useWallet() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount()
    const { chain, chains} = useNetwork()
  return { address, isConnected, chain, chains }
}
