import Tab from './Tab'

class TabCollection {
  constructor () {
    this.tabs = new Map()
    this.currentTab = null
  }

  activeTab (tabId) {
    if (this.tabs.has(tabId)) {
      this.currentTab = this.tabs.get(tabId)
    } else {
      throw Error(`cant not find tab: ${tabId}`)
    }
  }

  getTab (tabId) {
    return this.tabs.get(tabId)
  }

  addTab (tab) {
    if (!(tab instanceof Tab)) {
      throw Error('tab must be instance of Tab')
    }
    this.tabs.add(tab.id, tab)
  }

  removeTab (tabId) {
    this.tabs.delete(tabId)
  }
}

export default TabCollection
