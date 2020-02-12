import th from './th.json';
import en from './en.json';

const langData = {
    th,
    en
}

export const getLang = (lang) => {
    return langData[lang] || {};
}

export const getLangList = () => {
    return Object.keys(langData);
}