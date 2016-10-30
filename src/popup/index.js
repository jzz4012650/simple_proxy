import './index.less';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import { MuiThemeProvider } from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducers from './reducers'
import Container from './components/Container';

let store = createStore(reducers, applyMiddleware(promiseMiddleware));

injectTapEventPlugin();

render(
    <Provider store={store}>
        <MuiThemeProvider>
            <Container/>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);