import API from '../common/API';
import {dateBetween} from '../common/util';
import guid from 'uuid/v1';
import {responseParser, paramParser, getApiRoute} from '../common/API/parser';
import {useMockup, getToken} from '../constants';

export const getData = (moduleName, param, mode = 'list') => {
  let mockup = useMockup(moduleName);
  return mockup ? mockupGetData(moduleName, param) : apiGetData(moduleName, param, mode);
}

export const addData = (moduleName, param, callback, mode = 'add') => {
  let mockup = useMockup(moduleName);
  return mockup ? mockupAddData(moduleName, param, callback) : apiAddData(moduleName, param, callback, mode);
}

export const updateData = (moduleName, param, callback, mode = 'edit') => {
  let mockup = useMockup(moduleName);
  return mockup ? mockupUpdateData(moduleName, param) : apiUpdateData(moduleName, param, callback, mode);
}

export const deleteData = (moduleName, param, mode = 'delete') => {
  let mockup = useMockup(moduleName);
  return mockup ? mockupDeleteData(moduleName, param) : apiDeleteData(moduleName, param, mode);
}

export const getDataBatch = (moduleName, param) => {
  let mockup = useMockup(moduleName);
  return mockup ? mockupGetDataBatch(moduleName, param) : apiGetDataBatch(moduleName, param);
}

// Work with API
function apiGetData(moduleName, param = {}, mode) {
  return dispatch => {
    let apiRoute = getApiRoute(moduleName, 'get', mode);
    dispatch(fetchBegin(moduleName));
    console.log(param)
    API.get(`${apiRoute}/`, param).then(json => {
      dispatch({
        type: `FETCH_SUCCESS_${moduleName}`,
        res: responseParser(json, moduleName)
      })
    })
    .catch(err => dispatch(fetchFailure(moduleName, err)));
  };
}

function apiAddData(moduleName, param, callback, mode) {
  return dispatch => {
    let params = paramParser(param, 'post');
    let apiRoute = getApiRoute(moduleName, 'post', mode);
    
    dispatch(fetchBegin(moduleName));
    API.post(`${apiRoute}`, params).then(json => {      
      if (callback) {
        callback(json);
      }

      dispatch({
        type: `ADD_DATA_${moduleName}`,
        param: []
      });
    })
    .catch(err => dispatch(fetchFailure(moduleName, err)));
  };
}

function apiUpdateData(moduleName, param, callback, mode) {
  return dispatch => {
    const {id, ...data} = param;
    let params = paramParser({attr: data, con: {id}}, 'update', mode);
    let apiRoute = getApiRoute(moduleName, 'update');
    
    dispatch(fetchBegin(moduleName));
    API.put(`${apiRoute}`, params).then(json => {      
      if (callback) {
        callback(json);
      }

      dispatch({
        type: `UPDATE_DATA_${moduleName}`,
        param
      });
    })
    .catch(err => dispatch(fetchFailure(moduleName, err)));
  };
}

function apiDeleteData(moduleName, param, mode) {
  let con = {
    id: param
  }
  
  return dispatch => {
    let apiRoute = getApiRoute(moduleName, 'delete', mode);
    
    dispatch(fetchBegin(moduleName));
    API.delete(`${apiRoute}/`, {con}).then(json => {
      dispatch({
        type: `DELETE_DATA_${moduleName}`,
        param
      });
    })
    .catch(err => dispatch(fetchFailure(moduleName, err)));
  };
}

export function apiGetDataBatch(moduleName, param) {
  return (dispatch, getState) => {
    // let params = paramParser(param, 'get');
    let apiRoute = getApiRoute(moduleName, 'get');
    dispatch(fetchBegin(moduleName));
    // API.get(`${apiRoute}/${params}`, '').then(json => {
    API.get(`${apiRoute}/`, param).then(json => {
      let res = responseParser(json, moduleName)
      res = {
        ...res,
        data: res.data.map(item => ({
          guid: guid(),
          ...item
        }))
      }

      dispatch({
        type: `GET_DATA_BATCH_${moduleName}`,
        res
      });
    })
    .catch(err => dispatch(fetchFailure(moduleName, err)));
  };
}

