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
import ScheduleManagementSecretary from "./pages/ScheduleManagementSecretary";
import DoctorLinkTree from "./pages/DoctorLinkTree";
import PublicDoctorProfile from "./pages/PublicDoctorProfile";

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
          <Route path="/d/:slug" element={<PublicDoctorProfile />} />
          
          {/* Protected routes with sidebar */}
          <Route path="/" element={
            <AuthGuard>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <Index />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/agendamentos" element={
            <AuthGuard>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <Appointments />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/secretaria" element={
            <AuthGuard>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <SecretaryDashboard />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/pacientes" element={
            <AuthGuard>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <PatientCRM />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/gestao-agenda" element={
            <AuthGuard>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <ScheduleManagementSecretary />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/agenda" element={
            <AuthGuard requiredRole="doctor">
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                  <ScheduleManagement />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/funcionarios" element={
            <AuthGuard requiredRole="doctor">
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto p-6">
                  <EmployeeManagement />
                </main>
              </div>
            </AuthGuard>
          } />
          
          <Route path="/linktree" element={
            <AuthGuard>
              <div className="flex h-screen w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto p-6">
                  <DoctorLinkTree />
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
