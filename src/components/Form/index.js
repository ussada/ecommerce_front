import React from 'react';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from '@material-ui/core';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DateUtils from '@date-io/moment';
import RadioGroup from './radioGroup';
import Select from './select';
import FileInput from './fileInput';
import NumberFormat from 'react-number-format';
import CheckGroup from './checkGroup';
import AutoSuggest from './autoSuggest';
import {connect} from 'react-redux';
import {isDate, stringToDate} from '../../common/util';

const types = {
    text: TextField,
    number: NumberFormat,
    button: Button,
    date: KeyboardDatePicker,
    checkbox: Checkbox,
    fileinput: FileInput,
    // Add below components as null for use to validate component
    select: null,
    radiogroup: null,
    checkgroup: null,
    autosuggest: null
};

const getComponent = ({id, opts, defaultProps, initialValue, changeValue, title, errorText}) => {
    let defaultOpts = {
        className: 'input-field grid-cell--6',
        onChange: defaultProps.handleChange || null
    };

    let {component} = opts;
    opts = {...opts};
    opts.label = title || opts.title;
    delete opts.component;
    delete opts.title;
    // opts = {...defaultOpts, ...opts, id, key: id, name: id};
    opts = {...opts, id, key: id, name: id};

    if( !types.hasOwnProperty(component)) return `Invalid component '${component}'`;

    if (errorText !== '')
        opts.error = true;

    if (opts.hasOwnProperty('helperText') && opts.helperText !== '')
        opts.helperText = <><div>{errorText}</div> <div>{opts.helperText}</div></>
    else
        opts.helperText = errorText;

    let element = [];

    opts.value = typeof changeValue !== 'undefined' ? changeValue : undefined 
        || typeof initialValue !== 'undefined' ? initialValue : undefined
        || typeof opts.value !== 'undefined' ? opts.value : undefined
        
    if (typeof initialValue !== 'undefined')
        opts.initialValue = initialValue;

    if (opts.disable)
        opts.disabled = opts.disable();

    switch(component) {
        case 'button': {
            let {label} = opts;
            delete opts.label;
            element.push(label);

            let def = {
                type: 'button',
                variant: 'contained',
                color: 'primary',
            }

            opts = {
                ...def,
                ...opts,
                className: 'grid-cell--1'
            }
            
            break;
        }

        case 'number': {
            if (opts.hasOwnProperty('customInput')) {
                let customInput = opts.customInput;
                opts.customInput = types[customInput];
            }

            if (!opts.hasOwnProperty('onChange') && !opts.hasOwnProperty('onValueChange'))
                opts.onValueChange = ({formattedValue, value}) => defaultProps.setChangeFields(id, value);

            break;
        }

        case 'date': {
            let def = {
                format: 'DD/MM/YYYY',
                autoOk: true
            }

            if (opts.hasOwnProperty('onChange')) {
                const handleChange = opts.onChange;
                def.onChange = date => handleChange(id, date !== null ? date.startOf('day') : null);
            }

            opts = {
                ...opts,
                ...def
            }

            opts.value = typeof opts.value !== 'undefined' && opts.value !== null  ? stringToDate(opts.value, 'YYYY-MM-DD') : null;
            break;
        }

        case 'select':
        case 'radiogroup':
            opts.value = opts.value || '';
            break;

        default:
            break;
    }
    
    opts = {
        ...defaultOpts,
        ...opts
    }
    
    element.unshift(types[component], opts);
    
    switch(component) {
        case 'select':
            return <Select schema={opts} />

        case 'radiogroup':
            return <RadioGroup schema={opts} />

        case 'date':
            return (
                <MuiPickersUtilsProvider utils={DateUtils}>
                    {React.createElement(...element)}
                </MuiPickersUtilsProvider>
            )
        case 'checkbox':
            return (
                <FormControlLabel
                    control={<Checkbox {...opts} className="" />}
                    label={opts.label}
                />
            )
        
        case 'checkgroup':
            return <CheckGroup schema={opts} />

        case 'autosuggest':
            return <AutoSuggest {...opts} />

        default:
            return React.createElement(...element);
    }
}

const Form = ({lang, schema, formData, changeFields, errors = {}, defaultProps = {}}) => {

    return (
        <div className="grid">
            {
                Object.keys(schema).map((id, idx) => {
                    if (schema[id]) {
                        // If visibled is set to false, don't generate element
                        if (schema[id].hasOwnProperty('visibled') && !schema[id].visibled)
                            return;

                        let initialValue = undefined;
                        let changeValue = undefined;
                        let errorText = errors[id] || '';

                        if (formData) {
                            if (schema[id].component === 'checkgroup')
                                initialValue = formData;
                            else
                                initialValue = formData[id];
                        }

                        if (changeFields)
                            changeValue = changeFields[id];
                        
                        return (
                            getComponent({
                                id,
                                opts: schema[id],
                                initialValue,
                                changeValue,
                                errorText,
                                defaultProps,
                                title: lang && lang.data ? lang.data[id] : ''
                            })
                        )
                    }
                })
            }
        </div>
    );
}
const mapStateToProps = state => ({
    lang: state.config.lang
})

export default connect(mapStateToProps)(Form);
