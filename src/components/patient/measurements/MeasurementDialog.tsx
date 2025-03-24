
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface MeasurementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measurementName: string;
  measurementValue: string;
  measurementUnit: string;
  setMeasurementValue: (value: string) => void;
  onSave: () => void;
  isReadOnly?: boolean;
}

export const MeasurementDialog = ({
  isOpen,
  onOpenChange,
  measurementName,
  measurementValue,
  measurementUnit,
  setMeasurementValue,
  onSave,
  isReadOnly = false,
}: MeasurementDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly ? "Visualizar" : "Editar"} Medição
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Nome da Medição
            </label>
            <Input
              value={measurementName}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Valor
              </label>
              <Input
                type="number"
                value={measurementValue}
                onChange={(e) => setMeasurementValue(e.target.value)}
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Unidade
              </label>
              <Input
                value={measurementUnit}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
        {!isReadOnly && (
          <DialogFooter>
            <Button onClick={onSave}>
              Salvar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
