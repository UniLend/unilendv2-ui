import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { openRoutes } from './routes';

export default function MainRoutes() {
  return (
    <Routes>
      {openRoutes.map((singleRoute) => {
        return (
          <Route
            element={<singleRoute.element />}
            exact={singleRoute.exact}
            path={singleRoute.path}
            key={singleRoute.path}
          />
        );
      })}
    </Routes>
  );
}
