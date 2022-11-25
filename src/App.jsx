import { useEffect } from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import "antd/dist/antd.css";
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
  // getProvider,
  getweb3Instance,
  // MetaMaskEventHandler,
} from './services/wallet';
import { coreAbi, helperAbi, positionAbi, erc20Abi } from './core/contractData/abi';
import { contractAddress } from './core/contractData/contracts_sepolia';
import { getContract } from './services/contracts';
import { getAllEvents } from "./services/events";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.scss';
import { getFromLocalStorage } from './utils';
import { fetchCoinLogo } from "./utils/axios";

// import ends here

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const handleTheme = () => {
    dispatch(setTheme(state.theme == "dark" ? "light" : "dark"));
  };

  const { coreAddress, helperAddress, positionAddress } = contractAddress;

  const data = [
    { abi: coreAbi, address: coreAddress },
    { abi: helperAbi, address: helperAddress },
    { abi: positionAbi, address: positionAddress },
  ];

  // setting contract state to store from here

  const isSame = state?.user?.address != getFromLocalStorage('user')?.address;

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true));
        const web3 = await getweb3Instance();
        const user = await connectWallet();
        dispatch(setUser(user));
        dispatch(setWeb3(web3));
        Promise.all(
          data.map((item) => getContract(web3, item.abi, item.address))
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
        dispatch( setError(error));
      }
    })();
  }, [isSame, getFromLocalStorage('ethEvent')]);

  useEffect(() => {
    if (state.contracts.coreContract) { 
      try { 
        (async () => {
          const web3 = await getweb3Instance();
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
            const ERC20contracts =  await Promise.all(poolTokens.map((addr) => getContract(web3, erc20Abi, addr)))
            const Symbols = await Promise.all(ERC20contracts.map((contract, i)=>  contract.methods.symbol().call()))
            Symbols.forEach((symbol, i) => tokenList[poolTokens[i]] = {symbol})
            const logos = await Promise.all(Symbols.map((sym, i) =>  fetchCoinLogo(sym)))
            
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
