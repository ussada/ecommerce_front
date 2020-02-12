import {getLangList} from '../assets/lang';

const initialState = {
    user: {},
    lang: {
        current: 'en',
        list: getLangList()
    },
    auth: {}
}

export default function configReducer(state = initialState, action) {
    switch(action.type) {
        case 'SET_CONFIG_VALUE':
            return {
                ...state,
                ...action.param
            }

        case 'SET_CONFIG_LANG':
            return {
                ...state,
                lang: action.param
            }

        case 'SET_TOKEN':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: {
                        ...state.auth.token,
                        ...action.param
                    }
                }
            }

        default:
            return state;
    }
}