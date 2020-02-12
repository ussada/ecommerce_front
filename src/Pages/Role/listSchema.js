import {getList} from '../../mockup';
import {setDisable} from './actions';

function schema(e, name) {
    let _schemas = {
        page: {
            title: 'Role Management'
        },
        initialState: {
            role_status: 'A',
            role_name: ''
        },
        condition: {
            role_name: {
                component: 'text',
                title: 'Role Name',
                op: 'like',
            },
            role_status: {
                component: 'select',
                title: 'Status',
                items: getList('status'),
            }
        },
        conditionButton: {
            search: {
                component: 'button',
                title: 'Search',
                onClick: e.search
            },
            reset: {
                component: 'button',
                type: 'reset',
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
            }
        },
        table: {
            headers: {
                role_name: 'Role Name',
                role_status: {
                    value: 'Status',
                    displayItems: getList('status')
                }
            },
            options: {
                checkbox: true,
                padding: 'checkbox',
                cursor: 'pointer',
                canClick: true,
                onClick: e.rowClick,
                onRowToggle: e.handleRowToggle, // checkbox click
                selectedRows: e.state.selectedRows,  // pass selectedRow to Table component, use to set indeterminate
                rowNumber: false,
                // setDisable: setDisable,
                pagination: true,
            }
        }
    };

    return _schemas[ name ];
}

export default schema;
