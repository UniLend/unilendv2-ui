import tokensbysymbol from "../services/tokensbysymbol.json";
import tokensbyaddress from "../services/tokensbyaddress.json"
const tokensBYSymbol = {
  "ETH" : {
      "address": "",
      "symbol": "ETH",
      "logo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880"
  },
  "LINK" : {
      "address": "0xa36085F69e2889c224210F603D836748e7dC0088",
      "symbol": "LINK",
      "logo": "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png?1547034700"
  },
  "DAI" : {
      "address": "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
      "symbol": "DAI",
      "logo": "https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734"
  },
  "USDC" : {
      "address": "0x7079f3762805CFf9C979a5bDC6f5648bCFEE76C8",
      "symbol": "USDC",
      "logo": "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
  },
  "UFT" : {
      "address": "0x83Fb1c9f0774d13B1c11796137678338411240Bf",
      "symbol": "UFT",
      "logo": "https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
  },
  "OMATIC": {
      // "address": "0x99aA0f9e64bFb788201369dA3b1522E6026DCd4A",
      "address": "0x5a6B05b85d5b859988f280E32ac5e79321B15779",
      "symbol": "OMATIC",
      "logo": "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912"
  },
  "OUNI": {
      "address": "0xEBf5742313EeAcC07eC2E9B78630c26bADcE72D2",
      "symbol": "OUNI",
      "logo": "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604"
  },
  "OUSDC": {
      // "address": "0x89b1C1D707Fb7E20A6C0F65B488A8837fa488F9e",
      "address": "0x6142E3D569B3821e7A5F45b49b0F85F58370a3dD",
      "symbol": "OUSDC",
      "logo": "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
  },
  "OBNB": {
      "address": "0x5e92B7841C8803746149d86fcDd6DA6F7880a25a",
      "symbol": "OBNB",
      "logo": "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850"
  },
  "WETH": {
      "address": "0xeD43f81C17976372Fcb5786Dd214572e7dbB92c7",
      "symbol": "WETH",
      "logo": "https://assets.coingecko.com/coins/images/17238/small/aWETH_2x.png?1626940782"
  },
  "WBTC": {
      "address": "0xeD43f81C17976372Fcb5786Dd214572e7dbB92c7",
      "symbol": "WBTC",
      "logo": "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744"
  },
  "USDT":{
      "address": "0x6175a8471c2122f778445e7e07a164250a19e661",
      "symbol": "USDT",
      "logo": "https://assets.coingecko.com/coins/images/14243/small/aUSDT.78f5faae.png?1615528400"
  },
  "WBNB":{
      "address": "0x0bc8AEE2DbecfB45E1559BD7F81905156Cf64077",
      "symbol": "WBNB",
      "logo": "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png"
  },
  "BUSD":{
      "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
      "symbol": "BUSD",
      "logo": "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766"
  },
  "NED":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "BUSD",
    "logo": "https://i.imgur.com/JqKNrg3.png"
  },
  "ARG":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "ARG",
    "logo": "https://i.imgur.com/QZxMU2H.png"
  },
  "VATRENI":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "VATRENI",
    "logo": "https://i.imgur.com/dhQeXfe.png"
  },
  "BFT":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "BFT",
    "logo": "https://i.imgur.com/d9x0GkT.png"
  },
  "ENG":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "ENG",
    "logo": "https://i.imgur.com/kDsnLdo.png"
  },
  "FRA":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "BUSD",
    "logo": "https://i.imgur.com/V824oSR.png"
  },
  "MAR":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "BUSD",
    "logo": "https://i.imgur.com/0lGiSbo.png"
  },
  "POR":{
    "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
    "symbol": "BUSD",
    "logo": "https://i.imgur.com/owRvfOY.png"
  },
  "SANTA":{
    "logo": "https://i.imgur.com/70sMFN7.png"
  }, 
  "GIFT":{
    "logo":"https://i.imgur.com/tWu6HLM.png"
  },
...tokensbysymbol 
}


