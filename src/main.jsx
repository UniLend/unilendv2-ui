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
import {  RainbowKitProvider } from "@rainbow-me/rainbowkit";
// Custom theme
import { myCustomTheme } from "./core/theme/customWalletTheme";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  
  polygon,

} from "wagmi/chains";
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
const alchemyId2 = import.meta.env.VITE_ALCHEMY_ID2;
const projectId = '18855b3b9345b6d878b636ea87cd502f' ||  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const infuraID = import.meta.env.VITE_INFURA_ID;

import {
  sepoliaTestnet,
  zkEVMTestNet,
  mumbaiTestnet,
  shardeumTestnet,
  holeskyTestnet,
  polygonMainnet
} from "./core/networks/Chains";


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ mainnet, polygonMainnet, sepoliaTestnet, mumbaiTestnet, zkEVMTestNet ],
  [publicProvider(), infuraProvider({apiKey: infuraID})]
);


const connectors = connectorsForWallets([
    {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({chains, projectId}),
      injectedWallet({ chains, projectId }),
      coinbaseWallet({ appName: "UnilendV2", chains , projectId}),
      walletConnectWallet({ chains, projectId }),
      coin98Wallet({ chains, projectId}),
      okxWallet({chains, projectId}),
      // infintyWallet({chains})
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      injectedWallet({ chains , projectId}),
      // argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);


export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});
//uri: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend_mumbai",

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
