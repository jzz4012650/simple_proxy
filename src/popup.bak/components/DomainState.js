import React from 'react'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import RemoveCircle from 'material-ui-icons/RemoveCircle'
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline'

export default [{
  value: -1,
  text: chrome.i18n.getMessage('domain_neither'),
  icon: <MoreVertIcon />
}, {
  value: 1,
  text: chrome.i18n.getMessage('domain_black'),
  icon: <RemoveCircle />
}, {
  value: 0,
  text: chrome.i18n.getMessage('domain_white'),
  icon: <RemoveCircleOutline />
}]
