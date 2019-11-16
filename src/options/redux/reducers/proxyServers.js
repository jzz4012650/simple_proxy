import { ADD_PROXY_SERVER, REMOVE_PROXY_SERVER, INIT } from '../actionTypes'
import { PROXY_SERVERS } from '../../../constants/storage'

const initSate = []

export default function (state = initSate, action) {
  switch (action.type) {
  case INIT:
    const list = action.payload[PROXY_SERVERS]
    return list
  case ADD_PROXY_SERVER:
    const server = action.payload
    return [server, ...state]
  case REMOVE_PROXY_SERVER:
    const index = action.payload
    return state.slice(0, index).concat(state.slice(index + 1))
  default:
    return state
  }
}
