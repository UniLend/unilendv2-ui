import { Chain  } from '@rainbow-me/rainbowkit'
export const zkEVMTestNet = {
    id: 1442,
    name: 'zkEVM Testnet',
    network: 'polygon-zkevm-testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://polygon-zkevm-testnet.rpc.thirdweb.com/ed043a51a23b0db3873f5a38b77ab28175fa496f15d3c53cf70401be89b622a', 'https://rpc.public.zkevm-test.net'],
      },
      public: {
        http: ['https://rpc.public.zkevm-test.net','https://rpc.public.zkevm-test.net'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://explorer.public.zkevm-test.net',
      },
    },
    testnet: true,
} as Chain;

export const shardeumTestnet = {
  id: 8081,
  name: "Shardeum Testnet",
  network: "Shardeum Sphinx Dapp 1.X",
  nativeCurrency: { name: "shardeum", symbol: "SHM", decimals: 18 },
  rpcUrls: {
    default: {
      http: [ 'https://dapps.shardeum.org/'],
    },
    public: {
      http: [ 'https://dapps.shardeum.org/ '],
    },
  },
  blockExplorers: {
    default: {
      name: "shardeum",
      url: "https://explorer-dapps.shardeum.org/",
    },
  },
  testnet: true,
} as Chain;

export const sepoliaTestnet = {
  id: 11155111,
  name: "Sepolia Testnet",
  network: "Sepolia Testnet",
  nativeCurrency: { name: "Etherium", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [ 'https://sepolia.infura.io/v3/603c7bc2fa6c46ecb189576fded15f81' ,'https://eth-sepolia.g.alchemy.com/v2/mibiTKAFT4EkiFnw5Fkl55NkwpOVibgP'],
      webSocket: [ 'wss://sepolia.infura.io/v3/603c7bc2fa6c46ecb189576fded15f81' ,'wss://eth-sepolia.g.alchemy.com/v2/mibiTKAFT4EkiFnw5Fkl55NkwpOVibgP'],
    },
    public: {
      http: [ 'https://sepolia.infura.io/v3/603c7bc2fa6c46ecb189576fded15f81 '],
      webSocket: ['wss://sepolia.infura.io/v3/603c7bc2fa6c46ecb189576fded15f81 ']
    },
  },
  blockExplorers: {
    default: {
      name: "sepolia",
      url: "https://sepolia.etherscan.io/",
    },
  },
  testnet: true,
} as Chain;

export const mumbaiTestnet = {
  id: 80001,
  name: 'Polygon Mumbai',
  network: 'Polygon Mumbai',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://polygon-mumbai.g.alchemy.com/v2/2Uqa_uWFpqzmbVfbHrVn5euVsAJ5eHQK'],
      webSocket:  ['wss://polygon-mumbai.g.alchemy.com/v2/2Uqa_uWFpqzmbVfbHrVn5euVsAJ5eHQK']
    },
    public:{
      http: ['https://polygon-mumbai.g.alchemy.com/v2/2Uqa_uWFpqzmbVfbHrVn5euVsAJ5eHQK'],
      webSocket:  ['wss://polygon-mumbai.g.alchemy.com/v2/2Uqa_uWFpqzmbVfbHrVn5euVsAJ5eHQK']
    },
  },
  blockExplorers: {
    default: {
      name: 'etherscan',
      url: 'https://mumbai.polygonscan.com/',
    },
  },
  testnet: true,
} as Chain;

export const polygonMainnet = {
  id: 137,
  name: 'Polygon',
  network: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://polygon-mainnet.g.alchemy.com/v2/3UO4F86XEds-_CMUV4vnlrf0MOgFt5bn'],
      webSocket:  ['wss://polygon-mainnet.g.alchemy.com/v2/3UO4F86XEds-_CMUV4vnlrf0MOgFt5bn']
    },
    public:{
      http: ['https://polygon-mainnet.g.alchemy.com/v2/3UO4F86XEds-_CMUV4vnlrf0MOgFt5bn'],
      webSocket:  ['wss://polygon-mainnet.g.alchemy.com/v2/3UO4F86XEds-_CMUV4vnlrf0MOgFt5bn']
    },
  },
  blockExplorers: {
    default: {
      name: 'etherscan',
      url: 'https://mumbai.polygonscan.com/',
    },
  },
  testnet: true,
} as Chain;