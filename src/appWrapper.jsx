import React from "react";
import App from "./App";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { getNetwork } from "@wagmi/core";

const graphURL = {
  80001: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/my_unilend",
  137: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon",
};

export default function AppWrapper() {
  const activeAcount = JSON.parse(localStorage.getItem("wagmi.store"))?.state
    ?.data;

  const { chain, chains } = getNetwork();
  const activeChainID = chain?.id || activeAcount?.chain?.id || 137;

  console.log(
    "activeChainID",
    activeChainID,
    chain?.id,
    activeAcount?.chain?.id
  );

  const client = new ApolloClient({
    uri: graphURL[activeChainID],
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <>
        <App />
      </>
    </ApolloProvider>
  );
}
