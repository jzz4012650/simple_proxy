import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import {blue, pink} from '@material-ui/core/colors';
import Options from './Options';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
  typography: {
    useNextVariants: true,
  },
});

function App() {
  return (
    <Fragment>
      <CssBaseline/>
      <MuiThemeProvider theme={theme}>
        <Options></Options>
      </MuiThemeProvider>
    </Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
