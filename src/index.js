import 'core-js/es6/string';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'formdata-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from './theme/muiTheme';
// import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import configureStore from './store'
import {PersistGate} from 'redux-persist/integration/react';

const {store, persistor} = configureStore();

// ReactDOM.render(
//     <MuiThemeProvider theme={theme}>
//         <HashRouter>
//             <App />
//         </HashRouter>
//     </MuiThemeProvider>, 
//     document.getElementById('root')
// );

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} >
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </MuiThemeProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
