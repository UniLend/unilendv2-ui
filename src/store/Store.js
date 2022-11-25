
import { createStore,applyMiddleware } from "redux"
import logger from 'redux-logger'
import {Reducer } from "./Reducer"
import thunk from "redux-thunk";

const middleWare = window.location.origin === 'http://localhost:5173' ? applyMiddleware(logger, thunk): applyMiddleware(thunk)

export const store= createStore(Reducer, middleWare);