import React from 'react';
import propTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Checkbox,
    FormHelperText
} from '@material-ui/core';
// import {connect} from 'react-redux';
// import {getData} from '../../actions/base';

// const useStyles = makeStyles(theme => ({
const styles = theme => ({
    root: {
        // display: 'flex',
    },
    formControl: {
        // minWidth: '200px',
        width: '100%',
        textAlign: 'start',
    },
    inputLabel: {
        font: {
            size: 10
        }
    },
    menuItem: {
        minHeight: '30px'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
});

const renderValue = (selected, classes) => {
    return (
        <div className={classes.chips}>
            {selected.sort((a, b) => a - b).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
            ))}
        </div>
    )
}

class SelectField extends React.Component {
    
    // UNSAFE_componentWillMount() {
    //     let {refModule} = this.props.schema;
    //     if (refModule && refModule.moduleName) {
    //         this.props.dispatch(getData(refModule.moduleName));
    //     }        
    // }
    
    render() {
        const {schema, classes, moduleItems} = this.props;
        const {label, required, selectedRows, className, multiple, value, error, helperText, ...otherProps} = schema;
        let items;
        let values;
        
        if (multiple && !Array.isArray(value))
            values = value.split(',');
        else
            values = value;

        if (moduleItems && moduleItems.length > 0) {
            const {refModule} = schema;
            let valueField = refModule && refModule.valueField ? refModule.valueField : 'id';
            let labelField = refModule && refModule.labelField ? refModule.labelField : 'id';
            
            items = moduleItems.map(item => ({id: item[valueField], name: item[labelField]}));
        }
        else {
            items = schema.items ? schema.items.slice() : [];
        }

        return (
            <div className={className || classes.root}>
            <FormControl className={classes.formControl} required={required} error={error}>
                <InputLabel>{label}</InputLabel>
                <Select
                    {...otherProps}
                    value={values}
                    multiple={multiple}
                    InputLabelProps={{
                        shrink: true
                    }}
                    renderValue={
                        multiple
                            ?   selected => renderValue(selected, classes)
                            :   null
                    }
                >
                    {
                        !required && items.length > 0 ? <MenuItem value="" className={classes.menuItem}></MenuItem> : undefined
                    }
                    {
                        items
                            ?   items.map(item => {
                                    let itemValue, itemLabel;

                                    if (typeof item === 'object') {
                                        itemValue = item.id;
                                        itemLabel = item.name;
                                    }
                                    else {
                                        itemValue = item;
                                        itemLabel = item;
                                    }

                                    return ( 
                                        <MenuItem key={itemValue} value={itemValue}>
                                            {multiple ? <Checkbox checked={values.includes(itemValue)}/> : undefined}
                                            {itemLabel}
                                        </MenuItem>
                                    )
                                })
                            :   undefined
                    }
                </Select>
                {
                    helperText && helperText !== ''
                        ?   <FormHelperText>{helperText}</FormHelperText>
                        :   undefined
                }
            </FormControl>
            </div>
        )
    }
}

SelectField.propTypes = {
    schema: propTypes.shape({
        id: propTypes.string,
        name: propTypes.string,
        label: propTypes.string,
        required: propTypes.bool,
        selectedRows: propTypes.array,
        className: propTypes.string,
        multiple: propTypes.bool,
        value: propTypes.oneOfType([
            propTypes.string,
            propTypes.number,
            propTypes.array
        ]),
        error: propTypes.bool,
        helperText: propTypes.string,
        items: propTypes.arrayOf(
            propTypes.shape({
                id: propTypes.oneOfType([
                    propTypes.string,
                    propTypes.number
                ]),
                name: propTypes.string
            })
        ),
        refModule: propTypes.shape({
            moduleName: propTypes.string,
            valueField: propTypes.string,
            labelField: propTypes.string,
        }),
    }),
    moduleItems: propTypes.arrayOf(propTypes.object),
    classes: propTypes.any,
}

const mapStateToProps = (state, props) => {
    let stateProps = {}
    let {refModule} = props.schema;
    
    if (refModule && refModule.moduleName) {
        let moduleName = refModule.moduleName;
                
        stateProps = {
            moduleItems: state[moduleName].selectedItems,
            loading: state[moduleName].loading,
            error: state[moduleName].error           
        };
    }    

    return stateProps;
}

// export default connect(mapStateToProps)(withStyles(styles)(SelectField));
export default withStyles(styles)(SelectField);