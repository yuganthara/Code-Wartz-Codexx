
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Trading from "./pages/Trading";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Social from "./pages/Social";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Chatbot from "./pages/Chatbot";
import NFTPage from "./pages/NFT";
import DeFiPage from "./pages/DeFi";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/social" element={<Social />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/nft" element={<NFTPage />} />
          <Route path="/defi" element={<DeFiPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
