import { ProxyModes } from '../constants/proxyModes';
import { STORAGE_BLACK_LIST, STORAGE_PROXY_SERVERS, STORAGE_WHITE_LIST } from '../constants/storage';
import { ProxyServer, getConfig } from './config';

export const generatePac = async (proxyMode: ProxyModes) => {
  const config = await getConfig();
  const proxyServers = config[STORAGE_PROXY_SERVERS].map((d: ProxyServer) => `${d.method} ${d.host}:${d.port}`).join(';') || 'DIRECT';
  const hostLists = config[proxyMode === ProxyModes.BlackList ? STORAGE_BLACK_LIST : STORAGE_WHITE_LIST];
  const exactHosts: string[] = [];
  const hostsWithWildcards: string[] = [];
  hostLists.forEach((host: string) => {
    if (host.includes('*')) {
      hostsWithWildcards.push(host);
    } else {
      exactHosts.push(host);
    }
  });
  const proxyRules = `{
    ${exactHosts.map(d => `"${d}": 1`).join(',')}
  }`;
  return `
    function FindProxyForURL(url, host) {
      var rules = ${proxyRules};
      var wildcardsRules = ${JSON.stringify(hostsWithWildcards)};
      var proxyServers = "${proxyServers}";
      if (host in rules) {
        return ${proxyMode === ProxyModes.BlackList ? 'proxyServers' : 'DIRECT'};
      } else {
        for (var i = 0; i < wildcardsRules.length; i++) {
          if (shExpMatch(host, wildcardsRules[i])) {
            return ${proxyMode === ProxyModes.BlackList ? 'proxyServers' : 'DIRECT'};
          }
        }
      }
      return ${proxyMode === ProxyModes.BlackList ? 'DIRECT' : 'proxyServers'};
    }
  `;
};
