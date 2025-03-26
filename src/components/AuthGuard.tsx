
import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "doctor" | "staff";
  organization_id: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load user profile
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Error loading profile:", error);
            return;
          }
          
          if (data) {
            setProfile(data as UserProfile);
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for active session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Load user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error loading profile:", error);
          return;
        }
        
        if (data) {
          setProfile(data as UserProfile);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: "owner" | "admin" | "doctor" | "staff";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip redirection if already on login or signup page
    if (location.pathname === "/login" || location.pathname === "/cadastro") {
      return;
    }

    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    if (!isLoading && user && requiredRole && profile?.role !== requiredRole) {
      // Redirect based on profile
      if (profile?.role === "staff") {
        navigate("/secretaria");
      } else {
        navigate("/");
      }
      return;
    }
  }, [isLoading, user, profile, requiredRole, navigate, location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return <>{children}</>;
}
