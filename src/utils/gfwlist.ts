import { DEFAULT_GFWLIST_URL } from "../constants/default";
import { STORAGE_GFWLIST_CONTENT } from "../constants/storage";

/**
 * 将 GFWlist 转换为 PAC 代理规则
 * @param gfwlistContent GFWlist 文本内容（已解析的 AutoProxy 规则，非 base64 编码）
 * @param proxyString 代理字符串，格式如 "PROXY 127.0.0.1:1087" 或 "SOCKS5 127.0.0.1:1080"
 * @returns PAC 文件内容
 */
export function convertGfwlistToPac(gfwlistContent: string, proxyString: string): string {
  // 解析 GFWlist 规则
  const rules = parseGfwlistRules(gfwlistContent);

  // 生成 PAC 文件内容
  return generatePacContent(rules, proxyString);
}

interface ParsedRule {
  type: 'domain' | 'url' | 'regex' | 'whitelist';
  pattern: string;
  original: string;
}

/**
 * 解析 GFWlist 规则
 */
function parseGfwlistRules(content: string): ParsedRule[] {
  const rules: ParsedRule[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // 跳过空行和注释
    if (!trimmed || trimmed.startsWith('!') || trimmed.startsWith('[AutoProxy')) {
      continue;
    }

    const rule = trimmed;

    // 处理白名单规则（@@开头）
    if (rule.startsWith('@@')) {
      const pattern = rule.substring(2);
      rules.push({
        type: 'whitelist',
        pattern: normalizePattern(pattern),
        original: rule
      });
      continue;
    }

    // 处理正则表达式规则（/开头和结尾/）
    if (rule.startsWith('/') && rule.endsWith('/')) {
      rules.push({
        type: 'regex',
        pattern: rule.slice(1, -1),
        original: rule
      });
      continue;
    }

    // 处理域名规则（||开头）
    if (rule.startsWith('||')) {
      const domain = rule.substring(2);
      // 移除末尾的路径分隔符
      const cleanDomain = domain.replace(/\^.*$/, '').replace(/\/.*$/, '');
      rules.push({
        type: 'domain',
        pattern: cleanDomain,
        original: rule
      });
      continue;
    }

    // 处理 URL 匹配规则
    if (rule.includes('*') || rule.includes('?') || rule.includes('.')) {
      rules.push({
        type: 'url',
        pattern: normalizePattern(rule),
        original: rule
      });
    }
  }

  return rules;
}

/**
 * 标准化模式字符串
 */
function normalizePattern(pattern: string): string {
  return pattern
    .replace(/\^/g, '') // 移除分隔符标记
    .replace(/\|/g, '') // 移除边界标记
    .replace(/\*/g, '.*') // 将通配符转换为正则表达式
    .replace(/\?/g, '.'); // 将单字符通配符转换为正则表达式
}

/**
 * Generate check logic (internal function, does not include function definition)
 */
function generateCheckLogic(rules: ParsedRule[], proxyString: string): string {
  const domainRules = rules.filter(r => r.type === 'domain');
  const urlRules = rules.filter(r => r.type === 'url');
  const regexRules = rules.filter(r => r.type === 'regex');
  const whitelistRules = rules.filter(r => r.type === 'whitelist');

  return `

    // Domain matching
    var domains = [${domainRules.map(r => `"${r.pattern}"`).join(', ')}];

    // Check whitelist rules
    ${generateWhitelistChecks(whitelistRules)}

    // Check domain rules
    for (var i = 0; i < domains.length; i++) {
        if (dnsDomainIs(host, domains[i]) || shExpMatch(host, "*." + domains[i])) {
            return "${proxyString}";
        }
    }

    // Check URL rules
    ${generateUrlChecks(urlRules, proxyString)}

    // Check regex rules
    ${generateRegexChecks(regexRules, proxyString)}`;
}

/**
 * 生成 PAC 文件内容
 */
function generatePacContent(rules: ParsedRule[], proxyString: string): string {
  const checkLogic = generateCheckLogic(rules, proxyString);

  return `function FindProxyForURL(url, host) {
    "use strict";

    ${checkLogic}

    return "DIRECT";
}`;
}

/**
 * Generate whitelist check code
 */
function generateWhitelistChecks(whitelistRules: ParsedRule[]): string {
  if (whitelistRules.length === 0) return '';

  let code = '// Whitelist rules check\n';
  for (const rule of whitelistRules) {
    if (rule.pattern.includes('*')) {
      code += `    if (shExpMatch(url, "*${rule.pattern}*")) return "DIRECT";\n`;
    } else if (rule.pattern.includes('.')) {
      code += `    if (dnsDomainIs(host, "${rule.pattern}")) return "DIRECT";\n`;
    } else {
      code += `    if (url.indexOf("${rule.pattern}") !== -1) return "DIRECT";\n`;
    }
  }
  return code;
}

/**
 * Generate URL check code
 */
