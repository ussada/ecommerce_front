import React from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    Button,
    TextField,
    Icon
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    button: {
      marginRight: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    input: {
        flexGrow: 1
    }
});

class FileInput extends React.Component {
    
    handleFileSelect = name => (e) => {
        e.preventDefault();
        document.getElementById(name).click();
    }
    
    render() {
        const {lang, classes, id, name, value, className, onChange, fileExtensions} = this.props;
        let buttonLabel = lang.data && lang.data.choose_file ? lang.data.choose_file : 'Choose File';

        return (
            <div className={className}>
                <div className={classes.root}>
                    <input type="file" hidden id={id} name={name} accept={fileExtensions} onChange={onChange} />
                    <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.handleFileSelect(name)} >
                        {buttonLabel}
                        <Icon className={classes.rightIcon}>folder_open</Icon>
                    </Button>
                    <TextField className={classes.input} value={value}></TextField>
                </div>
            </div>
        )
    }
}

FileInput.propTypes = {
    lang: propTypes.shape({
        data: propTypes.object
    }),
    classes: propTypes.any,
    id: propTypes.string,
    name: propTypes.string,
    value: propTypes.string,
    className: propTypes.string,
    onChange: propTypes.func,
    fileExtensions: propTypes.string,
}

const mapStateToProps = state => ({
    lang: state.config.lang
})

export default connect(mapStateToProps)(withStyles(styles)(FileInput));