const tokensByAddress = {
  "ETH" : {
      "address": "",
      "symbol": "ETH",
      "logo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880"
  },
  "LINK" : {
      "address": "0xa36085F69e2889c224210F603D836748e7dC0088",
      "symbol": "LINK",
      "logo": "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png?1547034700"
  },
  "0x7AF17A48a6336F7dc1beF9D485139f7B6f4FB5C8" : {
      "address": "0x7AF17A48a6336F7dc1beF9D485139f7B6f4FB5C8",
      "symbol": "DAI",
      "logo": "https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734"
  },
  "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5" : {
      "address": "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5",
      "symbol": "USDC",
      "logo": "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
  },
  "0x66395D8E88A67e4ECA06f440cFAC7DFb03Ba95E7" : {
      "address": "0x66395D8E88A67e4ECA06f440cFAC7DFb03Ba95E7",
      "symbol": "UFT",
      "logo": "https://assets.coingecko.com/coins/images/12819/small/UniLend_Finance_logo_PNG.png?1602748658"
  },
  "0x5a6B05b85d5b859988f280E32ac5e79321B15779": {
      "address": "0x5a6B05b85d5b859988f280E32ac5e79321B15779",
      "symbol": "OMATIC",
      "logo": "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912"
  },
  "0xEBf5742313EeAcC07eC2E9B78630c26bADcE72D2": {
      "address": "0xEBf5742313EeAcC07eC2E9B78630c26bADcE72D2",
      "symbol": "OUNI",
      "logo": "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604"
  },
  "0x6142E3D569B3821e7A5F45b49b0F85F58370a3dD": {
      "address": "0x6142E3D569B3821e7A5F45b49b0F85F58370a3dD",
      "symbol": "OUSDC",
      "logo": "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"
  },
  "0x5e92B7841C8803746149d86fcDd6DA6F7880a25a": {
      "address": "0x5e92B7841C8803746149d86fcDd6DA6F7880a25a",
      "symbol": "OBNB",
      "logo": "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850"
  },
  "0x6175a8471c2122f778445e7e07a164250a19e661":{
      "address": "0x6175a8471c2122f778445e7e07a164250a19e661",
      "symbol": "USDT",
      "logo": "https://assets.coingecko.com/coins/images/14243/small/aUSDT.78f5faae.png?1615528400"
  },
  "0x536BcBE548cef2cE493932fEFCeC059Dda4d5579":{
      "address": "0x536BcBE548cef2cE493932fEFCeC059Dda4d5579",
      "symbol": "WBTC",
      "logo": "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744"
  },
  "0xeD43f81C17976372Fcb5786Dd214572e7dbB92c7":{
      "address": "0xeD43f81C17976372Fcb5786Dd214572e7dbB92c7",
      "symbol": "WETH",
      "logo": "https://assets.coingecko.com/coins/images/17238/small/aWETH_2x.png?1626940782"
  },
  "0x0bc8AEE2DbecfB45E1559BD7F81905156Cf64077":{
      "address": "0x0bc8AEE2DbecfB45E1559BD7F81905156Cf64077",
      "symbol": "WBNB",
      "logo": "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png"
  },
  "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82":{
      "address": "0x5fB282Df60a3264c06b2Cb36c74d0Fd23D727f82",
      "symbol": "BUSD",
      "logo": "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766"
  },
  ...tokensbyaddress
}

