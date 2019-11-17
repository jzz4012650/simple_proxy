import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { SHOW_SNACK } from '../constants/channels'

class SnackbarWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      message: ''
    }
    this.show = this.show.bind(this)
  }

  componentDidMount () {
    window.addEventListener(SHOW_SNACK, this.show)
  }

  componentWillUnmount () {
    window.removeEventListener(SHOW_SNACK, this.show)
  }

  show ({ detail }) {
    this.setState({
      open: true,
      message: detail
    })
  }

  render () {
    const { open, message } = this.state
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={4000}
        onClose={() => this.setState({ open: false })}
        message={<span>{message}</span>}
      />
    )
  }
}

export const showSnack = function (msg) {
  const e = new window.CustomEvent(SHOW_SNACK, { detail: msg })
  window.dispatchEvent(e)
}

export default SnackbarWrapper
