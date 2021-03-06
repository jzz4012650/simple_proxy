import { storageLocal } from './storage'
import { PROXY_MODE } from '../constants/storage'
import { SYSTEM, DIRECT, WHITE_LIST, BLACK_LIST } from '../constants/proxyModes'
import { generatePac } from './pacScript'

const generateProxySettingObj = (mode) => {
  return new Promise(function (resolve, reject) {
    const settingObj = { scope: 'regular', value: {} }
    switch (mode) {
    case SYSTEM:
      settingObj.value.mode = 'system'
      resolve(settingObj)
      break
    case DIRECT:
      settingObj.value.mode = 'direct'
      resolve(settingObj)
      break
    case WHITE_LIST:
      generatePac(WHITE_LIST).then((pac) => {
        settingObj.value.mode = 'pac_script'
        settingObj.value.pacScript = { data: pac }
        resolve(settingObj)
      })
      break
    case BLACK_LIST:
      generatePac(BLACK_LIST).then((pac) => {
        settingObj.value.mode = 'pac_script'
        settingObj.value.pacScript = { data: pac }
        resolve(settingObj)
      })
      break
    }
  })
}

const setProxy = (settingObj) => {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.set(settingObj, () => {
      resolve()
    })
  })
}

export const updateProxyConfig = async () => {
  const obj = await storageLocal.get([PROXY_MODE])
  const proxyMode = obj[PROXY_MODE] || SYSTEM
  const settingObj = await generateProxySettingObj(proxyMode)
  await setProxy(settingObj)
}
