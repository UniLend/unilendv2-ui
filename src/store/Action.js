import { SET_THEME } from "./ActionTypes"

export const setTheme=(theme)=>{
    return{
        type: SET_THEME,
        payload: { theme }
    }
}