function generateUrlChecks(urlRules: ParsedRule[], proxyString: string): string {
  if (urlRules.length === 0) return '';

  let code = '// URL rules check\n';
  for (const rule of urlRules) {
    if (rule.pattern.includes('.*')) {
      code += `    if (shExpMatch(url, "*${rule.pattern.replace(/\.\*/g, '*')}*")) return "${proxyString}";\n`;
    } else {
      code += `    if (url.indexOf("${rule.pattern}") !== -1) return "${proxyString}";\n`;
    }
  }
  return code;
}

/**
 * Generate regex check code
 */
function generateRegexChecks(regexRules: ParsedRule[], proxyString: string): string {
  if (regexRules.length === 0) return '';

  let code = '// Regex rules check\n';
  for (const rule of regexRules) {
    // Note: PAC files have limited regex support, simplified handling here
    code += `    try { if (new RegExp("${rule.pattern.replace(/"/g, '\\"')}").test(url)) return "${proxyString}"; } catch(e) {}\n`;
  }
  return code;
}

/**
 * 从 base64 编码的 GFWlist 获取内容
 */
export function decodeGfwlist(base64Content: string): string {
  try {
    return atob(base64Content);
  } catch (error) {
    throw new Error('Invalid base64 GFWlist content');
  }
}

/**
 * 验证代理字符串格式
 */
export function validateProxyString(proxyString: string): boolean {
  const validFormats = [
    /^PROXY\s+[\w.-]+:\d+$/,           // PROXY host:port
    /^SOCKS\s+[\w.-]+:\d+$/,          // SOCKS host:port
    /^SOCKS4\s+[\w.-]+:\d+$/,         // SOCKS4 host:port
    /^SOCKS5\s+[\w.-]+:\d+$/,         // SOCKS5 host:port
    /^HTTP\s+[\w.-]+:\d+$/,           // HTTP host:port
    /^HTTPS\s+[\w.-]+:\d+$/,          // HTTPS host:port
  ];

  return validFormats.some(format => format.test(proxyString.trim()));
}

/**
 * 获取 GFWlist 文本内容
 * @param forceRefresh 是否强制从网络刷新，忽略缓存
 * @returns GFWlist 文本内容
 */
export async function getGfwlist(forceRefresh: boolean = false): Promise<string> {
  // 如果不强制刷新，直接从缓存获取
  if (!forceRefresh) {
    const cached = await getCachedGfwlist();
    if (cached) {
      return cached;
    }
    // 如果没有缓存，尝试从网络获取并缓存
    try {
      const response = await fetch(DEFAULT_GFWLIST_URL);
      const text = await response.text();
      const content = decodeGfwlist(text);
      await saveCachedGfwlist(content);
      return content;
    } catch (error) {
      throw new Error('Failed to fetch GFWList and no cache available');
    }
  }

  // 强制刷新：从网络获取
  try {
    const response = await fetch(DEFAULT_GFWLIST_URL);
    const text = await response.text();
    const content = decodeGfwlist(text);

    // 保存到缓存
    await saveCachedGfwlist(content);

    return content;
  } catch (error) {
    // 网络请求失败，fallback 到缓存
    const cached = await getCachedGfwlist();
    if (cached) {
      console.warn('Network request failed, using cached GFWList:', error);
      return cached;
    }
    // 如果连缓存都没有，抛出错误
    throw error;
  }
}

/**
 * 获取缓存的 GFWlist 内容
 * @returns 缓存的内容，如果缓存不存在则返回 null
 */
export async function getCachedGfwlist(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get([STORAGE_GFWLIST_CONTENT]);
    const content = result[STORAGE_GFWLIST_CONTENT];

    if (!content) {
      return null;
    }

    return content;
  } catch (error) {
    console.error('Failed to get cached GFWlist:', error);
    return null;
  }
}

/**
 * 保存 GFWlist 内容到缓存
 * @param content GFWlist 内容
 */
export async function saveCachedGfwlist(content: string): Promise<void> {
  try {
    await chrome.storage.local.set({
      [STORAGE_GFWLIST_CONTENT]: content
    });
  } catch (error) {
    console.error('Failed to save GFWlist to cache:', error);
  }
}

/**
 * 清除 GFWlist 缓存
 */
export async function clearGfwlistCache(): Promise<void> {
  try {
    await chrome.storage.local.remove([STORAGE_GFWLIST_CONTENT]);
  } catch (error) {
    console.error('Failed to clear GFWlist cache:', error);
  }
}

/**
 * 使用示例和测试
 */
export function createSamplePac(): string {
  const sampleGfwlist = `! This is a sample GFWlist
[AutoProxy 0.2.9]
||google.com
||youtube.com
||facebook.com
||twitter.com
||instagram.com
/google\\.com/
*.blogspot.com
@@||google.com/webhp
!Comment line`;

  const proxyString = "PROXY 127.0.0.1:1087";

  return convertGfwlistToPac(sampleGfwlist, proxyString);
}

/**
 * Generate GFWList check logic (does not include function definition, for embedding into other PAC)
 */
export function generateGfwlistCheckLogic(gfwlistContent: string, proxyString: string): string {
  // Parse GFWlist rules
  const rules = parseGfwlistRules(gfwlistContent);

  const checkLogic = generateCheckLogic(rules, proxyString);

  return `
    // GFWList check logic start
${checkLogic}
    // GFWList check logic end
  `.trim();
}
