import debounce from 'lodash/debounce';
import { ProxyModes } from '../constants/proxyModes';
import { STORAGE_BLACK_LIST, STORAGE_PROXY_MODE, STORAGE_PROXY_SERVERS, STORAGE_WHITE_LIST } from '../constants/storage';
import { updateProxyConfig } from './proxyConfig';

export type BlackList = string[];
export type WhiteList = string[];

export enum ProxyMethods {
  PROXY = 'PROXY',
  SOCKS5 = 'SOCKS5',
  SOCKS4 = 'SOCKS4',
  SOCKS = 'SOCKS',
  HTTPS = 'HTTPS',
  HTTP = 'HTTP',
}

export type ProxyServer = {
  method: ProxyMethods,
  host: string,
  port: number,
};

export type Config = {
  PROXY_SERVERS: string[],
  BLACK_LIST: BlackList,
  WHITE_LIST: WhiteList,
};

const debounceUpdateProxyConfig = () => debounce(() => {
  updateProxyConfig();
}, 500, { leading: false, trailing: true });

export const getConfig = async () => {
  const [local, sync] = await Promise.all([
    chrome.storage.local.get([STORAGE_PROXY_SERVERS]),
    chrome.storage.sync.get([STORAGE_BLACK_LIST, STORAGE_WHITE_LIST])
  ]);
  return {
    PROXY_SERVERS: local[STORAGE_PROXY_SERVERS] || [],
    BLACK_LIST: sync[STORAGE_BLACK_LIST] || [],
    WHITE_LIST: sync[STORAGE_WHITE_LIST] || []
  };
};

export const saveConfig = async (config: Config) => {
  await Promise.all([
    chrome.storage.local.set({ [STORAGE_PROXY_SERVERS]: config[STORAGE_PROXY_SERVERS] }),
    chrome.storage.sync.set({ [STORAGE_BLACK_LIST]: config[STORAGE_BLACK_LIST], [STORAGE_WHITE_LIST]: config[STORAGE_WHITE_LIST] })
  ]);
  await updateProxyConfig();
};

export const getProxyMode = async () => {
  const res = await chrome.storage.local.get([STORAGE_PROXY_MODE]);
  return res[STORAGE_PROXY_MODE] || ProxyModes.System;
};

export const getProxyServers = async (): Promise<ProxyServer[]> => {
  const res = await chrome.storage.local.get([STORAGE_PROXY_SERVERS]);
  return res[STORAGE_PROXY_SERVERS] || [];
};

export const setProxyServers = async (servers: ProxyServer[]) => {
  await chrome.storage.local.set({ [STORAGE_PROXY_SERVERS]: servers });
  debounceUpdateProxyConfig();
}

export const setProxyMode = async (mode: ProxyModes) => {
  await chrome.storage.local.set({ [STORAGE_PROXY_MODE]: mode });
  await updateProxyConfig();
};

export const getBlackList = async (): Promise<BlackList> => {
  const res = await chrome.storage.sync.get([STORAGE_BLACK_LIST]);
  return res[STORAGE_BLACK_LIST] || [];
}

export const setBlackList = async (blackList: BlackList) => {
  await chrome.storage.sync.set({ [STORAGE_BLACK_LIST]: blackList });
  debounceUpdateProxyConfig();
}

export const getWhiteList = async (): Promise<WhiteList> => {
  const res = await chrome.storage.sync.get([STORAGE_WHITE_LIST]);
  return res[STORAGE_WHITE_LIST] || [];
}

export const setWhiteList = async (whiteList: WhiteList) => {
  await chrome.storage.sync.set({ [STORAGE_WHITE_LIST]: whiteList });
  debounceUpdateProxyConfig();
}

export const updateBlackAndWhiteList = async (blackList: BlackList, whiteList: WhiteList) => {
  await chrome.storage.sync.set({
    [STORAGE_BLACK_LIST]: blackList,
    [STORAGE_WHITE_LIST]: whiteList,
  });
  debounceUpdateProxyConfig();
};
