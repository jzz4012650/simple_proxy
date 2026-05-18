
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';

import Alert from '@mui/material/Alert';
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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { AddOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useImportExport } from '../../hooks/useImportExport';
import { getProxyDomains, setProxyDomains } from '../../services/config';

type ProxyDomainsForRender = {
  originIndex: number;
  host: string;
}[];

const ProxyDomainsList = () => {
  const [proxyDomains, _setProxyDomains] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [filteredProxyDomains, setFilteredProxyDomains] = useState<ProxyDomainsForRender>([]);
  const [hostToAdd, setHostToAdd] = useState<string>('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const { fileInputRef, handleExport, handleImport } = useImportExport({
    currentList: proxyDomains,
    onImport: (newList) => {
      _setProxyDomains(newList);
      setProxyDomains(newList);
    }
  });

  const handleNewItem = (host: string) => {
    if (!host) {
      return;
    }
    const newList = [host, ...proxyDomains];
    _setProxyDomains(newList);
    setHostToAdd('');
    setProxyDomains(newList);
  };

  const handleRemoveItem = (index: number) => {
    const newList = proxyDomains.filter((_, i) => i !== index);
    _setProxyDomains(newList);
    setProxyDomains(newList);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNewItem(hostToAdd);
    }
  };

  const virtualizer = useWindowVirtualizer({
    count: filteredProxyDomains.length,
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
        <ListItemText primary={filteredProxyDomains[index].host} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => handleRemoveItem(filteredProxyDomains[index].originIndex)}>
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );

  useEffect(() => {
    getProxyDomains().then((res) => {
      _setProxyDomains(res);
    });
  }, []);

  useEffect(() => {
    const filtered: ProxyDomainsForRender = [];
    proxyDomains.forEach((host, index) => {
      if (host.toLocaleLowerCase().includes((keyword ?? '').toLocaleLowerCase())) {
        filtered.push({
          originIndex: index,
          host,
        });
      }
    });
    setFilteredProxyDomains(filtered);
  }, [proxyDomains, keyword]);

  return (
    <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>
      <Stack direction='row' alignItems='center' gap={2} marginBottom={1}>
        <Typography variant="h5" component="h4" gutterBottom={false} sx={{ flexGrow: 1 }}>
          {chrome.i18n.getMessage('proxy_domains')}
        </Typography>
        {/* 导入导出按钮 */}
        <ButtonGroup variant="outlined" size="small">
          <Tooltip title={chrome.i18n.getMessage('import_tooltip')} arrow>
            <Button
              startIcon={<FileUploadIcon />}
              color="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {chrome.i18n.getMessage('import')}
            </Button>
          </Tooltip>
          <Tooltip title={chrome.i18n.getMessage('export_tooltip')} arrow>
            <Button
              startIcon={<FileDownloadIcon />}
              color="primary"
              onClick={handleExport}
            >
              {chrome.i18n.getMessage('export')}
            </Button>
          </Tooltip>
        </ButtonGroup>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleImport}
        />
      </Stack>

      <Box marginBottom={1}>
        <Alert severity="info">
          {chrome.i18n.getMessage('proxy_domains_desc')}
        </Alert>
      </Box>

      <Card>
        <List>
          <ListItem>
            <Stack direction="row" spacing={2} alignItems="flex-start" width={'100%'}>
              <TextField
                size="small"
                variant="outlined"
                value={hostToAdd}
                sx={{ flexGrow: 3 }}
                onKeyUp={handleKeyUp}
                onChange={(e) => setHostToAdd(e.target.value)}
                label={chrome.i18n.getMessage('add_to_proxy_domains_placeholder')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <AddOutlined />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                size="small"
                variant="outlined"
                value={keyword}
                sx={{ flexGrow: 1 }}
                onChange={(e) => setKeyword(e.target.value)}
                label={chrome.i18n.getMessage('search')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </ListItem>
        </List>
        <div ref={listRef} style={{
          height: filteredProxyDomains.length > 0 ? `${virtualizer.getTotalSize()}px` : 'auto',
          position: 'relative',
        }}>
          {filteredProxyDomains.length > 0 ? (
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
          ) : (
            <ListItem>
              <ListItemText
                primary={chrome.i18n.getMessage('proxy_domains_empty')}
                sx={{ textAlign: 'center', color: 'text.disabled' }}
              />
            </ListItem>
          )}
        </div>
      </Card>
    </Box>
  );
};

export default ProxyDomainsList;
