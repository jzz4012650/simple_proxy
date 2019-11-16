import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'

import Public from '@material-ui/icons/Public'
import Link from '@material-ui/icons/Link'
import LinkOff from '@material-ui/icons/LinkOff'

const MenuList = ({ current, onClick, location, history }) => {
  return (
    <List subheader={<ListSubheader>{chrome.i18n.getMessage('options')}</ListSubheader>}>
      <Divider/>
      <ListItem button selected={location.pathname === '/proxy_servers'} onClick={() => history.push('/proxy_servers')}>
        <ListItemIcon><Public /></ListItemIcon>
        <ListItemText>{chrome.i18n.getMessage('proxy_server')}</ListItemText>
      </ListItem>
      <ListItem button selected={location.pathname === '/blacklist'} onClick={() => history.push('/blacklist')}>
        <ListItemIcon><Link /></ListItemIcon>
        <ListItemText>{chrome.i18n.getMessage('hosts_use_proxy')}</ListItemText>
      </ListItem>
      <ListItem button selected={location.pathname === '/whitelist'} onClick={() => history.push('/whitelist')}>
        <ListItemIcon><LinkOff /></ListItemIcon>
        <ListItemText>{chrome.i18n.getMessage('hosts_bypass_proxy')}</ListItemText>
      </ListItem>
    </List>
  )
}

export default MenuList
