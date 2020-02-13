import {getList} from '../../mockup';
import {getReference} from '../../common/util/refModule';

function schema( e, name ) {
    let mode = e.state.mode;
    let listItems = e.state.items || {};
    
    let _schemas = {        
        page: {
            title: 'User Data'
        },
        initialActions: [
            () => e.getListItems({...getReference('role'), itemField: 'role'}),
        ],
        initialState: {
            user_status: 'A'
        },
        data: {
            username: {
                component: 'text',
                title: 'Username',
                required: true,
                disabled: mode === 'edit',
                autoFocus: true
            },
            passwd: {
                component: 'text',
                type: 'password',
                title: 'Password',
                required: mode === 'add',
                visibled: mode === 'add',
            },
            confirm_password: {
                component: 'text',
                type: 'password',
                title: 'Confirm Password',
                required: mode === 'add',
                visibled: mode === 'add',
                matchWithField: 'passwd'
            },
            full_name: {
                component: 'text',
                title: 'Full Name',
                required: true,
            },
            role_id: {
                component: 'select',
                title: 'Role',
                required: true,
                items: listItems.role || []
            },
            user_status: {
                component: 'radiogroup',
                title: 'Status',
                items: getList('status'),
            }
        },
        button:{
            save: {
                component: 'button',
                title: 'Save',
                onClick: e.save
            },
            back: {
                component: 'button',
                title: 'Back',
                onClick: e.back
            }
        },
        attributes: {
            exclude: ['passwd']
        }
    };

    return _schemas[ name ];
}

export default schema;
