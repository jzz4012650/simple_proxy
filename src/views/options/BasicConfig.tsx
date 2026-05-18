import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import Language from '@mui/icons-material/Language';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProxyServer, getProxyServers, setProxyServers, getGfwlistEnabled, setGfwlistEnabled, refreshGfwlist, getBypassPrivateNetworks, setBypassPrivateNetworks } from '../../services/config';
import NewServerPopup from './NewServerPopup';
import { DnsOutlined } from '@mui/icons-material';

const BasicConfig = () => {
  const navigate = useNavigate();

  // Proxy servers state
  const [proxyServers, _setProxyServers] = useState<ProxyServer[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  // GFWList state
  const [gfwlistEnabled, setGfwlistEnabledState] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Bypass private networks state
  const [bypassPrivateNetworks, setBypassPrivateNetworksState] = useState<boolean>(true);

  const handleNewServer = (newProxyServer: ProxyServer) => {
    const newProxyServers = [newProxyServer, ...proxyServers];
    _setProxyServers(newProxyServers);
    setProxyServers(newProxyServers);
    setShowPopup(false);
  };

  const handleRemoveServer = (index: number) => {
    const newProxyServers = [...proxyServers];
    newProxyServers.splice(index, 1);
    _setProxyServers(newProxyServers);
    setProxyServers(newProxyServers);
  };

  const setPopup = (showPopup: boolean) => {
    setShowPopup(showPopup);
  };

  const handleToTop = (index: number) => {
    const newProxyServers = [...proxyServers];
    const server = newProxyServers.splice(index, 1);
    newProxyServers.unshift(server[0]);
    _setProxyServers(newProxyServers);
    setProxyServers(newProxyServers);
  };

  const handleGfwlistToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setGfwlistEnabledState(enabled);

    try {
      await setGfwlistEnabled(enabled);
      setSnackbarMessage(enabled ?
        chrome.i18n.getMessage('gfwlist_fetch_success') :
        chrome.i18n.getMessage('gfwlist_disabled')
      );
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to update GFWList setting:', error);
      setSnackbarMessage(chrome.i18n.getMessage('gfwlist_fetch_failed'));
      setSnackbarSeverity('error');
      setGfwlistEnabledState(!enabled);
    }
    setSnackbarOpen(true);
  };

  const handleGfwlistRefresh = async () => {
    if (!gfwlistEnabled) {
      setSnackbarMessage(chrome.i18n.getMessage('enable_gfwlist_first'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsRefreshing(true);
    try {
      const success = await refreshGfwlist();
      if (success) {
        setSnackbarMessage(chrome.i18n.getMessage('gfwlist_refresh_success'));
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(chrome.i18n.getMessage('gfwlist_refresh_failed'));
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Failed to refresh GFWlist:', error);
      setSnackbarMessage(chrome.i18n.getMessage('gfwlist_refresh_failed'));
      setSnackbarSeverity('error');
    } finally {
      setIsRefreshing(false);
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePrivateNetworksToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setBypassPrivateNetworksState(enabled);
    await setBypassPrivateNetworks(enabled);
  };

  useEffect(() => {
    getProxyServers().then((res) => {
      _setProxyServers(res);
    });
    getGfwlistEnabled().then((enabled) => {
      setGfwlistEnabledState(enabled);
    });
    getBypassPrivateNetworks().then((enabled) => {
      setBypassPrivateNetworksState(enabled);
    });
  }, []);

  return (
    <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>
      {/* Proxy Servers Section */}
      <Typography variant="h5" component="h5" gutterBottom>
        {chrome.i18n.getMessage('proxy_server_list')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {chrome.i18n.getMessage('proxy_server_desc')}
      </Typography>
      <Card sx={{ mb: 5 }}>
        <List>
          {proxyServers.map((server, i) => (
            <ListItem key={i} divider>
              <ListItemAvatar>
                <Avatar>
                  <DnsOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${server.host}:${server.port}`} secondary={server.method} />
              <ListItemSecondaryAction>
                <Tooltip title={chrome.i18n.getMessage('to_top')}>
                  <IconButton disabled={i === 0} onClick={() => handleToTop(i)}>
                    <VerticalAlignTopIcon />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => handleRemoveServer(i)}>
                  <DeleteForeverIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItemButton onClick={() => setPopup(true)}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {chrome.i18n.getMessage('add_proxy_server')}
            </ListItemText>
          </ListItemButton>
        </List>
      </Card>

      {/* On-Demand Proxy Mode Section */}
      <Typography variant="h5" component="h5" gutterBottom>
        {chrome.i18n.getMessage('on_demand_proxy_mode')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {chrome.i18n.getMessage('on_demand_proxy_mode_desc')}
      </Typography>
      <Card sx={{ mb: 5 }}>
        <List>
          {/* Proxy Domains Entry */}
          <ListItemButton onClick={() => navigate('/proxy-domains')} divider>
            <ListItemAvatar>
              <Avatar>
                <FilterAltOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chrome.i18n.getMessage('proxy_domains_entry')}
              secondary={chrome.i18n.getMessage('proxy_domains_entry_desc')}
            />
            <ListItemSecondaryAction>
              <ArrowForwardIcon color="action" />
            </ListItemSecondaryAction>
          </ListItemButton>

          {/* GFWList Toggle */}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DescriptionOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chrome.i18n.getMessage('enable_gfwlist')}
              secondary={<>
                <span>{chrome.i18n.getMessage('enable_gfwlist_tooltip')}</span>
                {gfwlistEnabled && <Link
                  component="span"
                  variant="body2"
                  onClick={isRefreshing ? undefined : handleGfwlistRefresh}
                  underline="hover"
                  sx={{
                    cursor: isRefreshing ? 'default' : 'pointer',
                    opacity: isRefreshing ? 0.5 : 1,
                    pointerEvents: isRefreshing ? 'none' : 'auto',
                  }}
                >
                  {chrome.i18n.getMessage('refresh_gfwlist')}
                </Link>}
              </>}
            />
            <Switch
              edge="end"
              checked={gfwlistEnabled}
              onChange={handleGfwlistToggle}
              color="primary"
            />
          </ListItem>
        </List>
      </Card>

      {/* Global Proxy Mode Section */}
      <Typography variant="h5" component="h5" gutterBottom>
        {chrome.i18n.getMessage('global_proxy_mode')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {chrome.i18n.getMessage('global_proxy_mode_desc')}
      </Typography>
      <Card>
        <List>
          {/* Bypass Domains Entry */}
          <ListItemButton onClick={() => navigate('/bypass-domains')} divider>
            <ListItemAvatar>
              <Avatar>
                <Language />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chrome.i18n.getMessage('bypass_domains_entry')}
              secondary={chrome.i18n.getMessage('bypass_domains_entry_desc')}
            />
            <ListItemSecondaryAction>
              <ArrowForwardIcon color="action" />
            </ListItemSecondaryAction>
          </ListItemButton>

          {/* Bypass Private Networks Toggle */}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LockOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chrome.i18n.getMessage('bypass_private_networks')}
              secondary={chrome.i18n.getMessage('bypass_private_networks_tooltip')}
            />
            <Switch
              edge="end"
              checked={bypassPrivateNetworks}
              onChange={handlePrivateNetworksToggle}
              color="primary"
            />
          </ListItem>
        </List>
      </Card>

      <NewServerPopup
        open={showPopup}
        onConfirm={handleNewServer}
        onClose={() => setPopup(false)}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BasicConfig;