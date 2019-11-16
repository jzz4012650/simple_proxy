class ChromeStorage {
  constructor (type = 'local') {
    this.type = type
  }
  get (keys) {
    return new Promise((resolve, reject) => {
      chrome.storage[this.type].get(keys, (obj) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(obj)
        }
      })
    })
  }
  set (obj) {
    return new Promise((resolve, reject) => {
      chrome.storage[this.type].set(obj, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }
}

export default ChromeStorage
