import { useEffect } from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
//import { useQuery } from "@apollo/client";
import { useQuery, useQueryClient} from "react-query";
import "antd/dist/antd.css";
import {
  createClient,
  getAccount,
  getNetwork,
  configureChains,
  getContract,
  getProvider,
  fetchToken,
  fetchSigner,
} from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";

import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { infuraProvider } from '@wagmi/core/providers/infura'

import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";

import {
  avalanche,
  bsc,
  mainnet,
  polygonMumbai,
  sepolia,
  polygonZkEvmTestnet,
  zkSyncTestnet,
  polygon
} from "@wagmi/core/chains";
import { ethers } from "ethers";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";

// internal imports
import {
  setTheme,
  setUser,
  setWeb3,
  setContracts,
  setLoading,
  setPools,
  setError,
} from "./store/Action";
import MainRoutes from "./routes";
import { connectWallet, defProv } from "./services/wallet";
import {
  coreAbi,
  helperAbi,
  positionAbi,
  erc20Abi,
} from "./core/contractData/abi";
import { contractAddress } from "./core/contractData/contracts";
// import { getContract } from './services/contracts';
import { getAllEvents } from "./services/events";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.scss";
import { getFromLocalStorage, getTokenLogo } from "./utils";
import { fetchCoinLogo, fetchGraphQlData } from "./utils/axios";
import { useState } from "react";
import {
  checkOpenPosition,
  fixedToShort,
  getPoolCreatedGraphQuery,
  getTokenPrice,
} from "./helpers/dashboard";
import { hidePools } from "./utils/constants";
import { zkEVMTestNet } from "./core/networks/Chains";
import { getTokenUSDPrice } from "./helpers/contracts";

// import ends here
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const infuraID = import.meta.env.VITE_INFURA_ID

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc, polygonMumbai, sepolia, polygonZkEvmTestnet, zkEVMTestNet, zkSyncTestnet, polygon],
  [ alchemyProvider({ apiKey: alchemyId }), publicProvider(), infuraProvider({ apiKey: infuraID }),]
);

export const MetaMaskconnector = new MetaMaskConnector({
  chains: [mainnet, polygonMumbai, sepolia, polygonZkEvmTestnet, zkEVMTestNet, zkSyncTestnet, polygon],
});

export const WalletConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
    version: 2,
    projectId: projectId,
  },
});

const client = createClient({
  connectors: [
    new InjectedConnector({ chains }),
  ],
  autoConnect: true,
  provider,
  webSocketProvider,
});

const graphURL = {
  80001: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/my_unilend",
  137: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon",
};

