import { RouteObject } from "react-router-dom";
import BasicConfig from "./BasicConfig";
import Options from './Options';
import ProxyDomainsList from "./ProxyDomains";
import BypassDomainsList from "./BypassDomains";

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: Options,
    children: [
      {
        path: '/basic-config',
        Component: BasicConfig,
      },
      {
        path: '/proxy-domains',
        Component: ProxyDomainsList,
      },
      {
        path: '/bypass-domains',
        Component: BypassDomainsList,
      }
    ]
  },
];