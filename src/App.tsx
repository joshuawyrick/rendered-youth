
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Store from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorUpload from "./pages/CreatorUpload";
import CreatorSubmitted from "./pages/CreatorSubmitted";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorPublicProfile from "./pages/CreatorPublicProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";
import DesignReview from "./pages/DesignReview";
import Auth from "./pages/Auth";
import AgeVerification from "./pages/AgeVerification";
import ParentVerification from "./pages/ParentVerification";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import TrainingProgram from "./pages/TrainingProgram";
import Creators from "./pages/Creators";
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
          <Route path="/store" element={<Store />} />
          <Route path="/store/:slug" element={<ProductDetail />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/upload" element={<CreatorUpload />} />
          <Route path="/creator/submitted" element={<CreatorSubmitted />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/creator/:creatorId" element={<CreatorPublicProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/review" element={<DesignReview />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/age-verification" element={<AgeVerification />} />
          <Route path="/parent-verify" element={<ParentVerification />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/training-program" element={<TrainingProgram />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
