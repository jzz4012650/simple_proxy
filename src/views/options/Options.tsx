import LinkIcon from '@mui/icons-material/Link';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import Language from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import { createElement, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Navigations = {
  BasicConfig: {
    pathname: '/basic-config',
    text: chrome.i18n.getMessage('basic_config'),
    icon: SettingsIcon,
  },
  ProxyDomains: {
    pathname: '/proxy-domains',
    text: chrome.i18n.getMessage('proxy_domains'),
    icon: FilterAltOutlined
  },
  BypassDomains: {
    pathname: '/bypass-domains',
    text: chrome.i18n.getMessage('bypass_domains'),
    icon: Language,
  },
};

export default function Options() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(Navigations.BasicConfig.pathname);

  useEffect(() => {
    const tab = Object.values(Navigations).find((nav) => nav.pathname === location.pathname);
    if (tab) {
      setCurrentTab(tab.pathname);
    } else {
      navigate(Navigations.BasicConfig.pathname);
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
