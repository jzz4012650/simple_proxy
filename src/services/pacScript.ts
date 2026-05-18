import { ProxyModes } from '../constants/proxyModes';
import { STORAGE_PROXY_DOMAINS, STORAGE_PROXY_SERVERS, STORAGE_BYPASS_DOMAINS } from '../constants/storage';
import { ProxyServer, getConfig, getGfwlistEnabled, getBypassPrivateNetworks } from './config';
import { getGfwlist, gfwListToPacFragment } from '../utils/gfwlist';

// Private network hostnames and wildcards that can be matched via exact/wildcard rules
const PRIVATE_NETWORK_HOSTS = ['localhost', '*.local'];

// Private network CIDR ranges that require isInNet checks in PAC
const PRIVATE_NETWORK_CIDRS = [
  { network: '127.0.0.0', mask: '255.0.0.0' },
  { network: '10.0.0.0', mask: '255.0.0.0' },
  { network: '172.16.0.0', mask: '255.240.0.0' },
  { network: '192.168.0.0', mask: '255.255.0.0' },
];

function generatePrivateNetworkCheck(): string {
  const checks = PRIVATE_NETWORK_CIDRS.map(
    ({ network, mask }) => `isInNet(host, "${network}", "${mask}")`
  ).join(' || ');
  return checks;
}

export const generatePac = async (proxyMode: ProxyModes) => {
  const config = await getConfig();
  const proxyServers = config[STORAGE_PROXY_SERVERS].map((d: ProxyServer) => `${d.method} ${d.host}:${d.port}`).join(';') || 'DIRECT';
  const hostLists = config[proxyMode === ProxyModes.OnDemand ? STORAGE_PROXY_DOMAINS : STORAGE_BYPASS_DOMAINS];

  // Check if bypass private networks is enabled
  const bypassPrivateNetworks = proxyMode === ProxyModes.Global ? await getBypassPrivateNetworks() : false;

  // 使用封装的方法获取 GFWList 开关状态
  const isGfwlistEnabled = await getGfwlistEnabled();

  // 如果是按需代理模式且启用了 GFWList，生成结合 GFWList 的 PAC
  if (proxyMode === ProxyModes.OnDemand && isGfwlistEnabled) {
    try {
      const gfwlistContent = await getGfwlist();
      return generateCombinedPacContent(hostLists, proxyServers, gfwlistContent);
    } catch (error) {
      console.error('Failed to fetch GFWList:', error);
      // 如果 GFWList 获取失败，回退到原有逻辑
    }
  }

  // 原有的 PAC 生成逻辑
  return generatePacContent(hostLists, proxyServers, proxyMode, bypassPrivateNetworks);
};

// 生成结合 GFWList 的 PAC 内容（按需代理模式）
function generateCombinedPacContent(hostLists: string[], proxyServers: string, gfwlistContent: string): string {
  const exactHosts: string[] = [];
  const hostsWithWildcards: string[] = [];

  hostLists.forEach((host: string) => {
    if (host.includes('*')) {
      hostsWithWildcards.push(host);
    } else {
      exactHosts.push(host);
    }
  });

  const proxyRules = `{ ${exactHosts.map(d => `"${d}": 1`).join(', ')} }`;

  // 直接生成 GFWList 检查逻辑
  const gfwlistCheckLogic = gfwListToPacFragment(gfwlistContent, proxyServers);

  return `
function FindProxyForURL(url, host) {
  var rules = ${proxyRules};
  var wildcardsRules = ${JSON.stringify(hostsWithWildcards)};
  var proxyServers = "${proxyServers}";

  // First check local proxy domains
  if (host in rules) {
    return proxyServers;
  } else {
    for (var i = 0; i < wildcardsRules.length; i++) {
      if (shExpMatch(host, wildcardsRules[i])) {
        return proxyServers;
      }
    }
  }

  // Then check GFWList rules
  ${gfwlistCheckLogic}
}
  `;
}

function generatePacContent(hostLists: string[], proxyServers: string, proxyMode: ProxyModes, bypassPrivateNetworks: boolean): string {
  // Merge private network hosts/wildcards into bypass list if enabled
  const mergedHostLists = bypassPrivateNetworks
    ? [...PRIVATE_NETWORK_HOSTS, ...hostLists]
    : hostLists;

  const exactHosts: string[] = [];
  const hostsWithWildcards: string[] = [];

  mergedHostLists.forEach((host: string) => {
    if (host.includes('*')) {
      hostsWithWildcards.push(host);
    } else {
      exactHosts.push(host);
    }
  });

  const proxyRules = `{
    ${exactHosts.map(d => `"${d}": 1`).join(',')}
  }`;

  // Generate private network CIDR check block if enabled
  const privateNetworkBlock = bypassPrivateNetworks
    ? `// Check private network ranges (CIDR)
  if (${generatePrivateNetworkCheck()}) {
    return DIRECT;
  }`
    : '';

  return `
    function FindProxyForURL(url, host) {
      ${privateNetworkBlock}
      var rules = ${proxyRules};
      var wildcardsRules = ${JSON.stringify(hostsWithWildcards)};
      var proxyServers = "${proxyServers}";
      if (host in rules) {
        return ${proxyMode === ProxyModes.OnDemand ? 'proxyServers' : 'DIRECT'};
      } else {
        for (var i = 0; i < wildcardsRules.length; i++) {
          if (shExpMatch(host, wildcardsRules[i])) {
            return ${proxyMode === ProxyModes.OnDemand ? 'proxyServers' : 'DIRECT'};
          }
        }
      }
      return ${proxyMode === ProxyModes.OnDemand ? 'DIRECT' : 'proxyServers'};
    }
  `;
}

