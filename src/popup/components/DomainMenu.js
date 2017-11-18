import React, { PureComponent } from 'react';
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import RemoveCircle from 'material-ui-icons/RemoveCircle'
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline'

const DOMAIN_STATE = [{
  value: -1,
  text: chrome.i18n.getMessage('domain_neither'),
  icon: <MoreVertIcon />
}, {
  value: 1,
  text: chrome.i18n.getMessage('domain_black'),
  icon: <RemoveCircle />
}, {
  value: 0,
  text: chrome.i18n.getMessage('domain_white'),
  icon: <RemoveCircleOutline />
}]

class DomainMenu extends PureComponent {


  render() {
    return (
      <Menu
        open={!!this.props.anchorEl}
        anchorEl={this.props.anchorEl}
        onRequestClose={this.props.onHide}>
        {DOMAIN_STATE.map((d, i) =>
          <MenuItem
            key={i}
            selected={this.props.iconType === d.value}
            onClick={() => this.props.onMenuChange(this.props.iconType, d.value)}>
            {d.icon}{' '}{d.text}
          </MenuItem>
        )}
      </Menu>
    );
  }
}

export default DomainMenu;