import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Fab, Tooltip, makeStyles } from '@material-ui/core'
import IconSave from '@material-ui/icons/Save'

import { showSnack } from '../services/snack'
import { PROXY_SERVERS, BLACK_LIST, WHITE_LIST } from '../../constants/storage'
import { setProxy } from '../../services/proxyConfig'
import { getConfig, saveConfig } from '../services/config'
import { INIT } from '../redux/actionTypes'

const useStyle = makeStyles(theme => ({
  saveBtn: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2)
  }
}))

const BtnSave = props => {
  const dispatch = useDispatch()
  const store = useStore()
  const classes = useStyle()
  const handleSave = () => {
    const { proxyServers, blackList, whiteList } = store.getState()
    const config = {
      [PROXY_SERVERS]: proxyServers,
      [BLACK_LIST]: blackList,
      [WHITE_LIST]: whiteList
    }
    saveConfig(config).then(() => {
      console.log(111)
      showSnack(chrome.i18n.getMessage('option_saved'))
      setProxy()
    })
  }

  useEffect(() => {
    getConfig().then(config => dispatch({ type: INIT, payload: config }))
  }, [])

  return (
    <Tooltip title={chrome.i18n.getMessage('save_option')}>
      <Fab color="secondary" className={classes.saveBtn} onClick={handleSave}>
        <IconSave />
      </Fab>
    </Tooltip>
  )
}

export default BtnSave
