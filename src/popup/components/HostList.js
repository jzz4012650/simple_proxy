import React, { useState, useEffect } from 'react'
import { List, ListSubheader, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Tooltip } from '@material-ui/core'
import Language from '@material-ui/icons/Language'
import Lens from '@material-ui/icons/Lens'
import LensOutlined from '@material-ui/icons/LensOutlined'
import { getHostsOfCurrentTab } from '../../services/chrome'
import { storageSync } from '../../services/storage'
import { BLACK_LIST, WHITE_LIST } from '../../constants/storage'
import { updateBlackAndWhiteList } from '../../services/config'
import { MESSAGE_HOSTS_UPDATE } from '../../constants/message'
import { makeStyles } from '@material-ui/styles'

const useStyle = makeStyles(theme => ({
  list: {
    flex: 1,
    overflow: 'auto'
  },
  listHeader: {
    background: theme.palette.common.white
  }
}))

const HostList = ({ setModified }) => {
  const classes = useStyle()
  const [hosts, setHosts] = useState([])
  const [blackListSet, setBlackList] = useState(new Set())
  const [whiteListSet, setWhiteList] = useState(new Set())
  const getBW = async () => {
    const res = await storageSync.get([BLACK_LIST, WHITE_LIST])
    setBlackList(new Set(res[BLACK_LIST]))
    setWhiteList(new Set(res[WHITE_LIST]))
  }
  const updateBW = async (host, mode) => {
    if (mode === BLACK_LIST) {
      blackListSet.has(host) ? blackListSet.delete(host) : blackListSet.add(host)
    }
    if (mode === WHITE_LIST) {
      whiteListSet.has(host) ? whiteListSet.delete(host) : whiteListSet.add(host)
    }
    await updateBlackAndWhiteList(Array.from(blackListSet), Array.from(whiteListSet))
    setModified(true)
    getBW()
  }
  const updateHosts = async () => {
    const hosts = await getHostsOfCurrentTab()
    setHosts(hosts)
  }
  const onHostsUpdate = (message) => {
    if (message === MESSAGE_HOSTS_UPDATE) {
      updateHosts()
    }
  }
  useEffect(() => {
    getBW()
    updateHosts()
    chrome.runtime.onMessage.addListener(onHostsUpdate)
    return () => {
      chrome.runtime.onMessage.removeListener(onHostsUpdate)
    }
  }, [])

  return (
    <List
      className={classes.list}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" className={classes.listHeader} id="nested-list-subheader">
          {chrome.i18n.getMessage('domain_list')}
        </ListSubheader>
      }
    >
      {hosts.map(host => {
        return (
          <ListItem key={host} dense>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary={host} />
            <ListItemSecondaryAction>
              <Tooltip title={chrome.i18n.getMessage('domain_black')}>
                <IconButton size="small" color={blackListSet.has(host) ? 'secondary' : undefined} onClick={() => updateBW(host, BLACK_LIST)}>
                  <Lens />
                </IconButton>
              </Tooltip>
              <Tooltip title={chrome.i18n.getMessage('domain_white')}>
                <IconButton size="small" color={whiteListSet.has(host) ? 'secondary' : undefined} onClick={() => updateBW(host, WHITE_LIST)}>
                  <LensOutlined />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </List>
  )
}

export default HostList
