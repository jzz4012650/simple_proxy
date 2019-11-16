import { storageSync, storageLocal } from './storage'
import { PROXY_MODE } from '../constants/storage'

export const setProxyMode = () => {

}

export const setProxy = () => {
  storageLocal.get([PROXY_MODE]).then(obj => {
    console.log(obj[PROXY_MODE])
  })
}
