import {REFRESH_TOKEN_THRESHOLD} from '../constants';
import API from '../common/API';
import {useMockup, setToken, getToken} from '../constants';

export default function requestMiddleware() {
    return ({dispatch, getState}) => next => (action) => {
        if (typeof action === 'function') {
            const {user} = getState().config;
            const token = getToken();;
            const currentTime = (new Date().getTime());
            
            if (user && user.id && token && token.refreshToken && currentTime > token.expireAt) {
                let actionPromise = Promise.resolve();
                let param = {
                    refreshToken: token.refreshToken,
                    userId: user.id
                }

                if (useMockup('auth')) {
                    // Mockup
                    const res = {
                        refresh_token: token.refresh_token,
                        access_token: 'token_'+currentTime,
                        expire_at: currentTime + (REFRESH_TOKEN_THRESHOLD * 1000)
                    }

                    let refreshToken = () => {
                        next({
                            type: 'SET_TOKEN',
                            param: res
                        });
                    
                        return new Promise(resolve => {
                            resolve()
                        })
                    }

                    actionPromise = refreshToken().then(() => next(action));
                }
                else {
                    let param = {
                        user_id: user.id,
                        refresh_token: token.refreshToken
                    }
                    actionPromise = API.post('auth/refresh', param).then(json => {
                        const {success, data} = json;
                        
                        if (success) {
                            const expireAt = (new Date().getTime() + (data.expiresIn * 1000));
                            setToken({...data, refreshToken: token.refreshToken, expireAt});
                            return next(action);
                        }
                        else {
                            setToken('');
                            return next({
                                type: 'SET_CONFIG_VALUE',
                                param: {
                                    auth: {
                                        success: false,
                                        msg: 'Session timeout',
                                    },
                                    user: {},
                                }
                            })
                        }
                    }).then(() => next(action));
                }

                return actionPromise;
            }
            else
                return next(action);
        }
        else
            return next(action);
    };
}