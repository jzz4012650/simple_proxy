import Public from "@mui/icons-material/Public";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useEffect, useState, useMemo } from "react";
import { MESSAGE_HOSTS_UPDATE } from "../../constants/message";
import { ProxyModes } from "../../constants/proxyModes";
import { getHostsOfCurrentTab } from "../../services/tabs";
import { STORAGE_PROXY_DOMAINS, STORAGE_BYPASS_DOMAINS, LEGACY_BLACK_LIST, LEGACY_WHITE_LIST } from "../../constants/storage";
import { updateProxyConfig } from "../../services/proxyConfig";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function HostList() {
  const [hosts, setHosts] = useState<string[]>([]);
  const [proxyDomains, setProxyDomains] = useState<string[]>([]);
  const [bypassDomains, setBypassDomains] = useState<string[]>([]);

  const proxyDomainsSet = useMemo(() => new Set(proxyDomains), [proxyDomains]);
  const bypassDomainsSet = useMemo(() => new Set(bypassDomains), [bypassDomains]);

  // Check if all hosts are in the proxy/bypass domains
  const allInProxyDomains = useMemo(() => {
    return hosts.length > 0 && hosts.every(host => proxyDomainsSet.has(host));
  }, [hosts, proxyDomainsSet]);

  const allInBypassDomains = useMemo(() => {
    return hosts.length > 0 && hosts.every(host => bypassDomainsSet.has(host));
  }, [hosts, bypassDomainsSet]);

  const getHosts = async () => {
    getHostsOfCurrentTab().then(hosts => {
      setHosts(hosts);
    });
  };

  const getProxyAndBypassDomains = async () => {
    const syncData = await chrome.storage.sync.get([STORAGE_PROXY_DOMAINS, STORAGE_BYPASS_DOMAINS, LEGACY_BLACK_LIST, LEGACY_WHITE_LIST]);
    setProxyDomains(syncData[STORAGE_PROXY_DOMAINS] ?? syncData[LEGACY_BLACK_LIST] ?? []);
    setBypassDomains(syncData[STORAGE_BYPASS_DOMAINS] ?? syncData[LEGACY_WHITE_LIST] ?? []);
  };

  const toggle = (mode: ProxyModes.OnDemand | ProxyModes.Global, host: string) => {
    const set = mode === ProxyModes.OnDemand ? proxyDomainsSet : bypassDomainsSet;
    const storageKey = mode === ProxyModes.OnDemand ? STORAGE_PROXY_DOMAINS : STORAGE_BYPASS_DOMAINS;
    const setter = mode === ProxyModes.OnDemand ? setProxyDomains : setBypassDomains;
    if (set.has(host)) {
      set.delete(host);
    } else {
      set.add(host);
    }
    const newList = Array.from(set);
    chrome.storage.sync.set({ [storageKey]: newList });
    updateProxyConfig();
    setter(newList);
  };

  const toggleAllInList = (mode: ProxyModes.OnDemand | ProxyModes.Global) => {
    const set = mode === ProxyModes.OnDemand ? new Set(proxyDomains) : new Set(bypassDomains);
    const storageKey = mode === ProxyModes.OnDemand ? STORAGE_PROXY_DOMAINS : STORAGE_BYPASS_DOMAINS;
    const setter = mode === ProxyModes.OnDemand ? setProxyDomains : setBypassDomains;
    const allInList = mode === ProxyModes.OnDemand ? allInProxyDomains : allInBypassDomains;

    if (allInList) {
      // Remove all hosts from the list
      hosts.forEach(host => {
        set.delete(host);
      });
    } else {
      // Add all hosts to the list
      hosts.forEach(host => {
        set.add(host);
      });
    }

    const newList = Array.from(set);
    chrome.storage.sync.set({ [storageKey]: newList });
    updateProxyConfig();
    setter(newList);
  };

  useEffect(() => {
    const callback = (message: string) => {
      if (message === MESSAGE_HOSTS_UPDATE) {
        getHosts();
      }
    };
    chrome.runtime.onMessage.addListener(callback);
    return () => {
      chrome.runtime.onMessage.removeListener(callback);
    };
  }, []);

  useEffect(() => {
    getHosts();
    getProxyAndBypassDomains();
  }, []);

  return (
    <List
      dense={true}
      subheader={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ListSubheader sx={{ pl: 2 }}>{chrome.i18n.getMessage('domain_list')}</ListSubheader>
          <Box sx={{ display: 'flex', pr: 2 }}>
            <Tooltip title={allInProxyDomains
              ? chrome.i18n.getMessage('remove_all_from_proxy_domains')
              : chrome.i18n.getMessage('add_all_to_proxy_domains')}>
              <IconButton
                edge="end"
                color={allInProxyDomains ? 'secondary' : 'default'}
                onClick={() => toggleAllInList(ProxyModes.OnDemand)}
              >
                {allInProxyDomains ? <CheckCircleIcon /> : <AddCircleIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={allInBypassDomains
              ? chrome.i18n.getMessage('remove_all_from_bypass_domains')
              : chrome.i18n.getMessage('add_all_to_bypass_domains')}>
              <IconButton
                edge="end"
                color={allInBypassDomains ? 'secondary' : 'default'}
                onClick={() => toggleAllInList(ProxyModes.Global)}
              >
                {allInBypassDomains ? <CheckCircleOutlineIcon /> : <AddCircleOutlineIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      }
    >
      {hosts.map(host => {
        const inProxyDomains = proxyDomainsSet.has(host);
        const inBypassDomains = bypassDomainsSet.has(host);
        return (
          <ListItem key={host}>
            <ListItemIcon>
              <Public />
            </ListItemIcon>
            <ListItemText primary={host}></ListItemText>
            <Tooltip title={inProxyDomains ? chrome.i18n.getMessage('remove_from_proxy_domains') : chrome.i18n.getMessage('add_to_proxy_domains')}>
              <IconButton
                edge='end'
                color={inProxyDomains ? 'secondary' : 'default'}
                onClick={() => toggle(ProxyModes.OnDemand, host)}
              >
                {inProxyDomains ? <CheckCircleIcon /> : <AddCircleIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={inBypassDomains ? chrome.i18n.getMessage('remove_from_bypass_domains') : chrome.i18n.getMessage('add_to_bypass_domains')}>
              <IconButton
                edge='end'
                color={inBypassDomains ? 'secondary' : 'default'}
                onClick={() => toggle(ProxyModes.Global, host)}
              >
                {inBypassDomains ? <CheckCircleOutlineIcon /> : <AddCircleOutlineIcon />}
              </IconButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}