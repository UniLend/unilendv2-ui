import axios from 'axios';
import fs from 'fs';
export const getTokenData = () => {
  axios('https://tokens.coingecko.com/uniswap/all.json?t=1658742391').then(
    (res) => {
      const json = JSON.stringify(res.data.tokens);

      const tokendata = res.data.tokens;
      const byAddr = {};
      const bySymbol = {};
      for (const token of tokendata) {
        const url = token.logoURI;
        const newURL = url?.replace('thumb', 'large');
        token.logo = newURL;
        byAddr[token.address] = token;
        bySymbol[token.symbol] = token;
      }
      fs.writeFileSync('tokensbyaddress.json', JSON.stringify(byAddr));
      fs.writeFileSync('tokensbysymbol.json', JSON.stringify(bySymbol));
    },
  );
};
