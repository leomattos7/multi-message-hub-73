
import React from "react";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface WeeklyViewProps {
  date: Date;
}

const WeeklyView = ({ date }: WeeklyViewProps) => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Time slots from 8:00 to 18:00 (hourly intervals)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="grid grid-cols-8 min-w-[800px]">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-12"></div> {/* Empty header cell */}
          {timeSlots.map((time) => (
            <div key={time} className="h-24 border-b border-r px-2 py-1 flex items-center">
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
                className="h-24 border-b border-r hover:bg-blue-50 cursor-pointer"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
