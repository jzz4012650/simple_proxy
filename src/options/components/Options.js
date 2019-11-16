import 'react-virtualized/styles.css'

import React, { PureComponent, Fragment } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import { Tooltip, AppBar, Toolbar, Typography, IconButton, Grid, Hidden } from '@material-ui/core'
import IconMenu from '@material-ui/icons/Menu'

import ProxyServers from './ProxyServers'
import BlackList from './BlackList'
import WhiteList from './WhiteList'
import Drawer from './Drawer'
import MenuList from './MenuList'
import Snackbar from './Snackbar'
import BtnSave from './BtnSave'

const IconGithub = () => {
  return (
    <svg onClick={() => window.open('https://github.com/jzz4012650/simple_proxy')} viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
      <path fill="white" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  )
}

class Container extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 0
    }
  }

  handleTabChange (e, value) {
    this.setState({
      currentTab: value,
      showDrawer: false
    })
  }

  render () {
    const { history, location } = this.props
    const { currentTab, showDrawer } = this.state

    return (
      <Fragment>
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <IconButton
              color="inherit"
              style={{ marginLeft: -12 }}
              onClick={() => this.setState({ showDrawer: !showDrawer })}
            >
              <IconMenu />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {chrome.i18n.getMessage('options')}
            </Typography>
            <Tooltip title="Github">
              <IconButton color="inherit" style={{ marginRight: -12 }}>
                <IconGithub />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer
          show={showDrawer}
          location={location}
          history={history}
          current={currentTab}
          onClose={() => this.setState({ showDrawer: false })}
        />
        <Grid container justify="center" spacing={32} style={{ flex: 1, padding: 16, overflow: 'hidden' }}>
          <Hidden smDown>
            <MenuList
              location={location}
              history={history}
              current={currentTab}
            />
          </Hidden>
          <Grid item xs={12} sm={10} md={7} lg={6} xl={4}>
            <Switch>
              <Route exact path="/proxy_servers" component={ProxyServers} />
              <Route exact path="/blacklist" component={BlackList} />
              <Route exact path="/whitelist" component={WhiteList} />
              <Redirect from="/" to="/proxy_servers" />
            </Switch>
          </Grid>
        </Grid>
        <BtnSave></BtnSave>
        <Snackbar />
      </Fragment>
    )
  }
}

export default Container
