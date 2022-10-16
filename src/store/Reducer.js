import { SET_ISCONNECTED, SET_THEME, SET_USER, SET_WEB3 } from './ActionTypes';

const init = {
  web3: null,
  isConnected: false,
  user: {
    address: '0x',
    balance: null,
    network: null,
  },
  theme: 'light',
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
        user: payload,
      };
    }
    
    case SET_WEB3: {
      return {
        ...state,
        web3: web3,
      };
    }

    
    
    default:
      return state;
  }
};
