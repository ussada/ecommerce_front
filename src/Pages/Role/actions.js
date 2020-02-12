import guid from 'uuid/v1'

export const addByCheck = (e, id, checked) => {
    const {moduleName, batchItems} = e.props;
    let param = {}
    let flag = '';
    // let item = batchItems.find(item => item.permit_id === id);
    // let PermitId = id;
    // let rowId = item && item.id ? item.id : 0;
    // let rowGUID = item && item.guid ? item.guid : '';

    // if (checked) {
    //   // if (item) {
    //   //   flag = 'edit';
    //   //   param = {
    //   //     id: rowId,
    //   //     guid: rowGUID,
    //   //     PermitId,
    //   //     Status: 'A'
    //   //   };
    //   // }
    //   // else {
    //   //   flag = 'add';
    //   //   param = {guid: guid(), PermitId, Status: 'A'};
    //   // }
    //   flag = 'add';
    //   param = {
    //     permit_id: id
    //   }
    //   e.props.dispatch(e.addDataBatch(moduleName, param));
    // }
    // else {
    //   // if (item.id)
    //   //   flag = 'edit';
    //   // else
    //   //   flag = 'delete';
      
    //   // param = {
    //   //   id: rowId,
    //   //   guid: rowGUID,
    //   //   PermitId,
    //   //   Status: 'I'
    //   // }
    //   flag = 'delete';
    //   param = {
        
    //   }
    //   e.props.dispatch(e.deleteDataBatch(moduleName, [item.guid]));
    // }

    // if (flag === 'add')
    //   e.props.dispatch(e.addDataBatch(moduleName, param));
    // else if (flag === 'edit')
    //   e.props.dispatch(e.updateDataBatch(moduleName, param));
    // else if (flag === 'delete')
    //   e.props.dispatch(e.deleteDataBatch(moduleName, [item.guid]));

    if (checked) {
      flag = 'add';
      param = {guid: guid(), permit_id: id};
      e.props.dispatch(e.addDataBatch(moduleName, param));
    }
    else {
      flag = 'delete';
      let item = batchItems.find(item => item.permit_id === id);
      let guid = item ? item.guid : '';
      let rowId = item ? item.id : 0;
      param = {guid, id: rowId};
      e.props.dispatch(e.deleteDataBatch(moduleName, [guid]));
    }
    
    e.changeRows(param, flag);
}

export const saveRole = (e) => {
  let langData = e.props.lang && e.props.lang.data ? e.props.lang.data : {};
  let {detailStore} = e.props || {};
  let {role_permission} = detailStore || {}
  let selectedItems = role_permission && role_permission.batchItems ? role_permission.batchItems.length : 0;
  if(selectedItems <= 0){
    alert(langData.role_choice_permission);
    return false;
  }
  e.save();
}

export const setDisable = (row) => {
  if(typeof row !== 'undefined' && row.NumOfUser > 0)
    return true;

  return false;
}