// Mock-up
export function mockupGetData(moduleName, params = {}) {
  return (dispatch, getState) => {
    let selectedItems = getState()[moduleName].items.slice();
    const {con, include} = params;
    // let param = typeof params.con !== 'undefined' && params.con !== null ? params.con : {};
    let param = con && con !== null ? con : {};

    const filterItem = (param, items) => {
      Object.keys(param).map(name => {
        if (typeof param[name] === 'object' && param[name] !== null) {
          if (param[name].hasOwnProperty('op')) {
            const {op, dataType} = param[name];
  
            if (op) {
              if (op === 'like')
                items = items.filter(item => item[name].includes(param[name].value));
              else if (op === 'between' && dataType && dataType === 'date') {
                items = items.filter(item => dateBetween(item[name], param[name].value[0], param[name].value[1]));
              }
              else if (op === 'not_in')
                items = items.filter(item => !param[name].value.includes(item[name]));
            }
          }
          else
            items = items.filter(item => item[name] == param[name].value);
        }
        else
          items = items.filter(item => item[name] == param[name]);
      });

      return items;
    }

    selectedItems = filterItem(param, selectedItems);
    
    if (include) {
      Object.keys(include).map(sourceModule => {
        let moduleStore = getState()[sourceModule];
        let items = moduleStore ? moduleStore.items.slice() : [];
        let fk = include[sourceModule].fk || '';
        param = include[sourceModule].con || {};
        items = filterItem(param, items);
        selectedItems = selectedItems.filter(item => items.map(detailItem => detailItem[fk]).includes(item.id));
      })
    }

    // Set result format same as response from API
    let res = {
      data: selectedItems
    }

    dispatch({
      type: `FETCH_SUCCESS_${moduleName}`,
      res
    })
  };
}

export function clearData(moduleName) {
  return dispatch => {
    dispatch({
      type: `CLEAR_DATA_${moduleName}`
    })
  }
}

export function mockupAddData(moduleName, param, callback) {
  return (dispatch, getState) => {
    let id = getState()[moduleName].items.map(item => item.id);
    let nextId = id.length > 0 ? Math.max(...id) + 1 : 1;
    let masterItem = {};
    
    // Add detail record
    Object.keys(param).map(name => {
      if (typeof param[name] === 'object' && param[name] !== null && param[name].hasOwnProperty('items')) {
        let fk = param[name].fk;
        let detailItems = param[name].items;
        
        detailItems.map(item => {
          delete item.guid;
          delete item.flag;
          dispatch(addData(name, {[fk]: nextId, ...item}));
        });
      }
      else
        masterItem[name] = param[name];
    });

    let item = {
      id: nextId,
      ...masterItem
    };
    
    dispatch({
      type: `ADD_DATA_${moduleName}`,
      param: item
    });

    if (callback)
      callback(nextId);
  }
}

export function mockupUpdateData(moduleName, param) {
  return dispatch => {
    let masterItem = {};
    let masterId = param.id;
    
    // Add/Update/Delete detail record
    Object.keys(param).map(name => {
      if (typeof param[name] === 'object' && param[name] !== null && param[name].hasOwnProperty('items')) {
        let fk = param[name].fk;
        let detailItems = param[name].items;
        
        detailItems.map(item => {
          switch(item.flag) {
            case 'add':
              let addItem = {[fk]: masterId, ...item};
              delete addItem.guid;
              delete addItem.flag;
              dispatch(addData(name, addItem));
              break;

            case 'edit':
              let updateItem = item;
              delete updateItem.guid;
              delete updateItem.flag;
              dispatch({
                type: `UPDATE_DATA_${name}`,
                param: updateItem
              });
              break;

            case 'delete':
              dispatch({
                type: `DELETE_DATA_${name}`,
                param: [item.id]
              });
              break;
          }
        });
      }
      else
        masterItem[name] = param[name];
    });

    dispatch({
      type: `UPDATE_DATA_${moduleName}`,
      param: masterItem
    });
  }
}

