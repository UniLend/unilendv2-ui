import { useEffect } from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";

import { createClient, getNetwork, configureChains, getContract, getProvider, readContract, fetchToken, watchContractEvent, waitForTransaction } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";

import { connect, fetchEnsName, switchNetwork, fetchBalance , prepareWriteContract, writeContract ,} from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'

import {
  avalanche,
  bsc,
  mainnet,
  polygonMumbai,
  sepolia,
} from "@wagmi/core/chains";
import { ethers } from "ethers";
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'

// internal imports
import {
  setTheme,
  setUser,
  setWeb3,
  setContracts,
  setLoading,
  setPools,
  setError,
} from './store/Action';
import MainRoutes from './routes';
import {
  // changeNetwork,
  connectWallet,
  defProv,
  // getProvider,
  getweb3Instance,
  MetaMaskEventHandler,
  // MetaMaskEventHandler,
} from './services/wallet';
import { coreAbi, helperAbi, positionAbi, erc20Abi } from './core/contractData/abi';
import { contractAddress } from './core/contractData/contracts';
// import { getContract } from './services/contracts';
import { getAllEvents } from "./services/events";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.scss';
import { getFromLocalStorage } from './utils';
import { fetchCoinLogo } from "./utils/axios";
import { useState } from "react";

// import ends here

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc, polygonMumbai, sepolia],
  [publicProvider(), alchemyProvider({apiKey: 'NWRaRuKnQbi8M2HMuf44rZS8Tro6FIH8'})]
);

export const MetaMaskconnector = new MetaMaskConnector({
  chains: [mainnet, polygonMumbai, sepolia],
})
// window.Buffer = window.Buffer || require("buffer").Buffer; 

const client = createClient({
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        version: 2,
    projectId: '45c3755af7419aaf09eb64929022acdd'
      },
    }),
  ],
  autoConnect: true,
  provider,
  webSocketProvider,
});



function App() {
  const dispatch = useDispatch();
  const provider = getProvider();
  const { chain, chains } = getNetwork();
  // const etherProvider = new ethers.providers.getDefaultProvider("sepolia");
  const state = useSelector((state) => state);
  const [contractAddresses, setContractAddresses] = useState(contractAddress['11155111'])
  const [data, setData] = useState([])

  document.body.className = `body ${getFromLocalStorage("unilendV2Theme")}`



  // setting contract state to store from here

  const isSame = state?.user?.address != getFromLocalStorage('user')?.address;

  useEffect(() => {

    const { coreAddress, helperAddress, positionAddress } = contractAddress[ chain.id || '80001'];

    const data = [
      { abi: coreAbi, address: coreAddress },
      { abi: helperAbi, address: helperAddress },
      { abi: positionAbi, address: positionAddress },
    ];
    setData(data)

    setContractAddresses( contractAddress[chain?.id || '80001'] )

   if(window.ethereum){
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
      window.location.href = window.location.origin
    });
    window.ethereum.on('accountsChanged', function (account) {
      window.location.reload();
    });
   }
  }, [])

  useEffect(() => {

    (async () => {
      try {

    
        // const contract = getContract({
        //   address: coreAddress,
        //   abi: coreAbi,
        //   signerOrProvider: provider
        // })

        // const poolCreatedEvent = contract.queryFilter('PoolCreated')
        // .then((res) => {
        //   console.log("PoolCreated", "result", res);
        // })
        dispatch(setLoading(true));

        const walletconnect = JSON.parse(localStorage.getItem('walletconnect'))
        if(state?.user?.isConnected || walletconnect?.connected ){
           
           const user = await connectWallet();
           dispatch(setUser(user));
        } 
        // dispatch(setWeb3(web3));
        const provider = getProvider()
        data.forEach((item) => {
          const contract = getContract({
            address: item.address,
                  abi: item.abi,
                  signerOrProvider: provider
          })
          console.log("DataContract", contract);
        })

        Promise.all(
          data.map((item) => getContract({
            address: item.address,
            abi: item.abi,
            signerOrProvider: provider
          }))
        )
          .then((res) => {
            
            const payload = {
              coreContract: res[0],
              helperContract: res[1],
              positionContract: res[2],
            };

            const result = res[0].queryFilter('PoolCreated')
            .then((data) => {

              console.log("PoolCreated", "result", data);

            })

            dispatch(setContracts(payload));
          })
          .catch((err) => {
            throw err;
          });
      } catch (error) {
        console.error(error.message);
        dispatch( setError(error));
      }
    })();
  }, [isSame, getFromLocalStorage('ethEvent'), data]);

  useEffect(() => {
    if (state.contracts.coreContract) { 
      try { 
        (async () => {
          let web3 = defProv();
          if(state.user.isConnected){
             web3 = await getweb3Instance();
          } 
          const result = await getAllEvents(
            state.contracts.coreContract,
            'PoolCreated'
            );
           
            const array =[];
            const tokenList = {}
            for (const pool of result) {
              array.push(pool.token0, pool.token1)
            }
            const poolTokens = [...new Set(array)];
            // const ERC20contracts =  await Promise.all(poolTokens.map((addr) =>  getContract({
            //   address: addr,
            //   abi: erc20Abi,
            //   signerOrProvider: provider
            // })))
            const ercTokens = await Promise.all(poolTokens.map((contract, i)=>  fetchToken({address: contract})))
            ercTokens.forEach((token, i) => tokenList[poolTokens[i]] = {symbol: token.symbol})
            console.log("PoolCreated", "Pool", tokenList);
            const logos = await Promise.all(ercTokens.map((token, i) =>  fetchCoinLogo(token.symbol)))
            
            logos.forEach((logo , i) => tokenList[poolTokens[i]] = {...tokenList[poolTokens[i]], logo})
            const poolData = {}
            const reverseResult = result.reverse()
            for (const poolElement of reverseResult) {
              poolData[poolElement.pool] = { poolAddress: poolElement.pool, token0: {...tokenList[poolElement.token0], address:poolElement.token0 }, token1:  {...tokenList[poolElement.token1], address:poolElement.token1 }}
            }

            dispatch( setPools({poolData, tokenList}))
          })();
        } catch (error) {
          console.error(error)
          dispatch( setError(error));
        }
        }
  }, [state.contracts]);

  return (
    <>
      <Navbar {...state} />
      <div  className="app_container">
        <div className="app">
          <MainRoutes {...state} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
