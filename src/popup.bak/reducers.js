import { handleActions } from 'redux-actions'

let bgPage = chrome.extension.getBackgroundPage()
const { PROXY_MODES, BLACK_LIST, WHITE_LIST } = bgPage

const defaultProps = {
  proxyModes: PROXY_MODES,
  proxyMode: PROXY_MODES[0].name,
  hostList: [],
  blackList: [],
  whiteList: []
}

export default handleActions({
  INIT_DATA: (state, action) => {
    let { mode, hostList, rules } = action.payload
    return {
      ...state,
      proxyMode: mode || state.proxyMode,
      hostList: hostList || [],
      blackList: rules[BLACK_LIST] || [],
      whiteList: rules[WHITE_LIST] || []
    }
  },
  CHANGE_PROXY_MODE: {
    next: (state, action) => {
      return {
        ...state,
        proxyMode: action.payload
      }
    }
  },
  MODIFY_HOST_TYPE: (state, action) => {
    let { host, prevType, type } = action.payload
    let { blackList, whiteList, proxyMode } = state

    if (prevType === type) return state

    if (type === 1) blackList = blackList.concat([host])
    if (type === 0) whiteList = whiteList.concat([host])
    if (prevType === 1) blackList = blackList.filter(d => d !== host)
    if (prevType === 0) whiteList = whiteList.filter(d => d !== host)

    bgPage.updateBlackWhiteList(blackList, whiteList, proxyMode)

    return {
      ...state,
      blackList: blackList,
      whiteList: whiteList
    }
  }
}, defaultProps)
