
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "secretary";
  phone?: string;
}

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: "doctor" | "secretary" | undefined;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr) as User;
      setUser(userData);
      
      // If this is the first login, initialize collections if they don't exist
      if (!localStorage.getItem("patients")) {
        localStorage.setItem("patients", "[]");
      }
      
      if (!localStorage.getItem("appointments")) {
        localStorage.setItem("appointments", "[]");
      }
      
      if (!localStorage.getItem("conversations")) {
        localStorage.setItem("conversations", "[]");
      }
      
      // If a specific role is required and the user doesn't have it, redirect
      if (requiredRole && userData.role !== requiredRole) {
        navigate("/secretaria");
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate, requiredRole]);

  return <>{children}</>;
}

export function useAuth(): { user: User | null } {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr) as User;
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  return { user };
}
