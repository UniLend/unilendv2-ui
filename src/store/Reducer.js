import { SET_THEME } from "./ActionTypes";

const init= {
   web3: null,
   isConnected: false,
   user:{
    address: '0x',
    balance: null,
    network: null
   } ,
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