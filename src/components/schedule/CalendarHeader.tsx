
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Settings
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ScheduleSettings from "./ScheduleSettings";

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: "weekly" | "monthly";
  onPrevious: () => void;
  onNext: () => void;
  onTodayClick: () => void;
  onViewChange: (view: "weekly" | "monthly") => void;
}

const CalendarHeader = ({
  currentDate,
  currentView,
  onPrevious,
  onNext,
  onTodayClick,
  onViewChange,
}: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <h2 className="text-2xl font-bold">
          {currentView === "weekly"
            ? `Semana de ${format(currentDate, "dd 'de' MMMM", { locale: ptBR })}`
            : format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onPrevious}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onTodayClick}
            variant="outline"
            size="sm"
            className="h-8"
          >
            Hoje
          </Button>
          
          <Button
            onClick={onNext}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Tabs 
          value={currentView} 
          onValueChange={(v) => onViewChange(v as "weekly" | "monthly")}
          className="bg-gray-100 rounded-lg p-1"
        >
          <TabsList className="grid grid-cols-2 gap-1">
            <TabsTrigger value="weekly" className="text-sm">Semanal</TabsTrigger>
            <TabsTrigger value="monthly" className="text-sm">Mensal</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Configurar Agenda</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Configurações da Agenda</SheetTitle>
            </SheetHeader>
            <ScheduleSettings />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CalendarHeader;
