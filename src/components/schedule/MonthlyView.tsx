
import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface MonthlyViewProps {
  date: Date;
}

const MonthlyView = ({ date }: MonthlyViewProps) => {
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

export default MonthlyView;
