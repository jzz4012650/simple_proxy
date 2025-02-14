import { MESSAGE_GET_CURRENT_TAB_HOSTS } from "../constants/message";

const getCurrentTabId = async (): Promise<number | undefined> => {
  const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return activeTabs[0]?.id;
};

async function getHostsOfCurrentTab(): Promise<string[]> {
  try {
    const response = await chrome.runtime.sendMessage(MESSAGE_GET_CURRENT_TAB_HOSTS);
    return response || [];
  } catch (error) {
    console.error('Error getting current tab hosts:', error);
    return [];
  }
}

export {
  getCurrentTabId,
  getHostsOfCurrentTab
};
