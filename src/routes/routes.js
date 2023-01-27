import { lazy } from 'react';
import UserDashboardComponent from '../components/UserDashBoard';

export const openRoutes = [
  {
    path: '/',
    exact: true,
    element: lazy(() => import('../pages/heropage')),
  },
  {
    path: '/pools',
    exact: true,
    element: lazy(() => import('../pages/hallOfPools')),
  },
  {
    path: '/history',
    exact: true,
    element: lazy(() => import('../pages/history')),
  },
  {
    path: '/pool/:poolAddress',
    exact: true,
    element: lazy(() => import('../pages/pool')),
  },
  {
    path: '/dashboard',
    exact: true,
    element: UserDashboardComponent ,
  },
];
