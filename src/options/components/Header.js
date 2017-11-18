import React, { PureComponent } from 'react'
import { AppBar, Toolbar, Typography, Button } from 'material-ui'
import { withStyles } from 'material-ui/styles';
import IconSave from 'material-ui-icons/Save'

const styles = theme => ({
  flex: {
    flex: 1
  }
})

class Header extends PureComponent {

  handleSaveClick() {
    this.props.saveConfig(
      this.props.proxyServers,
      this.props.blackList,
      this.props.whiteList
    )
  }

  render() {
    const { classes } = this.props
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.flex} type="title" color="inherit" >
            {chrome.i18n.getMessage("options")}
          </Typography>
          <Button color="contrast" onClick={() => this.handleSaveClick}>
            <IconSave />
            <Typography type="button">
              {chrome.i18n.getMessage("save_option")}
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);