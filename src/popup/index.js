import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue } from 'material-ui/colors'

import reducers from './reducers'
import Container from './components/Container';

let store = createStore(reducers, applyMiddleware(promiseMiddleware));

const theme = createMuiTheme({
    palette: {
        primary: blue
    }
});

render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <Container />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);