import React, { Component } from 'react';
import { connect } from 'react-redux'
import { AppBar, FlatButton, Snackbar, Tabs, Tab } from 'material-ui';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import IconSave from 'material-ui/svg-icons/content/save'
import IconList from 'material-ui/svg-icons/action/list'
import * as actions from '../actions';
import ServerList from './ServerList';
import RuleList from './RuleList';

class Container extends Component {

    componentDidMount() {
        let bgPage = chrome.extension.getBackgroundPage();
        Promise.all([
            bgPage.getProxyServers(),
            bgPage.getProxyRules()
        ]).then(values => {
            this.props.initConfiguration(values);
        }, reason => {
            console.log(reason);
        })
    }

    render() {
        return (
            <div className="container">
                <AppBar
                    title={chrome.i18n.getMessage("options")}
                    style={{ position: 'fixed', top: 0, left: 0 }}
                    iconElementRight={
                        <FlatButton
                            icon={<IconSave />}
                            label={chrome.i18n.getMessage("save_option")}
                            onClick={this.props.saveConfig.bind(null, this.props.proxyServers, this.props.blackList, this.props.whiteList)}
                        />
                    }
                />
                <div className="main-body">
                    <Card style={{ margin: 20 }}>
                        <CardTitle title={chrome.i18n.getMessage("proxy_server_list")} subtitle={chrome.i18n.getMessage("proxy_server_desc")} />
                        <CardText>
                            <ServerList
                                list={this.props.proxyServers}
                                add={this.props.addProxyServer}
                                remove={this.props.deleteProxyServer}
                                modify={this.props.modifyProxyServer}
                            />
                        </CardText>
                    </Card>
                    <div style={{ margin: 20 }}>
                        <Tabs>
                            <Tab icon={<IconList />} label={chrome.i18n.getMessage("white_list")}>
                                <Card>
                                    <CardTitle title={chrome.i18n.getMessage("white_list")} subtitle={chrome.i18n.getMessage("white_list_desc")} />
                                    <CardText>
                                        <RuleList
                                            type={0}
                                            list={this.props.whiteList}
                                            add={this.props.addProxyRule}
                                            remove={this.props.deleteProxyRule}
                                            modify={this.props.modifyProxyRule} />
                                    </CardText>
                                </Card>
                            </Tab>
                            <Tab icon={<IconList />} label={chrome.i18n.getMessage("black_list")}>
                                <Card>
                                    <CardTitle title={chrome.i18n.getMessage("black_list")} subtitle={chrome.i18n.getMessage("black_list_desc")} />
                                    <CardText>
                                        <RuleList
                                            type={1}
                                            list={this.props.blackList}
                                            add={this.props.addProxyRule}
                                            remove={this.props.deleteProxyRule}
                                            modify={this.props.modifyProxyRule} />
                                    </CardText>
                                </Card>
                            </Tab>
                        </Tabs>
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
        );
    }
}

export default connect(state => state, actions)(Container);;