import Tab from './Tab';

class TabCollection {
  currentTab: Tab | null;
  tabs: Map<number, Tab>;

  constructor() {
    this.tabs = new Map();
    chrome.tabs.query({}, (tabs: Tab[]) => {
      tabs.forEach(tab => {
        this.tabs.set(tab.id, new Tab(tab.id));
      });
    });
    this.currentTab = null;
  }

  activeTab(tabId: number) {
    if (this.tabs.has(tabId)) {
      this.currentTab = this.tabs.get(tabId) ?? null;
    } else {
      throw Error(`cant not find tab: ${tabId}`);
    }
  }

  getCurrent() {
    return this.currentTab;
  }

  getTab(tabId: number) {
    let tab = this.tabs.get(tabId);
    if (tab === undefined) {
      tab = new Tab(tabId);
      this.tabs.set(tabId, tab);
      return tab;
    } else {
      return this.tabs.get(tabId);
    }
  }

  addTab(tab: Tab) {
    if (!(tab instanceof Tab)) {
      throw Error('tab must be instance of Tab');
    }
    this.tabs.set(tab.id, tab);
  }

  removeTab(tabId: number) {
    this.tabs.delete(tabId);
  }
}

export default TabCollection;
