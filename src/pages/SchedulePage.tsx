import React, { useState, useEffect } from "react";
import { addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// Import our components
import WeeklyView from "@/components/schedule/WeeklyView";
import MonthlyView from "@/components/schedule/MonthlyView";
import CalendarHeader from "@/components/schedule/CalendarHeader";
import { useAppointments } from "@/hooks/use-appointments";

// Main Schedule Page Component
const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"weekly" | "monthly">(
    "weekly"
  );
  const { appointments, loading, fetchAppointments } = useAppointments();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handlePrevious = () => {
    if (currentView === "weekly") {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (currentView === "weekly") {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => addMonths(prev, 1));
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (view: "weekly" | "monthly") => {
    setCurrentView(view);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Agenda</h1>

      <Card>
        <CardHeader>
          <CalendarHeader
            currentDate={currentDate}
            currentView={currentView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onTodayClick={handleTodayClick}
            onViewChange={handleViewChange}
          />

          <div className="mt-4">
            {loading ? (
              <div className="text-center py-8">Carregando agendamentos...</div>
            ) : currentView === "weekly" ? (
              <WeeklyView date={currentDate} appointments={appointments} />
            ) : (
              <MonthlyView
                date={currentDate}
                appointments={appointments}
                isLoadingAppointments={loading}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Additional functionality could go here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
