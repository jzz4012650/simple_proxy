import { storageLocal, storageSync } from './storage'
import { BLACK_LIST, WHITE_LIST, PROXY_SERVERS, PROXY_MODE } from '../constants/storage'
import { updateProxyConfig } from './proxyConfig'

export const getConfig = async () => {
  const [local, sync] = await Promise.all([
    storageLocal.get([PROXY_SERVERS]),
    storageSync.get([BLACK_LIST, WHITE_LIST])
  ])
  return {
    PROXY_SERVERS: local[PROXY_SERVERS],
    BLACK_LIST: sync[BLACK_LIST],
    WHITE_LIST: sync[WHITE_LIST]
  }
}

export const saveConfig = async (config) => {
  await Promise.all([
    storageLocal.set({ [PROXY_SERVERS]: config[PROXY_SERVERS] }),
    storageSync.set({ [BLACK_LIST]: config[BLACK_LIST], [WHITE_LIST]: config[WHITE_LIST] })
  ])
  await updateProxyConfig()
}

export const getProxyMode = async () => {
  const res = await storageLocal.get([PROXY_MODE])
  return res[PROXY_MODE]
}

export const updateProxyMode = async (mode) => {
  await storageLocal.set({ [PROXY_MODE]: mode })
  await updateProxyConfig()
}

export const updateBlackAndWhiteList = async (blackList, whiteList) => {
  await storageSync.set({ [BLACK_LIST]: blackList, [WHITE_LIST]: whiteList })
  await updateProxyConfig()
}
