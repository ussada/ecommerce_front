import React from 'react';
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
                actions.map(item => {
                    const {label, icon, ...otherProps} = item;
                    return (
                        <Button {...otherProps}>
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

export default AlertDialog;