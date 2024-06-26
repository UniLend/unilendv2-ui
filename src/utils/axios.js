import axios from 'axios';
import { fetchEthRateInUSD, getToken } from '../utils';
import { supportedNetworks } from '../core/networks/networks';

const API = import.meta.env.VITE_UNSTOPPABLE_API;

export const fetchCoinGeckoTokens = async () => {
  return axios
    .get('https://tokens.coingecko.com/uniswap/all.json?t=1658742391')
    .then((response) => response.data);
};

export const fetchTokenPriceInUSD = async () => {
  return axios
    .get(
      'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json',
    )
    .then((res) => res.data);
};

export const fetchCoinLogo = async (token) => {
  const tokenObj = getToken(token);
  if (tokenObj?.logo) {
    return tokenObj?.logo;
  }

  return axios
    .get(`https://api.coingecko.com/api/v3/search?query=${token}`)
    .then((response) => {
      const logo = response.data.coins[0].large;
      return logo;
    })
    .catch(() => {
      return 'https://e7.pngegg.com/pngimages/407/710/png-clipart-ethereum-cryptocurrency-bitcoin-cash-smart-contract-bitcoin-blue-angle-thumbnail.png';
    });
};

export const fetchUserDomain = async (addr) => {
  // return axios
  //   .get(`https://resolve.unstoppabledomains.com/reverse/${addr}`, {
  //     headers: {
  //       Authorization: `Bearer ${API}`,
  //     },
  //   })
  //   .then((response) => {
  //     return response.data.meta;
  //   })
  //   .catch(() => {
  //     return { reverse: false };
  //   });
  return { reverse: false };
};

export const fetchUserAddressByDomain = async (domain) => {
  // return axios
  //   .get(`https://resolve.unstoppabledomains.com/domains/${domain}`, {
  //     headers: {
  //       Authorization: `Bearer ${API}`,
  //     },
  //   })
  //   .then((response) => {
  //     return response.data.meta;
  //   })
  //   .catch(() => {
  //     return { reverse: false };
  //   });
  return { reverse: false };
};

export const fetchGraphQlData = async (chainId, FILMS_QUERY) => {
  const graphURL = {
    80001: 'https://api.thegraph.com/subgraphs/name/shubham-rathod1/my_unilend',
    // 137: 'https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon',
    137: 'https://api.studio.thegraph.com/query/78424/unilend-polygon/version/latest',
    // 137: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon-2",
    1442: 'https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-zkevm',
    // 1: 'https://api.thegraph.com/subgraphs/name/shubham-rathod1/mainnet-1',
    // 1: 'https://api.studio.thegraph.com/query/78424/mainnet-1/version/latest',
    1: 'https://gateway-arbitrum.network.thegraph.com/api/e0902970e4a444dc4b0ae6c08b7ff801/subgraphs/id/FGE3FvB4dzGN2yFgUpVCSCYDwBCn74XLSwgs7mkajAhW',
    // 42161:'https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-arbritrum',
    42161:
      'https://api.studio.thegraph.com/query/78424/unilend-arbritrum/version/latest',
  };

  const fallbackURL = {
    1: 'https://api.studio.thegraph.com/query/78424/mainnet-1/version/latest',
  };

  const fetchData = async (url) => {
    try {
      const response = await axios.post(url, { query: FILMS_QUERY });
      return response.data.data;
    } catch (error) {
      console.error(`Request to ${url} failed`, error);
      return undefined;
    }
  };

  if (!Object.keys(graphURL).includes(String(chainId))) {
    throw new Error('Invalid chainId provided');
  }

  const primaryURL = graphURL[chainId] || 1;
  const data = await fetchData(primaryURL);

  if (data === undefined) {
    const fallbackURLLink = fallbackURL[chainId] || 1;
    const fallbackData = await fetchData(fallbackURLLink);
    if (fallbackData === undefined) {
      throw new Error(
        'Failed to fetch data from both primary and fallback URLs',
      );
    }
    return fallbackData;
  }

  return data;
};

export const getEthToUsd = async (chainId) => {
  const url = 'https://api.coinbase.com/v2/exchange-rates?currency=ETH';

  try {
    const response = await axios.get(url);
    return response.data.data.rates.USD;
  } catch (error) {
    console.error(
      `Failed to retrieve USD data from coinbase: ${error.message}`,
    );
    const response = await fetchEthRateInUSD(
      supportedNetworks[chainId]?.EthUsdAddress,
      chainId,
    );
    return response;
  }
};

export const getGeoInfo = async () => {
  const url = 'ttps://ipapi.co/json/';
  try {
    const response = await axios.get('https://ipapi.co/json/');
    let data = response.data;
    const location = {
      ip: data.ip,
      countryName: data.country_name,
      countryCode: data.country_calling_code,
      city: data.city,
      timezone: data.timezone,
    };
    return location;
  } catch (error) {
    throw error;
  }
};
