import guid from 'uuid/v1';
import {getList} from '../mockup';

var initialState = {
  items: [],
  selectedItems: [],
  batchItems: [],
  changeRows: [],
  changeFields: {},
  validateFields: [],
  loading: false,
  error: null
}

const createReducer = (reducerName = '') => {
  let items = [];
  let selectedItems = [];
  let batchItems = [];
  let idx = 0;
  let obj = {};

  let initial = {};

  // Mock-up
  let initialData = ['user', 'menu', 'role', 'role_permission'];

  if (initialData.includes(reducerName))
    initial = {
      ...initialState,
      items: getList(reducerName)
    }
  else
    initial = {...initialState}
  
  return (state = initial, action) => { 
    switch (action.type) {
      case `FETCH_BEGIN_${reducerName}`:
        return {
            ...state,          
            loading: true,
            error: null
        }
        
      case `FETCH_SUCCESS_${reducerName}`:
        return {
            ...state,          
            loading: false,
            changeRows: [],
            selectedItems: action.res.data || [],
            error: action.res.error || ''
        }      

      case `FETCH_FAILURE_${reducerName}`:
        return {
            ...state,
            loading: false,
            error: action.error
        }

      case `CLEAR_DATA_${reducerName}`:
        return {
            ...initialState
        }

      case `GET_BY_ID_${reducerName}`:
        selectedItems = state.items.filter(item => item.id === action.id);
        
        return {
          ...state,
          loading: false,        
          selectedItems
        }

      case `ADD_DATA_${reducerName}`:
        return {
          ...state,
          loading: false,
          items: [...state.items, action.param]
        }

      case `DELETE_DATA_${reducerName}`:
        items = state.items.filter(item => !action.param.includes(item.id));
        return {
          ...state,
          loading: false,
          items,
          selectedItems: items
        }

      case `UPDATE_DATA_${reducerName}`:
        items = state.items;
        idx = items.findIndex(item => item.id === action.param.id);
        obj = items.find(item => item.id === action.param.id);
        items[idx] = {...obj, ...action.param};

        return {
          ...state,
          loading: false,
          items
        }

      case `GET_DATA_BATCH_${reducerName}`:
        return {
          ...state,
          loading: false,
          changeRows: [],
          batchItems: action.res.data || [],
          error: action.res.error || ''
        };

      case `ADD_DATA_BATCH_${reducerName}`:
        batchItems = state.batchItems.slice();
        
        return {
          ...state, 
          loading: false,
          batchItems: [...batchItems, action.param]
        }

      case `UPDATE_DATA_BATCH_${reducerName}`:
        batchItems = state.batchItems.slice();
        idx = batchItems.findIndex(item => item.guid === action.param.guid);
        obj = batchItems.find(item => item.guid === action.param.guid);
        batchItems[idx] = {...obj, ...action.param};

        return {
          ...state, 
          loading: false,
          batchItems
        }

      case `DELETE_DATA_BATCH_${reducerName}`:
        batchItems = state.batchItems.filter(item => !action.param.includes(item.guid))
        
        return {
          ...state,
          batchItems,
          loading: false
        }

      case `INITIAL_DATA_${reducerName}`:
        return {
          ...state,
          loading: false,
          selectedItems: [],
          batchItems: [],
          changeRows: [],
          changeFields: {}
        }

      case `SET_SELECTED_ITEMS_${reducerName}`:
        return {
          ...state,
          loading: false,
          selectedItems: action.param
        }

      case `UPDATE_SELECTED_ITEMS_${reducerName}`:
        selectedItems = state.selectedItems.slice();
        idx = selectedItems.findIndex(item => item.guid === action.param.guid);
        obj = selectedItems.find(item => item.guid === action.param.guid);
        selectedItems[idx] = {...obj, ...action.param};

        return {
          ...state, 
          loading: false,
          selectedItems
        }

      case `SET_CHANGE_ROWS_${reducerName}`:
        return {
          ...state,
          loading: false,
          changeRows: action.param
        }

      case `SET_CHANGE_FIELDS_${reducerName}`:
        return {
          ...state,
          loading: false,
          changeFields: action.param
        }

      default:
        return state;
    }
  }
}

export default createReducer;