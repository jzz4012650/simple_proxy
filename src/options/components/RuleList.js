import React, { Component } from 'react';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { RaisedButton } from 'material-ui';
import ProxyRule from './ProxyRule';

const RuleList = props => {
    if (props.list.length) {
        return (
            <div>
                {props.list.map((d, i) =>(
                    <ProxyRule
                        key={i}
                        index={i}
                        value={d}
                        type={props.type}
                        add={props.add}
                        remove={props.remove}
                        modify={props.modify}/>
                ))}
            </div>
        )
    } else {
        return (
            <div>
                <ProxyRule
                    index={0}
                    value={''}
                    type={props.type}
                    add={props.add}
                    remove={props.remove}
                    modify={props.modify}
                />
            </div>
        )
    }
}

export default RuleList;