import React, { PureComponent } from 'react';
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Select from 'material-ui/Select'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import IconSetting from 'material-ui-icons/Settings'
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  flex: {
    flex: 1
  }
})

class Header extends PureComponent {
  render() {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography type="title" color="inherit">
            {chrome.i18n.getMessage("proxy_mode")}
          </Typography>
          <Select
            className={this.props.classes.flex}
            value={this.props.proxyMode}
            onChange={e => this.props.changeProxyMode(e.target.value)}>
            {this.props.proxyModes.map((d, i) => (
              <MenuItem key={i} value={d.name}>
                <List>
                  <ListItem>
                    <ListItemText primary={d.text} secondary={d.desc} />
                  </ListItem>
                </List>
              </MenuItem>
            ))}
          </Select>
          <IconButton onClick={() => chrome.runtime.openOptionsPage()}>
            <IconSetting />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);