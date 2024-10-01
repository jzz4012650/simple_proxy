import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import { getBlackList, setBlackList } from '../../services/config';

type BlackListForRender = {
  originIndex: number;
  host: string;
}[];

const BlackList = () => {
  const [blackList, _setBlackList] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [filteredBlackList, setFilteredBlackList] = useState<BlackListForRender>([]);
  const [hostToAdd, setHostToAdd] = useState<string>('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleNewItem = (host: string) => {
    if (!host) {
      return;
    }
    const newList = [host, ...blackList];
    _setBlackList(newList);
    setHostToAdd('');
    setBlackList(newList);
  };

  const handleRemoveItem = (index: number) => {
    const newList = blackList.filter((_, i) => i !== index);
    _setBlackList(newList);
    setBlackList(newList);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNewItem(hostToAdd);
    }
  };

  const virtualizer = useWindowVirtualizer({
    count: filteredBlackList.length,
    estimateSize: () => 50,
    overscan: 5,
    scrollMargin: 0
  });

  const rowRenderer = ({ index, style }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div key={index} style={style} >
      <ListItem divider>
        <ListItemText primary={filteredBlackList[index].host} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => handleRemoveItem(filteredBlackList[index].originIndex)}>
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );

  useEffect(() => {
    getBlackList().then((res) => {
      _setBlackList(res);
    });
  }, []);

  useEffect(() => {
    const filtered: BlackListForRender = [];
    blackList.forEach((host, index) => {
      if (host.toLocaleLowerCase().includes((keyword ?? '').toLocaleLowerCase())) {
        filtered.push({
          originIndex: index,
          host,
        });
      }
    });
    setFilteredBlackList(filtered);
  }, [blackList, keyword]);

  return (
    <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>
      <Typography variant="h4" component="h4" gutterBottom>
        {chrome.i18n.getMessage('black_list')}
      </Typography>
      <Stack direction='column' spacing={1}>
        <Typography variant="body1" gutterBottom>
          {chrome.i18n.getMessage('black_list_desc')}
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            variant="standard"
            value={hostToAdd}
            sx={{ flexGrow: 3 }}
            onKeyUp={handleKeyUp}
            onChange={(e) => setHostToAdd(e.target.value)}
            label={chrome.i18n.getMessage('add_to_black_list_placeholder')}
            helperText={chrome.i18n.getMessage('add_to_black_list_helper_text')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddBoxIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="standard"
            value={keyword}
            sx={{ flexGrow: 1 }}
            onChange={(e) => setKeyword(e.target.value)}
            label={chrome.i18n.getMessage('search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Card>
        <div ref={listRef} style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}>
            <List>
              {virtualizer.getVirtualItems().map((virtualRow) => rowRenderer({
                index: virtualRow.index,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                },
              }))}
            </List>
          </div>
        </Card>
      </Stack>
    </Box>
  );
};

export default BlackList;
