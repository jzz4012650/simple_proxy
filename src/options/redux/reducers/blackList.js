import get from 'lodash/get'
import { ADD_BLACKLIST, REMOVE_BACKLIST, INIT } from '../actionTypes'
import { BLACK_LIST } from '../../../constants/storage'

const initSate = []

export default function (state = initSate, action) {
  switch (action.type) {
  case INIT:
    const list = get(action.payload, BLACK_LIST, [])
    return list
  case ADD_BLACKLIST:
    const blackList = action.payload
    return [blackList, ...state]
  case REMOVE_BACKLIST:
    const index = action.payload
    return state.slice(0, index).concat(state.slice(index + 1))
  default:
    return state
  }
}
