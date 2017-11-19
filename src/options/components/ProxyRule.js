import React, { PureComponent } from 'react';
import { TextField } from 'material-ui';
import Button from 'material-ui/Button'
import ContentAdd from 'material-ui-icons/Add'
import ContentClear from 'material-ui-icons/Clear'

class ProxyRule extends PureComponent {

    handleRuleChange(e) {
        const { index, type } = this.props;
        this.props.modify({ index, type, value: e.target.value.trim() });
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
            <div style={{ marginTop: 10 }}>
                <TextField
                    style={{ verticalAlign: 'bottom' }}
                    placeholder="some.host.com"
                    value={this.props.value}
                    onChange={this.handleRuleChange.bind(this)}
                />{' '}
                <Button raised dense color="primary"
                    onClick={this.handleAddBtnClick.bind(this)}>
                    <ContentAdd />
                </Button>{' '}
                <Button raised dense color="accent"
                    onClick={this.handleClearBtnClick.bind(this)}>
                    <ContentClear />
                </Button>
            </div>
        );
    }
}

export default ProxyRule;