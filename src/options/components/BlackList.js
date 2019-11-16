import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addBlackList, removeBlackList } from '../redux/actions'

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

class BlackList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      host: ''
    }
  }

  handleNewListItem () {
    const { host } = this.state
    if (host !== '') {
      this.props.addBlackList(host)
      this.setState({
        host: ''
      })
    }
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleNewListItem()
    }
  }

  handleRemoveItem (index) {
    this.props.removeBlackList(index)
  }

  rowRenderer ({ index, key, style }) {
    const { blackList } = this.props
    return (
      <div key={key} style={style}>
        <ListItem divider>
          <ListItemText primary={blackList[index]} />
          <ListItemSecondaryAction>
            <IconButton>
              <IconDelete onClick={this.handleRemoveItem.bind(this, index)} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    )
  }

  render () {
    const { host } = this.state
    const { blackList } = this.props
    return (
      <Card>
        <CardHeader
          title={chrome.i18n.getMessage('black_list')}
          subheader={chrome.i18n.getMessage('black_list_desc')}
        />

        <WindowScroller scroll>
          {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
            <div>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary={
                      <Input
                        type="text"
                        fullWidth
                        value={host}
                        onKeyPress={e => this.handleKeyPress(e)}
                        onChange={e => this.setState({ host: e.target.value })}
                      />
                    }
                  >
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton onClick={this.handleNewListItem.bind(this)} >
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
                        rowCount={blackList.length}
                        rowHeight={47}
                        rowRenderer={this.rowRenderer.bind(this)}
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
}

BlackList.propTypes = {
  blackList: PropTypes.arrayOf(PropTypes.string),
  addBlackList: PropTypes.func,
  removeBlackList: PropTypes.func
}

export default connect(
  ({ blackList }) => ({ blackList }),
  { addBlackList, removeBlackList }
)(BlackList)
