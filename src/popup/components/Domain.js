import React, {Component} from 'react';
import { ListItem, IconMenu, IconButton, MenuItem } from 'material-ui';
import FontIcon from 'material-ui/FontIcon';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

class Domain extends Component {

    constructor(props) {
        super(props);
        this.iconType = -1;
    }


    handleHostTypeChange(e, child) {
        let type = child.props.value;
        let prevType = this.iconType;
        this.props.modifyHostType(this.props.host, prevType, type);
    }

    renderRightIconBtton(iconType) {
        let icon = <MoreVertIcon/>;

        if (iconType === 0) icon = <RemoveCircleOutline/>;
        if (iconType === 1) icon = <RemoveCircle/>;

        return (
            <IconMenu
                onItemTouchTap={this.handleHostTypeChange.bind(this)}
                iconButtonElement={<IconButton>{icon}</IconButton>}>
                <MenuItem value={-1} primaryText="Neither" leftIcon={<MoreVertIcon/>}/>
                <MenuItem value={1} primaryText="Black" leftIcon={<RemoveCircle/>}/>
                <MenuItem value={0} primaryText="White" leftIcon={<RemoveCircleOutline/>}/>
            </IconMenu>
        )
    }

    render() {
        const { host, blackList, whiteList } = this.props;

        switch(true) {
            case (blackList.indexOf('*' + host) >= 0):
                this.iconType = 1; break;
            case (whiteList.indexOf('*' + host) >= 0):
                this.iconType = 0; break;
            default:
                this.iconType = -1;
        }

        return (
            <ListItem
                disabled={true}
                primaryText={host}
                autoGenerateNestedIndicator={false}
                rightIconButton={this.renderRightIconBtton(this.iconType)}>
            </ListItem>
        );
    }
}

export default Domain;