export function mockupDeleteData(moduleName, param) {
  return dispatch => {
    dispatch({
      type: `DELETE_DATA_${moduleName}`,
      param
    });
  }
}

export function mockupGetDataBatch(moduleName, param) {
  return (dispatch, getState) => {
    let batchItems = getState()[moduleName].items.slice();
    const {con} = param || {};
        
    Object.keys(con).map(name => {
      batchItems = batchItems.filter(item => item[name] == con[name])
    });

    // Set result format same as response from API
    let res = {
      data: batchItems.map(item => ({guid: guid(), ...item}))
    }

    dispatch({
      type: `GET_DATA_BATCH_${moduleName}`,
      res
    });
  };
}

export function addDataBatch(moduleName, param) {
  return dispatch => {
    dispatch({
      type: `ADD_DATA_BATCH_${moduleName}`,
      param
    });
  }
}

export function updateDataBatch(moduleName, param) {
  return dispatch => {
    dispatch({
      type: `UPDATE_DATA_BATCH_${moduleName}`,
      param
    });
  }
}

export function deleteDataBatch(moduleName, param) {
  return dispatch => {
    dispatch({
      type: `DELETE_DATA_BATCH_${moduleName}`,
      param
    });
  }
}

export function setInitialData(moduleName) {
  return dispatch => {
    fetchBegin();
    dispatch({
      type: `INITIAL_DATA_${moduleName}`
    })
  }
}

export function setSelectedItems(moduleName, param) {
  return dispatch => {
    fetchBegin();
    dispatch({
      type: `SET_SELECTED_ITEMS_${moduleName}`,
      param
    })
  }
}

export function updateSelectedItems(moduleName, param) {
  return dispatch => {
    dispatch({
      type: `UPDATE_SELECTED_ITEMS_${moduleName}`,
      param
    });
  }
}

export function setChangeRows(moduleName, param) {
  return (dispatch, getState) => {
    let nextState = getState()[moduleName].changeRows.slice();
    
    param.map(paramItem => {
      switch (paramItem.flag) {
        case 'add':
          nextState.push(paramItem);
          break;
        
        case 'edit':
          if (nextState.some(item => item.guid === paramItem.guid)) {
              let idx = nextState.findIndex(item => item.guid === paramItem.guid);
              let obj = nextState.find(item => item.guid === paramItem.guid);
              nextState[idx] = {...obj, ...paramItem};
          }
          else
              nextState.push(paramItem);
          
          break;

        case 'delete':
          if (nextState.some(item => item.guid === paramItem.guid)) {
              let obj = nextState.find(item => item.guid === paramItem.guid);
              nextState = nextState.filter(item => item.guid !== paramItem.guid);
              
              if (obj.flag === 'edit')
                  nextState.push(paramItem);
          }
          else
              nextState.push(paramItem);

          break;
      }
    });

    dispatch({
      type: `SET_CHANGE_ROWS_${moduleName}`,
      param: nextState
    })
  }
}

export function setChangeFields(moduleName, param) {
  return dispatch => {
    dispatch({
      type: `SET_CHANGE_FIELDS_${moduleName}`,
      param
    })
  }
}

const fetchBegin = (moduleName) => ({
  type: `FETCH_BEGIN_${moduleName}`
});

const fetchSuccess = (moduleName, items) => ({
  type: `FETCH_SUCCESS_${moduleName}`,
  items
});

const fetchFailure = (moduleName, error) => ({
  type: `FETCH_FAILURE_${moduleName}`,
  error
});
