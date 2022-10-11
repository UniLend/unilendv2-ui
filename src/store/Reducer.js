import { SET_THEME } from "./ActionTypes";

const init= {
   web3: null,
   currentAddress: null,
   theme: 'light' 
}

export const Reducer =(state=init,{ type, payload}) => {
    switch (type) {
        case SET_THEME:{
          return{
              ...state,
              theme: payload.theme
          }
        }    
        default: return state
    }
}