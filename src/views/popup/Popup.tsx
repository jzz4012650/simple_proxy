import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
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
  const [proxyServers, setProxyServers] = useState<ProxyServer[] | null>(null);
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

  // Loading state
  if (proxyServers === null) return null;

  // No proxy servers configured — show hint instead of normal UI
  if (proxyServers.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
          p: 3,
        }}
      >
        <PublicOffIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="body1" color="text.secondary">
          {chrome.i18n.getMessage('no_proxy_server_hint')}
        </Typography>
        <Link
          component="button"
          variant="body1"
          onClick={() => chrome.runtime.openOptionsPage()}
          sx={{ cursor: 'pointer' }}
        >
          {chrome.i18n.getMessage('no_proxy_server_go_settings')}
        </Link>
      </Box>
    );
  }

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
            color="inherit"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            <Tooltip arrow title={chrome.i18n.getMessage('options')}>
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
