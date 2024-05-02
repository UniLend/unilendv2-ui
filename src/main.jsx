import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './polyfils';
import { store } from './store/Store';
import './index.css';
import Ring from './components/Loader/Ring';
import AppWrapper from './appWrapper';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// Custom theme
import { myCustomTheme } from './core/theme/customWalletTheme';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
  ledgerWallet,
  okxWallet,
  trustWallet,
  coin98Wallet,
  rabbyWallet,
  phantomWallet,
} from '@rainbow-me/rainbowkit/wallets';

// wallet connector 
import { gateWallet, infinityWallet } from './core/walletConnector/walletConnector';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';

// import ends here
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const infuraID = import.meta.env.VITE_INFURA_ID;
import { mumbaiTestnet, arbitrum } from './core/networks/Chains';
const approvedHosts = ['https://v2.unilend.finance']
const isDomainApproved = approvedHosts.includes(window?.location?.origin)


const { chains, publicClient, webSocketPublicClient } = configureChains(
  isDomainApproved?[mainnet] :[mainnet, arbitrum, polygon, mumbaiTestnet],
  [
    publicProvider(),
    alchemyProvider({ apiKey: alchemyId }),
    infuraProvider({ apiKey: infuraID }),
  ],
);
//check for the condition if Dapp is Open on web Browser or infinity web3 browser
function shouldShowInfinityWallet() {
  return window.ethereum && window.ethereum.isInfinityWallet;
}

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ chains, projectId }),
      injectedWallet({ chains, projectId }),
      coinbaseWallet({ appName: 'UnilendV2', chains, projectId }),
      walletConnectWallet({ chains, projectId }),
      gateWallet({ chains, projectId }),
      coin98Wallet({ chains, projectId }),
      okxWallet({ chains, projectId }),
      rabbyWallet({ chains, projectId }),
      phantomWallet({ chains, projectId }),
      gateWallet({ chains, projectId }),
      shouldShowInfinityWallet() ? infinityWallet({ chains, projectId }) : null,
    ].filter(wallet => wallet !== null), 
  },
  {
    groupName: 'Other',
    wallets: [
      injectedWallet({ chains, projectId }),
      // argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);


const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Ring />}>
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            modalSize='compact'
            theme={myCustomTheme}
          >
            <BrowserRouter>
              <AppWrapper />
            </BrowserRouter>
          </RainbowKitProvider>
        </WagmiConfig>
      </Provider>
    </Suspense>
  </React.StrictMode>,
);
