import { lazy } from 'react';

export const openRoutes = [
  {
    path: '/',
    exact: true,
    element: lazy(() => import('../pages/hallOfPools')),
  },
  {
    path: '/history',
    exact: true,
    element: lazy(() => import('../pages/history')),
  },
  {
    path: '/pool/:address',
    exact: true,
    element: lazy(() => import('../pages/pool')),
  },
];
