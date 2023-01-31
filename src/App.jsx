import { useEffect } from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
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
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";

import {
  avalanche,
  bsc,
  mainnet,
  polygonMumbai,
  sepolia,
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
import {
  connectWallet,
  defProv
} from "./services/wallet";
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
import { getFromLocalStorage } from "./utils";
import { fetchCoinLogo } from "./utils/axios";
import { useState } from "react";

// import ends here
const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc, polygonMumbai, sepolia],
  [publicProvider(), alchemyProvider({ apiKey: alchemyId })]
);

export const MetaMaskconnector = new MetaMaskConnector({
  chains: [mainnet, polygonMumbai, sepolia],
});

export const WalletConnector =  new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
    version: 2,
    projectId: projectId,
  }});

// window.Buffer = window.Buffer || require("buffer").Buffer;

const client = createClient({
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        version: 2,
        projectId: projectId,
      },
    }),
  ],
  autoConnect: true,
  provider,
  webSocketProvider,
});

function App() {
  const dispatch = useDispatch();
  const { chain, chains } = getNetwork();
  const {account} = getAccount();
  // const provider = getProvider();

  const etherProvider = new ethers.providers.getDefaultProvider("sepolia");
  const state = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [chainId, setChainId] = useState(0);
  // const [smartContracts, setSmartContracts] = useState();

  document.body.className = `body ${getFromLocalStorage("unilendV2Theme")}`;

  // setting contract state to store from here

  const isSame = state?.user?.address != getFromLocalStorage("user")?.address;
  



  useEffect(() => {
    
    const provider = getProvider()
    provider.on("chainChanged", (chainId) => {
      window.location.reload();
      window.location.href = window.location.origin;
    });
    provider.on("accountsChanged", function (account) {
      window.location.reload();
    });

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
        window.location.href = window.location.origin;
      });
      window.ethereum.on("accountsChanged", function (account) {
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true));

        const walletconnect = JSON.parse(localStorage.getItem("walletconnect"));
        const account = getAccount();
        let provider = etherProvider;
        const signer = await fetchSigner()
        if (
          state?.user?.isConnected ||
          (walletconnect?.connected && account.isConnected)
        ) {
          const user = await connectWallet();
          dispatch(setUser(user));
          provider = getProvider();
        }
        // dispatch(setWeb3(web3));
        const { chain : nextChain, chains } = getNetwork();
        const { coreAddress, helperAddress, positionAddress } =
        contractAddress[chain?.id || nextChain?.id || "11155111"];

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
    if (state.contracts.coreContract) {
      try {
        (async () => {
          const web3 = defProv();
          const poolData = {};
          const account = getAccount();
          // let provider = etherProvider;
          // if (state?.user?.isConnected && account.isConnected) {
          //   provider = getProvider();
          // }
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
  }, [state.contracts, chain?.id]);

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
