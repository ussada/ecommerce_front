import {createStore, applyMiddleware} from 'redux'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../reducers/root'
import thunk from 'redux-thunk';
import {requestMiddleware} from '../middleware';

const persistConfig = {
  key: 'ecommerce',
  storage,
  /*whitelist: [
      'user'
  ],
  blacklist: []*/
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(requestMiddleware(), thunk));
  let persistor = persistStore(store);
  return { store, persistor }
}