import React, { useState, useEffect } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'

import PROXY_METHODS from '../constants/proxyMethods'

const style = theme => ({
  bottomAlign: {
    verticalAlign: 'bottom'
  }
})

const NewServerPopup = ({ open, serverEditing, onClose, onConfirm, classes }) => {
  const [method, setMethod] = useState(PROXY_METHODS[0])
  const [host, setHost] = useState('')
  const [port, setPort] = useState('')

  useEffect(() => {
    if (serverEditing !== null) {
      setMethod(serverEditing.method)
      setHost(serverEditing.host)
      setPort(serverEditing.port)
    }
  }, [serverEditing])

  return (
    <Dialog keepMounted disableBackdropClick open={open} onClose={onClose}>
      <DialogTitle>
        {chrome.i18n.getMessage('add_proxy_server')}
      </DialogTitle>
      <DialogContent>
        <TextField
          select
          style={{ width: '10em' }}
          className={classes.bottomAlign}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {PROXY_METHODS.map((d, i) => (
            <MenuItem key={i} value={d}>{d}</MenuItem>
          ))}
        </TextField>
        <TextField
          id="host"
          label="Host"
          className={classes.bottomAlign}
          placeholder="example.proxy.com"
          value={host}
          onChange={e => setHost(e.target.value)}
        />
        <TextField
          id="port"
          type="number"
          label="Port"
          placeholder="8080"
          className={classes.bottomAlign}
          inputProps={{ min: 0, max: 65535 }}
          value={port}
          onChange={e => setPort(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => onConfirm({ method, host, port })}>{chrome.i18n.getMessage('confirm')}</Button>
        <Button onClick={onClose}>{chrome.i18n.getMessage('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default withStyles(style)(NewServerPopup)
