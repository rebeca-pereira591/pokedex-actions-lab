import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { DetailPage } from "./pages/DetailPage";
import { ListPage } from "./pages/ListPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/pokemon/:idOrName" element={<DetailPage />} />
    </Routes>
  );
}

export function Providers({ children, client }: { children: ReactNode; client?: QueryClient }) {
  // Los datos de un Pokémon no cambian mientras la app está abierta: no hace falta volver a pedirlos.
  const [queryClient] = useState(
    () => client ?? new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } } }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
}
