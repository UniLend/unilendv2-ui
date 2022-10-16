export const networks = {
  1: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
  },

  137: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },

  56: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
  },

  1284: {
    chainId: `0x${Number(1284).toString(16)}`,
    chainName: "MOON",
    nativeCurrency: {
      name: "Glimmer",
      symbol: "GLMR",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc.api.moonbeam.network",
      "wss://wss.api.moonbeam.network",
    ],
    blockExplorerUrls: ["https://moonbeam.moonscan.io"],
  },
  42: {
    chainId: `0x${Number(42).toString(16)}`,
    chainName: "Kovan Test Network",
    nativeCurrency: {
      name: "Ether",
      symbol: "KovanETH",
      decimals: 18,
    },
    rpcUrls: ["https://kovan.infura.io/v3/"],
    blockExplorerUrls: ["https://kovan.etherscan.io"],
  },
  3: {
    chainId: `0x${Number(3).toString(16)}`,
    chainName: " Testnet",
  },
  4: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "RINKEBY TESTNET",
  },
  5: {
    chainId: `0x${Number(5).toString(16)}`,
    chainName: "Goerli Test Network",
    nativeCurrency: {
      name: "Ether",
      symbol: "GoerliETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.infura.io/"],
  },
};

export const allNetworkIds = {
  mainNet: "1",
  polygonMainNet: "137",
  binanceMainNet: "56",
  moonMainNet: "1284",
  kovan: "42",
  rinkeby: "4",
  goerli: "5",
};
