import React from 'react';
import propTypes from 'prop-types';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import {
  Drawer,
  CssBaseline,
  AppBar,
  List,
  Typography,
  Divider,
  IconButton,
  Toolbar,
  Icon
} from '@material-ui/core';
import AccountMenu from './accountMenu';

const drawerWidth = 240;
const headerHeight = 10;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    height: headerHeight
  },
  content: {
    flexGrow: 1,
    // display: 'flex',
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    // justifyContent: 'flex-start'
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0
  },
  grow: {
    flexGrow: 1,
  },
});

class NavigationDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
    }
  
    handleDrawer = open => {
      this.setState({open});
    }

    render() {
        const {classes, drawerTitle, toolbarTitle, items = [], accountMenu} = this.props;
        const {open} = this.state;
        
        return (
        <div className={classes.root}>
          <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Toolbar>
                <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={() => this.handleDrawer(true)}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
                >
                  <Icon>menu</Icon>
                </IconButton>
                <Typography variant="h6" noWrap>{drawerTitle}</Typography>

                <div className={classes.grow} />
                <AccountMenu {...accountMenu} />
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={open}
              classes={{
                  paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <img width="100%" height="42px"></img>
                <IconButton onClick={() => this.handleDrawer(false)}>
                  <Icon>arrow_back</Icon>
                </IconButton>
              </div>
              <Divider />
              {/* <div className={classes.drawerHeader}>
                <Typography style={{fontWeight: 'bold', fontStyle: 'italic'}}>{drawerTitle}</Typography>
              </div> */}
              <Divider />
              <List>
                  {items.map(item => ({...item}))}
              </List>
            </Drawer>

            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {this.props.children}
            </main>
        </div>
        );
    }
}

NavigationDrawer.propTypes = {
  classes: propTypes.any,
  drawerTitle: propTypes.string,
  toolbarTitle: propTypes.string,
  items: propTypes.any,
  accountMenu: propTypes.any,
  children: propTypes.any
}

export default withStyles(styles)(NavigationDrawer);