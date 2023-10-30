
// local imports
import { fromWei, removeFromLocalStorage, saveToLocalStorage } from "../utils";
import { networks } from "../core/networks/networks";
import { getAccountLib, getNetworkLib, fetchBalanceLib, disconnectLib } from "../lib/fun/functions";
import { getEthersProvider } from "../lib/fun/wagmi";
// import { MetaMaskconnector, WalletConnector } from '../App';

const API = import.meta.env.VITE_INFURA_ID;


export const handleDisconnect = async () => {
  await disconnectLib();
  removeFromLocalStorage("user");
  localStorage.clear();
  localStorage.removeItem("walletconnect");
  window.location.reload();
};

export const connectWallet = async (wallet, ChangedAccount = null) => {

   try {

    const user = getAccountLib()
    const { chain, chains } = getNetworkLib()
    const chainId = chain.id
    const account = ChangedAccount || user.address;
    const bal =  await fetchBalanceLib({
      address: account,
    })
    // const balance = fromWei(web3, bal).slice(0, 6);
    const networkByWeb3 = chain.name.toUpperCase()
    const Currentnetwork = networks[chainId] ? networks[chainId].chainName: networkByWeb3
    const obj = { address: account, balance: Number(bal?.formatted ).toFixed(4), symbol: bal?.symbol ,network: {id: chainId, name: Currentnetwork} , isConnected: true}
    saveToLocalStorage('user', obj)
    return obj;
  } catch (error) {
   
    throw error;
  }
};

export const changeNetwork = async (networkId) => {
  const provider = getEthersProvider();
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
