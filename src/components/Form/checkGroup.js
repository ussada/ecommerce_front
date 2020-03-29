import React from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Icon
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(1)
  },
  label: {
    fontSize: 12
  },
}));

const CheckboxGroup = ({schema}) => {
  const classes = useStyles();
  const {className, label, items, required, disabled, initialValue, field, itemAsRow, ...otherProps} = schema;
  
  return (
    <div className="grid-cell--12">
      <FormControl className={className} required={required} disabled={disabled} >
        <FormLabel className={classes.label} component="legend">{label}</FormLabel>
        <FormGroup >
          {
            items.map(item => {
              let checked = false;
              // if (typeof initialValue !== 'undefined') {
                if (itemAsRow)
                  checked = initialValue.some(valueItem => valueItem[field] === item.id);
                else
                  checked = initialValue[item.id];
              // }

              const {icon, ...itemProps} = item;
              
              return (
                <FormControlLabel
                  key={item.id}
                  value={item.id}
                  control={
                    <>
                      <Checkbox color="primary" {...otherProps} {...itemProps} className="" checked={checked} />
                      { icon ? <Icon style={{marginRight: '5px'}}>{icon}</Icon> : '' }
                    </>
                  }
                  label={item.name}
                />
              )
            })
          }
        </FormGroup>
      </FormControl>
    </div>
  );
}

CheckboxGroup.propTypes = {
  schema: propTypes.shape({
    id: propTypes.string,
    key: propTypes.string,
    name: propTypes.string,
    className: propTypes.string,
    label: propTypes.string,
    items: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.oneOfType(
          propTypes.string,
          propTypes.number
        ).isRequired,
        name: propTypes.string,
        icon: propTypes.string,
        order: propTypes.number,
        onChange: propTypes.func
      })
    ),
    required: propTypes.bool,
    disabled: propTypes.bool,
    initialValue: propTypes.oneOf(
      propTypes.arrayOf(propTypes.object),
      propTypes.object
    ),
    field: propTypes.string,
    itemAsRow: propTypes.bool
  })
}

export default CheckboxGroup;