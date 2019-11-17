// map of common domain suffix.
import { PROXY_MODES } from '../constants/proxyModes'
import getHost from '../utils/getHost'
import Tab from '../models/Tab'
import TabCollection from '../models/TabCollection'

const tabCollection = new TabCollection()

chrome.tabs.onCreated.addListener(({ id }) => {
  const tab = new Tab(id)
  tabCollection.addTab(tab)
})

chrome.tabs.onRemoved.addListener((tabId) => {
  tabCollection.removeTab(tabId)
})

chrome.tabs.onActivated.addListener(({ id }) => {
  tabCollection.activeTab(id)
})

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    tabCollection.getTab(details.tabId).resetHosts()
  }
})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  const { url, tabId } = details
  tabCollection.getTab(tabId).addHost(getHost(url))
}, {
  urls: [
    'http://*/*',
    'https://*/*'
  ]
})

/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */
function getProxyMode () {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(PROXY_MODE, function (obj) {
      resolve(obj[PROXY_MODE] || PROXY_MODES[0].name)
    })
  })
}

/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */
function setProxyMode (mode) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set({ PROXY_MODE: mode }, function (obj) {
      generateProxySettingObj(mode).then(function (settingObj) {
        chrome.proxy.settings.set(settingObj, function () {
          resolve(mode)
        })
      })
    })
  })
}

/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */
function saveProxyServersAndRules (servers, blackList, whiteList) {
  return Promise.all([
    saveProxyServers(servers),
    saveProxyRules(blackList, whiteList)
  ]).then(function () {
    // update black(white) list and proxy server
    // in pac script by resetting the proxy mode.
    getProxyMode().then(function (mode) {
      setProxyMode(mode)
    })
  })
}

/**
 * function for saving proxy servers which returns a promise object.
 * @param {array} rules list of proxy rules
 */
function saveProxyRules (blackList, whiteList) {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.set({
      BLACK_LIST: blackList,
      WHITE_LIST: whiteList
    }, function () {
      resolve({
        BLACK_LIST: blackList,
        WHITE_LIST: whiteList
      })
    })
  })
}

/**
 * function for saving proxy servers which returns a promise object.
 * @param {array} servers list of proxy servers
 */
function saveProxyServers (servers) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set({ PROXY_SERVERS: servers }, function () {
      resolve()
    })
  })
}

/**
 * function for getting proxy_rules which returns a promise object.
 * @returns {Promise} resolve with proxy rules array
 */
function getProxyRules () {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get([BLACK_LIST, WHITE_LIST], function (obj) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(obj)
      }
    })
  })
}

/**
 * function for getting proxy_servers which returns a promise object.
 * @returns {Promise} resolve with proxy servers array
 */
function getProxyServers () {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(PROXY_SERVERS, function (obj) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(obj[PROXY_SERVERS])
      }
    })
  })
}

/**
 * function for update black & white list and reset pac script if need.
 * @param {array} blackList
 * @param {array} whiteList
 * @param {string} mode proxy mode
 */
function updateBlackWhiteList (blackList, whiteList, mode) {
  saveProxyRules(blackList, whiteList).then(function () {
    if (mode === BLACK_LIST || mode === WHITE_LIST) {
      // if in black(white) list mode
      // we need to reset the pac script.
      setProxyMode(mode)
    }
  })
}

/**
 * function for generate proxy setting object.
 * @param {string} mode proxy mode
 * @returns {Object} proxy setting object
 */
function generateProxySettingObj (mode) {
  return new Promise(function (resolve, reject) {
    let settingObj = { scope: 'regular', value: {} }
    switch (mode) {
    case PROXY_MODES[0].name:
      settingObj.value.mode = 'system'
      resolve(settingObj)
      break
    case PROXY_MODES[1].name:
      settingObj.value.mode = 'direct'
      resolve(settingObj)
      break
    case PROXY_MODES[2].name:
      generatePacWhite().then(function (pac) {
        settingObj.value.mode = 'pac_script'
        settingObj.value.pacScript = { data: pac }
        resolve(settingObj)
      })
      break
    case PROXY_MODES[3].name:
      generatePacBlack().then(function (pac) {
        settingObj.value.mode = 'pac_script'
        settingObj.value.pacScript = { data: pac }
        resolve(settingObj)
      })
      break
    }
  })
}
