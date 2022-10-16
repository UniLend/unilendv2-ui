import { SET_ISCONNECTED, SET_THEME, SET_USER, SET_WEB3 } from './ActionTypes';

export const setTheme = (theme) => {
  return {
    type: SET_THEME,
    payload: { theme },
  };
};

export const setWeb3 = (web3) => {
  return {
    type: SET_WEB3,
    payload: web3,
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

