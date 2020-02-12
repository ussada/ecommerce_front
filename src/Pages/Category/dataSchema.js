import {getList} from '../../mockup';
import {getReference} from '../../common/util/refModule';

function schema( e, name ) {
    let _schemas = {        
        page: {
            title: 'Category Data'
        },
        initialActions: [
            // () => e.getListItems({...getReference('role'), itemField: 'role'}),
        ],
        initialState: {
            cat_status: 'A'
        },
        data: {
            cat_name: {
                component: 'text',
                title: 'Category Name',
                required: true,
                autoFocus: true
            },
            cat_status: {
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
        }
    };

    return _schemas[ name ];
}

export default schema;
