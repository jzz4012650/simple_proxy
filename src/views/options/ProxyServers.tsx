import AddIcon from '@mui/icons-material/Add';
import Cloud from '@mui/icons-material/Cloud';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';

import { ProxyServer, getProxyServers, setProxyServers } from '../../services/config';
import NewServerPopup from './NewServerPopup';
import ListItemButton from '@mui/material/ListItemButton';

const ProxyServers = () => {
  const [proxyServers, _setProxyServers] = useState<ProxyServer[]>([]);
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    getProxyServers().then((res) => {
      _setProxyServers(res);
    });
  }, []);

  return (
    <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>
      <Typography variant="h4" component="h4" gutterBottom>
        {chrome.i18n.getMessage('proxy_server_list')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {chrome.i18n.getMessage('proxy_server_desc')}
      </Typography>
      <Card>
        <List>
          {proxyServers.map((server, i) => (
            <ListItem key={i} divider>
              <ListItemIcon>
                <Cloud />
              </ListItemIcon>
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
              <Avatar >
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {chrome.i18n.getMessage('add_proxy_server')}
            </ListItemText>
          </ListItemButton>
        </List>
      </Card>
      <NewServerPopup
        open={showPopup}
        onConfirm={handleNewServer}
        onClose={() => setPopup(false)}
      />
    </Box>
  );
};

export default ProxyServers;
