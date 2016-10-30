import React, { Component } from 'react';
import { connect } from 'react-redux'
import { SelectField, MenuItem } from 'material-ui';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import DomainList from './DomainList';
import * as actions from '../actions';
import { PROXY_MODES } from '../constants';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleProxyModeChange = this.handleProxyModeChange.bind(this);
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

    handleProxyModeChange(e, index, value) {
        this.props.changeProxyMode(value);
    }

    render() {
        return (
            <div className="popup-wrapper">
                <h2>Proxy Mode:
                    <SelectField
                        autoWidth={true}
                        value={this.props.proxyMode}
                        style={{ margin: '0 0 0 0.5em', verticalAlign: 'middle' }}
                        labelStyle={{ color: '#FFF' }}
                        onChange={this.handleProxyModeChange}>
                        {this.props.proxyModes.map((d, i) => (
                            <MenuItem
                                key={i}
                                value={d.name}
                                primaryText={<span className="mode-option">{d.name}</span>}
                                secondaryText={<span className="explanation">{d.desc}</span>}
                            />
                        ))}
                    </SelectField>
                </h2>
                <div className="domain-list-wrapper">
                    <DomainList
                        hostList={this.props.hostList}
                        blackList={this.props.blackList}
                        whiteList={this.props.whiteList}
                        modifyHostType={this.props.modifyHostType}/>
                </div>
            </div>
        );
    }
}

export default connect(state => state, actions)(Container);