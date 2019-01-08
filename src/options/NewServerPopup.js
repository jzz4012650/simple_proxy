import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { PROXY_METHODS } from './constants';

const style = theme => ({
  bottomAlign: {
    verticalAlign: 'bottom'
  }
});

const NewServerPopup = ({ open, onClose, classes }) => {
  const [method, setMethod] = useState(PROXY_METHODS[0]);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  return (
    <Dialog keepMounted open={open} onClose={onClose}>
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
        <Button>{chrome.i18n.getMessage('ok')}</Button>
        <Button>{chrome.i18n.getMessage('cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(style)(NewServerPopup);