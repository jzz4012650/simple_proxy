import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'
import Options from './components/Options'
import store from './redux/store'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  },
  typography: {
    useNextVariants: true
  }
})

function App () {
  return (
    <Fragment>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <HashRouter>
            <Route path="/" component={Options}/>
          </HashRouter>
        </Provider>
      </MuiThemeProvider>
    </Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
