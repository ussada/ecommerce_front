import {isDate, dateToStringDB} from '../util';

export const apiModuleList = {
    user: 'user',
    role: 'role',
    role_permission: 'role_permission',
    category: 'category',
    product: 'product',
    menu: 'permission'
}

export const responseParser = res => {
    let {success, error, ...rec} = res;
    let data = [];

    if (success) {
        Object.keys(rec).map(name => {
            if (Array.isArray(rec[name]))
                data = rec[name];
            else
                data.push(rec[name]);
        });

        return {
            data,
            success
        }
    }
    else
        return {
            data,
            success,
            error
        }
}

export const paramParser = (param, method) => {
    let result = {};
    switch(method) {
        case 'get':
            // const {con} = param;

            // if (con) {
            //     if (con.hasOwnProperty('id')) {
            //         return con.id;
            //     }
            //     else {
            //         let param = Object.keys(con).map(name => {
            //             let value;
            //             if (typeof con[name] === 'object' && con[name] !== null && con[name].hasOwnProperty('value'))
            //                 value = con[name].value;
            //             else if(isDate(con[name]))
            //                 value = dateToStringDB(con[name]);
            //             else
            //                 value = con[name];

            //             return `${name}=${value}`
            //         }).join('&');

            //         return '?' + param;
            //     }
            // }
            // else
            //     return '';
            return param;

        case 'post':
            Object.keys(param).map(name => {
                if (typeof param[name] === 'object' && param[name] !== null && param[name].hasOwnProperty('items')) {
                    let detailItems = param[name].items;
                    let items = [];

                    detailItems.map(item => {
                        const {guid, flag, ...fields} = item; // remove guid, flag
                        items.push(fields);
                    })

                    result[name] = items; // detail records
                }
                else
                    result[name] = param[name]; // master fields
            });

            return result;
        case 'update':
            const {attr, con} = param;
            Object.keys(attr).map(name => {
                if (typeof attr[name] === 'object' && attr[name] !== null && attr[name].hasOwnProperty('items')) {
                    let detailItems = attr[name].items;

                    let items = [];

                    detailItems.map(item => {
                        const {guid, ...fields} = item; // remove guid, flag
                        items.push(fields);
                    });

                    result[name] = items; // detail records
                }
                else
                    result[name] = attr[name]; // master fields
            });
            
            return {
                attr: result,
                con
            };
    }
}

export const getApiRoute = (moduleName, method, mode) => {
    let apiModule = apiModuleList[moduleName];
    
    if (typeof apiModule === 'string')
        return apiModule;
    else {
        if (typeof apiModule[method] === 'string')
            return apiModule[method];
        else
            return apiModule[method][mode];
    }
}
