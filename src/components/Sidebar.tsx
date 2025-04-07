
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Inbox,
  Menu,
  X,
  User,
  Briefcase,
  ClipboardList,
  Calendar,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

// Default navigation items
const sidebarItems = [
  {
    name: "Inbox",
    href: "/",
    icon: <Inbox />,
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: <User />,
  },
  {
    name: "Prontuários",
    href: "/prontuarios",
    icon: <ClipboardList />,
  },
  {
    name: "Agenda",
    href: "/agenda",
    icon: <Calendar />,
  },
  {
    name: "Funcionários",
    href: "/funcionarios",
    icon: <Briefcase />,
  },
  {
    name: "Políticas",
    href: "/politicas",
    icon: <FileText />,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Load user data from localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserData(user);
    }
    
    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUserData(null);
        } else if (session) {
          const userData = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "Usuário",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "admin",
          };
          setUserData(userData);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Toggle the sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Toggle collapse sidebar
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Erro ao sair: " + error.message);
        return;
      }
      
      // Remove user data from localStorage
      localStorage.removeItem("user");
      
      // Show success message
      toast.success("Você saiu com sucesso");
      
      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Erro ao sair: " + error.message);
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r shadow-sm transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full px-3 py-6 relative">
          {/* Collapse/Expand button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <div className={cn(
            "flex items-center mb-8 px-2",
            isCollapsed ? "justify-center" : "justify-start"
          )}>
            <Link to="/" className={cn(
              "flex items-center",
              isCollapsed && "flex-col"
            )}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {userData?.name?.charAt(0) || "U"}
              </div>
              {!isCollapsed && (
                <span className="ml-2 text-lg font-semibold">
                  {userData?.name || "Médico"}
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <ul className="space-y-2 font-medium flex-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-lg hover:bg-gray-100",
                    pathname === item.href && "bg-gray-100 text-blue-600",
                    isCollapsed ? "justify-center px-2 py-3" : "px-2 py-3"
                  )}
                >
                  <span className="w-6 h-6">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
                isCollapsed ? "justify-center px-2 py-3" : "justify-start px-2 py-3"
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Spacer div to ensure content doesn't overlap with sidebar */}
      <div className={cn(
        "transition-all duration-300",
        isOpen && !isCollapsed ? "ml-64" : (isOpen && isCollapsed ? "ml-20" : "ml-0"),
        isMobile && "ml-0"
      )} />
    </>
  );
}
