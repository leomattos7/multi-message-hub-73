import React, { useState } from "react";
import { format, addDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DailyView from "@/components/schedule/DailyView";
import WeeklyView from "@/components/schedule/WeeklyView";
import MonthlyView from "@/components/schedule/MonthlyView";

const ScheduleManagementSecretary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "monthly">("daily");

  const handlePrevious = () => {
    if (currentView === 'daily') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (currentView === 'weekly') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (currentView === 'daily') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (currentView === 'weekly') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    if (currentView === 'weekly' || currentView === 'monthly') {
      setCurrentView('daily');
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Gestão de Agenda</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Agenda do Médico</CardTitle>
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
          
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "daily" | "weekly" | "monthly")}>
            <TabsList className="mt-4">
              <TabsTrigger value="daily">Diário</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <DailyView date={currentDate} />
            </TabsContent>
            
            <TabsContent value="weekly">
              <WeeklyView 
                date={currentDate} 
                onDateSelect={handleDateSelect} 
              />
            </TabsContent>
            
            <TabsContent value="monthly">
              <MonthlyView 
                date={currentDate} 
                onDateSelect={handleDateSelect} 
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* This area could be used for additional information or controls */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagementSecretary;
