
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Store from "./pages/Store";
import Collection from "./pages/Collection";
import AgeVerification from "./pages/AgeVerification";
import Creators from "./pages/Creators";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import TrainingProgram from "./pages/TrainingProgram";
import AdminDashboard from "./pages/AdminDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorUpload from "./pages/CreatorUpload";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorPublicProfile from "./pages/CreatorPublicProfile";
import DesignReview from "./pages/DesignReview";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

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
          <Route path="/collections/:slug" element={<Collection />} />
          <Route path="/age-verification" element={<AgeVerification />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/training-program" element={<TrainingProgram />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/upload" element={<CreatorUpload />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/creator/:creatorId" element={<CreatorPublicProfile />} />
          <Route path="/design-review" element={<DesignReview />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sign-in" element={<Auth />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
