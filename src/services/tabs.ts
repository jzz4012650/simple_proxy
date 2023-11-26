import { MESSAGE_GET_CURRENT_TAB_HOSTS } from "../constants/message";

const getCurrentTabId = async (): Promise<number | undefined> => {
  const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return activeTabs[0]?.id;
};

async function getHostsOfCurrentTab(): Promise<string[]> {
  return chrome.runtime.sendMessage(MESSAGE_GET_CURRENT_TAB_HOSTS);
}

export {
  getCurrentTabId,
  getHostsOfCurrentTab
};
