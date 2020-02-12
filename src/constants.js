export const REFRESH_TOKEN_THRESHOLD = 600; //(10 minutes) expressed in seconds

export const HOME_PAGE_URL = process.env.REACT_APP_HOME_PAGE_URL;
export const API_URL = HOME_PAGE_URL + 'api/';

export const isIE = /*@cc_on!@*/false || !!document.documentMode;
export const styles = {
    marginLeft_1: {
        marginLeft: isIE ? 15 : 0
    },
    marginLeft_2: {
        marginTop: '20px',
        marginLeft: isIE ? 15 : 0,
        width: 115
    }
}

export const useMockup = moduleName => {
    const moduleList = {
        auth: false,
        user: false,
        role: false,
        role_permission: false,
        menu: false,
        category: false,
        product: false
    }

    return typeof moduleList[moduleName] === 'undefined' ? true : moduleList[moduleName];
}

export const setToken = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
}

export const getToken = () => {
    let token = localStorage.getItem('token');
    
    try {
        return JSON.parse(token);
    }
    catch {
        return {};
    }
}

export const DATE_FORMAT_DB = 'YYYY-MM-DD';
export const DATE_FORMAT_DB_LIST = 'YYYYMMDD';
export const DATE_FORMAT_UI = 'DD/MM/YYYY';
export const DATE_FORMAT_CURRENT_DATE = 'MM/DD/YYYY';
export const ROWS_PER_PAGE = 10;