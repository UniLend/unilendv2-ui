import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/Store';
import './index.css';
import Ring from './components/Loader/Ring';

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend_mumbai",
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ApolloProvider client={client}>
    <Suspense fallback={<Ring />}>
    <Provider store={store} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
    </Suspense>
    </ApolloProvider>
  </React.StrictMode>
);
