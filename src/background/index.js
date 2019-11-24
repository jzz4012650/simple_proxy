import debounce from 'lodash/debounce'
import getHost from '../utils/getHost'
import TabCollection from '../models/TabCollection'
import { MESSAGE_HOSTS_UPDATE } from '../constants/message'
import { getCurrentTabId } from '../services/chrome'

const notifyPopup = debounce(() => {
  chrome.runtime.sendMessage(MESSAGE_HOSTS_UPDATE)
}, 1000, { leading: false, trailing: true })

const reloadCurrentTab = debounce(async () => {
  const tabId = await getCurrentTabId()
  chrome.tabs.executeScript(tabId, { code: 'window.location.reload();' })
})

const tabCollection = new TabCollection()
window.tabCollection = tabCollection

chrome.tabs.onRemoved.addListener((tabId) => {
  tabCollection.removeTab(tabId)
})

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    tabCollection.getTab(details.tabId).resetHosts()
  }
})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  const { url, tabId } = details
  const tab = tabCollection.getTab(tabId)
  tab.addHost(getHost(url))
  notifyPopup()
}, {
  urls: [
    'http://*/*',
    'https://*/*'
  ]
})

chrome.runtime.onConnect.addListener((port) => {
  let modified = false
  port.onMessage.addListener((msg) => {
    modified = msg
  })
  port.onDisconnect.addListener(() => {
    if (modified) {
      reloadCurrentTab()
    }
  })
})
