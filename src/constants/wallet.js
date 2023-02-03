// @dev provider options for multiple wallets
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import detectEthereumProvider from '@metamask/detect-provider';

// const provider = await detectEthereumProvider()

const infuraAPI =  import.meta.env.VITE_INFURA_ID;

export const providerOptions = {
  // coinbasewallet: {
  //   package: CoinbaseWalletSDK,
  //   options: {
  //     appName: 'unilend Finance',
  //     infuraId: import.meta.env.REACT_APP_INFURA_ID,
  //   },
  // },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        11155111: `https://sepolia.infura.io/v3/${infuraAPI}`,
        11155111: 'https://rpc.sepolia.org',
      },
      infuraId: infuraAPI,
    },
  }, 
};

