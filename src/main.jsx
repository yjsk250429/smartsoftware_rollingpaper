import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx'

const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            gcTime: 300_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
            <QueryClientProvider client={client}>
                  <App />
          </QueryClientProvider>
  </StrictMode>,
)
