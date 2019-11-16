import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Snackbar } from 'material-ui'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Tabs, { Tab } from 'material-ui/Tabs'
import AppBar from 'material-ui/AppBar'
import IconSave from 'material-ui-icons/Save'
import IconList from 'material-ui-icons/List'

import * as actions from '../actions'
import Header from './Header'
import ServerList from './ServerList'
import RuleList from './RuleList'

class Container extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'black'
    }
  }

  componentDidMount() {
    let bgPage = chrome.extension.getBackgroundPage()
    Promise.all([
      bgPage.getProxyServers(),
      bgPage.getProxyRules()
    ]).then(([servers, rules]) => {
      this.props.initConfiguration(servers, rules)
    }, reason => {
      console.log(reason)
    })
  }

  handleSaveConfig() {
    this.props.saveConfig(
      this.props.proxyServers,
      this.props.blackList,
      this.props.whiteList
    )
  }

  render() {
    return (
      <div className="container">
        <Header onSave={this.handleSaveConfig.bind(this)} migrate={this.props.migrate}/>
        <div className="main-body">
          <Card style={{ margin: 20 }}>
            <CardHeader title={chrome.i18n.getMessage("proxy_server_list")} subheader={chrome.i18n.getMessage("proxy_server_desc")} />
            <CardContent>
              <ServerList
                list={this.props.proxyServers}
                add={this.props.addProxyServer}
                remove={this.props.deleteProxyServer}
                modify={this.props.modifyProxyServer}
              />
            </CardContent>
          </Card>
          <div style={{ margin: 20 }}>
            <AppBar position="static" color="primary">
              <Tabs
                value={this.state.activeTab}
                onChange={(e, v) => this.setState({ activeTab: v })}>
                <Tab value="black" icon={<IconList />} label={chrome.i18n.getMessage("black_list")} />
                <Tab value="white" icon={<IconList />} label={chrome.i18n.getMessage("white_list")} />
              </Tabs>
            </AppBar>
            {this.state.activeTab === 'black' &&
              <Card>
                <CardHeader title={chrome.i18n.getMessage("black_list")} subheader={chrome.i18n.getMessage("black_list_desc")} />
                <CardContent>
                  <RuleList
                    type={1}
                    list={this.props.blackList}
                    add={this.props.addProxyRule}
                    remove={this.props.deleteProxyRule}
                    modify={this.props.modifyProxyRule} />
                </CardContent>
              </Card>
            }
            {this.state.activeTab === 'white' &&
              <Card>
                <CardHeader title={chrome.i18n.getMessage("white_list")} subheader={chrome.i18n.getMessage("white_list_desc")} />
                <CardContent>
                  <RuleList
                    type={0}
                    list={this.props.whiteList}
                    add={this.props.addProxyRule}
                    remove={this.props.deleteProxyRule}
                    modify={this.props.modifyProxyRule} />
                </CardContent>
              </Card>
            }
          </div>
        </div>
        <Snackbar
          open={this.props.showSnackbar}
          message={this.props.snackbarType ?
            <span style={{ color: '#8bc34a' }}>{this.props.snackbarContent}</span> :
            <span style={{ color: '#e91e63' }}>{this.props.snackbarContent}</span>
          }
          autoHideDuration={4000}
          onRequestClose={this.props.handleSnackbarClose}
        />
      </div>
    )
  }
}

export default connect(state => state, actions)(Container)