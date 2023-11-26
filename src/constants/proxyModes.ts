import ArrowForward from '@mui/icons-material/ArrowForward';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import RadioButtonChecked from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import { FunctionComponent } from "react";

export enum ProxyModes {
  'Direct' = 'DIRECT',
  'System' = 'SYSTEM',
  'BlackList' = 'BLACK_LIST',
  'WhiteList' = 'WHITE_LIST',
}

export type ProxyModeOption = {
  name: ProxyModes,
  title: string,
  desc: string,
  icon: FunctionComponent,
}

export const PROXY_MODES: ProxyModeOption[] = [{
  name: ProxyModes.BlackList,
  title: chrome.i18n.getMessage('mode_black_list'),
  desc: chrome.i18n.getMessage('mode_black_list_desc'),
  icon: RadioButtonChecked,
}, {
  name: ProxyModes.WhiteList,
  title: chrome.i18n.getMessage('mode_white_list'),
  desc: chrome.i18n.getMessage('mode_white_list_desc'),
  icon: RadioButtonUnchecked,
}, {
  name: ProxyModes.System,
  title: chrome.i18n.getMessage('mode_system'),
  desc: chrome.i18n.getMessage('mode_system_desc'),
  icon: DesktopWindowsOutlinedIcon,
}, {
  name: ProxyModes.Direct,
  title: chrome.i18n.getMessage('mode_direct'),
  desc: chrome.i18n.getMessage('mode_direct_desc'),
  icon: ArrowForward,
}]
