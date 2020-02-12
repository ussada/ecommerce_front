import React from 'react';
import propTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon
} from '@material-ui/core'

const AlertDialog = ({title, description, open, actions}) => {

  return (
    <div>
      <Dialog
        open={open}
        onClose={actions.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            {
                actions.map((item, idx) => {
                    const {label, icon, ...otherProps} = item;
                    return (
                        <Button key={idx} {...otherProps}>
                            {icon ? <Icon>{icon}</Icon> : undefined}
                            {item.label}
                        </Button>
                    )
                })
            }
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertDialog.propTypes = {
  title: propTypes.string,
  description: propTypes.oneOf([
    propTypes.arrayOf(propTypes.element),
    propTypes.element,
    propTypes.string
  ]),
  open: propTypes.bool.isRequired,
  actions: propTypes.arrayOf(propTypes.object)
}

export default AlertDialog;