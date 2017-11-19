import React, { PureComponent } from 'react';
import Menu, { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles';

import DomainState from './DomainState'

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  }
})

class DomainMenu extends PureComponent {

  handleMenuClick(value) {
    this.props.onMenuChange(this.props.iconType, value)
  }

  render() {
    const { classes } = this.props
    return (
      <Menu
        open={!!this.props.anchorEl}
        anchorEl={this.props.anchorEl}
        onRequestClose={this.props.onHide}>
        {DomainState.map((d, i) =>
          <MenuItem
            key={i}
            selected={this.props.iconType === d.value}
            onClick={() => this.handleMenuClick(d.value)}>
            {React.cloneElement(d.icon, { className: classes.leftIcon })}
            {d.text}
          </MenuItem>
        )}
      </Menu>
    )
  }
}

export default withStyles(styles)(DomainMenu);