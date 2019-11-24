import { getConfig } from './config'
import { BLACK_LIST as MODE_BLACK } from '../constants/proxyModes'
import { PROXY_SERVERS, BLACK_LIST, WHITE_LIST } from '../constants/storage'

export const generatePac = async (proxyMode) => {
  const config = await getConfig()
  const proxyServers = config[PROXY_SERVERS].map(d => `${d.method} ${d.host}:${d.port}`).join(';') || 'DIRECT'
  const proxyRules = `{
    ${config[proxyMode === MODE_BLACK ? BLACK_LIST : WHITE_LIST].map(d => `"${d}": 1`).join(',')}
  }`
  return `
    function FindProxyForURL(url, host) {
      var rules = ${proxyRules};
      var proxyServers = "${proxyServers}";
      if (host in rules) {
        return ${proxyMode === MODE_BLACK ? 'proxyServers' : 'DIRECT'};
      }
      return ${proxyMode === MODE_BLACK ? 'DIRECT' : 'proxyServers'};
    }
  `
}
