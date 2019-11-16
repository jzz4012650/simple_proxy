import React, { PureComponent } from 'react';
import { TextField } from 'material-ui';
import Select from 'material-ui/Select'
import Button from 'material-ui/Button'
import { MenuItem } from 'material-ui/Menu'
import IconAdd from 'material-ui-icons/Add'
import IconClear from 'material-ui-icons/Clear'
import { PROXY_TYPES } from '../constants';
import { addProxyServer, deleteProxyServer } from '../actions';

class ProxyServer extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            type: 'HTTP',
            server: '',
            port: ''
        }
    }

    handleTypeChange(e) {
        const { index, modify, server } = this.props;
        let newServer = Object.assign({}, server, { type: e.target.value });
        modify({ index, newServer });
    }

    handleHostChange(e) {
        const { index, modify, server } = this.props;
        let newServer = Object.assign({}, server, { host: e.target.value });
        modify({ index, newServer });
    }

    handlePortChange(e) {
        const { index, modify, server } = this.props;
        let newServer = Object.assign({}, server, { port: e.target.value });
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
            <div style={{ marginTop: 10 }}>
                <Select
                    autoWidth={false}
                    value={this.props.server.type}
                    onChange={this.handleTypeChange.bind(this)}>
                    {PROXY_TYPES.map((d, i) => (
                        <MenuItem key={i} value={d}>{d}</MenuItem>
                    ))}
                </Select>{' '}
                <TextField
                    placeholder="example.proxy.com"
                    value={this.props.server.host}
                    onChange={this.handleHostChange.bind(this)}
                />{' '}
                <TextField
                    placeholder="8080"
                    value={this.props.server.port}
                    onChange={this.handlePortChange.bind(this)}
                />{' '}
                <Button raised dense color="primary"
                    onClick={this.handleAddBtnClick.bind(this)}>
                    <IconAdd />
                </Button>{' '}
                <Button raised dense color="accent"
                    onClick={this.handleClearBtnClick.bind(this)}>
                    <IconClear />
                </Button>
            </div>
        );
    }
}

export default ProxyServer;