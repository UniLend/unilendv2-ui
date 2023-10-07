import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useQuery } from "@apollo/client";
import { useQuery } from "react-query";
import "antd/dist/antd.css";
import { Buffer } from "buffer";
import {
  setUser,
  setContracts,
  setLoading,
  setPools,
  setError,
} from "./store/Action";
import MainRoutes from "./routes";
import { connectWallet } from "./services/wallet";
import {
  coreAbi,
  helperAbi,
  positionAbi,
  erc20Abi,
} from "./core/contractData/abi";
import { contractAddress } from "./core/contractData/contracts";
// import { getContract } from './services/contracts';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.scss";
import { getFromLocalStorage, getTokenLogo } from "./utils";
import { fetchCoinLogo, fetchGraphQlData } from "./utils/axios";
import {
  checkOpenPosition,
  fixedToShort,
  getPoolCreatedGraphQuery,
} from "./helpers/dashboard";
import { hidePools } from "./utils/constants";
import { fetchTokenLib, getPastEvents } from "./lib/fun/functions";
import {
  getEtherContract,
  getEtherContractWithProvider,
} from "./lib/fun/wagmi";
import { ethers } from "ethers";
import { getTokenUSDPrice } from "./helpers/contracts";
import useWalletHook from "./lib/hooks/useWallet";

const shardeumPools = [
  {
    pool: "0x665ACEc556dC92C2E504beFA061d5f65Cd9493e2",
    token1: "0x12685283Aba3e6db74a8A4C493fA61fae2c66Bf1",
    token0: "0x11f13ad374e79b466a36eb835747e431fbbe3890",
  },
  // {
  //   pool: '0x7BFeca0694616c19ef4DA11DC931b692b38aFf19',
  //   token1: '0xd146878affF8c8dd3e9EBd9177F2AE4f6d4e5979',
  //   token0:'0x12685283Aba3e6db74a8A4C493fA61fae2c66Bf1'
  // }
];
//"@wagmi/core": "^0.9.7",
window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;

function App() {
  const dispatch = useDispatch();
  const { address, isConnected, chain } = useWalletHook();
  const contracts = useSelector((state) => state.contracts);
  const user = useSelector((state) => state.user);
  const query = getPoolCreatedGraphQuery(address);
  const networksWithGraph = [80001, 137];

  const { data, loading, error, refetch } = useQuery("pools", async () => {
    const fetchedDATA = await fetchGraphQlData(chain?.id || 137, query);
    return fetchedDATA;
  });

  document.body.className = `body ${getFromLocalStorage("unilendV2Theme")}`;

  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [isConnected]);

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true));
        const walletconnect = JSON.parse(
          localStorage.getItem("wagmi.connected")
        );

        const { coreAddress, helperAddress, positionAddress } = contractAddress[chain?.id || user?.network?.id || 1442]
        console.log('contractAddres',coreAddress, helperAddress, positionAddress);
        const preparedData = [
          { abi: coreAbi, address: coreAddress },
          { abi: helperAbi, address: helperAddress },
          { abi: positionAbi, address: positionAddress },
        ];

        if (walletconnect && isConnected) {
          const user = await connectWallet();
          dispatch(setUser(user));
          Promise.all(
            preparedData.map((item) => getEtherContract(item.address, item.abi))
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
               console.log("ContractError", err);
              // throw err;
            });
        } else {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://rpc.public.zkevm-test.net"
          );
          Promise.all(
            preparedData.map((item) =>
              getEtherContractWithProvider(item.address, item.abi, provider)
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
        }
      } catch (error) {
        console.log("ContractError", error);
        dispatch(setError(error));
      }
    })();
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [isConnected]);

  // for getting the pools and tokens datafor non graph networks
  useEffect(() => {
    const networkID = chain?.id;
    if (contracts.coreContract && !networksWithGraph.includes(networkID)) {
      try {
        (async () => {
          const poolData = {};
          let result;

          if (networkID == 8081) {
            result = shardeumPools;
          } else {
            result = await getPastEvents(contracts.coreContract, "PoolCreated");
            result = result.map((item) => item.args);
          }

          const array = [];
          const tokenList = {};
          for (const pool of result) {
            array.push(pool.token0, pool.token1);
          }
          const poolTokens = [...new Set(array)];

          //if wallet not connected
          if (!isConnected) {
            const provider = new ethers.providers.JsonRpcProvider(
              "https://rpc.public.zkevm-test.net"
            );
            const ERC20contracts = await Promise.all(
              poolTokens.map(
                (addr) => new ethers.Contract(addr, erc20Abi, provider)
              )
            );

            const Symbols = await Promise.all(
              ERC20contracts.map((contract, i) => contract.symbol())
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
              if (hidePools.includes(poolElement.pool)) {
                continue;
              }
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
              poolTokens.map((contract, i) =>
                fetchTokenLib({ address: contract })
              )
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
              if (hidePools.includes(poolElement.pool)) {
                continue;
              }
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
        dispatch(setError(error));
      }
    }
  }, [contracts]);

  useEffect(() => {
    const networkID = chain?.id;
    if (data && networksWithGraph.includes(networkID) && contracts.coreContract ) {
      const allPositions = data?.positions;
      const poolData = {};
      const tokenList = {};
      const poolsData = Array.isArray(data.pools) && data.pools;

      for (const pool of poolsData) {
        if (hidePools.includes(pool?.pool)) {
          continue;
        }
        const li =
          fixedToShort(pool.liquidity0) * Number(pool.token0.priceUSD) +
          fixedToShort(pool.liquidity1) * Number(pool.token1.priceUSD);
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
              getTokenUSDPrice(pool.token1.priceUSD),

          totalBorrowed:
            fixedToShort(pool.totalBorrow0) *
              getTokenUSDPrice(pool.token0.priceUSD) +
            fixedToShort(pool.totalBorrow1) *
              getTokenUSDPrice(pool.token1.priceUSD),

          openPosition:
            openPosiions.length > 0 && checkOpenPosition(openPosiions[0]),
          token0: {
            ...pool.token0,
            address: pool?.token0?.id,
            logo: getTokenLogo(pool.token0.symbol),
          },
          token1: {
            ...pool.token1,
            address: pool?.token1?.id,
            logo: getTokenLogo(pool.token1.symbol),
          },
        };
        tokenList[String(pool.token0.id).toUpperCase()] = {
          ...pool.token0,
          address: pool?.token0?.id,
          logo: getTokenLogo(pool.token0.symbol),
          pricePerToken: pool.token0.priceUSD/100000000,
        };
        tokenList[String(pool.token1.id).toUpperCase()] = {
          ...pool.token1,
          address: pool?.token1?.id,
          logo: getTokenLogo(pool.token1.symbol),
          pricePerToken: pool.token1.priceUSD/100000000,
        };
        poolData[pool?.pool] = poolInfo;
      }
      dispatch(setPools({ poolData, tokenList }));
    }
  }, [data, contracts]);

  return (
    <>
      <Navbar />
      <div className="app_container">
        <div className="app">
          <MainRoutes />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
