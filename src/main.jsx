import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store/Store";
import "./index.css";
import Ring from "./components/Loader/Ring";
import AppWrapper from "./appWrapper";
//uri: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend_mumbai",


const activeAcount = JSON.parse(localStorage.getItem('wagmi.store'))?.state?.data

const activeChainID = activeAcount?.chain?.id || 80001

// console.log("activeChain", activeAcount, activeChainID, activeChainID);

const graphURL = {
  80001:  "https://api.thegraph.com/subgraphs/name/shubham-rathod1/my_unilend",
  137:"https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon"
}

const client = new ApolloClient({
  uri: graphURL[activeChainID],
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
      <Suspense fallback={<Ring />}>
        <Provider store={store}>
          <BrowserRouter>
            {/* <App /> */}
            <AppWrapper/>
          </BrowserRouter>
        </Provider>
      </Suspense>
    {/* </ApolloProvider> */}
  </React.StrictMode>
);
