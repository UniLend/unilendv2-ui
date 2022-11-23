// @dev provider options for multiple wallets
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

export const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'unilend Finance',
      infuraId: import.meta.env.REACT_APP_INFURA_ID,
    },
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: import.meta.env.REACT_APP_INFURA_ID,
    },
  },
};
