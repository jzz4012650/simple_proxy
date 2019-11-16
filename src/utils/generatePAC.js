import {get} from 'lodash'
import { PROXY_SERVERS } from "../constants/storage";
import { DEFAULT_PROXY_SERVER } from '../constants/default'

const generateProxyServerStr = (proxyServers) => {
  return proxyServers.length
    ? proxyServers.map(server => `${server.host}:${server.port}`).join(';')
    : 'DIRECT'
}

export const generatePAC = (mode, config) => {
  const proxyServers = get(config, PROXY_SERVERS, [])
  const
  const proxyServerStr = generateProxyServers(proxyServers);
const proxyRules = JSON.stringify(values[1][BLACK_LIST] || [])

resolve(`
    const proxyRules = new Set(${proxyRules});
    const proxyServers = '${proxyServerStr}';
    function FindProxyForURL(url, host) {

        for (var i = 0, l = rules.length; i < l; i++) {
            if (host === rules[i] || host.substr(-rules[i].length - 1) === ('.'+rules[i]))
                return proxyServers;
        }
        return 'DIRECT';
    }
`)
}
