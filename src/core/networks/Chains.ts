
import { Chain } from "@wagmi/core"
export const zkEVMTestNet = {
    id: 1442,
    name: 'zkEVM Testnet',
    network: 'polygon-zkevm-testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc.public.zkevm-test.net','https://polygon-zkevm-testnet.rpc.thirdweb.com/ed043a51a23b0db3873f5a38b77ab28175fa496f15d3c53cf70401be89b622a'],
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