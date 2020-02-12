import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import {PageList, PageData} from '../../components/Pages';
import listSchema from './listSchema';
import dataSchema from './dataSchema';

const UserManagement = ({moduleName, page, prefix}) => {
    return (
        <div>
            <Switch>
                <Route 
                    path={ `${prefix}/data` }
                    render={props => <PageData page={page} moduleName={moduleName} schema={dataSchema} {...props} />}
                />
                <Route 
                    path={ `${prefix}/list` }
                    render={props => <PageList page={page} moduleName={moduleName} schema={listSchema} {...props} />}
                />
                
                <Route render={() => (
                    <Redirect to={`${prefix}/list`} />
                )} />
            </Switch>
        </div>
    );
}

export default UserManagement;