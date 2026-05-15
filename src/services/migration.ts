import { ProxyModes } from '../constants/proxyModes';
import { LEGACY_BLACK_LIST, LEGACY_WHITE_LIST, STORAGE_PROXY_DOMAINS, STORAGE_BYPASS_DOMAINS, STORAGE_PROXY_MODE } from '../constants/storage';

/**
 * Migrate data from old naming (BLACK_LIST/WHITE_LIST) to new naming (PROXY_DOMAINS/BYPASS_DOMAINS).
 * Also migrates PROXY_MODE values: 'BLACK_LIST' → 'ON_DEMAND', 'WHITE_LIST' → 'GLOBAL'.
 * This runs once; after migration, old keys are removed from storage.
 */
export const migrateLegacyData = async (): Promise<void> => {
  // Migrate domain lists (sync storage)
  const syncData = await chrome.storage.sync.get([LEGACY_BLACK_LIST, LEGACY_WHITE_LIST, STORAGE_PROXY_DOMAINS, STORAGE_BYPASS_DOMAINS]);

  const hasLegacyBlackList = syncData[LEGACY_BLACK_LIST] !== undefined;
  const hasLegacyWhiteList = syncData[LEGACY_WHITE_LIST] !== undefined;

  const syncUpdates: Record<string, string[]> = {};
  const syncRemoves: string[] = [];

  if (hasLegacyBlackList && syncData[STORAGE_PROXY_DOMAINS] === undefined) {
    syncUpdates[STORAGE_PROXY_DOMAINS] = syncData[LEGACY_BLACK_LIST];
    syncRemoves.push(LEGACY_BLACK_LIST);
  } else if (hasLegacyBlackList) {
    // New key already exists, just remove legacy
    syncRemoves.push(LEGACY_BLACK_LIST);
  }

  if (hasLegacyWhiteList && syncData[STORAGE_BYPASS_DOMAINS] === undefined) {
    syncUpdates[STORAGE_BYPASS_DOMAINS] = syncData[LEGACY_WHITE_LIST];
    syncRemoves.push(LEGACY_WHITE_LIST);
  } else if (hasLegacyWhiteList) {
    syncRemoves.push(LEGACY_WHITE_LIST);
  }

  if (syncUpdates) {
    await chrome.storage.sync.set(syncUpdates);
  }
  if (syncRemoves.length > 0) {
    await chrome.storage.sync.remove(syncRemoves);
  }

  // Migrate proxy mode value (local storage)
  const localData = await chrome.storage.local.get([STORAGE_PROXY_MODE]);
  const currentMode = localData[STORAGE_PROXY_MODE];

  if (currentMode === 'BLACK_LIST') {
    await chrome.storage.local.set({ [STORAGE_PROXY_MODE]: ProxyModes.OnDemand });
  } else if (currentMode === 'WHITE_LIST') {
    await chrome.storage.local.set({ [STORAGE_PROXY_MODE]: ProxyModes.Global });
  }
};