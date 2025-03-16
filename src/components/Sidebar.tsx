
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  MessageSquare, 
  Mail, 
  Facebook, 
  Instagram, 
  Inbox,
  Users,
  Calendar,
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    { icon: Inbox, label: "Inbox", path: "/", active: location.pathname === "/" },
    { icon: Users, label: "Contatos", path: "/pacientes", active: location.pathname === "/pacientes" },
    { icon: Calendar, label: "Agenda", path: "/agendamentos", active: location.pathname === "/agendamentos" },
    { icon: Settings, label: "Configurações", path: "/configuracoes", active: location.pathname === "/configuracoes" },
  ];

  const channelItems = [
    { icon: MessageSquare, label: "WhatsApp", color: "text-channel-whatsapp", active: false },
    { icon: Instagram, label: "Instagram", color: "text-channel-instagram", active: false },
    { icon: Facebook, label: "Facebook", color: "text-channel-facebook", active: false },
    { icon: Mail, label: "Email", color: "text-channel-email", active: false },
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

        <div className={cn("space-y-3", !expanded && "opacity-0 invisible hidden")}>
          <h3 className="text-sm font-medium text-muted-foreground px-3">Canais</h3>
          <nav className="space-y-1">
            {channelItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  item.active && "font-medium",
                  item.color
                )}
              >
                <item.icon size={20} />
                <span className="transition-opacity duration-200">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto flex items-center gap-3">
        <Avatar
          src="https://i.pravatar.cc/150?img=36"
          name="Secretária"
          showStatus
          status="online"
        />
        <div className={cn("flex flex-col transition-opacity duration-200", !expanded && "opacity-0 invisible")}>
          <p className="font-medium text-sm">Amanda Costa</p>
          <p className="text-xs text-muted-foreground">Secretária</p>
        </div>
      </div>
    </aside>
  );
}

import { Avatar } from "./Avatar";
