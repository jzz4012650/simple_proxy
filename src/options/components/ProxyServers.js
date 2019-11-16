import React, { PureComponent, Fragment } from 'react'
import throttle from 'lodash/throttle'
import { connect } from 'react-redux'

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
import { addProxyServer, removeProxyServer } from '../redux/actions'

class ProxyServers extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showPopup: false,
      serverList: []
    }
    this.handleNewServer = throttle(this.handleNewServer.bind(this), 500, { trailing: false })
  }

  handleNewServer (newProxyServer) {
    const { serverList } = this.state
    const { addProxyServer } = this.props
    addProxyServer(newProxyServer)
    this.setState({
      showPopup: false
    })
  }

  handleRemoveServer (index) {
    const { serverList } = this.state
    const { removeProxyServer } = this.props
    removeProxyServer(index)
  }

  render () {
    const { showPopup } = this.state
    const { proxyServers } = this.props
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
                  <IconButton onClick={this.handleRemoveServer.bind(this, i)}>
                    <IconDelete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <ListItem button onClick={() => this.setState({ showPopup: true })}>
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
          onConfirm={this.handleNewServer}
          onClose={() => this.setState({ showPopup: false })}
        />
      </Fragment>
    )
  }
}

export default connect(
  ({ proxyServers }) => ({ proxyServers }),
  { addProxyServer, removeProxyServer }
)(ProxyServers)
