import { combineReducers, createStore } from 'redux'
import proxyServers from './reducers/proxyServers'
import blackList from './reducers/blackList'
import whiteList from './reducers/whiteList'

export default createStore(combineReducers({
  proxyServers,
  blackList,
  whiteList
}))
