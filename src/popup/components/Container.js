import React, { useEffect } from 'react'
import Header from './Header'
import HostList from './HostList'

let port = null

const Container = props => {
  const setModified = (modified) => {
    port.postMessage(modified)
  }
  useEffect(() => {
    port = chrome.runtime.connect()
  }, [])

  return (
    <div>
      <Header setModified={setModified}/>
      <HostList setModified={setModified}/>
    </div>
  )
}

export default Container
