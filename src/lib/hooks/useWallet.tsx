import React from 'react'
import { useAccount } from 'wagmi'

export default function useWallet() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  return { address, isConnected }
}
