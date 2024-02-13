import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import {
  fetchEthRateForAddresses,
  getFromSessionStorage,
  getTokenLogo,
} from "./utils";
import { fetchCoinLogo, fetchGraphQlData, getEthToUsd } from "./utils/axios";
import {
  checkOpenPosition,
  fixedToShort,
  getPoolCreatedGraphQuery,
  getPoolCreatedGraphQueryTestnet,
} from "./helpers/dashboard";
import { hidePools } from "./utils/constants";
import { fetchTokenLib, getPastEvents } from "./lib/fun/functions";
import {
  getEtherContract,
  getEtherContractWithProvider,
} from "./lib/fun/wagmi";
import { ethers } from "ethers";
import { fixed2Decimals, getTokenUSDPrice } from "./helpers/contracts";
import useWalletHook from "./lib/hooks/useWallet";
import { supportedNetworks } from "./core/networks/networks";

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
  const user = useSelector((state) => state.user);
  const query = getPoolCreatedGraphQuery(address);
  const testnetQuery = getPoolCreatedGraphQueryTestnet(address);
  const [tokenPrice, setTokenPrice] = useState({});

  const networksWithGraph = Object.values(supportedNetworks)
    .filter((network) => network.graphAvailable && network.chainId)
    .map((net) => net.chainId);

  const { data, loading, error, refetch } = useQuery("pools", async () => {
    const fetchedDATA = await fetchGraphQlData(
      chain?.id || 1,
      chain?.id == 80001 ? testnetQuery : query
    );
    return fetchedDATA;
  });

  document.body.className = `body ${
    getFromSessionStorage("unilendV2Theme") || "dark"
  }`;

  useEffect(() => {
    if (isConnected) {
      refetch();
    }
    createContract();
  }, [address, isConnected, data]);

  const createContract = async (withProvider = false) => {
    try {
      dispatch(setLoading(true));
      const walletconnect = JSON.parse(localStorage.getItem("wagmi.connected"));

      const { coreAddress, helperAddress, positionAddress } =
        contractAddress[chain?.id || user?.network?.id || 1442];
      const preparedData = [
        { abi: coreAbi, address: coreAddress },
        { abi: helperAbi, address: helperAddress },
        { abi: positionAbi, address: positionAddress },
      ];

      if (walletconnect && isConnected) {
        const user = await connectWallet();

        dispatch(setUser(user));
        Promise.all(
          preparedData.map((item) =>
            withProvider
              ? getEtherContractWithProvider(item.address, item.abi, chain?.id)
              : getEtherContract(item.address, item.abi, chain?.id)
          )
        )
          .then((res) => {
            const payload = {
              coreContract: res[0],
              helperContract: res[1],
              positionContract: res[2],
            };
            dispatch(setContracts(payload));
            //loadPoolsFromContract(payload);
            loadPoolsWithGraph();
          })
          .catch((err) => {
            throw err;
          });
      } else {
        loadPoolsWithGraph();
      }
    } catch (error) {
      console.log("ContractError", error);
      loadPoolsWithGraph();
      dispatch(setError(error));
    }
  };

  const loadPoolsFromContract = async (v2Contracts) => {
    const networkID = chain?.id;

    if (v2Contracts?.coreContract && !networksWithGraph.includes(networkID)) {
      try {
        const poolData = {};
        let result;

        if (networkID == 8081) {
          result = shardeumPools;
        } else {
          result = await getPastEvents(v2Contracts.coreContract, "PoolCreated");

          result = result.map((item) => item.args);
        }
        const array = [];
        const tokenList = {};
        for (const pool of result) {
          array.push(pool.token0, pool.token1);
        }
        const poolTokens = [...new Set(array)];

        //if wallet not connected
        if (isConnected) {
          const ercTokens = await Promise.all(
            poolTokens.map((contract, i) =>
              fetchTokenLib({ address: contract })
            )
          );
          ercTokens.forEach(
            (token, i) => (tokenList[poolTokens[i]] = { symbol: token.symbol })
          );
          const logos = await Promise.all(
            ercTokens.map((token, i) => fetchCoinLogo(token.symbol))
          );

          logos.forEach(
            (logo, i) =>
              (tokenList[poolTokens[i]] = {
                ...tokenList[poolTokens[i]],
                address: poolTokens[i],
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
      } catch (error) {
        if (error.code == -32603) {
          createContract(true);
        }
        dispatch(setError(error));
      }
    }
  };

  const getTokenPrice = async () => {
    const usdPrice = await getEthToUsd();
    const temp = await fetchEthRateForAddresses(data?.assetOracles, chain?.id);
    const result = {};

    for (const key in temp) {
      if (temp.hasOwnProperty(key)) {
        result[key] = (temp[key] / 10 ** 18) * usdPrice;
      }
    }
    result["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"] =
      result["0xae7ab96520de3a18e5e111b5eaab095312d7fe84"];
    setTokenPrice(result);
    return result;
  };

  useEffect(() => {
    if (data?.assetOracles) {
      getTokenPrice();
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(tokenPrice).length > 0) {
      loadPoolsWithGraph();
    }
  }, [tokenPrice]);

  const loadPoolsWithGraph = async () => {
    const networkID = chain?.id || 1;
    if (data && networksWithGraph.includes(networkID)) {
      const allPositions = data?.positions;
      const poolData = {};
      const tokenList = {};
      const poolsData = Array.isArray(data.pools) && data.pools;

      for (const pool of poolsData) {
        if (hidePools.includes(pool?.pool)) {
          continue;
        }
        // const list =
        //   fixedToShort(pool.liquidity0) * Number(pool.token0.priceUSD) +
        //   fixedToShort(pool.liquidity1) * Number(pool.token1.priceUSD);
        const openPosiions = allPositions.filter(
          (el) => el?.pool?.pool == pool.pool
        );
        const poolInfo = {
          ...pool,
          poolAddress: pool?.pool,
          hide: hidePools.includes(pool?.pool),

          totalLiquidity:
            fixed2Decimals(pool.liquidity0, pool.token0.decimals) *
              tokenPrice[pool?.token0?.id] +
            fixed2Decimals(pool.liquidity1, pool.token1.decimals) *
              tokenPrice[pool?.token1?.id] +
            (fixed2Decimals(pool.totalBorrow0, pool.token0.decimals) *
              tokenPrice[pool?.token0?.id] +
              fixed2Decimals(pool.totalBorrow1, pool.token1.decimals) *
                tokenPrice[pool?.token1?.id]),

          totalBorrowed:
            fixed2Decimals(pool.totalBorrow0, pool.token0.decimals) *
              tokenPrice[pool?.token0?.id] +
            fixed2Decimals(pool.totalBorrow1, pool.token1.decimals) *
              tokenPrice[pool?.token1?.id],

          openPosition:
            openPosiions.length > 0 && checkOpenPosition(openPosiions[0]),
          token0: {
            ...pool.token0,
            address: pool?.token0?.id,
            logo: getTokenLogo(pool.token0.symbol),
            priceUSD: tokenPrice[pool?.token0?.id] * pool.token0.decimals,
            pricePerToken: tokenPrice[pool?.token0?.id],
          },
          token1: {
            ...pool.token1,
            address: pool?.token1?.id,
            logo: getTokenLogo(pool.token1.symbol),
            priceUSD: tokenPrice[pool?.token1?.id] * pool.token1.decimals,
            pricePerToken: tokenPrice[pool?.token1?.id],
          },
        };
        tokenList[String(pool.token0.id).toUpperCase()] = {
          ...pool.token0,
          address: pool?.token0?.id,
          logo: getTokenLogo(pool.token0.symbol),
          priceUSD: tokenPrice[pool?.token0?.id] * pool.token0.decimals,
          pricePerToken: tokenPrice[pool?.token0?.id],
        };
        tokenList[String(pool.token1.id).toUpperCase()] = {
          ...pool.token1,
          address: pool?.token1?.id,
          logo: getTokenLogo(pool.token1.symbol),
          priceUSD: tokenPrice[pool?.token1?.id] * pool.token1.decimals,
          pricePerToken: tokenPrice[pool?.token1?.id],
        };
        poolData[pool?.pool] = poolInfo;
      }
      dispatch(setPools({ poolData, tokenList }));
    }
  };

  return (
    <>
      <Navbar />
      <div className='app_container'>
        <div className='app'>
          <MainRoutes />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
