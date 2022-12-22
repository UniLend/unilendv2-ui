import Web3 from 'web3';
import Web3Modal from 'web3modal';
// local imports
import { providerOptions } from '../constants/wallet';
import { fromWei, removeFromLocalStorage, saveToLocalStorage } from '../utils';
import { networks } from '../core/networks/networks';

const API = import.meta.env.VITE_INFURA_ID;

export const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
});

export const getProvider = async () => {
 try {
  const provider = await web3Modal.connect();
  // Subscribe to events
  MetaMaskEventHandler(provider)
  return provider;
 } catch (error) {
  throw error;
 }

};

 export const defProv = () => {
  const provider = new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/${API}`)

    const web3 = new Web3(provider);
    web3.default = true;
   return web3;
}


export const getweb3Instance = async () => {
  try {
    const provider = await getProvider();
    const web3 = new Web3(provider);
    return web3;
  } catch (error) {
    return defProv()
  }

};

export const handleDisconnect = async () => {
  await web3Modal.clearCachedProvider();
  removeFromLocalStorage('user');
  localStorage.removeItem('walletconnect')
  window.location.reload();
};

export const connectWallet = async () => {
  //   await provider.sendAsync('eth_requestAccounts');
  // const net = (await web3.eth.net.getNetworkType()).toUpperCase(); 
  try {
    const web3 = await getweb3Instance();
    const chainId = await web3.eth.getChainId();
    const accounts = await web3.eth.getAccounts();
    const bal = await web3.eth.getBalance(accounts[0]);
    const balance = fromWei(web3, bal).slice(0, 6);
    const networkByWeb3 = (await web3.eth.net.getNetworkType()).toUpperCase();
    const Currentnetwork = networks[chainId] ? networks[chainId].chainName: networkByWeb3
    const obj = { address: accounts[0], balance, network: {id: chainId, name: Currentnetwork} , isConnected: true}
    saveToLocalStorage('user', obj)
    return obj;
  } catch (error) {
    // console.error("Meaterror",error.message);
    throw error;
  }

};

export const changeNetwork = async (networkId) => {
  const provider = await getProvider();
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
