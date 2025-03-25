
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  selectedDate: Date;
  onChange: (date: Date | undefined) => void;
  label: string;
}

const DatePickerField = ({ selectedDate, onChange, label }: DatePickerFieldProps) => {
  return (
    <div>
      <label htmlFor="date" className="font-medium mb-1 block">{label}:</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
            ) : (
              "Selecione uma data"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onChange(date)}
            initialFocus
            className="pointer-events-auto"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
