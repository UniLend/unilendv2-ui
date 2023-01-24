import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { createClient, configureChains, disconnect, getNetwork, connect, fetchEnsName, switchNetwork, fetchBalance , prepareWriteContract, writeContract , getProvider, readContract, fetchToken, watchContractEvent, waitForTransaction } from "@wagmi/core";
// local imports
import { providerOptions } from '../constants/wallet';
import { fromWei, removeFromLocalStorage, saveToLocalStorage } from '../utils';
import { networks } from '../core/networks/networks';
import { MetaMaskconnector } from '../App';

const API = import.meta.env.VITE_INFURA_ID;

export const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
});

// export const getProvider = async () => {
//  try {
//   const provider = await web3Modal.connect();
//   // Subscribe to events
//   MetaMaskEventHandler(provider)
//   return provider;
//  } catch (error) {
//   throw error;
//  }

// };

 export const defProv = () => {
  const provider = new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/${API}`)

    const web3 = new Web3(provider)
    web3.default = true;
   return web3;
}


export const getweb3Instance = async () => {
  try {
    const provider = getProvider();
    const web3 = new Web3(provider);
    console.log("Provider", web3);
    return web3;
  } catch (error) {
    return defProv()
  }

};

export const handleDisconnect = async () => {
  // await web3Modal.clearCachedProvider();
  await disconnect()
  removeFromLocalStorage('user');
  localStorage.removeItem('walletconnect')
  window.location.reload();
};

export const connectWallet = async () => {
  //   await provider.sendAsync('eth_requestAccounts');
  // const net = (await web3.eth.net.getNetworkType()).toUpperCase();  
  try {
    const { account } = await connect({
      connector: MetaMaskconnector,
    }).then((res) => {
      return res;
    })
    const { chain, chains } = getNetwork()
    const chainId = chain.id
    const accounts = account;;
    const bal =  await fetchBalance({
      address: account,
    })
   
    // const balance = fromWei(web3, bal).slice(0, 6);
    const networkByWeb3 = chain.name.toUpperCase()
    const Currentnetwork = networks[chainId] ? networks[chainId].chainName: networkByWeb3
    const obj = { address: accounts, balance: Number(bal?.formatted ).toFixed(4), network: {id: chainId, name: Currentnetwork} , isConnected: true}
    console.log("user", obj);
    saveToLocalStorage('user', obj)
    return obj;
  } catch (error) {
    // console.error("Meaterror",error.message);
    throw error;
  }

};

export const changeNetwork = async (networkId) => {
  const provider = getProvider();
  try {
    if (!provider) throw new Error('No Crypto Wallet Found');
    const account = await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${networkId.toString(16)}`,
        },
      ],
    });
    return account;
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networks[networkId],
            },
          ],
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }
};

// use in connect functions and dispatched on every event or can be used in useEffect; 

export const MetaMaskEventHandler = (provider) => {
  provider.on('chainChanged', (chainId) => {
    window.location.reload();
  });
  provider.on('accountsChanged', function (account) {
    window.location.reload();
  });
  provider.on('message', (message) => {
    console.log(message);
  });
  provider.on('disconnect', (reason) => {
    console.log(reason);
  });
};
