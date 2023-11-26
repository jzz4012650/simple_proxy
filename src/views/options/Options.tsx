import Cloud from '@mui/icons-material/Cloud';
import LinkIcon from '@mui/icons-material/Link';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import { createElement, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Navigations = {
  ProxyServer: {
    pathname: '/proxy-servers',
    text: chrome.i18n.getMessage('proxy_server'),
    icon: Cloud,
  },
  BlackList: {
    pathname: '/black-list',
    text: chrome.i18n.getMessage('black_list'),
    icon: RadioButtonCheckedIcon
  },
  WhiteList: {
    pathname: '/white-list',
    text: chrome.i18n.getMessage('white_list'),
    icon: RadioButtonUncheckedIcon,
  },
};

export default function Options() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(Navigations.ProxyServer.pathname);

  useEffect(() => {
    const tab = Object.values(Navigations).find((nav) => nav.pathname === location.pathname);
    if (tab) {
      setCurrentTab(tab.pathname);
    } else {
      navigate(Navigations.ProxyServer.pathname);
    }
  }, [location, navigate]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <LinkIcon />
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Tabs
              indicatorColor="secondary"
              textColor="inherit"
              centered
              value={currentTab}
              onChange={(_event, value) => navigate(value)}
            >
              {Object.entries(Navigations).map(([key, nav]) => (
                <Tab key={key} value={nav.pathname} label={nav.text} icon={createElement(nav.icon)} />
              ))}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box >
          <Outlet />
        </Box>
      </Container>
    </>
  );
}
