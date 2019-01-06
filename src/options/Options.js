import React, { Component, Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconSave from '@material-ui/icons/Save';
import IconServer from '@material-ui/icons/Public';
import IconLink from '@material-ui/icons/LinkOutlined';
import IconLinkOff from '@material-ui/icons/LinkOffOutlined';


import { withStyles } from '@material-ui/core/styles';
import ProxyServers from './ProxyServers';

const styles = theme => ({
  saveIcon: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    margin: theme.spacing.unit * 2,
  },
  tabs: {
    flex: 1
  }
});

const IconGithub = () => {
  return (
    <svg onClick={() => window.open('https://github.com/jzz4012650/simple_proxy')} viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
      <path fill="white" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  );
};

class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0
    };
  }

  handleTabChange(e, value) {
    this.setState({
      currentTab: value
    });
  }

  render() {
    const { classes } = this.props;
    const {currentTab} = this.state;
    return (
      <Fragment>
        <AppBar position="static" color="primary">
          <ToolBar>
            <Typography variant="h6" color="inherit">
              {chrome.i18n.getMessage('options')}
            </Typography>
            <Tabs
              className={classes.tabs}
              value={currentTab}
              onChange={this.handleTabChange.bind(this)}
              centered
            >
              <Tab icon={<IconServer/>} label={chrome.i18n.getMessage('proxy_server')} />
              <Tab icon={<IconLink/>} label={chrome.i18n.getMessage('hosts_use_proxy')} />
              <Tab icon={<IconLinkOff/>} label={chrome.i18n.getMessage('hosts_bypass_proxy')} />
            </Tabs>
            <Tooltip title="Github">
              <IconButton color="inherit">
                <IconGithub />
              </IconButton>
            </Tooltip>
          </ToolBar>
        </AppBar>
        <Grid container spacing={16} direction="column" alignItems="center">
          <Grid item/>
          {currentTab === 0 && <ProxyServers />}
        </Grid>
        <Tooltip title={chrome.i18n.getMessage('save_option')}>
          <Fab className={classes.saveIcon} color="secondary" >
            <IconSave />
          </Fab>
        </Tooltip>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Container);