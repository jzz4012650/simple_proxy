import debounce from 'lodash/debounce';
import { MESSAGE_GET_CURRENT_TAB_HOSTS, MESSAGE_HOSTS_UPDATE } from '../constants/message';
import TabCollection from '../models/TabCollection';
import { getCurrentTabId } from '../services/tabs';
import { getHost } from '../utils/host';

const tabCollection = new TabCollection();
let isPopupConnected = false;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    isPopupConnected = true;
    port.onDisconnect.addListener(() => {
      isPopupConnected = false;
    });
  }
});

const notifyPopup = debounce(() => {
  if (isPopupConnected) {
    chrome.runtime.sendMessage(MESSAGE_HOSTS_UPDATE);
  }
}, 300, { leading: false, trailing: true });

const getCurrentTabHosts = async () => {
  const tabId = await getCurrentTabId();
  if (tabId) {
    const tab = tabCollection.getTab(tabId);
    const hosts = tab?.getHosts?.() ?? [];
    return hosts;
  } else {
    return [];
  }
};

chrome.tabs.onRemoved.addListener((tabId: number) => {
  tabCollection.removeTab(tabId);
});

chrome.webNavigation.onBeforeNavigate.addListener((details: { frameId: number; tabId: number; }) => {
  if (details.frameId === 0) {
    tabCollection.getTab(details.tabId)?.resetHosts();
  }
});

chrome.webRequest.onBeforeRequest.addListener((details: { url: string; tabId: number; }) => {
  const { url, tabId } = details;
  const tab = tabCollection.getTab(tabId);
  tab?.addHost(getHost(url));
  notifyPopup();
}, {
  urls: [
    'http://*/*',
    'https://*/*'
  ]
});

chrome.runtime.onMessage.addListener((message: string, _sender: chrome.runtime.MessageSender, sendResponse: (res: unknown) => void) => {
  if (message === MESSAGE_GET_CURRENT_TAB_HOSTS) {
    getCurrentTabHosts().then(hosts => sendResponse(hosts));
  } else {
    sendResponse([]);
  }
  // for async response, see: https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
  return true;
});
