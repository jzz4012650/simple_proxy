import ArrowForward from '@mui/icons-material/ArrowForward';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import Language from '@mui/icons-material/Language';
import { FunctionComponent } from "react";

export enum ProxyModes {
  'Direct' = 'DIRECT',
  'System' = 'SYSTEM',
  'OnDemand' = 'ON_DEMAND',
  'Global' = 'GLOBAL',
}

export type ProxyModeOption = {
  name: ProxyModes,
  title: string,
  desc: string,
  icon: FunctionComponent,
}

export const PROXY_MODES: ProxyModeOption[] = [{
  name: ProxyModes.OnDemand,
  title: chrome.i18n.getMessage('mode_on_demand'),
  desc: chrome.i18n.getMessage('mode_on_demand_desc'),
  icon: FilterAltOutlined,
}, {
  name: ProxyModes.Global,
  title: chrome.i18n.getMessage('mode_global'),
  desc: chrome.i18n.getMessage('mode_global_desc'),
  icon: Language,
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