const PoolsData = [
    // {
    //   // poolAddress: '0x40d3b357d8E70bD4a3d1595FBf1AF209F28B7E3c',
    //   // 0x918fe9e1afa89620e89f9907f4c95c93801a9aa3d7f4aa07d6140cd61713e23e
    //   poolAddress: '0x9Be89Ab05f8730e873f195daF329a0C5Db2ECca4',
    //   tokens: ['USDC', 'WETH'],
    //   supply: '$12,045,000',
    //   borrowed: '$7,310,455',
    // },
    // {
    //   // poolAddress: '0xc2cb7a0D3721c8D788B01d5140CF919C2cc9B64a',
    //   poolAddress: '0xad9E05A861B70Ae2E18C4EC5a3B47B59E65B535E',
    //   tokens: ['DAI', 'WETH'],
    //   supply: '$1,683,215',
    //   borrowed: '$897,642',
    // },
    // {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0xAc961A1F91b25ffd24b0FBB43d76d4369bAa2519',
    //   tokens: ['UFT', 'WETH'],
    //   supply: '$5,302,153',
    //   borrowed: '$3,817,985',
    // },
    // {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0x445949DDbbf05D5173e9Fc09B48e3B36A2e80e7a',
    //   tokens: ['UFT', 'USDC'],
    //   supply: '$3,123,179',
    //   borrowed: '$2,577,986',
    // },
    // {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0xcC6cd2528aA214784C8AA260442606a20c9891f1',
    //   tokens: ['WBTC', 'WETH'],
    //   supply: '$6,387,157',
    //   borrowed: '$3,246,700',
    // },
    // {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0xF30A7F4ABF997050241d6a6d9A5D035770AfcfFf',
    //   tokens: ['USDC', 'DAI'],
    //   supply: '$5,173,892',
    //   borrowed: '$2,981,366',
    // },
    // {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0xB7D0A5D21DE1b1581799cE1EFD78C1D20F731512',
    //   tokens: ['WBNB', 'BUSD'],
    //   supply: '$5,173,892',
    //   borrowed: '$2,981,366',
    // },
  ];

  const poolDataByAddr = {
    // '0x9Be89Ab05f8730e873f195daF329a0C5Db2ECca4': {
    //   // poolAddress: '0x40d3b357d8E70bD4a3d1595FBf1AF209F28B7E3c',
    //   // 0x918fe9e1afa89620e89f9907f4c95c93801a9aa3d7f4aa07d6140cd61713e23e
    //   poolAddress: '0x9Be89Ab05f8730e873f195daF329a0C5Db2ECca4',
    //   tokens: ['USDC', 'WETH'],
    //   supply: '$12,045,000',
    //   borrowed: '$7,310,455',
    // },
    // '0xad9E05A861B70Ae2E18C4EC5a3B47B59E65B535E': {
    //   // poolAddress: '0xc2cb7a0D3721c8D788B01d5140CF919C2cc9B64a',
    //   poolAddress: '0xad9E05A861B70Ae2E18C4EC5a3B47B59E65B535E',
    //   tokens: ['DAI', 'WETH'],
    //   supply: '$1,683,215',
    //   borrowed: '$897,642',
    // },
    // '0xAc961A1F91b25ffd24b0FBB43d76d4369bAa2519': {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0xAc961A1F91b25ffd24b0FBB43d76d4369bAa2519',
    //   tokens: ['UFT', 'WETH'],
    //   supply: '$5,302,153',
    //   borrowed: '$3,817,985',
    // },
    // '0x445949DDbbf05D5173e9Fc09B48e3B36A2e80e7a': {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0x445949DDbbf05D5173e9Fc09B48e3B36A2e80e7a',
    //   tokens: ['UFT', 'USDC'],
    //   supply: '$3,123,179',
    //   borrowed: '$2,577,986',
    // },
    // '0xcC6cd2528aA214784C8AA260442606a20c9891f1': {
    //   // poolAddress: '0x2bC1b550428Bf951E01AdA3b909e191f84c36B6d',
    //   poolAddress: '0xcC6cd2528aA214784C8AA260442606a20c9891f1',
    //   tokens: ['WBTC', 'WETH'],
    //   supply: '$6,387,157',
    //   borrowed: '$3,246,700',
    // },
    // '0xF30A7F4ABF997050241d6a6d9A5D035770AfcfFf': {
    //   poolAddress: '0xF30A7F4ABF997050241d6a6d9A5D035770AfcfFf',
    //   tokens: ['USDC', 'DAI'],
    //   supply: '$5,173,892',
    //   borrowed: '$2,981,366',
    // },
    // '0xe5b923a28ad1c2fdA6c6c62D72EA29804C0762eE': {
    //   poolAddress: '0xe5b923a28ad1c2fdA6c6c62D72EA29804C0762eE',
    //   tokens: ['UFT', 'OMATIC'],
    //   supply: '$120,45,000',
    //   borrowed: '$45,000',
    // },
    // '0x6176Da7FB5CE111B349b53acC6f89a63d7cF9E54': {
    //   poolAddress: '0x6176Da7FB5CE111B349b53acC6f89a63d7cF9E54',
    //   tokens: ['UFT', 'OUSDC'],
    //   supply: '$120,45,000',
    //   borrowed: '$45,000',
    // },
    // '0x0ec289e06B30d0BA30239A45F03be3D5DE875235': {
    //   poolAddress: '0x0ec289e06B30d0BA30239A45F03be3D5DE875235',
    //   tokens: ['OUSDC', 'OMATIC'],
    //   supply: '$120,45,000',
    //   borrowed: '$45,000',
    // },
    // '0xB7D0A5D21DE1b1581799cE1EFD78C1D20F731512': {
    //   poolAddress: '0xB7D0A5D21DE1b1581799cE1EFD78C1D20F731512',
    //   tokens: ['WBNB', 'BUSD'],
    //   supply: '$5,173,892',
    //   borrowed: '$2,981,366',
    // },
  };

  console.log("tokensBYSymbol", tokensBYSymbol);

export {tokensBYSymbol, tokensByAddress, PoolsData, poolDataByAddr };