function App() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient()
  const { chain, chains } = getNetwork();
  const {user} = useSelector((state) => state)
  const query = getPoolCreatedGraphQuery(user?.address);
  const etherProvider = new ethers.providers.JsonRpcProvider( `https://sepolia.infura.io/v3/${infuraID}`);
  const state = useSelector((state) => state);
  const networksWithGraph = [80001, 137]

 const { data, loading, error, refetch } = useQuery('pools', async () => {
 const fetchedDATA = await fetchGraphQlData(graphURL[chain?.id || user?.network?.id || 137], query)
 return fetchedDATA;
 } );


  document.body.className = `body ${getFromLocalStorage("unilendV2Theme")}`;

  // setting contract state to store from here

  const isSame = state?.user?.address != getFromLocalStorage("user")?.address;

  useEffect(() => {
    refetch()
  }, [chain, user])

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true));
        const walletconnect = JSON.parse(
          localStorage.getItem("wagmi.connected")
        );
        // const account = getAccount();
        let provider = etherProvider;
        if (walletconnect && user?.isConnected ) {
          const user = await connectWallet();
          dispatch(setUser(user));
          provider = getProvider();
        }
        // dispatch(setWeb3(web3));
        const { chain: nextChain, chains } = getNetwork();
        const networkID = user?.network?.id
        const { coreAddress, helperAddress, positionAddress } =
          contractAddress[chain?.id || nextChain?.id || networkID || "11155111"];

         
        const preparedData = [
          { abi: coreAbi, address: coreAddress },
          { abi: helperAbi, address: helperAddress },
          { abi: positionAbi, address: positionAddress },
        ];
        Promise.all(
          preparedData.map((item) =>
            getContract({
              address: item.address,
              abi: item.abi,
              signerOrProvider: provider,
            })
          )
        )
          .then((res) => {
            const payload = {
              coreContract: res[0],
              helperContract: res[1],
              positionContract: res[2],
            };

            dispatch(setContracts(payload));
          })
          .catch((err) => {
            throw err;
          });
      } catch (error) {
        console.error(error.message);
        dispatch(setError(error));
      }
    })();
  }, [isSame, getFromLocalStorage("ethEvent")]);

  useEffect(() => {
    const { chain } = getNetwork();
    const networkID = user?.network?.id
    if (state.contracts.coreContract && !networksWithGraph.includes(networkID)) {

      try {
        (async () => {
          const web3 = defProv();
          const poolData = {};
          const account = getAccount();
          const result = await getAllEvents(
            state.contracts.coreContract,
            "PoolCreated"
          );

          const array = [];
          const tokenList = {};
          for (const pool of result) {
            array.push(pool.token0, pool.token1);
          }
          const poolTokens = [...new Set(array)];

          //if wallet not connected
          if (!account.isConnected) {
         
            const ERC20contracts = await Promise.all(
              poolTokens.map((addr) => new web3.eth.Contract(erc20Abi, addr))
            );

            const Symbols = await Promise.all(
              ERC20contracts.map((contract, i) =>
                contract.methods.symbol().call()
              )
            );
            Symbols.forEach(
              (symbol, i) => (tokenList[poolTokens[i]] = { symbol })
            );

            const logos = await Promise.all(
              Symbols.map((sym, i) => fetchCoinLogo(sym))
            );

            logos.forEach(
              (logo, i) =>
                (tokenList[poolTokens[i]] = {
                  ...tokenList[poolTokens[i]],
                  logo,
                })
            );
            const reverseResult = result.reverse();
            for (const poolElement of reverseResult) {
              poolData[poolElement.pool] = {
                poolAddress: poolElement.pool,
                hide: hidePools.includes(poolElement.pool),
                token0: {
                  ...tokenList[poolElement.token0],
                  address: poolElement.token0,
                },
                token1: {
                  ...tokenList[poolElement.token1],
                  address: poolElement.token1,
                },
              };
            }
          } else {
         
            const ercTokens = await Promise.all(
              poolTokens.map((contract, i) => fetchToken({ address: contract }))
            );
            ercTokens.forEach(
              (token, i) =>
                (tokenList[poolTokens[i]] = { symbol: token.symbol })
            );
            const logos = await Promise.all(
              ercTokens.map((token, i) => fetchCoinLogo(token.symbol))
            );

            logos.forEach(
              (logo, i) =>
                (tokenList[poolTokens[i]] = {
                  ...tokenList[poolTokens[i]],
                  logo,
                })
            );

            const reverseResult = result.reverse();
            for (const poolElement of reverseResult) {
              poolData[poolElement.pool] = {
                poolAddress: poolElement.pool,
                hide: hidePools.includes(poolElement.pool),
                token0: {
                  ...tokenList[poolElement.token0],
                  address: poolElement.token0,
                },
                token1: {
                  ...tokenList[poolElement.token1],
                  address: poolElement.token1,
                },
              };
            }
          }

          dispatch(setPools({ poolData, tokenList }));
        })();
      } catch (error) {
        console.error(error);
        dispatch(setError(error));
      }
    }
  }, [state.contracts, chain?.id, user]);



  useEffect(() => {
    const { chain } = getNetwork();
    const networkID = user?.network?.id
    if ( data && networksWithGraph.includes(networkID)) {
     const allPositions = data?.positions
      const poolData = {};
      const tokenList = {};
    const poolsData = Array.isArray(data.pools) && data.pools

      for(const pool of poolsData){
       const li = 
       fixedToShort(pool.liquidity0) *
        Number(pool.token0.priceUSD) +
        fixedToShort(pool.liquidity1) *
        Number(pool.token1.priceUSD) 
       const openPosiions = allPositions.filter(
          (el) => el?.pool?.pool == pool.pool
        );
        const poolInfo = {
          ...pool,
          poolAddress: pool?.pool,
          hide: hidePools.includes(pool?.pool),

          totalLiquidity:
            fixedToShort(pool.liquidity0) *
            getTokenUSDPrice(pool.token0.priceUSD) +
             fixedToShort(pool.liquidity1) *
             getTokenUSDPrice(pool.token1.priceUSD) ,

          totalBorrowed:
          fixedToShort(pool.totalBorrow0) *
          getTokenUSDPrice(pool.token0.priceUSD) +
           fixedToShort(pool.totalBorrow1) *
           getTokenUSDPrice(pool.token1.priceUSD) ,

           openPosition: openPosiions.length > 0 && checkOpenPosition(openPosiions[0]),
          token0:{
            ...pool.token0,
            address: pool?.token0?.id,
            logo: getTokenLogo(pool.token0.symbol),
          },
          token1:{
            ...pool.token1,
            address: pool?.token1?.id,
            logo: getTokenLogo(pool.token1.symbol),
          }
        }
        tokenList[String(pool.token0.id).toUpperCase()] = {
          ...pool.token0,
          address: pool?.token0?.id,
          logo: getTokenLogo(pool.token0.symbol),
          pricePerToken: pool.token0.priceUSD
        };
        tokenList[String(pool.token1.id).toUpperCase()] = {
          ...pool.token1,
          address: pool?.token1?.id,
          logo: getTokenLogo(pool.token1.symbol),
          pricePerToken: pool.token1.priceUSD
        };
        poolData[pool?.pool] = poolInfo;
      
      }

      console.log("activeChain", poolData, tokenList);
      dispatch(setPools({ poolData, tokenList }));
    }
  }, [data , user]);

  return (
    <>
      <Navbar {...state} />
      <div className="app_container">
        <div className="app">
          <MainRoutes {...state} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
