import moment from 'moment';
import {DATE_FORMAT_UI, DATE_FORMAT_CURRENT_DATE, DATE_FORMAT_DB_LIST} from '../../constants';

const limit = (val, max) => {
    if (val.length === 1 && val[0] > max[0]) {
      val = '0' + val;
    }
  
    if (val.length === 2) {
      if (Number(val) === 0) {
        val = '01';
  
      //this can happen when user paste number
    } else if (val > max) {
        val = max;
      }
    }
  
    return val;
}
  
export const cardExpiry = (val) => {
    let month = limit(val.substring(0, 2), '12');
    let year = val.substring(2, 4);
  
    return month + (year.length ? '/' + year : '');
}

export const capitalize = (string) => {
  var arr = string.split('-');
  return arr.map(value => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
}

export const getFormData = (form) => {
  let data = new FormData(form);
  let output = {};
  for(let key of data.keys()) {
      output[key] = data.get(key);
  }

  return output;
}

export const validate = (schema, changeFields, rowData) => {
  let data = {
    ...rowData,
    ...changeFields,
  }

  const hasValue = (name) => {
      return data[name] && data[name] !== '';
  }

  const invalidDigit = (name) => {
    return schema[name].hasOwnProperty('minDigit') && hasValue(name) && data[name].length < schema[name].minDigit;
  }

  const invalidExpiry = (name) => {
      let invalid = false;

      if (schema[name].hasOwnProperty('validateExpiry') && hasValue(name)) {
          let expiry = data[name].split('/');
          let expiryMonth = Number(expiry[0]);
          let expiryYear = Number(expiry[1]) + 2000;
          let currentMonth = new Date().getMonth() + 1;
          let currentYear = new Date().getFullYear();
          invalid = expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth);
      }

      return invalid;
  }

  const matchValue = (name) => {
    let invalid = false;

    if (schema[name].hasOwnProperty('matchWithField') && hasValue(name)) {
      let matchField = schema[name].matchWithField;
      invalid = data[name] !== data[matchField];
    }

    return invalid;
  }

  const invalidEmail = (name) => {
    return schema[name].hasOwnProperty('isEmail') && schema[name].isEmail && hasValue(name) && 
    !(new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g).test(data[name]));
  }

  const invalidCardId = name => {
    if (schema[name].hasOwnProperty('isCardId') && schema[name].isCardId && hasValue(name)) {
      let id = data[name];
      let sum = 0;
      let i = 0;
      
      for (i=0; i<=11; i++)
        sum += id.charAt(i) * (13-i);

      return (11 - (sum % 11)) % 10 != id.charAt(12);
    }
  }

  const invalidMinValue = (name) => {
    return schema[name].hasOwnProperty('minValue') && hasValue(name) && data[name] <= schema[name].minValue;
  }

  const invalidMinDate = (name) => {
    return schema[name].hasOwnProperty('minDate') && hasValue(name) && data[name].length && !compare2Dates(schema[name].minDate, data[name]);  
  }  
  
  let validateRequiredFields = Object.keys(schema).filter(name => schema[name].required && !hasValue(name)).map(name => ({name, validation: 'required'}));
  let validateMinDigitFields = validateRequiredFields.concat(Object.keys(schema).filter(name => invalidDigit(name)).map(name => ({name, validation: 'invalidDigit'})));
  let validateExpiryFields = validateMinDigitFields.concat(Object.keys(schema).filter(name => invalidExpiry(name)).map(name => ({name, validation: 'invalidExpiry'})));
  let validateMatchValueFields = validateExpiryFields.concat(Object.keys(schema).filter(name => matchValue(name)).map(name => ({name, validation: 'invalidMatchValue'})));
  let validateEmailFields = validateMatchValueFields.concat(Object.keys(schema).filter(name => invalidEmail(name)).map(name => ({name, validation: 'invalidEmail'})));
  let validateMinValueFields = validateEmailFields.concat(Object.keys(schema).filter(name => invalidMinValue(name)).map(name => ({name, validation: 'invalidMinValue'})));
  let validateMinDateFields = validateMinValueFields.concat(Object.keys(schema).filter(name => invalidCardId(name)).map(name => ({name, validation: 'invalidCardId'})));
  let validateFields = validateMinDateFields.concat(Object.keys(schema).filter(name => invalidMinDate(name)).map(name => ({name, validation: 'invalidMinDate'})));
  
  let validateMsg = {};

  validateFields.map(item => {
    let title = `${schema[item.name].title}`;
    let errorText = '';

    switch(item.validation) {
      case 'required':
        errorText = `"${title}" is required`;
        break;

      case 'invalidDigit':
        errorText = `"${title}" must be at least ${schema[item.name].minDigit} digit(s)`;
        break;

      case 'invalidExpiry':
        errorText = `Credit card has expired`;
        break;

      case 'invalidMatchValue':
        errorText = `"${title}" is not match with confirm value`;
        break;

      case 'invalidEmail':
        errorText = `"${title}" is not a valid email format`;
        break;

      case 'invalidCardId':
        errorText = `"${title}" is not a valid Card ID format`;
        break;

      case 'invalidDate':
        errorText = `"${title}" must be greater than ${schema[item.name].minValue}`;
        break;

      case 'invalidMinDate':
        errorText = `"${title}" must be greater than ` + dateToStringDB(schema[item.name].minDate, DATE_FORMAT_UI);
        break;

      case 'invalidMinValue':
        errorText = `"${title}" must be greater than ${schema[item.name].minValue}`;
        break;
    }

    validateMsg[item.name] = errorText;
  });
  
  return validateMsg;
}

