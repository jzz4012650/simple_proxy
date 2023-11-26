import { useState } from 'react';
import { ProxyMethods, ProxyServer } from '../../services/config';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function NewServerPopup({ open, onClose, onConfirm }: {
  open: boolean,
  onClose: () => void,
  onConfirm: (proxyServer: ProxyServer) => void,
}) {
  const [method, setMethod] = useState<ProxyMethods>(ProxyMethods.PROXY);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');

  const _onClose = (_event: object, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    onClose();
  };

  return (
    <Dialog keepMounted disableEscapeKeyDown open={open} onClose={_onClose}>
      <DialogTitle>
        {chrome.i18n.getMessage('add_proxy_server')}
      </DialogTitle>
      <DialogContent>
        <Stack direction={'row'} spacing={2}>
          <TextField
            select
            value={method}
            sx={{ width: '7em' }}
            variant='standard'
            label={chrome.i18n.getMessage('proxy_method')}
            onChange={(e) => setMethod(e.target.value as ProxyMethods)}
          >
            {Object.entries(ProxyMethods).map(([key, method]) => (
              <MenuItem key={key} value={method}>{method}</MenuItem>
            ))}
          </TextField>
          <TextField
            id="host"
            label="Host"
            placeholder="example.proxy.com"
            value={host}
            variant='standard'
            onChange={e => setHost(e.target.value)}
          />
          <TextField
            id="port"
            type="number"
            label="Port"
            variant='standard'
            placeholder="8080"
            inputProps={{ min: 0, max: 65535, step: 1 }}
            value={port}
            onChange={e => setPort(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => onConfirm({ method, host, port: Number(port) })}>
          {chrome.i18n.getMessage('confirm')}
        </Button>
        <Button onClick={onClose}>
          {chrome.i18n.getMessage('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
