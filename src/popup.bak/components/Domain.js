import React, { PureComponent } from 'react'
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'

import DomainState from './DomainState'

class Domain extends PureComponent {
  render () {
    const { host, blackList, whiteList } = this.props
    let iconType

    switch (true) {
    case (blackList.indexOf(host) >= 0):
      iconType = 1; break
    case (whiteList.indexOf(host) >= 0):
      iconType = 0; break
    default:
      iconType = -1
    }

    return (
      <ListItem>
        <ListItemText primary={host} />
        <ListItemSecondaryAction>
          <IconButton onClick={(e) => this.props.onOpenMenu(e.target, this.props.host, iconType)}>
            {DomainState.find(d => d.value === iconType).icon}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default Domain
