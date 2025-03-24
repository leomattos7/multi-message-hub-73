
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths, isToday, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Weekly View Component
const WeeklyView = ({ date }: { date: Date }) => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Time slots from 8:00 to 18:00 (30 min intervals)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="grid grid-cols-8 min-w-[800px]">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-12"></div> {/* Empty header cell */}
          {timeSlots.map((time) => (
            <div key={time} className="h-12 border-b border-r px-2 py-1 flex items-center">
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => (
          <div key={day.toString()} className="col-span-1">
            <div 
              className={cn(
                "h-12 border-b border-r px-2 py-1 text-center font-semibold",
                isToday(day) ? "bg-blue-100" : ""
              )}
            >
              <div>{format(day, "EEE", { locale: ptBR })}</div>
              <div>{format(day, "dd", { locale: ptBR })}</div>
            </div>
            {timeSlots.map((time) => (
              <div 
                key={`${day}-${time}`} 
                className="h-12 border-b border-r hover:bg-blue-50 cursor-pointer"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Monthly View Component
const MonthlyView = ({ date }: { date: Date }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  
  const daysArray = [];
  let day = startDate;
  
  // Generate array of dates to display in month grid
  while (day <= monthEnd || daysArray.length % 7 !== 0) {
    daysArray.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((weekday) => (
          <div key={weekday} className="text-center font-medium p-2">
            {weekday}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysArray.map((day, idx) => (
          <div
            key={idx}
            className={cn(
              "h-24 p-1 border rounded-md overflow-hidden",
              !isSameMonth(day, date) ? "bg-gray-100 text-gray-400" : "",
              isToday(day) ? "bg-blue-50 border-blue-300" : "",
              "hover:bg-blue-50 cursor-pointer"
            )}
          >
            <div className="text-right p-1">{format(day, 'd')}</div>
            {isSameMonth(day, date) && (
              <div className="text-xs mt-1">
                {/* Here you could display appointment indicators */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Schedule Page Component
const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"weekly" | "monthly">("weekly");

  const handlePrevious = () => {
    if (currentView === 'weekly') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (currentView === 'weekly') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Agenda</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Consultas Agendadas</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleTodayClick}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "weekly" | "monthly")}>
            <TabsList className="mt-4">
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly">
              <WeeklyView date={currentDate} />
            </TabsContent>
            
            <TabsContent value="monthly">
              <MonthlyView date={currentDate} />
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* Additional functionality could go here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
