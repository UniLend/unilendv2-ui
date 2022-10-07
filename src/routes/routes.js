import { lazy } from 'react';
import History from '../pages/history';

export const openRoutes = [
  {
    path: '/history',
    exact: true,
    element: lazy(() => import('../pages/history')),
  },
];
