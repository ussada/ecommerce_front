function schema(e, name) {
    const _schema = {
        data: {
            username: {
                component: 'text',
                title: 'User Name',
                required: true,
                onChange: e.handleChange,
                onKeyPress: (event) => event.charCode == 13 ? e.submit() : null,
                autoFocus: true,
                className: 'grid-cell--12',
            },
            password: {
                component: 'text',
                type: 'password',
                title: 'Password',
                required: true,
                onChange: e.handleChange,
                onKeyPress: (event) => event.charCode == 13 ? e.submit() : null,
                className: 'grid-cell--12',
             }
        },
        button: {
            login: {
                component: 'button',
                title: 'Login',
                onClick: e.submit
            },
            reset: {
                component: 'button',
                title: 'Reset',
                onClick: e.reset
            }
        }
    }

    return _schema[name];
}

export default schema;
