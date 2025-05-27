import { ProxyMethods, ProxyServer } from "../services/config";

export const DEFAULT_PROXY_SERVER: ProxyServer = {
  method: 'PROXY' as ProxyMethods,
  host: '127.0.0.1',
  port: 8080
}

export const DEFAULT_GFWLIST_URL = 'https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt';