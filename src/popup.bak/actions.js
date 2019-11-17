import { createAction } from 'redux-actions'

let bgPage = chrome.extension.getBackgroundPage()
// const { saveProxyServersAndRules } = bgPage;

export const initData = createAction('INIT_DATA')

export const modifyHostType = createAction('MODIFY_HOST_TYPE', (host, prevType, type) => {
  return { host, prevType, type }
})

export const changeProxyMode = createAction('CHANGE_PROXY_MODE', mode => {
  return bgPage.setProxyMode(mode)
})
