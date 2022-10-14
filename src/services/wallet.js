import Web3 from 'web3';
import Web3Modal from 'web3modal';
// local imports
import { providerOptions } from '../constants/wallet';
import { fromWei } from '../helpers/utils';
import { networks } from '../core/networks/networks';

export const getProvider = async () => {
  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });
  const provider = await web3Modal.connect();
  return provider;
};

export const getweb3Instance = async () => {
  const provider = await getProvider();
  const web3 = new Web3(provider);
  return web3;
};

export const connectWallet = async (web3) => {
  //   await provider.sendAsync('eth_requestAccounts');
  // const net = (await web3.eth.net.getNetworkType()).toUpperCase();
  const chainId = await web3.eth.getChainId();
  const accounts = await web3.eth.getAccounts();
  const bal = await web3.eth.getBalance(accounts[0]);
  const balance = fromWei(web3, bal).slice(0, 6);
  return { address: accounts[0], balance, network: chainId };
};

export const changeNetwork = async (networkId) => {
  try {
    if (!window.ethereum) throw new Error('No Crypto Wallet Found');
    const account = await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${Number(Number(networkId)).toString(16)}`,
        },
      ],
    });
    console.log('eth', account);
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networks[networkId],
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      }
    }
  }
};
