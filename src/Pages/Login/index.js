import React from 'react';
import Form from '../../components/Form';
import {withStyles} from '@material-ui/core/styles';
import {
    Card,
    Typography,
    CardContent
} from '@material-ui/core';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import schema from './schema';
import {auth} from '../../actions/auth';
import {base64Decode} from '../../common/util';
import Loading from '../../components/Loading';
import {handleChange, setChangeFields} from '../../common/actions';
import SocialAuthPanel, {GoogleLogin, FacebookLogin} from '../../components/Auth';

const styles = theme => ({
    root: {
        display: 'flex',
        height: '90vh',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        [theme.breakpoints.down('xs')]: {
            width: '90%'
        },
        [theme.breakpoints.only('sm')]: {
            width: '50%'
        },
        [theme.breakpoints.up('md')]: {
            width: '30%'
        }
    },
    card: {
        // width: '30%',
        marginTop: 20,
    },
    title: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 14,
        marginTop: '20px',
        color: 'red'
    }
});

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.schema = schema.bind(null, this);
        this.handleChange = handleChange.bind(null, this);
        this.setChangeFields = setChangeFields.bind(null, this);
        
        this.state = {
            auth: {},
            loading: false,
            changeFields: {
                username: '',
                password: ''
            }
        }
    }

    toggleLoading = loading => {
        this.setState({loading});
    }

    submit = (e) => {
        let param = this.state.changeFields;
        
        if (param && param.username && param.password) {
            this.toggleLoading(true);
            this.props.dispatch(auth(param));
        }
    }

    responseGoogle = res => {
        console.log(res);
    }

    responseFacebook = res => {
        console.log(res);
    }

    reset = () => {
        this.setState({
            changeFields: {
                username: '',
                password: ''
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {auth} = nextProps;

        if (this.state.auth !== auth) {
            this.toggleLoading(false);
            this.setState({
                auth,
                changeFields: {
                    username: '',
                    password: ''
                }
            });
        }
    }

    UNSAFE_componentWillMount() {
        const {verify} = this.props.query || {};

        if (verify) {
            try {
                const decoded = base64Decode(verify);
                const {username, expired_on} = JSON.parse(decoded);

                if (username && username !== '' && expired_on && expired_on !== '') {
                    const currentTime = new Date().getTime();

                    if (currentTime <= expired_on) {
                        this.toggleLoading(true);
                        this.props.dispatch(auth({username, authMethod: 'SSO'}));
                    }
                    else
                        console.log('WACC login expired');

                }
            }
            catch(e) {
                console.log(e.message);
            }
        }
    }

    render() {
        const {classes} = this.props;
        const {auth, changeFields} = this.state;
        const schema = this.schema('data');
        const buttonSchema = this.schema('button');
        
        if (auth && auth.success)
            return <Redirect to="/" />

        const customButton = props => ({
            goobleLogin: {
                component: 'button',
                title: 'LOGIN WITH GOOGLE',
                onClick: props.onClick,
                disabled: props.disabled
            }
        })

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                <Card className={classes.card}>
                    <Loading isLoading={this.state.loading}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Login
                            </Typography>

                            {/* <form onSubmit={this.handleSubmit} > */}
                            <form>
                                <Form schema={schema} changeFields={changeFields} />
                                <br/>
                                <Form schema={buttonSchema} />
                            </form>

                            {
                                auth && auth.msg !== ''
                                    ?   <Typography className={classes.errorText} color="textSecondary">
                                            {auth.msg}
                                        </Typography>
                                    :   ''
                            }
                        </CardContent>
                    </Loading>
                </Card>

                {/* <SocialAuthPanel responseGoogle={this.responseGoogle} responseFacebook={this.responseFacebook} /> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.config.auth,
    // user: state.user.items
})

export default connect(mapStateToProps)(withStyles(styles)(Login));
