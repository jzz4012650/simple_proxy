/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "asserts";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background/index.js":
/*!*********************************!*\
  !*** ./src/background/index.js ***!
  \*********************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_proxyModes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/proxyModes */ "./src/constants/proxyModes.js");
/* harmony import */ var _utils_getHost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getHost */ "./src/utils/getHost.js");
/* harmony import */ var _models_Tab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Tab */ "./src/models/Tab.js");
/* harmony import */ var _models_TabCollection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/TabCollection */ "./src/models/TabCollection.js");
// map of common domain suffix.




const tabCollection = new _models_TabCollection__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"]();
chrome.tabs.onCreated.addListener(({
  id
}) => {
  const tab = new _models_Tab__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"](id);
  tabCollection.addTab(tab);
});
chrome.tabs.onRemoved.addListener(tabId => {
  tabCollection.removeTab(tabId);
});
chrome.tabs.onActivated.addListener(({
  id
}) => {
  tabCollection.activeTab(id);
});
chrome.webNavigation.onBeforeNavigate.addListener(details => {
  if (details.frameId === 0) {
    tabCollection.getTab(details.tabId).resetHosts();
  }
});
chrome.webRequest.onBeforeRequest.addListener(details => {
  const url = details.url,
        tabId = details.tabId;
  tabCollection.getTab(tabId).addHost(Object(_utils_getHost__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(url));
}, {
  urls: ['http://*/*', 'https://*/*']
});
/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */

function getProxyMode() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(PROXY_MODE, function (obj) {
      resolve(obj[PROXY_MODE] || _constants_proxyModes__WEBPACK_IMPORTED_MODULE_0__[/* PROXY_MODES */ "c"][0].name);
    });
  });
}
/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */


function setProxyMode(mode) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set({
      PROXY_MODE: mode
    }, function (obj) {
      generateProxySettingObj(mode).then(function (settingObj) {
        chrome.proxy.settings.set(settingObj, function () {
          resolve(mode);
        });
      });
    });
  });
}
/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */


function saveProxyServersAndRules(servers, blackList, whiteList) {
  return Promise.all([saveProxyServers(servers), saveProxyRules(blackList, whiteList)]).then(function () {
    // update black(white) list and proxy server
    // in pac script by resetting the proxy mode.
    getProxyMode().then(function (mode) {
      setProxyMode(mode);
    });
  });
}
/**
 * function for saving proxy servers which returns a promise object.
 * @param {array} rules list of proxy rules
 */


function saveProxyRules(blackList, whiteList) {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.set({
      BLACK_LIST: blackList,
      WHITE_LIST: whiteList
    }, function () {
      resolve({
        BLACK_LIST: blackList,
        WHITE_LIST: whiteList
      });
    });
  });
}
/**
 * function for saving proxy servers which returns a promise object.
 * @param {array} servers list of proxy servers
 */


function saveProxyServers(servers) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set({
      PROXY_SERVERS: servers
    }, function () {
      resolve();
    });
  });
}
/**
 * function for getting proxy_rules which returns a promise object.
 * @returns {Promise} resolve with proxy rules array
 */


function getProxyRules() {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get([BLACK_LIST, WHITE_LIST], function (obj) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(obj);
      }
    });
  });
}
/**
 * function for getting proxy_servers which returns a promise object.
 * @returns {Promise} resolve with proxy servers array
 */


function getProxyServers() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(PROXY_SERVERS, function (obj) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(obj[PROXY_SERVERS]);
      }
    });
  });
}
/**
 * function for update black & white list and reset pac script if need.
 * @param {array} blackList
 * @param {array} whiteList
 * @param {string} mode proxy mode
 */


function updateBlackWhiteList(blackList, whiteList, mode) {
  saveProxyRules(blackList, whiteList).then(function () {
    if (mode === BLACK_LIST || mode === WHITE_LIST) {
      // if in black(white) list mode
      // we need to reset the pac script.
      setProxyMode(mode);
    }
  });
}
/**
 * function for generate proxy setting object.
 * @param {string} mode proxy mode
 * @returns {Object} proxy setting object
 */


