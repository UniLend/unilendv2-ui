import eth from "../../assets/ethnew.svg"
import polygon from "../../assets/polygon.svg"
import  shardeum  from "../../assets/shardeumLogo.png";
export const networks = {

  137: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    logoUrl:polygon,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },


  11155111: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'SepoliaETH',
      decimals: 18,
    },
    logoUrl:eth,
    rpcUrls: ['https://sepolia.infura.io/v3/' ,
    'https://rpc.sepolia.dev',
    'https://rpc.sepolia.online',
    'https://www.sepoliarpc.space',
    'https://rpc.sepolia.org',
    'https://rpc-sepolia.rockx.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  
  80001: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    logoUrl:polygon,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  1442: {
    chainId: `0x${Number(1442).toString(16)}`,
    chainName: 'zkEVM Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    logoUrl:eth,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  8081: {
    chainId: `0x${Number(8081).toString(16)}`,
    chainName: 'Shardeum Sphinx Dapp 1.X',
    nativeCurrency:{ name: "shardeum", symbol: "SHM", decimals: 18 },
    rpcUrls: ['https://dapps.shardeum.org/'],
    blockExplorerUrls: ["https://explorer-dapps.shardeum.org/"],
    logoUrl:shardeum,
  }
};


export const ChangeNetwork = async (networkId) => {
  try {
    if (!window.ethereum) throw new Error('No crypto wallet found');
    const account = await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${Number(Number(networkId)).toString(16)}`,
        },
      ],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networks[networkId],
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      }
    }
  }
};

export const allNetworkIds = {
  mainNet: '1',
  polygonMainNet: '137',
  binanceMainNet: '56',
  moonMainNet: '1284',
  goerli: '5',
  sepolia: '11155111',
  polygonMumbai: '80001'
};
