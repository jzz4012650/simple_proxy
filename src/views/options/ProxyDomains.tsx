
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import { getProxyDomains, setProxyDomains, getGfwlistEnabled, setGfwlistEnabled, refreshGfwlist } from '../../services/config';
import { useImportExport } from '../../hooks/useImportExport';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Button } from '@mui/material';
import AddCircle from '@mui/icons-material/AddCircle';

type ProxyDomainsForRender = {
  originIndex: number;
  host: string;
}[];

const ProxyDomainsList = () => {
  const [proxyDomains, _setProxyDomains] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [filteredProxyDomains, setFilteredProxyDomains] = useState<ProxyDomainsForRender>([]);
  const [hostToAdd, setHostToAdd] = useState<string>('');
  const [gfwlistEnabled, setGfwlistEnabledState] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { fileInputRef, handleExport, handleImport } = useImportExport({
    currentList: proxyDomains,
    onImport: (newList) => {
      _setProxyDomains(newList);
      setProxyDomains(newList);
    }
  });

  const handleGfwlistToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setGfwlistEnabledState(enabled);

    try {
      await setGfwlistEnabled(enabled);
      setSnackbarMessage(enabled ?
        chrome.i18n.getMessage('gfwlist_fetch_success') :
        chrome.i18n.getMessage('gfwlist_disabled')
      );
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to update GFWList setting:', error);
      setSnackbarMessage(chrome.i18n.getMessage('gfwlist_fetch_failed'));
      setSnackbarSeverity('error');
      // 回退状态
      setGfwlistEnabledState(!enabled);
    }
    setSnackbarOpen(true);
  };

  const handleGfwlistRefresh = async () => {
    if (!gfwlistEnabled) {
      setSnackbarMessage(chrome.i18n.getMessage('enable_gfwlist_first'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsRefreshing(true);
    try {
      const success = await refreshGfwlist();
      if (success) {
        setSnackbarMessage(chrome.i18n.getMessage('gfwlist_refresh_success'));
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(chrome.i18n.getMessage('gfwlist_refresh_failed'));
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Failed to refresh GFWlist:', error);
      setSnackbarMessage(chrome.i18n.getMessage('gfwlist_refresh_failed'));
      setSnackbarSeverity('error');
    } finally {
      setIsRefreshing(false);
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
    getGfwlistEnabled().then((enabled) => {
      setGfwlistEnabledState(enabled);
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
      <Stack direction='row' alignItems='flex-start' gap={2}>
        <Typography variant="h4" component="h4" gutterBottom sx={{ flexGrow: 1 }}>
          {chrome.i18n.getMessage('proxy_domains')}
        </Typography>
        {/* 刷新 GFWList 按钮 */}
        {gfwlistEnabled && (
          <Tooltip title={chrome.i18n.getMessage('refresh_gfwlist_tooltip')} arrow>
            <span>
              <IconButton
                onClick={handleGfwlistRefresh}
                disabled={isRefreshing}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {/* 启用 GFWList 开关 */}
        <FormControlLabel
          control={
            <Switch
              checked={gfwlistEnabled}
              onChange={handleGfwlistToggle}
              color="primary"
            />
          }
          label={
            <Tooltip title={chrome.i18n.getMessage('enable_gfwlist_tooltip')} arrow>
              <span>{chrome.i18n.getMessage('enable_gfwlist')}</span>
            </Tooltip>
          }
          sx={{ mr: 0 }}
        />
        {/* 导入导出按钮 */}
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
          {chrome.i18n.getMessage('proxy_domains_desc')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            variant="outlined"
            value={hostToAdd}
            sx={{ flexGrow: 3 }}
            onKeyUp={handleKeyUp}
            onChange={(e) => setHostToAdd(e.target.value)}
            label={chrome.i18n.getMessage('add_to_proxy_domains_placeholder')}
            helperText={chrome.i18n.getMessage('add_to_proxy_domains_helper_text')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleNewItem(hostToAdd)}>
                    <AddCircle />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProxyDomainsList;
