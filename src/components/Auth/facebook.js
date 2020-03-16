import React from 'react';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookLogin from 'react-facebook-login';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Form from '../Form';
import {withStyles} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

// const StyledButton = styled(Button)`
//     color: 'primary',
//     variant: 'contained'
// `;

const StyledButton = withStyles(theme => ({
    root: {
        // color: theme.palette.getContrastText(purple[500]),
        // backgroundColor: purple[500],
        color: 'white',
        backgroundColor: '#4267b2',
        '&:hover': {
          backgroundColor: '#4267b2',
        },
    },
}))(Button);

const GoogleAuth = props => {
    const appId = props.appId || process.env.REACT_APP_FB_APP_ID;
    
    const defaultProps = {
        fields: 'first_name,last_name,email',
        icon: 'fa-facebook'
        // textButton: 'FB Login',
        // size: 'small'
    }

    const customButton = props => {
        return {
            facebookLogin: {
                component: 'button',
                title: 'LOGIN WIGH FACEBOOK',
                disabled: props.isDisabled,
                onClick: props.onClick,
                startIcon: <Icon>delete</Icon>
            }
        }
    }
    
    return (
        <FacebookLogin
            appId={appId}
            {...defaultProps}
            {...props}
            // render={renderProps => <StyledButton onClick={renderProps.onClick} disabled={renderProps.isDisalbed}>LOGIN WITH FACEBOOK</StyledButton>}
            // render={renderProps => <Form schema={customButton(renderProps)} />}
        />
    )
}

export default GoogleAuth;