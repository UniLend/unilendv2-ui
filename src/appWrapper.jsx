import React from 'react'
import App from './App';

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const graphURL = {
    80001:  "https://api.thegraph.com/subgraphs/name/shubham-rathod1/my_unilend",
    137:"https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon"
  }
  
  const client = new ApolloClient({
    uri: graphURL[80001],
    cache: new InMemoryCache(),
  });
export default function AppWrapper() {
  return (
    <ApolloProvider client={client}>
    <>

        <App/>
    </>
    </ApolloProvider>
  )
}
