import React, { Component } from 'react';
import {
  Grid,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
  Fab,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import IconOrder from '@material-ui/icons/UnfoldMore';
import IconDelete from '@material-ui/icons/DeleteForever';
import IconAdd from '@material-ui/icons/Add';

import NewServerPopup from './NewServerPopup';
import { PROXY_METHODS } from './constants';

const style = () => {
  return {
    bottomAlign: {
      verticalAlign: 'bottom'
    }
  };
};

class ProxyServers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      serverList: []
    };
  }

  handleInputChange(key, e) {
    const { input } = this.state;
    this.setState({
      input: {
        ...input,
        [key]: e.target.value
      }
    });
  }

  handleNewServer() {
    const { input, serverList } = this.state;
    const inputClone = JSON.parse(JSON.stringify(input));
    this.setState({
      serverList: [
        ...serverList,
        inputClone
      ],
      input: {
        method: PROXY_METHODS[0],
        host: '',
        port: ''
      }
    });
  }

  handleRemoveServer(index) {
    const { serverList } = this.state;
    this.setState({
      serverList: serverList.slice(0, index).concat(serverList.slice(index + 1))
    });
  }

  render() {
    const { serverList, showPopup } = this.state;
    const { classes } = this.props;
    return (
      <Grid item xs={11} sm={10} md={8} lg={6}>
        <Card>
          <CardHeader title={chrome.i18n.getMessage('proxy_server_list')} subheader={chrome.i18n.getMessage('proxy_server_desc')} />
          <Divider />
          <CardContent>
            <List>
              {serverList.map((server, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    <IconOrder />
                  </ListItemIcon>
                  <ListItemText>
                    {`${server.method} ${server.host}:${server.port}`}
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton onClick={this.handleRemoveServer.bind(this, i)}>
                      <IconDelete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <NewServerPopup
          open={showPopup}
          onClose={() => this.setState({showPopup: false})}
        />
      </Grid>
    );
  }
}

export default withStyles(style)(ProxyServers);