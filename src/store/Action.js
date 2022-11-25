import { SET_CONTRACTS, SET_THEME, SET_USER, SET_WEB3, SET_LOADING, SET_POOLS, SET_ERROR } from './ActionTypes';

export const setTheme = (theme) => {
  return {
    type: SET_THEME,
    payload: { theme },
  };
};

export const setLoading = (bool) => {
  return {
    type: SET_LOADING,
    payload: bool
  }
}

export const setError = (error) => {
 return {
  type: SET_ERROR,
  payload: {isError: true, error}
 }
}

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

export const setContracts = (contracts) => {
  return {
    type: SET_CONTRACTS,
    payload: contracts,
  };
};

export const setPools = (pools) => {
  return {
    type: SET_POOLS,
    payload: pools,
  };
};
