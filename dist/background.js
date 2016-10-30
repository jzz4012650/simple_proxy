// map of common domain suffix.
var DOMAINS = { "biz": 1, "com": 1, "edu": 1, "gov": 1, "info": 1, "int": 1, "mil": 1, "name": 1, "net": 1, "org": 1, "pro": 1, "xxx": 1, "aero": 1, "cat": 1, "coop": 1, "jobs": 1, "museum": 1, "travel": 1, "mobi": 1, "asia": 1, "tel": 1, "arpa": 1, "root": 1, "tel": 1, "post": 1, "geo": 1, "kid": 1, "mail": 1, "sco": 1, "web": 1, "nato": 1, "example": 1, "invalid": 1, "localhost": 1, "test": 1, "bitnet": 1, "csnet": 1, "local": 1, "onion": 1, "uucp": 1, "ac": 1, "ad": 1, "ae": 1, "af": 1, "ag": 1, "ai": 1, "al": 1, "am": 1, "an": 1, "ao": 1, "aq": 1, "ar": 1, "as": 1, "at": 1, "au": 1, "aw": 1, "az": 1, "ba": 1, "bb": 1, "bd": 1, "be": 1, "bf": 1, "bg": 1, "bh": 1, "bi": 1, "bj": 1, "bm": 1, "bn": 1, "bo": 1, "br": 1, "bs": 1, "bt": 1, "bv": 1, "bw": 1, "by": 1, "bz": 1, "ca": 1, "cc": 1, "cd": 1, "cf": 1, "cg": 1, "ch": 1, "ci": 1, "ck": 1, "cl": 1, "cm": 1, "cn": 1, "co": 1, "cr": 1, "cu": 1, "cv": 1, "cx": 1, "cy": 1, "cz": 1, "de": 1, "dj": 1, "dk": 1, "dm": 1, "do": 1, "dz": 1, "ec": 1, "ee": 1, "eg": 1, "er": 1, "es": 1, "et": 1, "eu": 1, "fi": 1, "fj": 1, "fk": 1, "fm": 1, "fo": 1, "fr": 1, "ga": 1, "gd": 1, "ge": 1, "gf": 1, "gg": 1, "gh": 1, "gi": 1, "gl": 1, "gm": 1, "gn": 1, "gp": 1, "gq": 1, "gr": 1, "gs": 1, "gt": 1, "gu": 1, "gw": 1, "gy": 1, "hk": 1, "hm": 1, "hn": 1, "hr": 1, "ht": 1, "hu": 1, "id": 1, "ie": 1, "il": 1, "im": 1, "in": 1, "io": 1, "iq": 1, "ir": 1, "is": 1, "it": 1, "je": 1, "jm": 1, "jo": 1, "jp": 1, "ke": 1, "kg": 1, "kh": 1, "ki": 1, "km": 1, "kn": 1, "kr": 1, "kw": 1, "ky": 1, "kz": 1, "la": 1, "lb": 1, "lc": 1, "li": 1, "lk": 1, "lr": 1, "ls": 1, "lt": 1, "lu": 1, "lv": 1, "ly": 1, "ma": 1, "mc": 1, "md": 1, "me": 1, "mg": 1, "mh": 1, "mk": 1, "ml": 1, "mm": 1, "mn": 1, "mo": 1, "mp": 1, "mq": 1, "mr": 1, "ms": 1, "mt": 1, "mu": 1, "mv": 1, "mw": 1, "mx": 1, "my": 1, "mz": 1, "na": 1, "nc": 1, "ne": 1, "nf": 1, "ng": 1, "ni": 1, "nl": 1, "no": 1, "np": 1, "nr": 1, "nu": 1, "nz": 1, "om": 1, "pa": 1, "pe": 1, "pf": 1, "pg": 1, "ph": 1, "pk": 1, "pl": 1, "pm": 1, "pn": 1, "pr": 1, "ps": 1, "pt": 1, "pw": 1, "py": 1, "qa": 1, "re": 1, "ro": 1, "ru": 1, "rw": 1, "sa": 1, "sb": 1, "sc": 1, "sd": 1, "se": 1, "sg": 1, "sh": 1, "si": 1, "sk": 1, "sl": 1, "sm": 1, "sn": 1, "so": 1, "sr": 1, "st": 1, "sv": 1, "sy": 1, "sz": 1, "tc": 1, "td": 1, "tf": 1, "tg": 1, "th": 1, "tj": 1, "tk": 1, "tl": 1, "tm": 1, "tn": 1, "to": 1, "tr": 1, "tt": 1, "tv": 1, "tw": 1, "tz": 1, "ua": 1, "ug": 1, "uk": 1, "us": 1, "uy": 1, "uz": 1, "va": 1, "vc": 1, "ve": 1, "vg": 1, "vi": 1, "vn": 1, "vu": 1, "wf": 1, "ws": 1, "ye": 1, "yt": 1, "yu": 1, "za": 1, "zm": 1, "zw": 1, "cs": 1, "eh": 1, "kp": 1, "ax": 1, "bv": 1, "gb": 1, "sj": 1, "um": 1};

