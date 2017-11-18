import React, { PureComponent } from 'react';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import RemoveCircle from 'material-ui-icons/RemoveCircle'
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline'

class Domain extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }

  renderRightIconBtton(iconType) {
    let icon
    switch (iconType) {
      case 0:
        icon = <RemoveCircleOutline />
        break
      case 1:
        icon = <RemoveCircle />
      default:
        icon = <MoreVertIcon />
    }
    return (
      <IconButton onClick={(e) => this.props.onOpenMenu(e.target, this.props.host, iconType)}>
        {icon}
      </IconButton>
    )
  }

  render() {
    const { host, blackList, whiteList } = this.props;
    let iconType

    switch (true) {
      case (blackList.indexOf('*' + host) >= 0):
        iconType = 1; break;
      case (whiteList.indexOf('*' + host) >= 0):
        iconType = 0; break;
      default:
        iconType = -1;
    }

    return (
      <ListItem>
        <ListItemText primary={host} />
        <ListItemSecondaryAction>
          {this.renderRightIconBtton(iconType)}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default Domain;