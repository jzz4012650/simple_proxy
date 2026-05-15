import { RouteObject } from "react-router-dom";
import ProxyServers from "./ProxyServers";
import Options from './Options';
import ProxyDomainsList from "./ProxyDomains";
import BypassDomainsList from "./BypassDomains";

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: Options,
    children: [
      {
        path: '/proxy-servers',
        Component: ProxyServers,
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