import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';

import Header from './Header'
import DomainList from './DomainList';
import DomainMenu from './DomainMenu'
import * as actions from '../actions';
import { PROXY_MODES } from '../constants';


class Container extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      anchorHost: null,
      iconType: -1
    }
  }

  handleHideMenu() {
    this.setState({ anchorEl: null })
  }

  handleOpenMenu(target, host, type) {
    this.setState({
      anchorEl: target,
      anchorHost: host,
      iconType: type
    });
  }

  handleMenuChange(prevType, type) {
    this.handleHideMenu()
    this.props.modifyHostType(this.state.anchorHost, prevType, type)
  }

  componentDidMount() {
    let bgPage = chrome.extension.getBackgroundPage();
    Promise.all([
      bgPage.getProxyMode(),
      bgPage.getCurrentTabHosts(),
      bgPage.getProxyRules()
    ]).then(values => {
      this.props.initData({
        mode: values[0],
        hostList: values[1],
        rules: values[2]
      })
    })
  }

  render() {
    return (
      <div className="popup-wrapper">
        <Header
          proxyMode={this.props.proxyMode}
          proxyModes={this.props.proxyModes}
          changeProxyMode={this.props.changeProxyMode}
        />
        <div className="domain-list-wrapper">
          <DomainList
            hostList={this.props.hostList}
            blackList={this.props.blackList}
            whiteList={this.props.whiteList}
            onOpenMenu={this.handleOpenMenu.bind(this)}
          />
        </div>
        <DomainMenu
          iconType={this.state.iconType}
          anchorEl={this.state.anchorEl}
          modifyHostType={this.props.modifyHostType}
          onHide={this.handleHideMenu.bind(this)}
          onMenuChange={this.handleMenuChange.bind(this)}
        />
      </div>
    );
  }
}

export default connect(state => state, actions)(Container);