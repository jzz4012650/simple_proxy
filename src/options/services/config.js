import { storageLocal, storageSync } from '../../services/storage'
import { BLACK_LIST, WHITE_LIST, PROXY_SERVERS } from '../../constants/storage'

export const getConfig = () => {
  return Promise.all([
    storageLocal.get([PROXY_SERVERS]),
    storageSync.get([BLACK_LIST, WHITE_LIST])
  ]).then(([local, sync]) => {
    return Promise.resolve({
      PROXY_SERVERS: local[PROXY_SERVERS],
      BLACK_LIST: sync[BLACK_LIST],
      WHITE_LIST: sync[WHITE_LIST]
    })
  })
}

export const saveConfig = (config) => {
  return Promise.all([
    storageLocal.set({ [PROXY_SERVERS]: config[PROXY_SERVERS] }),
    storageSync.set({
      [BLACK_LIST]: config[BLACK_LIST],
      [WHITE_LIST]: config[WHITE_LIST]
    })
  ])
  // TODO: setProxy
}
