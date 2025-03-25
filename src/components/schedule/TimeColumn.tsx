
import React from "react";

interface TimeColumnProps {
  timeSlots: string[];
}

const TimeColumn = ({ timeSlots }: TimeColumnProps) => {
  return (
    <div className="col-span-1 bg-gray-50">
      <div className="h-10 border-b border-r border-gray-200 flex items-center justify-center font-semibold text-gray-500 text-sm">
        Horário
      </div>
      {timeSlots.map((time) => (
        <div key={time} className="h-16 border-b border-r border-gray-200 px-2 py-1 flex items-center justify-center text-gray-700">
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