export const getSearchCondition = (condition, params) => {
  let param = {};
  
  Object.keys(params).forEach(name => {
      // if (condition.hasOwnProperty(name)) {
        let inputCondition = params[name];

        if (inputCondition !== null) {
          let hasValue = typeof inputCondition === 'undefined' || inputCondition === '' ? false : true;
          let op = condition[name] && condition[name].hasOwnProperty('op') ? condition[name].op : '';
          let con = hasValue ? setQueryCondition(name, inputCondition, op, condition, params) : '';
          let fieldName = condition[name] && condition[name].field ? condition[name].field : name;
          let include;

          if (con !== '' && !param.hasOwnProperty(fieldName)) {
            if (condition[name] && condition[name].hasOwnProperty('sourceModule')) {
              let sourceModule = condition[name].sourceModule;
              let fk = condition[name].fk;
              let existingCon = param.include && param.include[sourceModule] && param.include[sourceModule].con ? param.include[sourceModule].con : {};
              include = {
                [sourceModule]: {
                  fk,
                  con: {
                    ...existingCon,
                    [fieldName]: con
                  }
                }
              }

              param = {
                ...param,
                include: {
                  ...param.include,
                  ...include
                }
              }
            }
            else
              param = {
                  ...param,
                  [fieldName]: con
              }
          }
        }
      // }
  })

  return param;
}

const setQueryCondition = (paramName, paramValue, op = '', condition, params) => {
  if (op !== '') {
      if (op === 'between') {
          let values = [];
          const {refField} = condition[paramName];
          
          if (refField) {
              values.push(paramValue);
              values.push(params[refField]);
          }

          return {
              value: values,
              op,
              dataType: condition[paramName].component
          }
      }
      else 
          return {
              value: paramValue, 
              op
          }        
  }
  else 
      return paramValue;
}

export const dateToString = (date) => {
  if (moment(date, moment.ISO_8601, true).isValid())
    return moment(date).format(DATE_FORMAT_UI);
  else
    return date;
}

export const dateBetween = (determineDate, startDate, endDate) => {
  return moment(determineDate).isBetween(startDate, endDate, null, '[]');
}

export const curDate = () => {
  return new Date(moment().format(DATE_FORMAT_CURRENT_DATE));
}

export const isDate = (value) => {
  const format = [
    moment.ISO_8601,
    DATE_FORMAT_UI
  ]

  return moment(value, format, true).isValid();
}

export const stringToDate = (dateString, format) => {
  return new Date(moment(dateString, format));
}

export const toNumber = value => {
  switch(typeof value) {
      case 'string':
          return Number.isNaN(Number(value)) ? value : Number(value);
      
      default :
          return value;
  }
}

export const getFileExtension = (filename) => {
  if(!filename) return '';
  return filename.split('.').pop();
}

export const currencyFormat = (x) => {
  if(isNaN(x))
    x = 0;

  return x.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const setSuggestionList = (items, name) => {
  let values = items.map(item => item[name]);

  const func = (a, b) => {
    if (!a.includes(b))
        a.push(b);
        
    return a;
  }

  return values.reduce(func, []).sort((a, b) => a - b).map(value => ({label: value}));
}

export const base64Encode = (s) => {
  return new Buffer(s).toString('base64');
}

export const base64Decode = (s) => {
  return new Buffer(s, 'base64').toString('ascii');
}

export const dateToStringDB = (date, format=DATE_FORMAT_DB_LIST) => {
  if (moment(date, moment.ISO_8601, true).isValid())
    return moment(date).format(format);
  else
    return date;
}

export const compare2Dates = (date1, date2) => {
  if(!isDate(date1) || !isDate(date2))
    return false;
  
  date1 = dateFromString(date1);
  date2 = dateFromString(date2);
  return moment(date2).isSameOrAfter(date1);
}

export const dateFromString = (strDate) => {
  if(!isDate(strDate))  return curDate();

  return new moment(strDate);
}

export const sortData = (fields, sortType = 'asc') => {
  if (fields) {
    fields = typeof fields === 'string' ? [fields] : fields;

    return (a, b) => {
      let result = 0;
      
      fields.map(name => {  
        if (a[name] < b[name]) result = -1;
        if (a[name] > b[name]) result = 1;
      })
      
      return sortType === 'asc' ? result : -result;
    }
  }

  return 0;
}