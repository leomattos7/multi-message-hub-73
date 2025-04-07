import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./components/AuthGuard";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import { Inbox } from "./pages/Inbox";
import { Pacientes } from "./pages/Pacientes";
import { Prontuarios } from "./pages/Prontuarios";
import { Agenda } from "./pages/Agenda";
import { Funcionarios } from "./pages/Funcionarios";
import { AuthGuard } from "./components/AuthGuard";
import { ProfileManager } from "./components/DoctorProfile/ProfileManager";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import ClinicPolicies from "./pages/ClinicPolicies";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { authInitialized } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);

      // Define public routes that don't require authentication
      const publicRoutes = ["/login", "/register", "/forgot-password"];

      // If the user is not logged in and tries to access a non-public route, redirect to /login
      if (!token && !publicRoutes.includes(window.location.pathname)) {
        navigate("/login");
      }

      // If the user is logged in and tries to access /login or /register, redirect to /
      if (token && (window.location.pathname === "/login" || window.location.pathname === "/register")) {
        navigate("/");
      }
    };

    checkAuth();
  }, [authInitialized, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password/:token" element={<UpdatePassword />} />

      <Route
        path="/"
        element={
          <AuthGuard>
            <Layout>
              <Inbox />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/pacientes"
        element={
          <AuthGuard>
            <Layout>
              <Pacientes />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/paciente/:patientId"
        element={
          <AuthGuard>
            <Layout>
              <PatientMedicalRecords />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/prontuarios"
        element={
          <AuthGuard>
            <Layout>
              <Prontuarios />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/agenda"
        element={
          <AuthGuard>
            <Layout>
              <Agenda />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/funcionarios"
        element={
          <AuthGuard>
            <Layout>
              <Funcionarios />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <Layout>
              <ProfileManager />
            </Layout>
          </AuthGuard>
        }
      />
      <Route path="/politicas" element={
        <AuthGuard>
          <Layout>
            <ClinicPolicies />
          </Layout>
        </AuthGuard>
      } />
    </Routes>
  );
}
