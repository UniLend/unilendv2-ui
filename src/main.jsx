import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/Store';
import './index.css';
import Ring from './components/Loader/Ring';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Ring />}>
    <Provider store={store} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
    </Suspense>
  </React.StrictMode>
);
