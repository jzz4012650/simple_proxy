import { handleActions } from 'redux-actions';
import { PROXY_TYPES, PROXY_SERVER_TPL } from './constants';

let bgPage = chrome.extension.getBackgroundPage();
const { BLACK_LIST, WHITE_LIST } = bgPage;

const defaultProps = {
    proxyServers: [JSON.parse(PROXY_SERVER_TPL)],
    blackList: [],
    whiteList: [],
    showSnackbar: false,
    snackbarContent: '',
    snackbarType: 1
}

export default handleActions({
    INIT_CONFIGURATION: (state, action) => {
        const { servers, rules } = action.payload;
        return {
            ...state,
            proxyServers: servers || state.proxyServers,
            blackList: (rules || {})[BLACK_LIST] || [''],
            whiteList: (rules || {})[WHITE_LIST] || [''],
        }
    },
    MODIFY_PROXY_SERVER: (state, action) => {
        const { index, newServer } = action.payload;
        let servers = state.proxyServers.slice();
        servers.splice(index, 1, newServer);
        return {
            ...state,
            proxyServers: servers
        }
    },
    ADD_PROXY_SERVER: (state, action) => {
        let { index } = action.payload;
        let newServer = JSON.parse(PROXY_SERVER_TPL);
        let proxyServers = state.proxyServers.slice();
        proxyServers.splice(index + 1, 0, newServer);
        return {
            ...state,
            proxyServers: proxyServers
        }
    },
    ADD_PROXY_RULE: (state, action) => {
        let { index, type } = action.payload;
        let key = type === 1 ? 'blackList' : 'whiteList';
        let rules = state[key].slice();
        let newState = Object.assign({}, state);

        rules.splice(index + 1, 0, "");
        newState[key] = rules;

        return newState;
    },
    DELETE_PROXY_SERVER: (state, action) => {
        let { index } = action.payload;
        let proxyServers = state.proxyServers.slice();

        if (proxyServers.length <= 1) {
            return {
                ...state,
                proxyServers: [JSON.parse(PROXY_SERVER_TPL)],
                showSnackbar: true,
                snackbarType: 0,
                snackbarContent: 'At least one proxy server is required!'
            }
        } else {
            proxyServers.splice(index, 1);
            return {
                ...state,
                proxyServers: proxyServers
            }
        }
    },
    DELETE_PROXY_RULE: (state, action) => {
        let { index, type } = action.payload;
        let key = type === 1 ? 'blackList' : 'whiteList';
        let rules = state[key].slice();
        let newState = Object.assign({}, state);

        if (rules.length <= 1) {
            newState[key] = [""];
        } else {
            rules.splice(index, 1);
            newState[key] = rules;
        }

        return newState;
    },
    MODIFY_PROXY_RULE: (state, action) => {
        const { index, value, type } = action.payload;
        let key = type === 1 ? 'blackList' : 'whiteList';
        let rules = state[key].slice();
        let newState = Object.assign({}, state);

        rules.splice(index, 1, value);
        newState[key] = rules;

        return newState;
    },
    SAVE_CONFIG: {
        next: (state, action) => {
            return {
                ...state,
                showSnackbar: true,
                snackbarType: 1,
                snackbarContent: 'Configurations saved!'
            }
        },
        throw: (state, action) => {
            console.error(action.payload);
            return {
                ...state,
                showSnackbar: true,
                snackbarType: 0,
                snackbarContent: 'Configurations saved failed.'
            }
        }
    },
    HANDLE_SNACKBAR_CLOSE: (state, action) => {
        return {
            ...state,
            showSnackbar: false
        }
    }
}, defaultProps)