import React from 'react';
import {Icon, IconButton, Tooltip} from '@material-ui/core';

class MenuButton extends React.Component {
  getMenuItem = (opt) => {
    return (
      <Tooltip title={opt.title}>
        <IconButton color="primary" onClick={() => opt.onClick(this.props.row, opt)}>
          <Icon>{opt.icon}</Icon>
        </IconButton>
      </Tooltip>
    )  
  }

  render() {
    const { menuList } = this.props;
    return menuList.map(item => this.getMenuItem(item));
  }
}

export default MenuButton;