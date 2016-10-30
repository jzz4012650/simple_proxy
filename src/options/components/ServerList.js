import React, { Component } from 'react';
import ProxyServer from './ProxyServer';
import { RaisedButton } from 'material-ui';

const ServerList = props => {
    return (
        <div>
            {props.list.map((d, i) =>(
                <ProxyServer
                    server={d}
                    key={i}
                    index={i}
                    add={props.add}
                    remove={props.remove}
                    modify={props.modify}
                />
            ))}
        </div>
    )
}

export default ServerList;