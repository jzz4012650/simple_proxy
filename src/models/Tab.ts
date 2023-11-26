class Tab {
  id: number;
  hosts: Set<string>;
  constructor(id: number) {
    this.id = id;
    this.hosts = new Set();
  }

  getHosts() {
    return Array.from(this.hosts);
  }

  addHost(host: string) {
    this.hosts.add(host);
  }

  resetHosts() {
    this.hosts.clear();
  }
}

export default Tab;
