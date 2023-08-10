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
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  sepolia,
  polygonMumbai,
  polygonZkEvm,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import App1 from "./app1";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { alchemyProvider } from 'wagmi/providers/alchemy'


// import ends here
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
const alchemyId2 = import.meta.env.VITE_ALCHEMY_ID2;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const infuraID = import.meta.env.VITE_INFURA_ID;

import { sepoliaTestnet, zkEVMTestNet, mumbaiTestnet } from "./core/networks/Chains";


const { chains, publicClient } = configureChains(
  [sepoliaTestnet, zkEVMTestNet, mumbaiTestnet],
  [publicProvider(),alchemyProvider({ apiKey: alchemyId })]
);
// const walletConnectProjectID = "45c3755af7419aaf09eb64929022acdd";
// const { wallets } = getDefaultWallets({
//   appName: "RainbowKit demo",
//   projectId: "45c3755af7419aaf09eb64929022acdd",
//   chains,
// });

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [injectedWallet({ chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
//uri: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend_mumbai",





ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<Ring />}>
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <BrowserRouter>
              <AppWrapper />
            </BrowserRouter>
          </RainbowKitProvider>
        </WagmiConfig>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
