import React from 'react'
import { render } from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'

import Container from './components/Container'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  },
  typography: {
    useNextVariants: true
  }
})

render(
  <MuiThemeProvider theme={theme}>
    <Container />
  </MuiThemeProvider>,
  document.getElementById('root')
)
