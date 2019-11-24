import { getConfig } from './config'
import { BLACK_LIST as MODE_BLACK } from '../constants/proxyModes'
import { PROXY_SERVERS, BLACK_LIST, WHITE_LIST } from '../constants/storage'

export const generatePac = async (proxyMode) => {
  const config = await getConfig()
  const proxyServers = config[PROXY_SERVERS].map(d => `${d.method} ${d.host}:${d.port}`).join(';') || 'DIRECT'
  const hostLists = config[proxyMode === MODE_BLACK ? BLACK_LIST : WHITE_LIST]
  const exactHosts = []
  const hostsWithWildcards = []
  hostLists.forEach(host => {
    if (host.includes('*')) {
      hostsWithWildcards.push(host)
    } else {
      exactHosts.push(host)
    }
  })
  const proxyRules = `{
    ${exactHosts.map(d => `"${d}": 1`).join(',')}
  }`
  return `
    function FindProxyForURL(url, host) {
      var rules = ${proxyRules};
      var wildcardsRules = ${JSON.stringify(hostsWithWildcards)};
      var proxyServers = "${proxyServers}";
      if (host in rules) {
        return ${proxyMode === MODE_BLACK ? 'proxyServers' : 'DIRECT'};
      } else {
        for (var i = 0; i < wildcardsRules.length; i++) {
          if (shExpMatch(host, wildcardsRules[i])) {
            return ${proxyMode === MODE_BLACK ? 'proxyServers' : 'DIRECT'};
          }
        }
      }
      return ${proxyMode === MODE_BLACK ? 'DIRECT' : 'proxyServers'};
    }
  `
}
