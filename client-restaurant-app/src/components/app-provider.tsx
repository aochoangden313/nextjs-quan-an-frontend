"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
