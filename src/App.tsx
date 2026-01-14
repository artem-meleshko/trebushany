import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Index from "./pages/Index";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPageBuilder from "./pages/admin/AdminPageBuilder";
import AdminLogin from "./pages/auth/AdminLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (Ukrainian Default) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<div>About Us</div>} />

            {/* English Routes */}
            <Route path="/en" element={<Index />} />
            <Route path="/en/about" element={<div>About Us (EN)</div>} />
          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route path="/admin-portal" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="page-builder" element={<AdminPageBuilder />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
