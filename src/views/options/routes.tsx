import { RouteObject } from "react-router-dom";
import ProxyServers from "./ProxyServers";
import Options from './Options';
import BlackList from "./BlackList";
import WhiteList from "./WhiteList";

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
        path: '/black-list',
        Component: BlackList,
      },
      {
        path: '/white-list',
        Component: WhiteList,
      }
    ]
  },
];