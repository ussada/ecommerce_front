import React from 'react';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import {
    FormControlLabel,
    Radio
} from '@material-ui/core';
import Form from '../Form';
import getIcon from '../../icon';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
    width: '90%',
    margin: 'auto'
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    alignItems: 'center',
  },
}))(MuiExpansionPanelDetails);


const Expansion = ({schema, handleChange}) => {
    const {items, value} = schema.payment_method;

    return (
        <div>
        {
            items.map((item, idx) => {
              let iconList = []

              if (item.icon) {
                if (Array.isArray(item.icon))
                  iconList = item.icon.slice()
                else
                  iconList.push(item.icon);
              }

              return (
                <ExpansionPanel key={idx} square className="expansion" 
                    expanded={value === item.value} onChange={(e) => handleChange('payment_method', item.value)} 
                >
                    <ExpansionPanelSummary aria-controls={item.value} id={item.value}>
                        <FormControlLabel
                            checked={item.value === value}
                            value={item.value}
                            control={<Radio color="primary" />}
                            label={item.title}
                            onChange={(e) => handleChange('payment_method', e.target.value)}
                        />

                        {
                          iconList.length > 0
                            ? <>
                                {
                                  iconList.map(iconName => <img key={iconName} src={getIcon(iconName)} width="48" height="48" />)
                                }
                              </>
                            : undefined
                        }
                    </ExpansionPanelSummary>

                    {
                        item.data
                            ?   <>
                                    <ExpansionPanelDetails>
                                        <Form schema={item.data} />
                                    </ExpansionPanelDetails>
                                </>
                            :   undefined
                    }
                    
                </ExpansionPanel>
              )
            })
        }
        </div>
    );
}

Expansion.propTypes = {
  schema: propTypes.objectOf([
    propTypes.shape({
      title: propTypes.string,
      value: propTypes.string.isRequired,
      icon: propTypes.string,
      data: propTypes.objectOf(propTypes.any)
    })
  ]),
  handleChange: propTypes.func
}

export default Expansion;