function generateProxySettingObj(mode) {
  return new Promise(function (resolve, reject) {
    let settingObj = {
      scope: 'regular',
      value: {}
    };

    switch (mode) {
      case _constants_proxyModes__WEBPACK_IMPORTED_MODULE_0__[/* PROXY_MODES */ "c"][0].name:
        settingObj.value.mode = 'system';
        resolve(settingObj);
        break;

      case _constants_proxyModes__WEBPACK_IMPORTED_MODULE_0__[/* PROXY_MODES */ "c"][1].name:
        settingObj.value.mode = 'direct';
        resolve(settingObj);
        break;

      case _constants_proxyModes__WEBPACK_IMPORTED_MODULE_0__[/* PROXY_MODES */ "c"][2].name:
        generatePacWhite().then(function (pac) {
          settingObj.value.mode = 'pac_script';
          settingObj.value.pacScript = {
            data: pac
          };
          resolve(settingObj);
        });
        break;

      case _constants_proxyModes__WEBPACK_IMPORTED_MODULE_0__[/* PROXY_MODES */ "c"][3].name:
        generatePacBlack().then(function (pac) {
          settingObj.value.mode = 'pac_script';
          settingObj.value.pacScript = {
            data: pac
          };
          resolve(settingObj);
        });
        break;
    }
  });
}

/***/ }),

/***/ "./src/constants/proxyModes.js":
/*!*************************************!*\
  !*** ./src/constants/proxyModes.js ***!
  \*************************************/
/*! exports provided: DIRECT, SYSTEM, BLACK_LIST, WHITE_LIST, PROXY_MODES, PROXY_MODE_MAP */
/*! exports used: BLACK_LIST, DIRECT, PROXY_MODES, SYSTEM, WHITE_LIST */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DIRECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SYSTEM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BLACK_LIST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return WHITE_LIST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return PROXY_MODES; });
/* unused harmony export PROXY_MODE_MAP */
const DIRECT = 'DIRECT';
const SYSTEM = 'SYSTEM';
const BLACK_LIST = 'BLACK_LIST';
const WHITE_LIST = 'WHITE_LIST';
const PROXY_MODES = [{
  name: DIRECT,
  title: chrome.i18n.getMessage('mode_direct'),
  desc: chrome.i18n.getMessage('mode_direct_desc')
}, {
  name: SYSTEM,
  title: chrome.i18n.getMessage('mode_system'),
  desc: chrome.i18n.getMessage('mode_system_desc')
}, {
  name: BLACK_LIST,
  title: chrome.i18n.getMessage('mode_black_list'),
  desc: chrome.i18n.getMessage('mode_black_list_desc')
}, {
  name: WHITE_LIST,
  title: chrome.i18n.getMessage('mode_white_list'),
  desc: chrome.i18n.getMessage('mode_white_list_desc')
}];
const PROXY_MODE_MAP = {};
PROXY_MODES.forEach(d => {
  PROXY_MODE_MAP[d.name] = d;
});

/***/ }),

/***/ "./src/models/Tab.js":
/*!***************************!*\
  !*** ./src/models/Tab.js ***!
  \***************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Tab {
  constructor(id) {
    this.id = id;
    this.hosts = new Set();
  }

  getHosts() {
    return Array.from(this.hosts);
  }

  addHost(host) {
    this.hosts.add(host);
  }

  resetHosts() {
    this.hosts = new Set();
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Tab);

/***/ }),

/***/ "./src/models/TabCollection.js":
/*!*************************************!*\
  !*** ./src/models/TabCollection.js ***!
  \*************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _Tab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tab */ "./src/models/Tab.js");


class TabCollection {
  constructor() {
    this.tabs = new Map();
    this.currentTab = null;
  }

  activeTab(tabId) {
    if (this.tabs.has(tabId)) {
      this.currentTab = this.tabs.get(tabId);
    } else {
      throw Error(`cant not find tab: ${tabId}`);
    }
  }

  getTab(tabId) {
    return this.tabs.get(tabId);
  }

  addTab(tab) {
    if (!(tab instanceof _Tab__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])) {
      throw Error('tab must be instance of Tab');
    }

    this.tabs.add(tab.id, tab);
  }

  removeTab(tabId) {
    this.tabs.delete(tabId);
  }

}

/* harmony default export */ __webpack_exports__["a"] = (TabCollection);

/***/ }),

/***/ "./src/utils/getHost.js":
/*!******************************!*\
  !*** ./src/utils/getHost.js ***!
  \******************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (str => {
  const url = new URL(str);
  return url.hostname;
});

/***/ })

/******/ });
//# sourceMappingURL=background.js.map