// @dev provider options for multiple wallets
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';

console.log(import.meta.env.REACT_APP_INFURA_ID);

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: import.meta.env.REACT_APP_INFURA_ID,
    },
  },
};
