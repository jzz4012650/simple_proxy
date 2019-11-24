class Tab {
  constructor (id) {
    this.id = id
    this.hosts = new Set()
  }

  getHosts () {
    return Array.from(this.hosts)
  }

  addHost (host) {
    this.hosts.add(host)
  }

  resetHosts () {
    delete this.hosts
    this.hosts = new Set()
  }
}

export default Tab
