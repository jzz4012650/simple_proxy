import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
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
import { PROXY_MODE } from '../../constants/storage'
import { storageLocal } from '../../services/storage'
import { updateProxyConfig } from '../../services/proxyConfig'

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

const Header = props => {
  const classes = useStyle()
  const [mode, setMode] = useState(SYSTEM)
  const [anchorEl, setAnchorEl] = useState(null)
  const handleModeChange = (mode) => {
    setMode(mode)
    setAnchorEl(null)
    storageLocal.set({
      [PROXY_MODE]: mode
    }).then(() => {
      updateProxyConfig()
    })
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography type="title" color="inherit">
          {chrome.i18n.getMessage('proxy_mode')}
        </Typography>
        <Button
          aria-controls="mode-menu"
          aria-haspopup="true"
          // variant="outlined"
          className={classes.flex}
          color="inherit"
          onClick={e => setAnchorEl(e.currentTarget)}>
          {React.cloneElement(modeIcons[mode], { className: classes.leftIcon })}
          {PROXY_MODE_MAP[mode].title}
          <ArrowDropDown/>
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
        <IconButton onClick={() => chrome.runtime.openOptionsPage()}>
          <IconSetting />
        </IconButton>
      </Toolbar>
    </AppBar >
  )
}

export default Header
