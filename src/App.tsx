import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { BettingProvider } from "@/context/BettingContext";
import Dashboard from "./pages/Dashboard";
import RacesPage from "./pages/RacesPage";
import MyBetsPage from "./pages/MyBetsPage";
import OraclePage from "./pages/OraclePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <BettingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/races" element={<RacesPage />} />
              <Route path="/my-bets" element={<MyBetsPage />} />
              <Route path="/oracle" element={<OraclePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BettingProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
