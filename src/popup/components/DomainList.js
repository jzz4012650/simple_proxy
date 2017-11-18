import React, { PureComponent } from 'react';
import List, { ListSubheader } from 'material-ui/List';
import Domain from './Domain';

class DomainList extends PureComponent {
  render() {
    const props = this.props
    return (
      <List subheader={<ListSubheader>{chrome.i18n.getMessage("domain_list")}</ListSubheader>}>
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

export default DomainList;