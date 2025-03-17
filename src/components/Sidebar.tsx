
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck2,
  UserRound,
  MessageSquare,
  Users,
  Home,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useIsMobile } from "@/hooks/use-mobile";

// Default navigation items
const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home />,
  },
  {
    name: "Secretária",
    href: "/secretaria",
    icon: <CalendarCheck2 />,
  },
  {
    name: "Agendar Consulta",
    href: "/agendamentos",
    icon: <UserRound />,
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: <Users />,
  },
  {
    name: "Gerenciar Agenda",
    href: "/agenda",
    icon: <Calendar />,
  },
  {
    name: "Funcionários",
    href: "/funcionarios",
    icon: <Users />,
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
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "w-64" : "w-20 lg:w-64"
        )}
      >
        <div className="flex flex-col h-full px-3 py-6">
          <div
            className={cn(
              "flex items-center justify-center mb-8 px-2",
              !isMobile && "lg:justify-start"
            )}
          >
            <Link to="/" className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Dra. Ana Silva"
                className="w-10 h-10 rounded-full"
              />
              <span
                className={cn(
                  "ml-2 text-lg font-semibold",
                  !isMobile && !isOpen && "hidden lg:block"
                )}
              >
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
                    pathname === item.href && "bg-gray-100 text-blue-600",
                    !isMobile && !isOpen && "justify-center lg:justify-start"
                  )}
                >
                  <span className="w-6 h-6">{item.icon}</span>
                  <span
                    className={cn(
                      "ml-3",
                      !isMobile && !isOpen && "hidden lg:block"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Profile */}
          <div
            className={cn(
              "pt-4 mt-4 border-t border-gray-200",
              !isMobile && !isOpen && "text-center lg:text-left"
            )}
          >
            <div
              className={cn(
                "px-2 py-3",
                !isMobile && !isOpen && "flex justify-center lg:block"
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500",
                    !isMobile && !isOpen && "mx-auto lg:mx-0"
                  )}
                >
                  <UserRound className="w-4 h-4" />
                </div>
                <div
                  className={cn(
                    "ml-3",
                    !isMobile && !isOpen && "hidden lg:block"
                  )}
                >
                  <p className="text-sm font-medium">Meu Perfil</p>
                  <p className="text-xs text-gray-500">Ver detalhes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* This div adds the necessary space to prevent content overlap */}
      <div 
        className={cn(
          "transition-all duration-300",
          isOpen ? (isMobile ? "ml-0" : "ml-20 lg:ml-64") : "ml-0"
        )}
      />
    </>
  );
}
