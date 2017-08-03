import React, { Component } from 'react';
import { List } from 'material-ui';
import Domain from './Domain';


const DomainList = props => {
    return (
        <List>
            {props.hostList.map((d, i) => (
                <Domain
                    key={i}
                    index={i}
                    host={d}
                    blackList={props.blackList}
                    whiteList={props.whiteList}
                    modifyHostType={props.modifyHostType}
                />
            ))}
        </List>
    );
};

export default DomainList;