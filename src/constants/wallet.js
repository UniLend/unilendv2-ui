// @dev provider options for multiple wallets
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

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
      rpc:{
      11155111:`https://sepolia.infura.io/v3/${import.meta.env.REACT_APP_INFURA_ID}`,
      11155111: 'https://rpc.sepolia.org'
      },
      infuraId: import.meta.env.REACT_APP_INFURA_ID,
    },
  }
};

