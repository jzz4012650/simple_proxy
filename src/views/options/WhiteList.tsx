import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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

import { getWhiteList, setWhiteList } from '../../services/config';
import { useImportExport } from '../../hooks/useImportExport';
import ButtonGroup from '@mui/material/ButtonGroup/ButtonGroup';
import { Button } from '@mui/material';

type WhiteListForRender = {
  originIndex: number;
  host: string;
}[];

const WhiteList = () => {
  const [whiteList, _setWhiteList] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [filteredWhiteList, setFilteredWhiteList] = useState<WhiteListForRender>([]);
  const [hostToAdd, setHostToAdd] = useState<string>('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const { fileInputRef, handleExport, handleImport } = useImportExport({
    currentList: whiteList,
    onImport: (newList) => {
      _setWhiteList(newList);
      setWhiteList(newList);
    }
  });

  const handleNewItem = (host: string) => {
    if (!host) {
      return;
    }
    const newList = [host, ...whiteList];
    _setWhiteList(newList);
    setHostToAdd('');
    setWhiteList(newList);
  };

  const handleRemoveItem = (index: number) => {
    const newList = whiteList.filter((_, i) => i !== index);
    _setWhiteList(newList);
    setWhiteList(newList);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNewItem(hostToAdd);
    }
  };

  const virtualizer = useWindowVirtualizer({
    count: filteredWhiteList.length,
    estimateSize: () => 50,
    overscan: 5,
    scrollMargin: 0,
  });

  const rowRenderer = ({ index, style }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div key={index} style={style} >
      <ListItem divider>
        <ListItemText primary={filteredWhiteList[index].host} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => handleRemoveItem(filteredWhiteList[index].originIndex)}>
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );

  useEffect(() => {
    getWhiteList().then((res) => {
      _setWhiteList(res);
    });
  }, []);

  useEffect(() => {
    const filtered: WhiteListForRender = [];
    whiteList.forEach((host, index) => {
      if (host.toLocaleLowerCase().includes((keyword ?? '').toLocaleLowerCase())) {
        filtered.push({
          originIndex: index,
          host,
        });
      }
    });
    setFilteredWhiteList(filtered);
  }, [whiteList, keyword]);

  return (
    <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>
      <Stack direction='row' alignItems='flex-start'>
        <Typography variant="h4" component="h4" gutterBottom sx={{ flexGrow: 1 }}>
          {chrome.i18n.getMessage('white_list')}
        </Typography>
        <ButtonGroup variant="outlined">
          <Tooltip title={chrome.i18n.getMessage('import_tooltip')} arrow>
            <Button
              startIcon={<FileDownloadIcon />}
              color="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {chrome.i18n.getMessage('import')}
            </Button>
          </Tooltip>
          <Tooltip title={chrome.i18n.getMessage('export_tooltip')} arrow>
            <Button
              startIcon={<FileUploadIcon />}
              color="primary"
              onClick={handleExport}
            >
              {chrome.i18n.getMessage('export')}
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Stack>
      <Stack direction='column' spacing={1}>
        <Typography variant="body1" gutterBottom>
          {chrome.i18n.getMessage('white_list_desc')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            variant="standard"
            value={hostToAdd}
            sx={{ flexGrow: 3 }}
            onKeyUp={handleKeyUp}
            onChange={(e) => setHostToAdd(e.target.value)}
            label={chrome.i18n.getMessage('add_to_white_list_placeholder')}
            helperText={chrome.i18n.getMessage('add_to_white_list_helper_text')}
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
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImport}
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

export default WhiteList;
