import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'

import IconLink from '@material-ui/icons/Link'
import IconDelete from '@material-ui/icons/DeleteForever'
import Add from '@material-ui/icons/Add'

import NewServerPopup from './NewServerPopup'
import { ADD_PROXY_SERVER, REMOVE_PROXY_SERVER, INIT } from '../redux/actionTypes'
import { getConfig } from '../services/config'

const ProxyServers = props => {
  const [showPopup, setPopup] = useState(false)
  const proxyServers = useSelector(store => store.proxyServers, shallowEqual)
  const dispatch = useDispatch()
  const handleNewServer = (newProxyServer) => {
    dispatch({ type: ADD_PROXY_SERVER, payload: newProxyServer })
    setPopup(false)
  }
  const handleRemoveServer = (index) => {
    dispatch({ type: REMOVE_PROXY_SERVER, payload: index })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader
          title={chrome.i18n.getMessage('proxy_server_list')}
          subheader={chrome.i18n.getMessage('proxy_server_desc')}
        />
        <Divider />
        <List>
          {proxyServers.map((server, i) => (
            <ListItem key={i} divider>
              <ListItemIcon>
                <IconLink />
              </ListItemIcon>
              <ListItemText primary={`${server.host}:${server.port}`} secondary={server.method} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleRemoveServer(i)}>
                  <IconDelete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem button onClick={() => setPopup(true)}>
            <ListItemAvatar>
              <Avatar >
                <Add />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {chrome.i18n.getMessage('add_proxy_server')}
            </ListItemText>
          </ListItem>
        </List>
      </Card>
      <NewServerPopup
        open={showPopup}
        onConfirm={handleNewServer}
        onClose={() => setPopup(false)}
      />
    </Fragment>
  )
}

export default ProxyServers
