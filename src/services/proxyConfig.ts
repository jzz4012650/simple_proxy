import { ProxyModes } from '../constants/proxyModes';
import { STORAGE_PROXY_MODE } from '../constants/storage';
import { generatePac } from './pacScript';

export type ChromeSettingScope = 'regular' | 'regular_only' | 'incognito_persistent' | 'incognito_session_only';

export type ProxySetting = {
  scope: ChromeSettingScope,
  value: {
    mode: 'system' | 'pac_script' | 'direct',
    pacScript: {
      data: string;
    };
  };
};

const generateProxySettingObj = async (mode: ProxyModes) => {
  const settingObj: ProxySetting = {
    scope: 'regular',
    value: {
      mode: 'system',
      pacScript: {
        data: ''
      }
    }
  };
  if (mode === ProxyModes.System) {
    settingObj.value.mode = 'system';
  }
  switch (mode) {
    case ProxyModes.System:
      settingObj.value.mode = 'system';
      break;
    case ProxyModes.Direct:
      settingObj.value.mode = 'direct';
      break;
    case ProxyModes.WhiteList: {
      const pac = await generatePac(ProxyModes.WhiteList);
      settingObj.value.mode = 'pac_script';
      settingObj.value.pacScript = { data: pac };
      break;
    }
    case ProxyModes.BlackList: {
      const pac = await generatePac(ProxyModes.BlackList);
      settingObj.value.mode = 'pac_script';
      settingObj.value.pacScript = { data: pac };
      break;
    }
  }
  return settingObj;
};

const setProxy = (settingObj: ProxySetting) => {
  return chrome.proxy.settings.set(settingObj);
};

export const updateProxyConfig = async () => {
  const obj = await chrome.storage.local.get(STORAGE_PROXY_MODE);
  const proxyMode = obj[STORAGE_PROXY_MODE] || ProxyModes.System;
  const settingObj = await generateProxySettingObj(proxyMode);
  console.log(settingObj);
  await setProxy(settingObj);
};
