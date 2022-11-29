import axios from 'axios';

const API = import.meta.env.VITE_UNSTOPPABLE_API;

export const  fetchCoinGeckoTokens = async () => {
    return axios.get('https://tokens.coingecko.com/uniswap/all.json?t=1658742391')
    .then((response) => response.data)
    
}

export const fetchCoinLogo = async (token) => {
    return axios.get(`https://api.coingecko.com/api/v3/search?query=${token}`)
    .then((response) => {
        const logo = response.data.coins[0].large;
        return logo;
    })
    .catch(() => {
        return 'dataimage/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ic2MtMWZ2bmFkei0xIGhxdFlVTyIgc3R5bGU9ImNvbG9yOiByZ2IoODYsIDkwLCAxMDUpOyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSI0LjkzIiB5MT0iNC45MyIgeDI9IjE5LjA3IiB5Mj0iMTkuMDciPjwvbGluZT48L3N2Zz4='
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