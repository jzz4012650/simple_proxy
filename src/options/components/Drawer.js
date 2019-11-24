import React from 'react'

import Drawer from '@material-ui/core/Drawer'

import MenuList from './MenuList'

const DrawerMenu = ({ show, current, onClose, location, history }) => {
  return (
    <Drawer open={show} onClose={onClose}>
      <MenuList
        location={location}
        history={history}
      />
    </Drawer>
  )
}

export default DrawerMenu
