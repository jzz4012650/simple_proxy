import debounce from 'lodash/debounce';
import { ProxyModes } from '../constants/proxyModes';
import { STORAGE_PROXY_DOMAINS, STORAGE_PROXY_MODE, STORAGE_PROXY_SERVERS, STORAGE_BYPASS_DOMAINS, STORAGE_GFWLIST_ENABLED, LEGACY_BLACK_LIST, LEGACY_WHITE_LIST } from '../constants/storage';
import { updateProxyConfig } from './proxyConfig';
import { getGfwlist } from '../utils/gfwlist';

export type ProxyDomains = string[];
export type BypassDomains = string[];

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
  PROXY_DOMAINS: ProxyDomains,
  BYPASS_DOMAINS: BypassDomains,
};

const debounceUpdateProxyConfig = () => debounce(() => {
  updateProxyConfig();
}, 500, { leading: false, trailing: true });

export const getConfig = async () => {
  const [local, sync] = await Promise.all([
    chrome.storage.local.get([STORAGE_PROXY_SERVERS]),
    chrome.storage.sync.get([STORAGE_PROXY_DOMAINS, STORAGE_BYPASS_DOMAINS, LEGACY_BLACK_LIST, LEGACY_WHITE_LIST])
  ]);
  return {
    PROXY_SERVERS: local[STORAGE_PROXY_SERVERS] || [],
    PROXY_DOMAINS: sync[STORAGE_PROXY_DOMAINS] ?? sync[LEGACY_BLACK_LIST] ?? [],
    BYPASS_DOMAINS: sync[STORAGE_BYPASS_DOMAINS] ?? sync[LEGACY_WHITE_LIST] ?? []
  };
};

export const saveConfig = async (config: Config) => {
  await Promise.all([
    chrome.storage.local.set({ [STORAGE_PROXY_SERVERS]: config[STORAGE_PROXY_SERVERS] }),
    chrome.storage.sync.set({ [STORAGE_PROXY_DOMAINS]: config[STORAGE_PROXY_DOMAINS], [STORAGE_BYPASS_DOMAINS]: config[STORAGE_BYPASS_DOMAINS] })
  ]);
  await updateProxyConfig();
};

export const getProxyMode = async () => {
  const res = await chrome.storage.local.get([STORAGE_PROXY_MODE]);
  const mode = res[STORAGE_PROXY_MODE] || ProxyModes.System;
  // Fallback for legacy values
  if (mode === 'BLACK_LIST') return ProxyModes.OnDemand;
  if (mode === 'WHITE_LIST') return ProxyModes.Global;
  return mode;
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

export const getProxyDomains = async (): Promise<ProxyDomains> => {
  const res = await chrome.storage.sync.get([STORAGE_PROXY_DOMAINS, LEGACY_BLACK_LIST]);
  return res[STORAGE_PROXY_DOMAINS] ?? res[LEGACY_BLACK_LIST] ?? [];
}

export const setProxyDomains = async (proxyDomains: ProxyDomains) => {
  await chrome.storage.sync.set({ [STORAGE_PROXY_DOMAINS]: proxyDomains });
  debounceUpdateProxyConfig();
}

export const getBypassDomains = async (): Promise<BypassDomains> => {
  const res = await chrome.storage.sync.get([STORAGE_BYPASS_DOMAINS, LEGACY_WHITE_LIST]);
  return res[STORAGE_BYPASS_DOMAINS] ?? res[LEGACY_WHITE_LIST] ?? [];
}

export const setBypassDomains = async (bypassDomains: BypassDomains) => {
  await chrome.storage.sync.set({ [STORAGE_BYPASS_DOMAINS]: bypassDomains });
  debounceUpdateProxyConfig();
}

export const updateProxyAndBypassDomains = async (proxyDomains: ProxyDomains, bypassDomains: BypassDomains) => {
  await chrome.storage.sync.set({
    [STORAGE_PROXY_DOMAINS]: proxyDomains,
    [STORAGE_BYPASS_DOMAINS]: bypassDomains,
  });
  debounceUpdateProxyConfig();
};

export const getGfwlistEnabled = async (): Promise<boolean> => {
  const res = await chrome.storage.local.get([STORAGE_GFWLIST_ENABLED]);
  return res[STORAGE_GFWLIST_ENABLED] || false;
};

export const setGfwlistEnabled = async (enabled: boolean) => {
  await chrome.storage.local.set({ [STORAGE_GFWLIST_ENABLED]: enabled });
  await updateProxyConfig();
};

/**
 * 刷新 GFWlist 缓存并更新代理配置
 * @returns 是否刷新成功
 */
export const refreshGfwlist = async (): Promise<boolean> => {
  try {
    // 强制从网络获取最新的 GFWlist
    await getGfwlist(true);
    // 更新代理配置
    await updateProxyConfig();
    return true;
  } catch (error) {
    console.error('Failed to refresh GFWlist:', error);
    return false;
  }
};
