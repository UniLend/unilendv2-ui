import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { openRoutes } from './routes';

export default function MainRoutes(props) {

  return (
    <Routes>
      {openRoutes.map((singleRoute) => {
        return (
          <Route
            element={<singleRoute.element {...props} />}
            exact={singleRoute.exact}
            path={singleRoute.path}
            key={singleRoute.path}
          />
        );
      })}
    </Routes>
  );
}
