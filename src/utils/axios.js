import axios from 'axios';

export const  fetchCoinGeckoTokens = async () => {
    return axios.get('https://tokens.coingecko.com/uniswap/all.json?t=1658742391')
    .then((response) => response.data)
    
}