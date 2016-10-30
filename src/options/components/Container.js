import React, { Component } from 'react';
import { connect } from 'react-redux'
import { AppBar, FlatButton, Snackbar } from 'material-ui';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
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
                    title="OPTIONS"
                    style={{ position: 'fixed', top: 0, left: 0 }}
                    iconElementRight={
                        <FlatButton
                            label="SAVE"
                            onClick={this.props.saveConfig.bind(null, this.props.proxyServers, this.props.blackList, this.props.whiteList)}
                        />
                    }
                />
                <div className="main-body">
                    <Card style={{ margin: 20 }}>
                        <CardTitle title="Proxy Server List" subtitle="Configure your proxy server. One proxy server a line."/>
                        <CardText>
                            <ServerList
                                list={this.props.proxyServers}
                                add={this.props.addProxyServer}
                                remove={this.props.deleteProxyServer}
                                modify={this.props.modifyProxyServer}
                            />
                        </CardText>
                    </Card>
                    <Card style={{ margin: 20 }}>
                        <CardTitle title="White List" subtitle="white list"/>
                        <CardText>
                            <RuleList
                                type={0}
                                list={this.props.whiteList}
                                add={this.props.addProxyRule}
                                remove={this.props.deleteProxyRule}
                                modify={this.props.modifyProxyRule}/>
                        </CardText>
                    </Card>
                    <Card style={{ margin: 20 }}>
                        <CardTitle title="Black List" subtitle="black list"/>
                        <CardText>
                            <RuleList
                                type={1}
                                list={this.props.blackList}
                                add={this.props.addProxyRule}
                                remove={this.props.deleteProxyRule}
                                modify={this.props.modifyProxyRule}/>
                        </CardText>
                    </Card>
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