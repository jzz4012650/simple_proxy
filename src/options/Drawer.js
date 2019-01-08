import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider
} from '@material-ui/core';
import {
  Public,
  Link,
  LinkOff
} from '@material-ui/icons';

const DrawerMenu = ({ show, current, onClick, onClose}) => {
  return (
    <Drawer open={show} onClose={onClose}>
      <List subheader={<ListSubheader>{chrome.i18n.getMessage('options')}</ListSubheader>}>
        <Divider/>
        <ListItem button selected={current === 0} onClick={() => onClick(0)}>
          <ListItemIcon><Public /></ListItemIcon>
          <ListItemText>{chrome.i18n.getMessage('proxy_server')}</ListItemText>
        </ListItem>
        <ListItem button selected={current === 1} onClick={() => onClick(1)}>
          <ListItemIcon><Link /></ListItemIcon>
          <ListItemText>{chrome.i18n.getMessage('hosts_use_proxy')}</ListItemText>
        </ListItem>
        <ListItem button selected={current === 2} onClick={() => onClick(2)}>
          <ListItemIcon><LinkOff /></ListItemIcon>
          <ListItemText>{chrome.i18n.getMessage('hosts_bypass_proxy')}</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DrawerMenu;