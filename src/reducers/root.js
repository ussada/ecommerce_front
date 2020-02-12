import {combineReducers} from "redux";
import createReducer from './base';
import config from './config';

export default combineReducers({
  config,
  menu: createReducer('menu'),
  role: createReducer('role'),
  role_permission: createReducer('role_permission'),
  user: createReducer('user'),
  category: createReducer('category'),
  product: createReducer('product')
});
