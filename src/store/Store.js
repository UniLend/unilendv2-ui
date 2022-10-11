
import { createStore,applyMiddleware } from "redux"
import logger from 'redux-logger'
import {Reducer } from "./Reducer"
import thunk from "redux-thunk";


export const store= createStore(Reducer, applyMiddleware(logger, thunk));