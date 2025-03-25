
import React from "react";

interface TimezoneInfoProps {
  timezone?: string;
}

export const TimezoneInfo: React.FC<TimezoneInfoProps> = ({ 
  timezone = "(GMT-03:00) Horário Padrão de Brasília - São Paulo" 
}) => {
  return (
    <div className="text-sm text-gray-500 mt-2">
      {timezone}
    </div>
  );
};
