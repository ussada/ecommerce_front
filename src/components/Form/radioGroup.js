import React from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(1)
  },
  label: {
    fontSize: 12
  },
}));

const RadioButtonGroup = ({schema}) => {
  const classes = useStyles();
  const {className, style, label, items = [], required, ...otherProps} = schema;  
  
  return (
    <div className={className} style={style}>
      <FormControl className={classes.formControl} required={required} >
        <FormLabel className={classes.label}>{label}</FormLabel>
        <RadioGroup
          {...otherProps}
          row          
        >
          {
            items.map(item => (
              <FormControlLabel
                key={item.id}
                value={item.id}
                control={<Radio color="primary" />}
                label={item.name}
                disabled={otherProps.disabled || item.disabled}
              />
            ))
          }
        </RadioGroup>
      </FormControl>
    </div>
  );
}

RadioButtonGroup.propTypes = {
  schema: propTypes.shape({
    className: propTypes.string,
    style: propTypes.any,
    label: propTypes.string,
    items: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.oneOfType([
          propTypes.string,
          propTypes.number
        ]),
        name: propTypes.string
      })
    ),
    required: propTypes.bool
  })
}

export default RadioButtonGroup;