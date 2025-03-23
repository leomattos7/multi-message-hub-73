
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface LabExamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (examData: {
    name: string;
    result: string;
    reference_range?: string;
    is_abnormal: boolean;
    exam_date: string;
  }) => void;
}

export const LabExamDialog = ({
  isOpen,
  onOpenChange,
  onAdd,
}: LabExamDialogProps) => {
  const [examName, setExamName] = useState("");
  const [examResult, setExamResult] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!examName.trim() || !examResult.trim() || !examDate) return;

    onAdd({
      name: examName.trim(),
      result: examResult.trim(),
      reference_range: referenceRange.trim() || undefined,
      is_abnormal: isAbnormal,
      exam_date: examDate,
    });

    // Reset form
    setExamName("");
    setExamResult("");
    setReferenceRange("");
    setIsAbnormal(false);
    setExamDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo exame</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            placeholder="Nome do exame"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
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
          <Button onClick={handleSubmit}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
