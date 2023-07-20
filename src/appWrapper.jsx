import React from "react";
import App from "./App";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const graphURL = {
  80001: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/my_unilend",
  137: "https://api.thegraph.com/subgraphs/name/shubham-rathod1/unilend-polygon",
};

export default function AppWrapper() {
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
