import React from 'react';
import GoogleLogin from './google';
import FacebookLogin from './facebook';
import {makeStyles} from '@material-ui/core/styles';

const usestyles = makeStyles(theme => ({
    panel: {
        display: 'flex',
        marginTop: '20px'
    },
    account: {
        width: '50%',
        height: '20px'
    }
}));

const AuthPanel = props => {
    const classes = usestyles();
    const {responseGoogle, responseFacebook} = props;

    return (
        <div className={classes.panel}>
            <div className={classes.account}>
                <GoogleLogin onSuccess={responseGoogle} onFailure={responseGoogle} />
            </div>
            <div className={classes.account}>
                <FacebookLogin callback={responseFacebook} />
                {/* <div class="fb-login-button" data-width="" data-size="medium" data-button-type="login_with" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
            </div>
        </div>
    )
}

export default AuthPanel;

export {
    GoogleLogin,
    FacebookLogin
}