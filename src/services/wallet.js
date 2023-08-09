import Web3 from "web3";
import {
  getAccount,
  getNetwork,
  disconnect,
fetchBalance
} from "wagmi/actions";
// local imports
import { providerOptions } from "../constants/wallet";
import { fromWei, removeFromLocalStorage, saveToLocalStorage } from "../utils";
import { networks } from "../core/networks/networks";
// import { MetaMaskconnector, WalletConnector } from '../App';

const API = import.meta.env.VITE_INFURA_ID;

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
    'https://rpc.public.zkevm-test.net')

  const web3 = new Web3(provider);
  web3.default = true;
  return web3;
};

export const getweb3Instance = async () => {
  try {
    // const provider = getProvider();
    // const web3 = new Web3(provider);
    // return web3;
  } catch (error) {
    return defProv();
  }
};

export const handleDisconnect = async () => {
  await disconnect();
  removeFromLocalStorage("user");
  localStorage.removeItem("walletconnect");
  window.location.reload();
};

export const connectWallet = async (wallet, ChangedAccount = null) => {
  
const trigerWallet = wallet || localStorage.getItem('wallet');
   try {
  //   if(trigerWallet == 'metamask'){
  //     try {
  //       const data = await connect({
  //         connector: MetaMaskconnector,
  //       }).then((res) => {
  //         return res;
  //       })
  //       localStorage.setItem('wallet', 'metamask')
  //       console.log("USerObject", data);
  //     } catch (error) {
  //       const isError = (error?.message == 'Connector already connected')
  //       if(!isError){
  //         const data = await connect({
  //           connector: WalletConnector,
  //         }).then((res) => {
  //           return res;
  //         })
  //         localStorage.setItem('wallet', 'walletConnect')
  //       }
  //     }
  //   } else if (trigerWallet == 'walletConnect'){
  //     const data = await connect({
  //       connector: WalletConnector,
  //     }).then((res) => {
  //       return res;
  //     })
  //     localStorage.setItem('wallet', 'walletConnect')
  //   }
    const user = getAccount()
    const { chain, chains } = getNetwork()
    const chainId = chain.id
    const account = ChangedAccount || user.address;
    const bal =  await fetchBalance({
      address: account,
    })
    // const balance = fromWei(web3, bal).slice(0, 6);
    const networkByWeb3 = chain.name.toUpperCase()
    const Currentnetwork = networks[chainId] ? networks[chainId].chainName: networkByWeb3
    const obj = { address: account, balance: Number(bal?.formatted ).toFixed(4), network: {id: chainId, name: Currentnetwork} , isConnected: true}
    saveToLocalStorage('user', obj)
    return obj;
  } catch (error) {
   
    throw error;
  }
};

export const changeNetwork = async (networkId) => {
  const provider = getProvider();
  try {
    if (!provider) throw new Error("No Crypto Wallet Found");
    const account = await provider.request({
      method: "wallet_switchEthereumChain",
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
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkId],
            },
          ],
        });
        return true;
      } catch (err) {
      
        return false;
      }
    }
  }
};

// use in connect functions and dispatched on every event or can be used in useEffect;

export const MetaMaskEventHandler = (provider) => {
  provider.on("chainChanged", (chainId) => {
    window.location.reload();
  });
  provider.on("accountsChanged", function (account) {
    window.location.reload();
  });
  provider.on("message", (message) => {
    console.log(message);
  });
  provider.on("disconnect", (reason) => {
    console.log(reason);
  });
};
