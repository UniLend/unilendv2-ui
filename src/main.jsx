import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./polyfils";
import { store } from "./store/Store";
import "./index.css";
import Ring from "./components/Loader/Ring";
import AppWrapper from "./appWrapper";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// Custom theme
import { myCustomTheme } from "./core/theme/customWalletTheme";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
  ledgerWallet,
  okxWallet,
  trustWallet,
  coin98Wallet,
} from "@rainbow-me/rainbowkit/wallets";


import { mainnet, sepolia } from 'wagmi/chains'



//infinity wallet integration 
// import { InfinityWalletConnector, openInfinityWallet } from '@infinitywallet/infinity-connector';

import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from 'wagmi/providers/infura'

// import ends here
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const infuraID = import.meta.env.VITE_INFURA_ID;

import { mumbaiTestnet } from "./core/networks/Chains";


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, mumbaiTestnet],
  [
    publicProvider(),
    alchemyProvider({ apiKey: alchemyId }),
    infuraProvider({ apiKey: infuraID }),
  ]
);

console.log("Ethereum", chains, {publicClient});

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains, projectId }),
      injectedWallet({ chains, projectId }),
      coinbaseWallet({ appName: "UnilendV2", chains, projectId }),
      walletConnectWallet({ chains, projectId }),
      coin98Wallet({ chains, projectId }),
      okxWallet({ chains, projectId }),
      // infintyWallet({chains})
    ],
  },
  {
    groupName: "Other",
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


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<Ring />}>
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            theme={myCustomTheme}
          >
            <BrowserRouter>
              <AppWrapper />
            </BrowserRouter>
          </RainbowKitProvider>
        </WagmiConfig>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
