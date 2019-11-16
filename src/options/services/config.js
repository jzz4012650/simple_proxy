import { storageSync } from '../../services/storage'
import { BLACK_LIST, WHITE_LIST, PROXY_SERVERS } from '../../constants/storage'

export const getConfig = () => {
  return storageSync.get([PROXY_SERVERS, BLACK_LIST, WHITE_LIST])
}

export const saveConfig = (config) => {
  return storageSync.get(config)
}
