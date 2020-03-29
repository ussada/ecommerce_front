import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import withWidth from "@material-ui/core/withWidth";
import Collapse from '@material-ui/core/Collapse';

import AccountMenu from './accountMenu';

const useStyles = makeStyles(theme => {
  const drawerOpenWidth = 240;
  const drawerCloseWidth = theme.spacing(7) + 1;

  const drawerStyle = drawerWidth => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  })

  return {
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerOpenWidth,
        flexShrink: 0,
      },
    },
    drawerOpen: {
      ...drawerStyle(drawerOpenWidth)
    },
    drawerClose: {
      ...drawerStyle(drawerCloseWidth),
      overflowX: 'hidden',
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      }
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerOpenWidth}px)`,
        marginLeft: drawerOpenWidth,
      },
    },
    appBarOpen: {
      ...drawerStyle(`calc(100% - ${drawerOpenWidth}px)`),
    },
    appBarClose: {
      ...drawerStyle(`calc(100% - ${drawerCloseWidth}px)`),
    },
    hide: {
        display: 'none',
    },
    menuButton: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      [theme.breakpoints.down('sm')]: {
          ...theme.mixins.toolbar,
      },
    },
    drawerPaper: {
      width: drawerOpenWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    contentShift: {
      ...theme.mixins.toolbar,
    },
    grow: {
      flexGrow: 1,
    },
  }
});

const applyToolTip = component => {
  const label = component.props && component.props.label ? component.props.label : '';

  return (
    <Tooltip 
        title={label}
        placement="right"
    >
        {component}
    </Tooltip>
  )
}

function NavigationDrawer(props) {
  const {container, children, items = [], width, drawerTitle, accountMenu} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isSmallScreen = /xs|sm/.test(width);
  const drawer = (
    <div>
      <div className={classes.toolbar} >
        <IconButton
            button
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={clsx(classes.menuButton, {
                [classes.hide]: mobileOpen,
            })}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
            button
            onClick={handleDrawerToggle}
            className={clsx(classes.menuButton, {
                [classes.hide]: !mobileOpen,
            })}
        >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      
      <Divider />
      <List>
          {items.map(item => {
              if (isSmallScreen && !mobileOpen)
                return applyToolTip(item);
              else
                return item;
          })}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar 
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarOpen]: mobileOpen,
          [classes.appBarClose]: isSmallScreen && !mobileOpen,
        })}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>{drawerTitle}</Typography>
          <div className={classes.grow} />
          <AccountMenu {...accountMenu} />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="nav-bar">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="permanent"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: mobileOpen,
                [classes.drawerClose]: !mobileOpen,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: mobileOpen,
                    [classes.drawerClose]: !mobileOpen,
                }),
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      
      <main className={classes.content}>
        <div className={classes.contentShift} />
        {children}
      </main>
    </div>
  );
}

NavigationDrawer.propTypes = {
  container: PropTypes.any,
  classes: PropTypes.any,
  drawerTitle: PropTypes.string,
  toolbarTitle: PropTypes.string,
  items: PropTypes.any,
  accountMenu: PropTypes.any,
  children: PropTypes.any
};

export default withWidth()(NavigationDrawer);