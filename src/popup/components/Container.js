import React, { useEffect, Fragment } from 'react'
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
    <Fragment>
      <Header setModified={setModified}/>
      <HostList setModified={setModified}/>
    </Fragment>
  )
}

export default Container