// reg_exp to test ip address.
var REG_IP = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

var PROXY_SERVERS = 'PROXY_SERVERS';
var PROXY_RULES = 'PROXY_RULES';
var BLACK_LIST = 'BLACK_LIST';
var WHITE_LIST = 'WHITE_LIST';
var PROXY_MODE = 'PROXY_MODE';

var PROXY_MODES = [{
    name: 'SYSTEM',
    desc: 'Configuration will be taken from your OS'
}, {
    name: 'DIRECT',
    desc: 'All directly, without any proxy involved'
}, {
    name: 'BLACK_LIST',
    desc: 'Only traffic hits the black list will be proxied'
}, {
    name: 'WHITE_LIST',
    desc: 'Only traffic hits the white list will not be proxied'
}]

// id of current tab actived.
var currentTabId = null;

// map of tabs, each is an array of urls requested in that tab.
var tabs = {};

// obj of setting.
var settings = {};

// when tab created
chrome.tabs.onCreated.addListener(function(tab) {
    tabs[tab.id] = [];
})


// when tab closed
chrome.tabs.onRemoved.addListener(function(tabId) {
    if (tabId in tabs) {
        delete tabs[tabId];
    }
})


// when tab changeed
chrome.tabs.onActivated.addListener(function(tab) {
    currentTabId = tab.tabId;
});


// when page redirect or refreshed.
chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    if (details.frameId === 0) {
        tabs[details.tabId] = [];
    }
})


// when a request is going to be send
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    collectHosts(details);
}, {
    urls: [
        "http://*/*",
        "https://*/*"
    ]
});


/**
 * push first-level domain into hostlist of corresponding tab, uniqueness ensured.
 * @param  {Object} details request detail
 */
function collectHosts(details) {
    var tabId         = details.tabId;
    var hostname      = getLocation(details.url).hostname;
    var firstlvDomain = getFirstlvDomain(hostname);
    var hostList      = tabs[tabId] || [];

    if (hostList.indexOf(firstlvDomain) < 0) {
        hostList.push(firstlvDomain);
    }

    tabs[tabId] = hostList;
}


/**
 * get first level domain of a hostname.
 * @param  {String} host hostname
 * @returns {String} first level hostname
 */
function getFirstlvDomain(host) {
    if (REG_IP.test(host)) {
        return host;
    } else {
        var hostArray = host.split('.');

        for (var i = hostArray.length - 1; i >= 0; i--) {
            if (!(hostArray[i] in DOMAINS)) {
                hostArray = hostArray.splice(i);
                break;
            }
        }

        return hostArray.join('.');
    }
}

/**
 * get hostname from an URL
 * @returns {DOM} DOM with href property
 */
var linkDom = document.createElement("a");
function getLocation(url) {
    linkDom.href = url;
    return linkDom;
};

/**
 * get hosts which current tab has sent requests to them
 * @returns {Promise} list of hostnames
 */
function getCurrentTabHosts() {
    return Promise.resolve(tabs[currentTabId] || []);
}

/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */
function getProxyMode() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(PROXY_MODE, function(obj) {
            resolve(obj[PROXY_MODE] || PROXY_MODES[0].name);
        })
    })
}

/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */
function setProxyMode(mode) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.set({ PROXY_MODE: mode }, function(obj) {
            generateProxySettingObj(mode).then(function(settingObj) {
                console.log(settingObj);
                chrome.proxy.settings.set(settingObj, function() {
                    resolve(mode);
                });
            });
        })
    })
}

/**
 * get proxy mode stored in loacal storage
 * @returns {Promise}
 */
function saveProxyServersAndRules(servers, blackList, whiteList) {
    return Promise.all([
        saveProxyServers(servers),
        saveProxyRules(blackList, whiteList)
    ]).then(function() {
        // update black(white) list and proxy server
        // in pac script by resetting the proxy mode.
        getProxyMode().then(function(mode) {
            setProxyMode(mode);
        })
    });
}

