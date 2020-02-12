import React from 'react';
import {
    Toolbar,
    Tooltip,
    IconButton,
    Icon,
    Typography,
    Fab
} from '@material-ui/core';
import {makeStyles, lighten} from '@material-ui/core/styles';
import clsx from 'clsx';

const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
}));

const TableAction = ({props}) => {
    const classes = useToolbarStyles();
    const {selectedRows, ...actions} = props;
    let count = selectedRows ? selectedRows.length : 0;
    
    return (
        <Toolbar
            className={clsx(classes.root, {
            [classes.highlight]: count > 0,
            })}
        >
            <div className={classes.title}>
                {
                    count > 0 
                        ?   <Typography color="inherit" variant="subtitle1">
                                {count} selected
                            </Typography>
                        :   undefined
                }
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {
                    count > 0 
                        ?   <Tooltip title="Delete">
                                <IconButton aria-label="Delete" onClick={actions.delete}>
                                    <Icon>delete</Icon>
                                </IconButton>
                            </Tooltip>
                        :   <Tooltip title="Add new data" onClick={actions.add}>
                                <Fab size="small" aria-label="Add new data" color="primary">
                                    <Icon>add</Icon>
                                </Fab>
                            </Tooltip>
                }
            </div>
        </Toolbar>
    );

};

export default TableAction;