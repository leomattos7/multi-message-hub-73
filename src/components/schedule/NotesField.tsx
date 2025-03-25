
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  notes: string;
  setNotes: (value: string) => void;
}

const NotesField = ({ notes, setNotes }: NotesFieldProps) => {
  return (
    <div>
      <label htmlFor="notes" className="font-medium mb-1 block">Observações:</label>
      <Textarea 
        id="notes"
        value={notes} 
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Observações adicionais"
        className="resize-none min-h-[80px]"
      />
    </div>
  );
};

export default NotesField;
