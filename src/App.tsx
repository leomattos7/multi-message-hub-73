
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import PatientCRM from "./pages/PatientCRM";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EmployeeManagement from "./pages/EmployeeManagement";
import ScheduleManagement from "./pages/ScheduleManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/cadastro" element={<SignUp />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/agendamentos" element={<AuthGuard><Appointments /></AuthGuard>} />
          <Route path="/secretaria" element={<AuthGuard><SecretaryDashboard /></AuthGuard>} />
          <Route path="/pacientes" element={<AuthGuard><PatientCRM /></AuthGuard>} />
          <Route path="/agenda" element={<AuthGuard requiredRole="doctor"><ScheduleManagement /></AuthGuard>} />
          
          {/* Doctor-only route */}
          <Route path="/funcionarios" element={<AuthGuard requiredRole="doctor"><EmployeeManagement /></AuthGuard>} />
          
          {/* Redirect to login if not authenticated */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
