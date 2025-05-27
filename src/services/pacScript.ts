import { ProxyModes } from '../constants/proxyModes';
import { STORAGE_BLACK_LIST, STORAGE_PROXY_SERVERS, STORAGE_WHITE_LIST } from '../constants/storage';
import { ProxyServer, getConfig, getGfwlistEnabled } from './config';
import { getGfwlist, generateGfwlistCheckLogic } from '../utils/gfwlist';

export const generatePac = async (proxyMode: ProxyModes) => {
  const config = await getConfig();
  const proxyServers = config[STORAGE_PROXY_SERVERS].map((d: ProxyServer) => `${d.method} ${d.host}:${d.port}`).join(';') || 'DIRECT';
  const hostLists = config[proxyMode === ProxyModes.BlackList ? STORAGE_BLACK_LIST : STORAGE_WHITE_LIST];

  // 使用封装的方法获取 GFWList 开关状态
  const isGfwlistEnabled = await getGfwlistEnabled();

  // 如果是黑名单模式且启用了 GFWList，生成结合 GFWList 的 PAC
  if (proxyMode === ProxyModes.BlackList && isGfwlistEnabled) {
    try {
      const gfwlistContent = await getGfwlist();
      return generateCombinedPacContent(hostLists, proxyServers, gfwlistContent);
    } catch (error) {
      console.error('Failed to fetch GFWList:', error);
      // 如果 GFWList 获取失败，回退到原有逻辑
    }
  }

  // 原有的 PAC 生成逻辑
  return generatePacContent(hostLists, proxyServers, proxyMode);
};

// 生成结合 GFWList 的 PAC 内容
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

  const proxyRules = `{
    ${exactHosts.map(d => `"${d}": 1`).join(',')}
  }`;

  // 直接生成 GFWList 检查逻辑
  const gfwlistCheckLogic = generateGfwlistCheckLogic(gfwlistContent, proxyServers);

  return `
    function FindProxyForURL(url, host) {
      var rules = ${proxyRules};
      var wildcardsRules = ${JSON.stringify(hostsWithWildcards)};
      var proxyServers = "${proxyServers}";

      // First check local blacklist
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

      return "DIRECT";
    }
  `;
}

function generatePacContent(hostLists: string[], proxyServers: string, proxyMode: ProxyModes): string {
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
}

