
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NewRecordDialogProps {
  patientName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (content: string, type: string) => void;
}

export const NewRecordDialog = ({ 
  patientName, 
  isOpen, 
  onOpenChange, 
  onSave 
}: NewRecordDialogProps) => {
  const [recordContent, setRecordContent] = useState("");
  const [recordType, setRecordType] = useState("anamnesis");

  const recordTypes = [
    { value: "anamnesis", label: "Anamnese" },
    { value: "consultation", label: "Consulta" },
    { value: "exam", label: "Exame" },
    { value: "prescription", label: "Receita" },
    { value: "evolution", label: "Evolução" },
  ];

  const handleSave = () => {
    onSave(recordContent, recordType);
    setRecordContent("");
    setRecordType("anamnesis");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Registro</DialogTitle>
          <DialogDescription>
            Adicione um novo registro ao prontuário de {patientName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recordType" className="text-sm font-medium">
              Tipo de Registro
            </Label>
            <select 
              id="recordType"
              className="w-full p-2 border rounded-md"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
            >
              {recordTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Conteúdo
            </Label>
            <Textarea
              id="content"
              className="min-h-[200px]"
              value={recordContent}
              onChange={(e) => setRecordContent(e.target.value)}
              placeholder="Digite o conteúdo do registro"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
