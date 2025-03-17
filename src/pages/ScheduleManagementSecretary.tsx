
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths, isToday, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Appointment Dialog Component
const AppointmentDialog = ({ date, time, onClose }: { date: Date, time: string, onClose: () => void }) => {
  const [patientName, setPatientName] = useState("");
  
  const handleSubmit = () => {
    if (!patientName.trim()) {
      toast.error("Por favor, informe o nome do paciente");
      return;
    }
    
    toast.success(`Consulta agendada para ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${time}`);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Agendar Consulta</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <p className="font-medium mb-1">Data:</p>
          <p>{format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Horário:</p>
          <p>{time}</p>
        </div>
        <div>
          <label htmlFor="patientName" className="font-medium mb-1 block">Nome do Paciente:</label>
          <input 
            id="patientName"
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Digite o nome do paciente"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Salvar</Button>
      </div>
    </>
  );
};

// Helper function to generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

// Daily View Component
const DailyView = ({ date }: { date: Date }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const timeSlots = generateTimeSlots();

  const handleSlotClick = (time: string) => {
    setSelectedSlot(time);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </h3>
      </div>
      <div className="bg-white rounded-lg shadow">
        {timeSlots.map((time) => (
          <div 
            key={time} 
            className="border-b p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
            onClick={() => handleSlotClick(time)}
          >
            <span>{time}</span>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4 mr-1" />
              Agendar
            </Button>
          </div>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedSlot && (
            <AppointmentDialog 
              date={date} 
              time={selectedSlot} 
              onClose={handleCloseDialog} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Weekly View Component
const WeeklyView = ({ date, onDateSelect }: { date: Date, onDateSelect: (date: Date) => void }) => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const timeSlots = generateTimeSlots();

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
                onClick={() => onDateSelect(day)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Monthly View Component
const MonthlyView = ({ date, onDateSelect }: { date: Date, onDateSelect: (date: Date) => void }) => {
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
            onClick={() => onDateSelect(day)}
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

// Main Component
const ScheduleManagementSecretary = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

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
    setSelectedDate(date);
    if (currentView === 'weekly' || currentView === 'monthly') {
      setCurrentDate(date);
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
          {selectedDate && isAppointmentDialogOpen && (
            <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agendar Consulta</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <p className="font-medium mb-1">Data:</p>
                    <p>{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  </div>
                  {/* Additional form fields would go here */}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAppointmentDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={() => {
                    toast.success("Consulta agendada com sucesso!");
                    setIsAppointmentDialogOpen(false);
                  }}>Salvar</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagementSecretary;
