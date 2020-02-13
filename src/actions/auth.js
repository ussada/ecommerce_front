import {REFRESH_TOKEN_THRESHOLD} from '../constants';
import API from '../common/API';
import {base64Encode} from '../common/util';
import {useMockup, setToken} from '../constants';

export const auth = param => {
    return useMockup('auth') ? mockupAuth(param) : apiAuth(param);
}

export const mockupAuth = (param) => {
    return (dispatch, getState) => {
        const {user_id} = param;
        const user = getState()['user'].items.find(item => item.user_id === user_id && item.status === 'A');
        let res = {};

        if (user) {
            const roleDetail = getState()['role_permission'].items.filter(item => item.role_id == user.role_id).map(item => item.program_id);
            const role = getState()['role'].items.find(item => item.id == user.role_id);
            const menu = getState()['menu'].items.slice();
            const permission = menu.filter(item => roleDetail.includes(item.id)).map(item => ({
                id: item.id,
                key: item.program_key,
                to: item.program_target_url,
                label: item.program_name,
                module: item.program_module,
                type: item.program_type,
                order: item.program_order,
                icon: item.program_icon
            }));

            const expiresAt = (new Date().getTime() + (REFRESH_TOKEN_THRESHOLD * 1000));

            res = {
                auth: {
                    success: true,
                    token: {
                        refreshToken: '1234567890',
                        access_token: 'token_' + expiresAt,
                        tokenType: 'Bearer',
                        expiresAt
                    }
                },
                user: {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    user_level: user.user_level || 'S',
                    role_id: user.role_id,
                    role_name: role.role_name
                },
                permission
            }

            let token = {
                refreshToken: '1234567890',
                access_token: 'token_' + expiresAt,
                tokenType: 'Bearer',
                expiresAt
            }

            setToken(token);
        }
        else {
            res = {
                auth: {
                    success: false,
                    msg: 'Invalid User ID or Password',
                },
                user: {},
            }
        }

        // Pass value to Config reducer
        dispatch({
          type: `SET_CONFIG_VALUE`,
          param: res
        })
    }
}

// Work with API
export const apiAuth = (param) => {
    return dispatch => {
        let params = param;
        
        let res = {};
        API.post(`auth/login`, params).then(json => {
            const {success, data} = json;
            const {user, token} = data || {};
            
            if (success && user && token) {
                const expireAt = (new Date().getTime() + (token.expiresIn * 1000));
                setToken({...token, expireAt});
                let param = {
                    con: {
                        id: user.role_id
                    },
                    include: {
                        role_permission: []
                    }
                }

                API.get(`role/`, param).then(json => {
                    const {success, data} = json;
                    const role = data[0];
                    
                    if(success && role && role.role_permission){
                        const permission = [];
                        role.role_permission.map(item => {
                            permission.push(item.permit_id);
                        });

                        res = {
                            auth: {
                                success: true,                                    
                            },
                            user: {
                                ...user,
                                role_name: role.role_name
                            },
                            permission
                        }

                        dispatch({
                            type: `SET_CONFIG_VALUE`,
                            param: res
                        });
                    }
                });
            }
            else {
                res = {
                    auth: {
                        success: false,
                        msg: 'Invalid Email ID or Password',
                    },
                    user: {},
                }

                dispatch({
                    type: `SET_CONFIG_VALUE`,
                    param: res
                });
            }

        })
        .catch(err => {
            res = {
                auth: {
                    success: false,
                    msg: err,
                },
                user: {}
            }
            
            dispatch({
                type: `SET_CONFIG_VALUE`,
                param: res
            });
        });
    }
}

export const revokeAuth = user_id => {
    return dispatch => {
        if (user_id) {
            API.post('auth/logout', {user_id}).then(json => {
                const {success, data, error} = json;
                let res ={};

                if (success) {
                    res = {
                        auth: {
                            success: false,
                            msg: data,
                        },
                        user: {},
                    }
                }

                setToken('');
                dispatch({
                    type: `SET_CONFIG_VALUE`,
                    param: res
                });
            });
        }
    }
}