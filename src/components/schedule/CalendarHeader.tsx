
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  // Format for the header title based on view
  const headerFormat = currentView === "weekly" 
    ? "'Semana de' d 'de' MMMM" 
    : "MMMM yyyy";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        {format(currentDate, headerFormat, { locale: ptBR })}
      </h3>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onTodayClick}>
          Hoje
        </Button>
        <Button variant="outline" size="sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={currentView} onValueChange={(value) => onViewChange(value as "weekly" | "monthly")}>
        <TabsList>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CalendarHeader;
