import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from 'react-router-dom';
import {Icon, ListItem, ListItemText, ListItemIcon, Tooltip, Collapse, List} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
// import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
    submenu: {
        paddingLeft: props => theme.spacing(props.spacing)
    },
}));

const setItem = ({to, label, icon, rightIcon, prefix, pathname, ...otherProps}) => {
    let idx = pathname.indexOf('/', 1); // Index of next "/"
    let pathModule = idx > 0 ? pathname.slice(0, idx) : pathname;
    return (
        <ListItem 
            button 
            component={to ? Link : null}
            selected={to === pathModule}
            to={to}
            {...otherProps}
        >
            <ListItemIcon>{<Icon>{icon}</Icon>}</ListItemIcon>
            <ListItemText primary={label} />
            {rightIcon ? <Icon>{rightIcon}</Icon> : undefined}
        </ListItem>
    )
}

const Items = ({to, exact, sub, parents, pathname, level, ...otherProps}) => {
    let styles = {
        spacing: level * 4
    };

    const classes = useStyles(styles);
    const [open, setOpen] = React.useState(false);

    const toggleCollapse = () => {
        setOpen(!open);
    };

    let item;
    
    if (sub && sub.length > 0) {
        let prefix = to;
        let rightIcon = open ? 'expand_less' : 'expand_more';

        item = <div>
                    {setItem({...otherProps, pathname, onClick: toggleCollapse, rightIcon})}
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                sub.map(data => {
                                    let schema = {
                                        ...data,
                                        pathname,
                                        prefix,
                                        className: classes.submenu,
                                        level: level + 1
                                    }
                                    
                                    return <Items {...schema} />
                                })
                            }
                        </List>
                    </Collapse>
                </div>;
    }
    else
        item = setItem({...otherProps, to, pathname});
    
    return item;
}

class NavItem extends React.Component {

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.menuExpand !== nextProps.menuExpand) return true;

    //     return false;
    // }

    showToolTips = (showToolTips) => {
        this.setState({showToolTips});
    }

    render() {
        return (
            <Route>
                {({location}) => <Items {...this.props} pathname={location.pathname} level={1} />}
            </Route>
        )
    }

}

NavItem.propTypes = {
    key: PropTypes.string,
    module: PropTypes.string,
    label: PropTypes.string.isRequired,
    to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]).isRequired,
    exact: PropTypes.bool,
    icon: PropTypes.string,
    sub: PropTypes.array
};

// const mapStateToProps = state => ({
//     menuExpand: state.config.menuExpand
// });

// export default connect(mapStateToProps)(NavItemLink);
export default NavItem;

