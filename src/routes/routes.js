import { lazy } from "react";

export const openRoutes = [
  {
    path: "/",
    exact: true,
    element: lazy(() => import("../pages/heroPage")),
  },
  {
    path: "/pools",
    exact: true,
    element: lazy(() => import("../pages/hallOfPools")),
  },
  {
    path: "/history",
    exact: true,
    element: lazy(() => import("../pages/history")),
  },
  {
    path: "/pool/:poolAddress",
    exact: true,
    element: lazy(() => import("../pages/pool")),
  },
  {
    path: "/dashboard",
    exact: true,
    element: lazy(() => import("../pages/userDashboard")),
  },
  {
    path: "/governance",
    exact: true,
    element: lazy(() => import("../pages/vote")),
  },
];
