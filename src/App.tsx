
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Eagerly load the landing page for fast first paint
import Index from "./pages/Index";

// Lazy load all other pages
const Store = lazy(() => import("./pages/Store"));
const Collection = lazy(() => import("./pages/Collection"));
const AgeVerification = lazy(() => import("./pages/AgeVerification"));
const Creators = lazy(() => import("./pages/Creators"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const About = lazy(() => import("./pages/About"));
const TrainingProgram = lazy(() => import("./pages/TrainingProgram"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorUpload = lazy(() => import("./pages/CreatorUpload"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile"));
const CreatorPublicProfile = lazy(() => import("./pages/CreatorPublicProfile"));
const DesignReview = lazy(() => import("./pages/DesignReview"));
const Auth = lazy(() => import("./pages/Auth"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
