import { ADD_WHITELIST, REMOVE_WHITELIST, INIT } from '../actionTypes'
import { WHITE_LIST } from '../../../constants/storage'

const initSate = []

export default function (state = initSate, action) {
  switch (action.type) {
  case INIT:
    const list = action.payload[WHITE_LIST]
    return list
  case ADD_WHITELIST:
    const whiteList = action.payload
    return [whiteList, ...state]
  case REMOVE_WHITELIST:
    const index = action.payload
    return state.slice(0, index).concat(state.slice(index + 1))
  default:
    return state
  }
}
