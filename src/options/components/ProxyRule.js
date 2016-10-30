import React, { Component } from 'react';
import { TextField, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';


class ProxyRule extends Component {

    handleRuleChange(e, value) {
        const { index, type } = this.props;
        this.props.modify({ index, value, type });
    }

    handleAddBtnClick() {
        const { index, type } = this.props;
        this.props.add({ index, type });
    }

    handleClearBtnClick() {
        const { index, type } = this.props;
        this.props.remove({ index, type });
    }

    render() {
        return (
            <div>
                <TextField
                    style={{ verticalAlign: 'bottom' }}
                    hintText="some.host.com"
                    value={this.props.value}
                    onChange={this.handleRuleChange.bind(this)}
                />
                <FloatingActionButton
                    mini={true}
                    style={{ margin: '0 0 0 0.5em', verticalAlign: 'top' }}
                    onClick={this.handleAddBtnClick.bind(this)}>
                    <ContentAdd/>
                </FloatingActionButton>
                <FloatingActionButton
                    mini={true}
                    secondary={true}
                    style={{ margin: '0 0 0 0.5em', verticalAlign: 'top' }}
                    onClick={this.handleClearBtnClick.bind(this)}>
                    <ContentClear/>
                </FloatingActionButton>
            </div>
        );
    }
}

export default ProxyRule;