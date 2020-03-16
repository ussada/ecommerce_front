import React from 'react';
import GoogleLogin from 'react-google-login';

const GoogleAuth = props => {
    const clientId = props.clientId || process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    const defaultProps = {
        buttonText: 'LOGIN WITH GOOGLE' || props.title
    }
    
    return (
        <GoogleLogin 
            clientId={clientId}
            {...defaultProps}
            {...props}
        />
    )
}

export default GoogleAuth;