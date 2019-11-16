import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Cloud from '@material-ui/icons/Cloud'

import ProxyServers from './ProxyServers'
import BtnSave from './BtnSave'
import Snackbar from './Snackbar'

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    paddingTop: 72 + theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflow: 'auto'
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
  const { path } = props.match
  const classes = useStyles()
  const [activeTab, setTab] = React.useState(path)
  const handleChange = (e, newValue) => {
    setTab(newValue)
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
          <Tab icon={<Cloud/>} label={chrome.i18n.getMessage('')} value="/black-list"/>
          <Tab icon={<Cloud/>} label={chrome.i18n.getMessage('')} value="/white-list"/>
        </Tabs>
      </AppBar>
      <Container className={classes.container}>
        {/* <Paper className={classes.paper}> */}
        <Switch>
          <Route exact path="/">
            <ProxyServers />
          </Route>
          <Route exact path="/black-list">
          </Route>
          <Route exact path="/white-list">
          </Route>
        </Switch>
        {/* </Paper> */}
        <BtnSave/>
      </Container>
      <Snackbar/>
    </Fragment>
  )
}

export default Options
