import axios from 'axios';

export const  fetchCoinGeckoTokens = async () => {
    return axios.get('https://tokens.coingecko.com/uniswap/all.json?t=1658742391')
    .then((response) => response.data)
    
}

export const fetchCoinLogo = async (token) => {
    return axios.get(`https://api.coingecko.com/api/v3/search?query=${token}`)
    .then((response) => {
    response.data
    })
}