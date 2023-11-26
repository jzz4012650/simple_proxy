import { ProxyMethods, ProxyServer } from "../services/config";

export const DEFAULT_PROXY_SERVER: ProxyServer = {
  method: ProxyMethods.PROXY,
  host: '127.0.0.1',
  port: 8080
}
