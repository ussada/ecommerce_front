import {toNumber} from '../util';
import API from '../API';
import {paramParser, getApiRoute, responseParser} from '../API/parser';

export const handleRowToggle = (e, event, rows = []) => {
    let id = toNumber(event.target.id);
    let checked = event.target.checked;
    let selectedRows = [];
    
    if (checked) {
        if (id == '0')
            selectedRows = rows.map(row => row.id || row.guid);
        else
            selectedRows = [
                ...e.state.selectedRows,
                id
            ];
    }
    else {
      if (id == '0')
        selectedRows = [];
      else
        selectedRows = [
            ...e.state.selectedRows.filter(value => value !== id)
        ];
    }

    e.setState({selectedRows});
}

export const setChangeFields = (e, name, value, callback) => {
    let changeFields = e.state.changeFields ? {...e.state.changeFields} : {};
    
    changeFields = {
        ...changeFields,
        [name]: value
    };
    
    e.setState({changeFields}, callback)
}

export const handleChange = (e, event) => {
    let name = event.target.name;
    let value = event.target.value;
    e.setChangeFields(name, value);
}

export const setChangeFieldsByParam = (e, param, callback) => {
    let changeFields = e.state.changeFields ? {...e.state.changeFields} : {};    
    
    changeFields = {
        ...changeFields,
        ...param
    };
    
    e.setState({changeFields}, callback)
}

export const getListItems = (e, {moduleName, fields, valueField, labelField, itemField, param = {}}) => {
    let items = [];
    const itemModule = itemField || moduleName || '';
    
    // if (moduleName && moduleName !== '' && valueField && valueField !== '' && itemModule !== '') {
    if (moduleName && moduleName !== '' && Object.keys(fields).length > 0) {
        // let params = paramParser(param, 'get');
        let apiRoute = getApiRoute(moduleName, 'get');
        
        return API.get(`${apiRoute}/`, param).then(json => {
            const {success, data} = responseParser(json);
        
            if (success && Object.keys(data).length > 0) {
                // data.filter(item => item.hasOwnProperty(valueField) && item.hasOwnProperty(labelField))
                //     .map(item => items.push({id: item[valueField], name: item[labelField]}));
                
                data.map(item => {
                    let obj = {};
                
                    Object.keys(fields).map(name => {
                        let fieldName = fields[name];

                        if (item.hasOwnProperty(fieldName))
                            obj[name] = item[fieldName];
                    })
                    
                    if (Object.keys(obj).length > 0)
                        items.push(obj);
                })
            }

            e.setState({items: {
                ...e.state.items,
                [itemModule]: items
            }});
        });
    }
}

export const getCurrentValue = (e, field) => {
    const initialValue = e.state.initialFields ? e.state.initialFields[field] : '';
    const changeValue = e.state.changeFields ? e.state.changeFields[field] : '';
    return changeValue || initialValue;
}