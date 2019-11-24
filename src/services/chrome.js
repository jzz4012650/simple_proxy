import { get } from 'lodash'

const { tabCollection } = chrome.extension.getBackgroundPage()

const getCurrentTabId = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      const tabId = get(tabs, [0, 'id'], null)
      if (tabId) {
        resolve(tabId)
      } else {
        reject(new Error('[TabCollection] cant get current tab'))
      }
    })
  })
}

const getHostsOfCurrentTab = async () => {
  const currentTabId = await getCurrentTabId()
  return Array.from(tabCollection.getTab(currentTabId).hosts)
}

export {
  getCurrentTabId,
  getHostsOfCurrentTab
}
