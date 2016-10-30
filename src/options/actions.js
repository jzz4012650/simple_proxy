import { createAction } from 'redux-actions';

let bgPage = chrome.extension.getBackgroundPage();
const { saveProxyServersAndRules } = bgPage;

export const initConfiguration = createAction('INIT_CONFIGURATION', values => {
    return {
        servers: values[0],
        rules: values[1]
    }
})

export const addProxyServer = createAction('ADD_PROXY_SERVER')

export const addProxyRule = createAction('ADD_PROXY_RULE')

export const deleteProxyServer = createAction('DELETE_PROXY_SERVER')

export const deleteProxyRule = createAction('DELETE_PROXY_RULE')

export const modifyProxyServer = createAction('MODIFY_PROXY_SERVER')

export const modifyProxyRule = createAction('MODIFY_PROXY_RULE')

export const saveConfig = createAction('SAVE_CONFIG', (servers, blackList, whiteList) => {
    return saveProxyServersAndRules(servers, blackList, whiteList);
})

export const handleSnackbarClose = createAction('HANDLE_SNACKBAR_CLOSE')
