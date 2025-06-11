import { DEFAULT_GFWLIST_URL } from "../constants/default";
import { STORAGE_GFWLIST_CONTENT } from "../constants/storage";

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

export function gfwListToPacFragment(gfwListText: string, proxy = "PROXY 127.0.0.1:1080") {
  const domains = getDomainsFromGfwList(gfwListText);

  const conditions = Array.from(domains).map(domain => {
    return `shExpMatch(host, "*.${domain}") || host === "${domain}"`;
  }).join(' ||\n        ') || 'false';

  return `
  if (
    ${conditions}
  ) {
    return "${proxy}";
  }
  return "DIRECT";
`;
}

/**
 * Get domains from GFWList
 * @param gfwListText GFWList text
 * @returns Set of domains
 */
export function getDomainsFromGfwList(gfwListText: string): Set<string> {
  const lines = gfwListText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('!') && !line.startsWith('[') && !line.startsWith('@@') && !line.startsWith('/') && line !== '');

  const domains = new Set<string>();

  for (const line of lines) {
    if (line.startsWith('||')) {
      // ||google.com
      const domain = line.slice(2).split('/')[0];
      domains.add(domain);
    } else if (line.startsWith('|')) {
      // |http://google.com
      const domain = line.slice(1).split('/')[0];
      domains.add(domain);
    } else if (line.startsWith('.')) {
      // .google.com
      domains.add(line.slice(1));
    } else {
      // fallback: try parse as domain or URL
      try {
        const domain = line.split('//')[1].split('/')[0];
        domains.add(domain);
      } catch {
        // fallback: treat line as domain
        domains.add(line.split('/')[0]);
      }
    }
  }

  return domains;
}
