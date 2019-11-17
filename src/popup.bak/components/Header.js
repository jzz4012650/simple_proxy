import React, { PureComponent } from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconSetting from 'material-ui-icons/Settings'
import RemoveCircle from 'material-ui-icons/RemoveCircle'
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline'
import IconDesktop from 'material-ui-icons/DesktopMac'
import IconDirect from 'material-ui-icons/SwapHoriz'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  flex: {
    flex: 1,
    margin: theme.spacing(1)
  }
})

class Header extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      anchorEl: null
    }
  }

  renderModeIcon (mode) {
    switch (mode) {
    case 'SYSTEM':
      return <IconDesktop />
    case 'DIRECT':
      return <IconDirect />
    case 'BLACK_LIST':
      return <RemoveCircle />
    case 'WHITE_LIST':
      return <RemoveCircleOutline />
    }
  }

  handleProxyModeClick (mode) {
    this.props.changeProxyMode(mode)
    this.setState({ anchorEl: null })
  }

  render () {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography type="title" color="inherit">
            {chrome.i18n.getMessage('proxy_mode')}
          </Typography>
          <Button
            className={this.props.classes.flex}
            color="contrast"
            onClick={(e) => this.setState({ anchorEl: e.target })}>
            {React.cloneElement(
              this.renderModeIcon(this.props.proxyMode),
              { className: this.props.classes.leftIcon }
            )}
            {this.props.proxyModes.find(d => d.name === this.props.proxyMode).text}
          </Button>
          <Menu
            open={!!this.state.anchorEl}
            anchorEl={this.state.anchorEl}
            onRequestClose={() => this.setState({ anchorEl: null })}>
            {this.props.proxyModes.map((d, i) =>
              <MenuItem
                key={i}
                value={d.name}
                selected={this.props.proxyMode === d.name}
                onClick={() => this.handleProxyModeClick(d.name)}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {this.renderModeIcon(d.name)}
                    </ListItemIcon>
                    <ListItemText primary={d.text} secondary={d.desc} />
                  </ListItem>
                </List>
              </MenuItem>
            )}
          </Menu>
          <IconButton onClick={() => chrome.runtime.openOptionsPage()}>
            <IconSetting />
          </IconButton>
        </Toolbar>
      </AppBar >
    )
  }
}

export default withStyles(styles)(Header)
