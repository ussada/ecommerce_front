import React from 'react';
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
    <div className={className}>
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

export default CheckboxGroup;