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
import { getDefaultWallets, getWalletConnectConnector, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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

//infinity wallet integration 
// import { InfinityWalletConnector, openInfinityWallet } from '@infinitywallet/infinity-connector';

import { alchemyProvider } from "wagmi/providers/alchemy";

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
  holeskyTestnet
} from "./core/networks/Chains";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepoliaTestnet, zkEVMTestNet, mumbaiTestnet, polygon, shardeumTestnet, holeskyTestnet],
  [publicProvider(), alchemyProvider({ apiKey: alchemyId })]
);

//const projectId = 'YOUR_PROJECT_ID';
const { wallets } = getDefaultWallets({
  appName: 'UnilendV2',
  projectId,
  chains,
});


// code for infinity wallet

// const Dapp_URl ="localhost://5173"

// import useWalletHook from "./lib/hooks/useWallet";
// // const {isConnected } = useWalletHook();

// const isConnected = false;

// if (!isConnected) {
//   // No wallet is connected, proceed to check for Infinity Wallet
//   if (window.ethereum && window.ethereum?.isInfinityWallet) {
//     // Initialize Infinity Wallet Connector
//     const infinitywalletConnector = new InfinityWalletConnector({
//       supportedChainIds: [80001],
//     });

//     // Activate Connection
//     const { activate } = useWeb3ReactCore();
//     activate(infinitywalletConnector);
//   } else {
//     // Open Infinity Wallet if not detected
//     openInfinityWallet(Dapp_URl, 80001);
//   }
// }



// export const infintyWallet = ({ chains})  => ({
//   id: 'my-wallet',
//   name: 'My Wallet',
//   iconUrl: 'https://my-image.xyz',
//   iconBackground: '#0c2f78',
//   downloadUrls: {
//     android: 'https://play.google.com/store/apps/details?id=my.wallet',
//     ios: 'https://apps.apple.com/us/app/my-wallet',
//     chrome: 'https://chrome.google.com/webstore/detail/my-wallet',
//     qrCode: 'https://my-wallet/qr',
//   },
//   createConnector: () => {
//     const connector = InfinityWalletConnector({chains});

//     return {
//       connector,
//       mobile: {
//         getUri: async () => {
//           const provider = await connector.getProvider();
//           const uri = await new Promise<string>(resolve =>
//             provider.once('display_uri', resolve)
//           );
//           return uri;
//         },
//       },
    
//       extension: {
//         instructions: {
//           learnMoreUrl: 'https://my-wallet/learn-more',
//           steps: [
//             {
//               description:
//                 'We recommend pinning My Wallet to your taskbar for quicker access to your wallet.',
//               step: 'install',
//               title: 'Install the My Wallet extension',
//             },
//             {
//               description:
//                 'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
//               step: 'create',
//               title: 'Create or Import a Wallet',
//             },
//             {
//               description:
//                 'Once you set up your wallet, click below to refresh the browser and load up the extension.',
//               step: 'refresh',
//               title: 'Refresh your browser',
//             },
//           ],
//         },
//       },
//     };
//   },
// });



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

// const connectors = connectorsForWallets([
//   {
//     groupName: "Recommended",
//     wallets: [
//       metaMaskWallet({chains}),
//       injectedWallet({ chains }),
//       coinbaseWallet({ appName: "UnilendV2", chains }),
//       walletConnectWallet({ chains, projectId }),
//     ],
//   },
//   {
//     groupName: "More",
//     wallets: [
//     trustWallet({chains, projectId})
//     ],
//   },
// ]);

const wagmiConfig = createConfig({
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
