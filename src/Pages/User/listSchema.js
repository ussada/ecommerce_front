import {getList} from '../../mockup';
import {getReference} from '../../common/util/refModule';

function schema(e, name) {
    let listItems = e.state.items || {};
    
    let _schemas = {
        page: {
            title: 'User Management'
        },
        initialState: {
            username: '',
            user_status: 'A'
        },
        initialActions: [
            () => e.getListItems({...getReference('role'), itemField: 'role'}),
        ],
        condition: {
            username: {
                component: 'text',
                title: 'User ID',
                op: 'like',
            },
            user_status: {
                component: 'select',
                title: 'Status',
                items: getList('status'),
            },
        },
        conditionButton: {
            search: {
                component: 'button',
                title: 'Search',
                onClick: e.search
            },
            reset: {
                component: 'button',
                title: 'Reset',
                onClick: e.reset
            }
        },
        button:{
            add: {
                component: 'button',
                title: 'Add',
                onClick: e.add
            },
            delete: {
                component: 'button',
                title: 'Delete',
                onClick: e.delete
            },
            export: {
                component: 'button',
                title: 'Export',
                onClick: e.export
            }
        },
        table: {
            headers: {
                username: 'Username',
                full_name: 'Full Name',
                role_id: {
                    value: 'Role',
                    displayItems: listItems.role || []
                },
                user_status: {
                    value: 'Status',
                    displayItems: getList('status')
                }
            },
            options: {
                checkbox: true,
                padding: 'checkbox',
                cursor: 'pointer',
                canClick: true,
                pagination: true,
                onClick: e.rowClick,
                rowNumber: false,
                onRowToggle: e.handleRowToggle, // checkbox click
                selectedRows: e.state.selectedRows  // pass selectedRow to Table component, use to set indeterminate
            }
        }
    };

    return _schemas[ name ];
}

export default schema;
