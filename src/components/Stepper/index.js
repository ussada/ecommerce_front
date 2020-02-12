import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  step: {
      color: 'orange'
  }
}));

const SimpleStepper = ({schema}) => {
    const classes = useStyles();
    const {stepList, activeStep} = schema;

    return (
        // <div className={classes.root}>
        <div>
            <Stepper activeStep={activeStep} alternativeLabel >
            {stepList.map((label, idx) => (
                <Step key={idx}>
                    <StepLabel />
                </Step>
            ))}
            </Stepper>
            <Typography className={classes.instructions}>{stepList[activeStep]}</Typography>
        </div>
    );
}

export default SimpleStepper;