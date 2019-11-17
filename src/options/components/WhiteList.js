import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import IconAdd from '@material-ui/icons/AddCircle'
import IconDelete from '@material-ui/icons/DeleteForever'
import WindowScroller from 'react-virtualized/dist/es/WindowScroller'
import VirtualList from 'react-virtualized/dist/es/List'
import AutoSizer from 'react-virtualized/dist/es/AutoSizer'

import { ADD_WHITELIST, REMOVE_WHITELIST } from '../redux/actionTypes'

const WhiteList = props => {
  const dispatch = useDispatch()
  const whiteList = useSelector(store => store.whiteList)
  const [host, setHost] = useState('')
  const handleNewItem = () => {
    if (host !== '') {
      dispatch({ type: ADD_WHITELIST, payload: host })
      setHost('')
    }
  }
  const handleRemoveItem = (index) => {
    dispatch({ type: REMOVE_WHITELIST, payload: index })
  }
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleNewItem()
    }
  }
  const rowRenderer = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
        <ListItem divider>
          <ListItemText primary={whiteList[index]} />
          <ListItemSecondaryAction>
            <IconButton>
              <IconDelete onClick={() => handleRemoveItem(index)} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader
        title={chrome.i18n.getMessage('white_list')}
        subheader={chrome.i18n.getMessage('white_list_desc')}
      />

      <WindowScroller scroll>
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
          <div>
            <List>
              <ListItem divider>
                <ListItemText>
                  <Input
                    type="text"
                    fullWidth
                    value={host}
                    onKeyUp={handleKeyUp}
                    onChange={e => setHost(e.target.value)}
                  />
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={handleNewItem} >
                    <IconAdd />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <AutoSizer disableHeight>
                {({ width }) => (
                  <div ref={registerChild}>
                    <VirtualList
                      autoHeight
                      width={width}
                      height={height}
                      scrollTop={scrollTop}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      rowCount={whiteList.length}
                      rowHeight={47}
                      rowRenderer={rowRenderer}
                    />
                  </div>
                )}
              </AutoSizer>
            </List>
          </div>
        )}
      </WindowScroller>
    </Card>
  )
}

export default WhiteList
