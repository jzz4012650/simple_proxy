import Public from "@mui/icons-material/Public";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Tooltip from "@mui/material/Tooltip";
import { createElement, useEffect, useState } from "react";
import { MESSAGE_HOSTS_UPDATE } from "../../constants/message";
import { PROXY_MODES, ProxyModes } from "../../constants/proxyModes";
import { getHostsOfCurrentTab } from "../../services/tabs";
import { STORAGE_BLACK_LIST, STORAGE_WHITE_LIST } from "../../constants/storage";
import { updateProxyConfig } from "../../services/proxyConfig";

export function HostList() {
  const [hosts, setHosts] = useState<string[]>([]);
  const [blackList, setBlackList] = useState<string[]>([]);
  const [whiteList, setWhiteList] = useState<string[]>([]);
  const blackListSet = new Set(blackList);
  const whiteListSet = new Set(whiteList);

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
        <ListSubheader>{chrome.i18n.getMessage('domain_list')}</ListSubheader>
      }
    >
      {hosts.map(host => {
        const inBlackList = blackListSet.has(host);
        const inWhiteList = whiteListSet.has(host);
        return (
          <ListItem>
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
                {createElement(PROXY_MODES[0].icon)}
              </IconButton>
            </Tooltip>
            <Tooltip title={inWhiteList ? chrome.i18n.getMessage('remove_from_white') : chrome.i18n.getMessage('add_to_white')}>
              <IconButton
                edge='end'
                color={inWhiteList ? 'secondary' : 'default'}
                onClick={() => toggle(ProxyModes.WhiteList, host)}
              >
                {createElement(PROXY_MODES[1].icon)}
              </IconButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>

  );
}