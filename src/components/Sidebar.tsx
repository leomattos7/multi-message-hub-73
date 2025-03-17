
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck2,
  UserRound,
  Users,
  Inbox,
  Menu,
  X,
  User,
  Briefcase,
  Calendar,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useIsMobile } from "@/hooks/use-mobile";

// Default navigation items
const sidebarItems = [
  {
    name: "Inbox",
    href: "/",
    icon: <Inbox />,
  },
  {
    name: "Agenda",
    href: "/secretaria",
    icon: <Calendar />,
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: <User />,
  },
  {
    name: "Funcionários",
    href: "/funcionarios",
    icon: <Briefcase />,
  },
  {
    name: "Minisite Pessoal",
    href: "/linktree",
    icon: <Link2 />,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Toggle the sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
          "fixed top-0 left-0 z-40 h-screen bg-white border-r shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "w-64" : "w-64",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col h-full px-3 py-6">
          <div className="flex items-center justify-start mb-8 px-2">
            <Link to="/" className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Dra. Ana Silva"
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2 text-lg font-semibold">
                Dra. Ana Silva
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <ul className="space-y-2 font-medium flex-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-2 py-3 rounded-lg hover:bg-gray-100",
                    pathname === item.href && "bg-gray-100 text-blue-600"
                  )}
                >
                  <span className="w-6 h-6">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Profile */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="px-2 py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <UserRound className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Meu Perfil</p>
                  <p className="text-xs text-gray-500">Ver detalhes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Spacer div to ensure content doesn't overlap with sidebar */}
      <div className={cn(
        "transition-all duration-300",
        isOpen ? "ml-64" : "ml-0",
        isMobile && "ml-0"
      )} />
    </>
  );
}
