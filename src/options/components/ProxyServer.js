import React, { Component } from 'react';
import { SelectField, MenuItem, TextField, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { PROXY_TYPES } from '../constants';
import { addProxyServer, deleteProxyServer } from '../actions';

class ProxyServer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'HTTP',
            server: '',
            port: ''
        }
    }

    handleTypeChange(e, i, type) {
        const { index, modify, server } = this.props;
        let newServer = Object.assign({}, server, { type });
        modify({ index, newServer });
    }

    handleHostChange(e, host) {
        const { index, modify, server } = this.props;
        let newServer = Object.assign({}, server, { host });
        modify({ index, newServer });
    }

    handlePortChange(e, port) {
        const { index, modify, server } = this.props;
        let newServer = Object.assign({}, server, { port });
        modify({ index, newServer });
    }

    handleAddBtnClick() {
        this.props.add({ index: this.props.index });
    }

    handleClearBtnClick() {
        this.props.remove({ index: this.props.index });
    }

    render() {
        return (
            <div className="proxy-server">
                <SelectField
                    value={this.props.server.type}
                    style={{ verticalAlign: 'bottom', textAlign: 'left' }}
                    onChange={this.handleTypeChange.bind(this)}>
                    {PROXY_TYPES.map((d, i) => (
                        <MenuItem key={i} value={d} primaryText={d}/>
                    ))}
                </SelectField>
                <TextField
                    hintText="example.proxy.com"
                    value={this.props.server.host}
                    style={{ verticalAlign: 'bottom' }}
                    onChange={this.handleHostChange.bind(this)}
                />
                <TextField
                    hintText="8080"
                    value={this.props.server.port}
                    style={{ verticalAlign: 'bottom' }}
                    onChange={this.handlePortChange.bind(this)}
                />
                <FloatingActionButton mini
                    style={{ margin: '0 0 0 0.5em', verticalAlign: 'top' }}
                    onClick={this.handleAddBtnClick.bind(this)}>
                    <ContentAdd/>
                </FloatingActionButton>
                <FloatingActionButton mini secondary
                    style={{ margin: '0 0 0 0.5em', verticalAlign: 'top' }}
                    onClick={this.handleClearBtnClick.bind(this)}>
                    <ContentClear/>
                </FloatingActionButton>
            </div>
        );
    }
}

export default ProxyServer;