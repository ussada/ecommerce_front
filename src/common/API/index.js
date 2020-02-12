import {API_URL, getToken} from '../../constants';
import {base64Encode} from '../util';

const getAccessToken = () => {
    const token = getToken();
    
    if (token && token !== '') {
        const {accessToken} = token;
        
        if (accessToken)
            return accessToken;
        else
            return '';
    }
    else    
        return '';
}

const apiCall = ( method, uri, param ) => {
    let url = API_URL + uri;
    let _param = param ? JSON.stringify(param) : '';
    url += method === 'GET' ? base64Encode(_param) : '';
    // url += method === 'GET' ? _param : '';
    delete _param.confirm_password;
    const token = getAccessToken();
    const fetchOption = {
        method: method,
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        })
    }

    if (method !== 'GET') fetchOption['body'] = _param;

    return fetch( url, fetchOption)
        .then( res => {       
            return res.json();
        })
        .catch( err => {
            if( err.status === 'error' ) {
                throw err;
            }
            
            let error = '';

            if (typeof err === 'string')
                error = err;
            else if(typeof err === 'object')
                error = err.error || '';

            return {
                success: false,
                error
            }
        });
}

const API = {
    get: (uri, param) => apiCall('GET', uri, param),
    post: (uri, param) => apiCall('POST', uri, param),
    put: (uri, param) => apiCall('PUT', uri, param),
    delete: (uri, param) => apiCall('DELETE', uri, param)
}

export default API;