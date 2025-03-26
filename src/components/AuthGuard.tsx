
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          navigate("/login");
          return;
        }
        
        if (!session) {
          // No active session, redirect to login
          navigate("/login");
          return;
        }
        
        // Get user data from session
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "Usuário",
          email: session.user.email || "",
          role: session.user.user_metadata?.role || "doctor",
          phone: session.user.user_metadata?.phone
        };
        
        setUser(userData);
        
        // Store user in localStorage for backward compatibility
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Initialize collections if they don't exist
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
        console.error("Error checking auth:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          // User has signed out
          setUser(null);
          navigate("/login");
        } else if (session && event === 'SIGNED_IN') {
          // User has signed in
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "Usuário",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "doctor",
            phone: session.user.user_metadata?.phone
          };
          
          setUser(userData);
          
          // Store user in localStorage for backward compatibility
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    );
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return <>{children}</>;
}

export function useAuth(): { user: User | null } {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get user from localStorage (for backward compatibility)
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "Usuário",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "doctor",
            phone: session.user.user_metadata?.phone
          };
          
          setUser(userData);
        } else {
          // Fallback to localStorage
          const userStr = localStorage.getItem("user");
          if (userStr) {
            try {
              const userData = JSON.parse(userStr) as User;
              setUser(userData);
            } catch (error) {
              console.error("Error parsing user data:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error in useAuth:", error);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (session) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "Usuário",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "doctor",
            phone: session.user.user_metadata?.phone
          };
          
          setUser(userData);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { user };
}
