export const DIRECT = 'DIRECT'
export const SYSTEM = 'SYSTEM'
export const BLACK_LIST = 'BLACK_LIST'
export const WHITE_LIST = 'WHITE_LIST'

export const PROXY_MODES = [{
  name: DIRECT,
  title: chrome.i18n.getMessage('mode_direct'),
  desc: chrome.i18n.getMessage('mode_direct_desc')
}, {
  name: SYSTEM,
  title: chrome.i18n.getMessage('mode_system'),
  desc: chrome.i18n.getMessage('mode_system_desc')
}, {
  name: BLACK_LIST,
  title: chrome.i18n.getMessage('mode_black_list'),
  desc: chrome.i18n.getMessage('mode_black_list_desc')
}, {
  name: WHITE_LIST,
  title: chrome.i18n.getMessage('mode_white_list'),
  desc: chrome.i18n.getMessage('mode_white_list_desc')
}]

export const PROXY_MODE_MAP = {}
PROXY_MODES.forEach(d => { PROXY_MODE_MAP[d.name] = d })
