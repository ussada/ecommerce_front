import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import {PageList, PageData} from '../../components/Pages';
import listSchema from './listSchema';
import dataSchema from './dataSchema';

const ProductManagement = ({prefix, moduleName, page}) => {
    return (
        <div>
            <Switch>
                <Route 
                    path={ `${ prefix }/list` }
                    render={props => <PageList page={page} moduleName={moduleName} schema={listSchema} {...props} />}
                />

                <Route 
                    path={ `${ prefix }/data` }
                    render={props => <PageData page={page} moduleName={moduleName} schema={dataSchema} {...props} />}
                />

                <Route render={() => (
                    <Redirect to={`${prefix}/list`} />
                )} />
            </Switch>
        </div>
    );
}

export default ProductManagement;