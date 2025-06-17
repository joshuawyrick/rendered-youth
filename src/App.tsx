
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Creators from "./pages/Creators";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Store from "./pages/Store";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorUpload from "./pages/CreatorUpload";
import CreatorSubmitted from "./pages/CreatorSubmitted";
import CreatorProfile from "./pages/CreatorProfile";
import Auth from "./pages/Auth";
import DesignReview from "./pages/DesignReview";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminSetup from "./pages/AdminSetup";
import AgeVerification from "./pages/AgeVerification";
import ParentVerification from "./pages/ParentVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/store" element={<Store />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/age-verification" element={<AgeVerification />} />
          <Route path="/parent-verify" element={<ParentVerification />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/upload" element={<CreatorUpload />} />
          <Route path="/creator/submitted" element={<CreatorSubmitted />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/design-review" element={<DesignReview />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
