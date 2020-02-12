export function setValue(param) {
    return dispatch => {    
        dispatch({
            type: `SET_CONFIG_VALUE`,
            param
        });
    };
}

export function setLang(param) {
    return dispatch => {    
        dispatch({
            type: `SET_CONFIG_LANG`,
            param
        });
    };
}