
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import { Sidebar } from "./components/Sidebar";

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
          {/* Public routes - no sidebar */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/cadastro" element={<SignUp />} />
          
          {/* Protected routes with sidebar */}
          <Route path="/" element={
            <AuthGuard>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                  <Index />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/agendamentos" element={
            <AuthGuard>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                  <Appointments />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/secretaria" element={
            <AuthGuard>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                  <SecretaryDashboard />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/pacientes" element={
            <AuthGuard>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                  <PatientCRM />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/agenda" element={
            <AuthGuard requiredRole="doctor">
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                  <ScheduleManagement />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/funcionarios" element={
            <AuthGuard requiredRole="doctor">
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                  <EmployeeManagement />
                </main>
              </div>
            </AuthGuard>
          } />
          
          {/* Redirect to login if not authenticated */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
