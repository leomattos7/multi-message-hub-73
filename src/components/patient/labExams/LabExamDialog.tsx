
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { LabExam } from "@/types/labExam";

interface LabExamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exam?: LabExam;
  title?: string;
  onSave: (examData: Omit<LabExam, "id" | "created_at" | "patient_id">) => void;
}

export const LabExamDialog = ({
  isOpen,
  onOpenChange,
  exam,
  title = "Adicionar novo exame",
  onSave,
}: LabExamDialogProps) => {
  const [examName, setExamName] = useState("");
  const [examResult, setExamResult] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      if (exam) {
        // Fill form with exam data for editing
        setExamName(exam.name || "");
        setExamResult(exam.result || "");
        setReferenceRange(exam.reference_range || "");
        setIsAbnormal(exam.is_abnormal || false);
        setExamDate(exam.exam_date || new Date().toISOString().split('T')[0]);
      } else {
        // Reset form for new exam
        setExamName("");
        setExamResult("");
        setReferenceRange("");
        setIsAbnormal(false);
        setExamDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, exam]);

  const handleSubmit = () => {
    if (!examName.trim() || !examResult.trim() || !examDate) return;

    onSave({
      name: examName.trim(),
      result: examResult.trim(),
      reference_range: referenceRange.trim() || undefined,
      is_abnormal: isAbnormal,
      exam_date: examDate,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do exame laboratorial.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            placeholder="Nome do exame"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="Resultado"
                value={examResult}
                onChange={(e) => setExamResult(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Valor de referência (opcional)"
                value={referenceRange}
                onChange={(e) => setReferenceRange(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="is-abnormal" 
              checked={isAbnormal} 
              onCheckedChange={setIsAbnormal} 
            />
            <Label htmlFor="is-abnormal">Resultado fora do valor de referência</Label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!examName.trim() || !examResult.trim() || !examDate}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
