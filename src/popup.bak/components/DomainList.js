import React, { PureComponent } from 'react'
import List, { ListSubheader } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'

import Domain from './Domain'

const styles = theme => ({
  list: {
    background: theme.palette.background.paper
  }
})

class DomainList extends PureComponent {
  render () {
    const props = this.props
    return (
      <List
        className={props.classes.list}
        subheader={<ListSubheader>{chrome.i18n.getMessage('domain_list')}</ListSubheader>}>
        {props.hostList.map((d, i) => (
          <Domain
            key={i}
            index={i}
            host={d}
            onOpenMenu={this.props.onOpenMenu}
            blackList={props.blackList}
            whiteList={props.whiteList}
          />
        ))}
      </List>
    )
  }
}

export default withStyles(styles)(DomainList)
