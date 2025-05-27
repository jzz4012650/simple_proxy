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
import { STORAGE_BLACK_LIST, STORAGE_WHITE_LIST } from "../../constants/storage";
import { updateProxyConfig } from "../../services/proxyConfig";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function HostList() {
  const [hosts, setHosts] = useState<string[]>([]);
  const [blackList, setBlackList] = useState<string[]>([]);
  const [whiteList, setWhiteList] = useState<string[]>([]);

  const blackListSet = useMemo(() => new Set(blackList), [blackList]);
  const whiteListSet = useMemo(() => new Set(whiteList), [whiteList]);

  // Check if all hosts are in the black/white list
  const allInBlackList = useMemo(() => {
    return hosts.length > 0 && hosts.every(host => blackListSet.has(host));
  }, [hosts, blackListSet]);

  const allInWhiteList = useMemo(() => {
    return hosts.length > 0 && hosts.every(host => whiteListSet.has(host));
  }, [hosts, whiteListSet]);

  const getHosts = async () => {
    getHostsOfCurrentTab().then(hosts => {
      setHosts(hosts);
    });
  };

  const getBlackWhiteList = async () => {
    const [blackList, whiteList] = await Promise.all([
      chrome.storage.sync.get(STORAGE_BLACK_LIST),
      chrome.storage.sync.get(STORAGE_WHITE_LIST),
    ]);
    setBlackList(blackList[STORAGE_BLACK_LIST] ?? []);
    setWhiteList(whiteList[STORAGE_WHITE_LIST] ?? []);
  };

  const toggle = (mode: ProxyModes.BlackList | ProxyModes.WhiteList, host: string) => {
    const set = mode === ProxyModes.BlackList ? blackListSet : whiteListSet;
    const storageKey = mode === ProxyModes.BlackList ? STORAGE_BLACK_LIST : STORAGE_WHITE_LIST;
    const setter = mode === ProxyModes.BlackList ? setBlackList : setWhiteList;
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

  const toggleAllInList = (mode: ProxyModes.BlackList | ProxyModes.WhiteList) => {
    const set = mode === ProxyModes.BlackList ? new Set(blackList) : new Set(whiteList);
    const storageKey = mode === ProxyModes.BlackList ? STORAGE_BLACK_LIST : STORAGE_WHITE_LIST;
    const setter = mode === ProxyModes.BlackList ? setBlackList : setWhiteList;
    const allInList = mode === ProxyModes.BlackList ? allInBlackList : allInWhiteList;

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
    getBlackWhiteList();
  }, []);

  return (
    <List
      dense={true}
      subheader={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ListSubheader sx={{ pl: 2 }}>{chrome.i18n.getMessage('domain_list')}</ListSubheader>
          <Box sx={{ display: 'flex', pr: 2 }}>
            <Tooltip title={allInBlackList
              ? chrome.i18n.getMessage('remove_all_from_black')
              : chrome.i18n.getMessage('add_all_to_black')}>
              <IconButton
                edge="end"
                color={allInBlackList ? 'secondary' : 'default'}
                onClick={() => toggleAllInList(ProxyModes.BlackList)}
              >
                {allInBlackList ? <CheckCircleIcon /> : <AddCircleIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={allInWhiteList
              ? chrome.i18n.getMessage('remove_all_from_white')
              : chrome.i18n.getMessage('add_all_to_white')}>
              <IconButton
                edge="end"
                color={allInWhiteList ? 'secondary' : 'default'}
                onClick={() => toggleAllInList(ProxyModes.WhiteList)}
              >
                {allInWhiteList ? <CheckCircleOutlineIcon /> : <AddCircleOutlineIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      }
    >
      {hosts.map(host => {
        const inBlackList = blackListSet.has(host);
        const inWhiteList = whiteListSet.has(host);
        return (
          <ListItem key={host}>
            <ListItemIcon>
              <Public />
            </ListItemIcon>
            <ListItemText primary={host}></ListItemText>
            <Tooltip title={inBlackList ? chrome.i18n.getMessage('remove_from_black') : chrome.i18n.getMessage('add_to_black')}>
              <IconButton
                edge='end'
                color={inBlackList ? 'secondary' : 'default'}
                onClick={() => toggle(ProxyModes.BlackList, host)}
              >
                {inBlackList ? <CheckCircleIcon /> : <AddCircleIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={inWhiteList ? chrome.i18n.getMessage('remove_from_white') : chrome.i18n.getMessage('add_to_white')}>
              <IconButton
                edge='end'
                color={inWhiteList ? 'secondary' : 'default'}
                onClick={() => toggle(ProxyModes.WhiteList, host)}
              >
                {inWhiteList ? <CheckCircleOutlineIcon /> : <AddCircleOutlineIcon />}
              </IconButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}