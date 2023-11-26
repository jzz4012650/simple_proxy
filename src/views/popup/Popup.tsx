import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createElement, useEffect, useState } from 'react';
import { PROXY_MODES, ProxyModes } from '../../constants/proxyModes';
import { ProxyServer, getProxyMode, getProxyServers, setProxyMode } from '../../services/config';
import { HostList } from './HostList';

function Popup() {
  const [mode, setMode] = useState<ProxyModes>(ProxyModes.System);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [proxyServers, setProxyServers] = useState<ProxyServer[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const currentMode = PROXY_MODES.find(d => d.name === mode);

  const _setProxyMode = (_mode: ProxyModes) => {
    setMode(_mode);
    setProxyMode(_mode);
    setMenuOpen(false);
  };

  useEffect(() => {
    getProxyMode().then(mode => {
      setMode(mode);
    });
    getProxyServers().then(servers => {
      setProxyServers(servers);
    });
  }, []);

  return (
    <>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant="body1" >{chrome.i18n.getMessage('proxy_mode')}</Typography>
          <Button
            variant='text'
            color='inherit'
            sx={{ flexGrow: 1 }}
            startIcon={currentMode && createElement(currentMode.icon)}
            endIcon={<ArrowDropDownIcon />}
            onClick={e => { setMenuAnchor(e.currentTarget); setMenuOpen(true); }}
          >
            {currentMode && currentMode.title}
          </Button>
          <Menu anchorEl={menuAnchor} open={menuOpen} onClose={() => setMenuOpen(false)}>
            {PROXY_MODES.map(mode => (
              <MenuItem value={mode.name} onClick={() => _setProxyMode(mode.name)}>
                <ListItemIcon>{createElement(mode.icon)}</ListItemIcon>
                <ListItemText primary={mode.title} secondary={mode.desc}></ListItemText>
              </MenuItem>
            ))}
          </Menu>
          <IconButton
            size="large"
            aria-label="settings"
            edge="end"
            color={proxyServers.length ? "inherit" : "warning"}
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            <Tooltip arrow open={proxyServers.length === 0} title={chrome.i18n.getMessage('no_proxy_server_warning')}>
              <SettingsIcon />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </AppBar >
      <Box flexGrow={1} overflow='auto'>
        <HostList />
      </Box>
    </>
  );
}

export default Popup;
