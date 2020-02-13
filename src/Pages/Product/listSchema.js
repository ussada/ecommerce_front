import {getList} from '../../mockup';
import {getReference} from '../../common/util/refModule';

function schema(e, name) {
    let listItems = e.state.items || {};
    let listCategory = listItems.category || [];

    let _schemas = {
        page: {
            title: 'Product Management'
        },
        initialState: {
            prod_name: '',
            cat_id: '',
            prod_status: 'A'
        },
        initialActions: [
            () => e.getListItems({...getReference('category'), itemField: 'category'}),
        ],
        condition: {
            prod_name: {
                component: 'text',
                title: 'Product Name',
                suggestionList: listItems.channel || [],
            },
            cat_id: {
                component: 'select',
                title: 'Category',
                items: listCategory
            },
            prod_status: {
                component: 'select',
                title: 'Status',
                onChange: e.handleChange,
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
                prod_name: 'Product Name',
                cat_id: {
                    value: 'Category',
                    displayItems: listCategory
                },
                prod_status: {
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
