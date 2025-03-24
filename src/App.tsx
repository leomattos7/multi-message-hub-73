
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
import PatientCRM from "./pages/PatientCRM";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EmployeeManagement from "./pages/EmployeeManagement";
import MedicalRecords from "./pages/MedicalRecords";
import MedicalRecordDetail from "./pages/MedicalRecordDetail";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import SchedulePage from "./pages/SchedulePage";

const queryClient = new QueryClient();

function App() {
  return (
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
                <div className="flex h-screen w-full overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                    <Index />
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
            
            {/* Medical Records routes with sidebar */}
            <Route path="/prontuarios" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                    <MedicalRecords />
                  </main>
                </div>
              </AuthGuard>
            } />
            
            <Route path="/prontuarios/:id" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                    <MedicalRecordDetail />
                  </main>
                </div>
              </AuthGuard>
            } />
            
            <Route path="/prontuarios/paciente/:patientId" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                    <PatientMedicalRecords />
                  </main>
                </div>
              </AuthGuard>
            } />
            
            {/* Add the new Agenda route */}
            <Route path="/agenda" element={
              <AuthGuard>
                <div className="flex h-screen w-full overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
                    <SchedulePage />
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
            
            {/* Redirect to login if not authenticated */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
