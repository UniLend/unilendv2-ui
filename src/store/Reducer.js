import { getFromLocalStorage } from '../utils';
import { SET_CONTRACTS, SET_ERROR, SET_LOADING, SET_POOLS, SET_THEME, SET_USER, SET_WEB3 } from './ActionTypes';
const user = {
  address: '0x',
  balance: null,
  network: {
    id: null,
    name: null
  },
  isConnected: false,
}

const init = {
  web3: null,
  contracts: {
    coreContract: null,
    helperContract: null,
    positionContract: null,
  },
  isLoading: false,
  isError: false,
  user: getFromLocalStorage('user') ? getFromLocalStorage('user'): user,
  theme: getFromLocalStorage('unilendV2Theme')  || 'light',
  poolList: {},
  tokenList: {},
  isLoadingPoolData: false
};

export const Reducer = (state = init, { type, payload }) => {
  switch (type) {
    case SET_THEME: {
      return {
        ...state,
        theme: payload.theme,
      };
    }
    case SET_USER: {
      return {
        ...state,
        user: payload
      };
    }
    case SET_WEB3: {
      return {
        ...state,
        web3: payload,
      };
    }
    case SET_CONTRACTS: {
      return {
        ...state,
        contracts: payload,
        isLoading: false,
        isError: false
      };
    }
    case SET_LOADING : {
      return {
        ...state,
        isLoading: payload,
        isLoadingPoolData: payload
      }
    }
    case SET_ERROR : {
      return {
        ...state,
        isLoading: false,
        isLoadingPoolData: false,
        isError: payload
      }
    }
    case SET_POOLS : {
      return {
        ...state,
        poolList: payload.poolData,
        tokenList: payload.tokenList,
        isLoadingPoolData: false
      }
    }
    default:
      return state;
  }
};
