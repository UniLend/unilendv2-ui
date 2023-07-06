import axios from 'axios';
import { getToken } from '../utils';

const API = import.meta.env.VITE_UNSTOPPABLE_API;

export const  fetchCoinGeckoTokens = async () => {
    return axios.get('https://tokens.coingecko.com/uniswap/all.json?t=1658742391')
    .then((response) => response.data)
    
}

export const fetchTokenPriceInUSD = async () => {
    return axios.get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json')
    .then((res) => res.data)
}

export const fetchCoinLogo = async (token) => {

    const tokenObj = getToken(token)
    if(tokenObj?.logo){
        return tokenObj?.logo;
    }

    return axios.get(`https://api.coingecko.com/api/v3/search?query=${token}`)
    .then((response) => {
        const logo = response.data.coins[0].large;
        return logo;
    })
    .catch(() => {
        return "https://e7.pngegg.com/pngimages/407/710/png-clipart-ethereum-cryptocurrency-bitcoin-cash-smart-contract-bitcoin-blue-angle-thumbnail.png"
    })
}

export const fetchUserDomain = async (addr) => {

    return axios.get(`https://resolve.unstoppabledomains.com/reverse/${addr}`, {
        headers: { 
          'Authorization': `Bearer ${API}`
        }
      })
    .then((response) => {
      return  response.data.meta;
    })
    .catch(() => {
        return {reverse : false};
    })
}


export const  fetchGraphQlData = async (endpoint, FILMS_QUERY) => {
    return axios({
        url: endpoint,
        method: "POST",
        data: {
          query: FILMS_QUERY
        }
      })
    .then((response) => response.data.data)
}