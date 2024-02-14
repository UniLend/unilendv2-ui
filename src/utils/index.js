import { getEthersProvider } from "../lib/fun/wagmi";
import { tokensBYSymbol, tokensByAddress } from "./constants";
import { ethers } from "ethers";
import { Avatar } from "antd";
import { aggregatorV3InterfaceABI } from "../core/contractData/abi";

export const fromWei = (web3, val) => {
  const result = web3.utils.fromWei(val, "ether");
  return result;
};

export function getTokenLogo(address) {
  if (tokensBYSymbol[address]) {
    return tokensBYSymbol[address]["logo"];
  } else {
    return "https://e7.pngegg.com/pngimages/407/710/png-clipart-ethereum-cryptocurrency-bitcoin-cash-smart-contract-bitcoin-blue-angle-thumbnail.png";
  }
}

export function getTokenSymbol(address) {
  if (tokensBYSymbol[address]) {
    return tokensBYSymbol[address]["symbol"];
  } else {
    return `Token`;
  }
}

export function getToken(symbol) {
  if (tokensBYSymbol[symbol]) {
    return tokensBYSymbol[symbol];
  }
  return null;
}

export function getTokenByAddress(addr) {
  if (tokensByAddress[addr]) {
    return tokensByAddress[addr];
  } else {
    const token = {
      logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ic2MtMWZ2bmFkei0xIGhxdFlVTyIgc3R5bGU9ImNvbG9yOiByZ2IoODYsIDkwLCAxMDUpOyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSI0LjkzIiB5MT0iNC45MyIgeDI9IjE5LjA3IiB5Mj0iMTkuMDciPjwvbGluZT48L3N2Zz4=",
      address: "",
      symbol: "",
    };
    return token;
  }
}

export const shortenAddress = (address) =>
  address && `${address.slice(0, 5)}....${address.slice(address.length - 4)}`;

export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const saveToSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getFromSessionStorage = (key) => {
  return JSON.parse(sessionStorage.getItem(key));
};

export const removeFromSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};
//'https://assets.coingecko.com/coins/images/12591/large/binance-coin-logo.png'
export function imgError(source) {
  source.target.src =
    "https://e7.pngegg.com/pngimages/407/710/png-clipart-ethereum-cryptocurrency-bitcoin-cash-smart-contract-bitcoin-blue-angle-thumbnail.png";
  source.onerror = null;
  return true;
}

export function fixFormatNumber(number) {
  // Convert the number to a string representation with three decimals
  const numberString = Number(number).toFixed(3);

  // Check if the string representation contains any non-zero digits after the decimal point
  const hasNonZeroDigits = /\.\d*[1-9]/.test(numberString);

  // Return the formatted number with 6 decimals if true, otherwise with 3 decimals
  return hasNonZeroDigits
    ? Number(number).toFixed(3)
    : Number(number).toFixed(6);
}

// export const fetchEthRateForAddresses = async (addresses, chainId) => {
//   const provider = getEthersProvider(chainId);
//   try {
//     const tokensObject = await Promise.all(
//       addresses?.map(async (addr) => {
//         const priceFeed = new ethers.Contract(
//           addr.source,
//           aggregatorV3InterfaceABI,
//           provider
//         );

//         try {
//           const roundData = await priceFeed.latestRoundData();
//           // return ETH price of each token
//           return {
//             [addr.id]: roundData.answer.toString(),
//           };
//         } catch (error) {
//           console.error(
//             `Error fetching round data for address ${addr}: ${error.message}`
//           );
//           return null;
//         }
//       })
//     );

//     // Use reduce to filter out null results and create the final object
//     return tokensObject.reduce(
//       (acc, obj) => (obj ? { ...acc, ...obj } : acc),
//       {}
//     );
//   } catch (error) {
//     console.error("Error fetching round data:", error.message);
//     throw error;
//   }
// }

//new fetching code 
export const fetchEthRateForAddresses = async (addresses, chainId) => {
  const balances = {};
  try {
    const ERC20Instances = addresses.map((addr) =>
      getEtherContractWithProvider(addr.source, aggregatorV3InterfaceABI, chainId)
    );

    await Promise.all(
      ERC20Instances.map(async (instance, index) => {
        try {
          const roundData = await instance.latestRoundData();
          balances[addresses[index].id] = roundData.answer.toString();
        } catch (error) {
          balances[addresses[index].id] = null;
        }
      })
    );
  } catch (error) {
    console.error("Error fetching balances:", error.message);
    throw error;
  }

  // Filter out null values
  const filteredBalances = Object.fromEntries(
    Object.entries(balances).filter(([key, value]) => value !== null)
  );
  return filteredBalances;
};

