import React from 'react';
import {
    IconButton,
    Icon,
    Menu,
    MenuItem,
    Divider
} from '@material-ui/core';

const menu = ({menu, items}) => {
    return (
        <>
        <Menu
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            keepMounted
            {...menu}
        >    
            {
                items.map(item => item)
            }
        </Menu>
        </>
        
    )
}

const AccountMenu = ({lang, account}) => {
    const profileMenuId = 'profile-menu';
    const langMenuId = 'lang-menu';
    const [anchorEl, setAnchorEl] = React.useState(null);
    const profileMenuOpen = Boolean(anchorEl  ? anchorEl.id === profileMenuId : false);
    const langMenuOpen = Boolean(anchorEl ? anchorEl.id === langMenuId : false);
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const profileMenu = {
        menu: {
            id: profileMenuId,
            anchorEl,
            open: profileMenuOpen,
            onClick: handleMenuClose,
        },
        items: [
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>,
            <Divider/>,
            <MenuItem onClick={account.logout}>Logout</MenuItem>
        ]
    };

    const langList = lang ? lang.list.filter(value => value !== lang.current) : [];
    let currentLang = lang ? lang.current.toUpperCase() : 'EN';

    const langMenu = {
        menu: {
            id: langMenuId,
            anchorEl,
            open: langMenuOpen,
            onClick: handleMenuClose,
        },
        items: [
            langList.map((value, idx) => {
                let items = [];
                items.push(
                    <MenuItem 
                        id={value} 
                        onClick={(e) => lang.setLanguage(e.currentTarget.id)}
                    >
                        {value.toUpperCase()}
                    </MenuItem>
                )

                if (idx < langList.length - 1)
                    items.push(<Divider />);

                return items;
            })
        ]
    }

    return (
        <div>
            <IconButton 
                id={langMenuId}
                color="inherit"
                edge="end"
                aria-label="current language"
                aria-controls={langMenuId}
                aria-haspopup="true"
                onClick={handleMenuOpen}
            >
                <div style={{fontSize: '16px'}}>{currentLang}</div>
            </IconButton>
            <IconButton
                id={profileMenuId}
                edge="end"
                aria-label="account of current user"
                aria-controls={profileMenuId}
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
            >
                <Icon>account_circle</Icon>
                <div style={{marginLeft: '3px', fontSize: '16px'}}>{account.user.full_name}</div>
            </IconButton>

            {menu(profileMenu)}
            {menu(langMenu)}
        </div>
    )
}

export default AccountMenu;