import {getList} from '../../mockup';
import {getReference} from '../../common/util/refModule';

function schema( e, name ) {
    let listItems = e.state.items || {};
    let listCategory = listItems.category || [];
    
    let _schemas = {        
        page: {
            title: 'Product Data'
        },
        initialActions: [
            () => e.getListItems({...getReference('category'), itemField: 'category'})
        ],
        initialState: {
            prod_status: 'A'
        },
        data: {
            prod_name: {
                component: 'text',
                title: 'Product Name',
                required: true,
                autoFocus: true
            },
            cat_id: {
                component: 'select',
                title: 'Category',
                items: listCategory
            },
            cat_price: {
                component: 'number',
                title: 'Price',
                customInput: 'text',
                thousandSeparator: true,
                decimalScale: 2,
                fixedDecimalScale: true
            },
            prod_status: {
                component: 'radiogroup',
                title: 'Status',
                items: getList('status')
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