/**
 * function for saving proxy servers which returns a promise object.
 * @param {array} rules list of proxy rules
 */
function saveProxyRules(blackList, whiteList) {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.set({
            BLACK_LIST: blackList,
            WHITE_LIST: whiteList
        }, function() {
            resolve();
        })
    });
}

/**
 * function for saving proxy servers which returns a promise object.
 * @param {array} servers list of proxy servers
 */
function saveProxyServers(servers) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.set({ PROXY_SERVERS: servers }, function() {
            resolve();
        })
    })
}

/**
 * function for getting proxy_rules which returns a promise object.
 * @returns {Promise} resolve with proxy rules array
 */
function getProxyRules() {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get([BLACK_LIST, WHITE_LIST], function(obj) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(obj);
            }
        })
    })
}

/**
 * function for getting proxy_servers which returns a promise object.
 * @returns {Promise} resolve with proxy servers array
 */
function getProxyServers() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(PROXY_SERVERS, function(obj) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(obj[PROXY_SERVERS]);
            }
        })
    })
}

/**
 * function for update black & white list and reset pac script if need.
 * @param {array} blackList
 * @param {array} whiteList
 * @param {string} mode proxy mode
 */
function updateBlackWhiteList(blackList, whiteList, mode) {
    saveProxyRules(blackList, whiteList).then(function() {
        if (mode === BLACK_LIST || mode === WHITE_LIST) {
            // if in black(white) list mode
            // we need to reset the pac script.
            setProxyMode(mode);
        }
    })
}

/**
 * function for generate proxy setting object.
 * @param {string} mode proxy mode
 * @returns {Object} proxy setting object
 */
function generateProxySettingObj(mode) {
    return new Promise(function(resolve, reject) {
        let settingObj = { scope: 'regular', value: {} };
        switch(mode) {
            case PROXY_MODES[0].name:
                settingObj.value.mode = 'system';
                resolve(settingObj);
                break;
            case PROXY_MODES[1].name:
                settingObj.value.mode = 'direct';
                resolve(settingObj);
                break;
            case PROXY_MODES[2].name:
                generatePacBlack().then(function(pac) {
                    settingObj.value.mode = 'pac_script';
                    settingObj.value.pacScript = { data: pac };
                    resolve(settingObj);
                })
                break;
            case PROXY_MODES[3].name:
                generatePacWhite().then(function(pac) {
                    settingObj.value.mode = 'pac_script';
                    settingObj.value.pacScript = { data: pac };
                    resolve(settingObj);
                })
                break;
        }
    })
}


/**
 * function for generate pac file that suits black list mode
 * @returns {string} pac script
 */
function generatePacBlack() {
    return new Promise(function(resolve, reject) {
        Promise.all([
            getProxyServers(),
            getProxyRules()
        ]).then(function(values) {
            var proxyServers = (values[0] || []).map(function(d) {
                return `${d.type} ${d.host}:${d.port}`
            }).join(';') || 'DIRECT';
            var proxyRules = JSON.stringify(values[1][BLACK_LIST] || []);

            resolve(`
                function FindProxyForURL(url, host) {
                    var rules = ${proxyRules};
                    var proxyServers = '${proxyServers}';
                    for (var i = 0, l = rules.length; i < l; i++) {
                        if (shExpMatch(host, rules[i])) return proxyServers;
                    }
                    return 'DIRECT';
                }
            `);
        })

    })
}

/**
 * function for generate pac file that suits white list mode
 * @returns {Promise} pac script
 */
function generatePacWhite() {
    return new Promise(function(resolve, reject) {
        Promise.all([
            getProxyServers(),
            getProxyRules()
        ]).then(function(values) {
            var proxyServers = (values[0] || []).map(function(d) {
                return `${d.type} ${d.host}:${d.port}`
            }).join(';') || 'DIRECT';
            var proxyRules = JSON.stringify(values[1][WHITE_LIST] || []);

            resolve(`
                function FindProxyForURL(url, host) {
                    var rules = ${proxyRules};
                    var proxyServers = '${proxyServers}';
                    for (var i = 0, l = rules.length; i < l; i++) {
                        if (shExpMatch(host, rules[i])) return 'DIRECT';
                    }
                    return proxyServers;
                }
            `);
        })
    })
}
