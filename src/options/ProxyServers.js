import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconOrder from '@material-ui/icons/UnfoldMore';
import IconDelete from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import IconAdd from '@material-ui/icons/Add';


class ProxyServers extends Component {
  render() {
    return (
      <Grid item xs={11} sm={10} md={8} lg={6}>
        <Card>
          <CardHeader title={chrome.i18n.getMessage('proxy_server_list')} subheader={chrome.i18n.getMessage('proxy_server_desc')} />
          <Divider />
          <CardContent>
            <Grid container direction="column" alignItems="center">
              <Grid xs="12" sm="10" md="10" lg="10">
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <IconOrder />
                    </ListItemIcon>
                    <ListItemText>
                      {'some.proxy.com:8080'}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton><IconDelete /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <IconOrder />
                    </ListItemIcon>
                    <ListItemText>
                      {'some.proxy.com:8080'}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton><IconDelete /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <IconOrder />
                    </ListItemIcon>
                    <ListItemText>
                      {'some.proxy.com:8080'}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton><IconDelete /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <IconOrder />
                    </ListItemIcon>
                    <ListItemText>
                      {'some.proxy.com:8080'}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton><IconDelete /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
              <Grid xs="12" sm="10" md="8" lg="6">
                <TextField
                  id="host"
                  label="Host"
                  placeholder="example.proxy.com"
                />
                <TextField
                  id="port"
                  type="number"
                  label="Port"
                  placeholder="8080"
                  inputProps={{ min: 0, max: 65535 }}
                />
                <Fab variant="contained" color="primary" size="small" style={{ verticalAlign: 'bottom'}}>
                  <IconAdd />
                </Fab>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default ProxyServers;