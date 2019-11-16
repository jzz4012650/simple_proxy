import {
  ADD_PROXY_SERVER,
  REMOVE_PROXY_SERVER,
  ADD_BLACKLIST,
  ADD_WHITELIST,
  REMOVE_BACKLIST,
  REMOVE_WHITELIST,
  INIT
} from './actionTypes'

export const init = obj => ({
  type: INIT,
  payload: obj
})

export const addProxyServer = server => ({
  type: ADD_PROXY_SERVER,
  payload: server
})

export const removeProxyServer = index => ({
  type: REMOVE_PROXY_SERVER,
  payload: index
})

export const addBlackList = blackList => ({
  type: ADD_BLACKLIST,
  payload: blackList
})

export const removeBlackList = index => ({
  type: REMOVE_BACKLIST,
  payload: index
})

export const addWhiteList = whiteList => ({
  type: ADD_WHITELIST,
  payload: whiteList
})

export const removeWhiteList = index => ({
  type: REMOVE_WHITELIST,
  payload: index
})
