import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import IconSetting from '@material-ui/icons/Settings'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline'
import IconDesktop from '@material-ui/icons/DesktopMac'
import IconDirect from '@material-ui/icons/SwapHoriz'
import { SYSTEM, DIRECT, BLACK_LIST, WHITE_LIST, PROXY_MODES, PROXY_MODE_MAP } from '../../constants/proxyModes'
import { updateProxyMode, getProxyMode, getProxyServers } from '../../services/config'
import { Tooltip } from '@material-ui/core'

const modeIcons = {
  [SYSTEM]: <IconDesktop />,
  [DIRECT]: <IconDirect />,
  [BLACK_LIST]: <RemoveCircle />,
  [WHITE_LIST]: <RemoveCircleOutline />
}

const useStyle = makeStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  flex: {
    flex: 1,
    margin: theme.spacing(1)
  }
}))

const Header = ({ setModified }) => {
  const classes = useStyle()
  const [mode, setMode] = useState(SYSTEM)
  const [warn, setWarn] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const initProxyMode = async () => {
    const mode = await getProxyMode()
    setMode(mode)
    const proxyServers = await getProxyServers()
    if (!proxyServers.length) {
      setWarn(true)
    }
  }
  const handleModeChange = async (mode) => {
    await updateProxyMode(mode)
    setModified(true)
    setMode(mode)
    setAnchorEl(null)
  }
  useEffect(() => {
    initProxyMode()
  }, [])

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography type="title" color="inherit">
          {chrome.i18n.getMessage('proxy_mode')}
        </Typography>
        <Button
          aria-controls="mode-menu"
          aria-haspopup="true"
          className={classes.flex}
          color="inherit"
          onClick={e => setAnchorEl(e.currentTarget)}>
          {React.cloneElement(modeIcons[mode], { className: classes.leftIcon })}
          {PROXY_MODE_MAP[mode].title}
          <ArrowDropDown />
        </Button>
        <Menu
          id="mode-menu"
          keepMounted
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}>
          {PROXY_MODES.map((d, i) =>
            <MenuItem
              dense
              key={i}
              value={d.name}
              selected={mode === d.name}
              onClick={() => handleModeChange(d.name)}>
              <ListItemIcon>
                {modeIcons[d.name]}
              </ListItemIcon>
              <ListItemText primary={d.title} secondary={d.desc} />
            </MenuItem>
          )}
        </Menu>
        <Tooltip arrow open={warn} title={chrome.i18n.getMessage('no_proxy_server_warning')}>
          <IconButton size="small" onClick={() => chrome.runtime.openOptionsPage()}>
            <IconSetting />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar >
  )
}

export default Header
