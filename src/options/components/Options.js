import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Cloud from '@material-ui/icons/Cloud'
import Lens from '@material-ui/icons/Lens'
import LensOutlined from '@material-ui/icons/LensOutlined'

import ProxyServers from './ProxyServers'
import WhiteList from './WhiteList'
import BlackList from './BlackList'
import BtnSave from './BtnSave'
import Snackbar from './Snackbar'

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: 72 + theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  toolbarIcon: {
    marginRight: theme.spacing(1)
  },
  paper: {
    width: '100%',
    height: '100%',
    display: 'inline-block'
  }
}))

const Options = props => {
  const { pathname } = props.location
  const classes = useStyles()
  const [activeTab, setTab] = React.useState(pathname)
  const handleChange = (e, newValue) => {
    setTab(newValue)
    props.history.push(newValue)
  }

  return (
    <Fragment>
      <AppBar position="fixed" color="primary">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          centered
        >
          <Tab icon={<Cloud/>} label={chrome.i18n.getMessage('proxy_server')} value="/"/>
          <Tab icon={<LensOutlined/>} label={chrome.i18n.getMessage('black_list')} value="/black-list"/>
          <Tab icon={<Lens/>} label={chrome.i18n.getMessage('white_list')} value="/white-list"/>
        </Tabs>
      </AppBar>
      <Container className={classes.container}>
        <Switch>
          <Route exact path="/">
            <ProxyServers />
          </Route>
          <Route exact path="/black-list">
            <BlackList/>
          </Route>
          <Route exact path="/white-list">
            <WhiteList/>
          </Route>
        </Switch>
        <BtnSave/>
      </Container>
      <Snackbar/>
    </Fragment>
  )
}

export default Options
