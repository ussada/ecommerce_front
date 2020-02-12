import React, {Component} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom';
import NavigationDrawer from '../../components/NavigationDrawer';
import NavItem from '../../components/NavItems';
import {capitalize} from '../../common/util';
import {Divider} from '@material-ui/core';

import {connect} from 'react-redux';
import {getLang, getLangList} from '../../assets/lang';
import {setLang, setValue} from '../../actions/config';

// import MenuList from './Menu.js';

import dashboard from '../Dashboard';
import user from '../User';
import role from '../Role';
import category from '../Category';
import product from '../Product';

import {sortData} from '../../common/util';
import {getData} from '../../actions/base';

const components = {
    dashboard,
    user,
    role,
    category,
    product
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolbarTitle: this.getCurrentTitle(props)
        };
    }

    setLanguage = (lang) => {
        let data = getLang(lang);
        let list = getLangList();
        this.props.dispatch(setLang({current: lang, list, data}));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextLang = nextProps.lang ? nextProps.lang.current : '';
        const currentLang = this.props.lang ? this.props.lang.current : '';
        
        if (currentLang !== nextLang && nextLang !== '') {
            this.setLanguage(nextLang);
        }

        this.setState({toolbarTitle: this.getCurrentTitle(nextProps)});
    }

    UNSAFE_componentWillMount() {
        const {current} = this.props.lang;
        this.setLanguage(current);

        // getListItems(this, {...getReference('menu'), itemField: 'menu'});
        this.props.dispatch(getData('menu'));
    }

    getCurrentTitle = ({location: {pathname}}) => {
        let path = pathname.slice(1);
        let title = path.includes('/') ? path.substr(0, path.indexOf('/')) : path; // Get module name
        return capitalize(title);
    };

    setMenuItem = (menuList) => {
        var menu = menuList.map((item) => {
            if (item.hasOwnProperty('divider')) return <Divider />;
            else return <NavItem key={item.to} {...item} />;
        });

        return menu;
    }

    getMenuList = (lang) => {        
        // let menu = this.state.items && this.state.items.menu ? this.state.items.menu.slice().sort((a, b) => a.order - b.order) : [];
        
        let menu = this.props.menu && this.props.menu ? this.props.menu.slice().sort(sortData('permit_order')) : [];
        let menuList = [];
        let permission = this.props.permission ? this.props.permission : [];
        
        menu.map((item, idx) => {
            if(permission.indexOf(item.id) >= 0){
                if (idx > 0 && item.permit_type !== menu[idx-1].permit_type)
                    menuList.push({key: 'divider', divider: true});
            
                menuList.push({
                    id: item.id,
                    key: item.permit_key,
                    to: item.permit_path,
                    label: lang == 'en' ? item.name_en : item.name_th,
                    module: item.permit_module,
                    type: item.permit_type,
                    order: item.permit_order,
                    icon: item.permit_icon
                });
            }
        });
        
        return menuList;
    }

    addRoute = (item) => {
        if (item.sub && item.sub.length > 0) {
            return item.sub.map(subitem => this.addRoute(subitem))
        }
        else {
            const Component = components[item.key];

            if (Component)
                return <Route
                        path={item.to}
                        render={props => <Component page={item.key.toLowerCase()} prefix={item.to} moduleName={item.module} {...props} />}
                    />
        }
    }

    logout = () => {
        localStorage.removeItem('token');
        this.props.dispatch(setValue({
            auth: {
                success: false
            },
            user: {}
        }));
    }
      
    render() {
        const {auth} = this.props;

        if (!auth || !auth.success)
            return <Redirect to="/login" />

        const {toolbarTitle} = this.state;  
        const {current, list} = this.props.lang;
            
        const lang = {
            current,
            list,
            setLanguage: this.setLanguage
        }
        
        const MenuList = this.getMenuList(current);
        const navItems = this.setMenuItem(MenuList);
        const routes = MenuList.filter(item => item.hasOwnProperty('key') && item.key !== '' && item.hasOwnProperty('to') && item.to !== '');
        const {user} = this.props

        const account = {
            user,
            logout: this.logout
        };

        return (
            <NavigationDrawer
            drawerTitle="E-Commerce"
            items={navItems}
            toolbarTitle={toolbarTitle}
            accountMenu={{lang, account}}
            >
                <Switch>
                    {routes.map(item => this.addRoute(item))}

                    <Route render={() => (
                        <Redirect to='/dashboard' />
                    )} />
                </Switch>
            </NavigationDrawer>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.config.lang,
    auth: state.config.auth,
    permission: state.config.permission,
    user: state.config.user,
    menu: state.menu.selectedItems
})

export default connect(mapStateToProps)(Home);