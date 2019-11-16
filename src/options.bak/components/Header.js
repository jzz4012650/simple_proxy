import React, { PureComponent } from 'react'
import { AppBar, Toolbar, Typography, Button, Tooltip } from 'material-ui'
import { withStyles } from 'material-ui/styles';
import IconSave from 'material-ui-icons/Save'
import IconUpdate from 'material-ui-icons/CloudUpload'

const styles = theme => ({
  flex: {
    flex: 1
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  }
})

class Header extends PureComponent {

  render() {
    const { classes } = this.props
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.flex} type="title" color="inherit" >
            {chrome.i18n.getMessage("options")}
          </Typography>
          <Tooltip title={chrome.i18n.getMessage("migration_explain")} placement="bottom-end">
            <Button color="contrast" onClick={this.props.migrate}>
              <IconUpdate className={classes.leftIcon} />
              {chrome.i18n.getMessage("migration")}
            </Button>
          </Tooltip>
          <Button color="contrast" onClick={this.props.onSave}>
            <IconSave className={classes.leftIcon} />
            {chrome.i18n.getMessage("save_option")}
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);