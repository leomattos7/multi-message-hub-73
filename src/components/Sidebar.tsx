
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Inbox,
  Users,
  Calendar,
  X,
  Menu,
  UserPlus,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { toast } from "sonner";
import { useAuth } from "./AuthGuard";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso");
    navigate("/login");
  };

  // Define navigation items based on user role
  const navItems = [
    { icon: Inbox, label: "Inbox", path: "/", active: location.pathname === "/" },
    { icon: Users, label: "Contatos", path: "/pacientes", active: location.pathname === "/pacientes" },
    { icon: Calendar, label: "Agenda", path: "/secretaria", active: location.pathname === "/secretaria" },
    // Only show Employee Management for doctors
    ...(user?.role === "doctor" ? [
      { icon: UserPlus, label: "Funcionários", path: "/funcionarios", active: location.pathname === "/funcionarios" }
    ] : [])
  ];

  return (
    <aside 
      className={cn(
        "bg-white border-r border-border h-screen transition-all duration-300 ease-in-out flex flex-col flex-shrink-0",
        expanded ? "w-64" : "w-16",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className={cn("transition-opacity", !expanded && "opacity-0")}>
          <h1 className="font-semibold text-xl">Med Attend</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div className="flex flex-col gap-8 p-3 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 font-normal",
                item.active && "font-medium"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon size={20} />
                <span className={cn("transition-opacity duration-200", !expanded && "opacity-0 invisible hidden")}>
                  {item.label}
                </span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-2">
          <Avatar
            src="https://i.pravatar.cc/150?img=36"
            name={user?.name || "Usuário"}
            showStatus
            status="online"
          />
          <div className={cn("flex flex-col transition-opacity duration-200", !expanded && "opacity-0 invisible")}>
            <p className="font-medium text-sm">{user?.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{user?.role === "doctor" ? "Médico" : "Secretária"}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size={expanded ? "default" : "icon"} 
          onClick={handleLogout}
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          {expanded && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
