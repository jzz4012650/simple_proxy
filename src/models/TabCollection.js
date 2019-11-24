import Tab from './Tab'

class TabCollection {
  constructor () {
    this.tabs = new Map()
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        this.tabs.set(tab.id, new Tab(tab.id))
      })
    })
    this.currentTab = null
  }

  activeTab (tabId) {
    if (this.tabs.has(tabId)) {
      this.currentTab = this.tabs.get(tabId)
    } else {
      throw Error(`cant not find tab: ${tabId}`)
    }
  }

  getCurrent () {
    return this.currentTab
  }

  getTab (tabId) {
    let tab = this.tabs.get(tabId)
    if (tab === undefined) {
      tab = new Tab(tabId)
      this.tabs.set(tabId, tab)
      return tab
    } else {
      return this.tabs.get(tabId)
    }
  }

  addTab (tab) {
    if (!(tab instanceof Tab)) {
      throw Error('tab must be instance of Tab')
    }
    this.tabs.set(tab.id, tab)
  }

  removeTab (tabId) {
    this.tabs.delete(tabId)
  }
}

export default TabCollection
