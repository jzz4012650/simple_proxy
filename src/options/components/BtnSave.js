import React, { PureComponent } from 'react'
import { Fab, Tooltip } from '@material-ui/core'
import IconSave from '@material-ui/icons/Save'
import { connect } from 'react-redux'
import { showSnack } from '../services/snack'
import { PROXY_SERVERS, BLACK_LIST, WHITE_LIST } from '../../constants/storage'
import { setProxy } from '../../services/proxyConfig'
import { init } from '../redux/actions'
import { getConfig, saveConfig } from '../services/config'

class BtnSave extends PureComponent {
  componentDidMount () {
    getConfig().then(config => {
      this.props.init(config)
    })
  }

  handleSave () {
    const { proxyServers, blackList, whiteList } = this.props
    const config = {
      [PROXY_SERVERS]: proxyServers,
      [BLACK_LIST]: blackList,
      [WHITE_LIST]: whiteList
    }
    saveConfig(config).then(() => {
      showSnack(chrome.i18n.getMessage('option_saved'))
      setProxy()
    })
  }

  render () {
    return (
      <Tooltip title={chrome.i18n.getMessage('save_option')}>
        <Fab color="secondary" style={{ position: 'fixed', right: 15, bottom: 15 }} onClick={e => this.handleSave()}>
          <IconSave />
        </Fab>
      </Tooltip>
    )
  }
}

export default connect(
  ({ blackList, whiteList, proxyServers }) => ({ blackList, whiteList, proxyServers }),
  { init }
)(BtnSave)
