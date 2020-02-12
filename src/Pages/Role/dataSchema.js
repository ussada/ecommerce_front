import {getList} from '../../mockup';
import {addByCheck, saveRole} from './actions';
import { getReference } from '../../common/util/refModule';
import {useMockup} from '../../constants';
import {sortData} from '../../common/util';

function rolePermissionSchema(e, name) {
    const permission = (e2, name) => {
        let schema = {
            title: 'Select Pemrission',
            moduleName: 'menu',
            fk: 'program_id',
            condition: {
                program_name: {
                    component: 'text',
                    title: 'Menu Name',
                    op: 'like',
                    onChange: e2.handleChange,
                    onKeyPress: (event) => event.charCode == 13 ? e2.search() : null,
                    className: 'grid-cell--12',
                    autoFocus: true
                }
            },
            conditionButton: {
                search: {
                    component: 'button',
                    title: 'Search',
                    variant: 'contained',
                    color: 'primary',
                    className:'grid-cell--1',
                    style: {marginTop: '20px'},
                    onClick: e.search
                },
                reset: {
                    component: 'button',
                    type: 'reset',
                    title: 'Reset',
                    variant: 'contained',
                    color: 'primary',
                    className:'grid-cell--1',
                    style: {marginTop: '20px'},
                    onClick: e.reset
                }
            },
            page: {
                // title: 'Menu List'
            },
            table: {
                headers: {
                    'program_name': 'Menu Name'
                },
                options: {
                    checkbox: true,
                    padding: 'checkbox',
                    selectedRows: e.state.selectedSearch['menu'] || [],
                    onRowToggle: (event, rows = []) => e.searchSelected(event, 'menu', rows),
                }
            }
        }

        return schema[name];
    }

    let schema = {
        title: 'Permission',
        type: 'table',
        fk: 'role_id',
        addMode: 'search',
        table: {
            headers: {
                'program_id': {
                    value: 'Name',
                    refModule: 'menu',
                    refField: 'program_name'
                }
            },
            options: {
                checkbox: true,
                padding: 'checkbox',
                onRowToggle: e.handleRowToggle,
                selectedRows: e.state.selectedRows
            },
            actions: {
                selectedRows: e.state.selectedRows,
                add: e.add,
                delete: e.delete
            }
        },
        data: permission,
    }

    return schema[name];
}

function rolePermission(e, name) {
    // let valueFields = e && e.state ? e.state.changeFields : {};
    let listItems = e.state.items || {};
    let menuItems = useMockup('menu') ? getList('menu') : (listItems.menu || []);
    // let fk = useMockup('menu') ? 'role_id' : 'role_id';
    // let field = useMockup('menu') ? 'permit_id' : 'permit_id';
    let fk = 'role_id';
    let field = 'permit_id';
    let currentLang = e.props.lang ? e.props.lang.current : 'en';
    let schema = {
        title: 'Permission',
        type: 'list',
        fk,
        initialActions: [
            () => e.getListItems({...getReference('menu'), itemField: 'menu'})
        ],
        data: {
            menu: {
                component: 'checkgroup',
                title: 'Group Menu',
                // className: '',
                itemAsRow: true,
                field,
                style: {'text-align': 'start'},
                items: menuItems.map(item => {
                    return {
                        id: item.id,
                        name: item[`name_${currentLang}`] || item.program_name,
                        icon: item.icon || item.program_icon,
                        order: item.order || item.program_order,
                        onChange: (event, checked) => addByCheck(e, item.id, checked)
                    }
                }).sort(sortData(['order']))
            }
        }
    }

    return schema[name];
}

function schema( e, name ) {
    let mode = e && e.state ? e.state.mode : '';
    let valueFields = e && e.state ? e.state.changeFields : {};
    let editFields = e && e.props ? e.props.selectedItems[0] : {};
    let _schemas = {
        page: {
            title: 'Role Data'
        },
        initialState: {
            role_status: 'A'
        },
        data: {
            role_name: {
                component: 'text',
                title: 'Role Name',
                required: true,
                autoFocus: true
            },
            role_status: {
                component: 'radiogroup',
                title: 'Status',
                items: getList('status')
            }
        },
        detail: {
            role_permission: rolePermission, // Set value as checkbox list
            // 'role_detail': rolePermissionSchema // Set value with search page
        },
        button:{
            save: {
                component: 'button',
                // type: 'button',
                title: 'Save',
                // variant: 'contained',
                // color: 'primary',
                // className: 'grid-cell--1',
                // style: {marginTop: '20px'},
                // onClick: () => { saveRole(e); }
                onClick: e.save
            },
            back: {
                component: 'button',
                // type: 'button',
                title: 'Back',
                // variant: 'contained',
                // color: 'primary',
                // className: 'grid-cell--1',
                // style: {marginTop: '20px'},
                onClick: e.back
            }
        }
    };

    return _schemas[ name ];
}

export default schema;
