import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { store } from "../store/Store";
import "../index.css";
import Ring from "../components/Loader/Ring";

/* eslint-disable import/export */
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'




//uri: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend_mumbai",


const AllWrapers = ({children}) => {
    <React.StrictMode>
    <Suspense fallback={<Ring />}>
      <Provider store={store}>
        {/* <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            theme={myCustomTheme}
          > */}
            <BrowserRouter>
              {children}
            </BrowserRouter>
          {/* </RainbowKitProvider>
        </WagmiConfig> */}
      </Provider>
    </Suspense>
  </React.StrictMode>
} 

afterEach(() => {
    cleanup()
  })
  
  function customRender(ui, options = {}) {
    return render(ui, {
      // wrap provider(s) here if needed
      wrapper: AllWrapers,
      ...options,
    })
  }
  
  export * from '@testing-library/react'
  export { default as userEvent } from '@testing-library/user-event'
  // override render export
  export { customRender as render }
