
import React from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types/patient";

interface EditPatientDialogProps {
  patientData: Patient | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdate: (patient: Patient) => void;
  onPatientChange: (patient: Patient | null) => void;
}

export const EditPatientDialog = ({
  patientData,
  isOpen,
  onOpenChange,
  onUpdate,
  onPatientChange,
}: EditPatientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Dados do Paciente</DialogTitle>
          <DialogDescription>
            Atualize as informações do paciente conforme necessário.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo*</Label>
            <Input
              id="full_name"
              value={patientData?.full_name || patientData?.name || ''}
              onChange={(e) => onPatientChange(patientData ? {...patientData, full_name: e.target.value} : null)}
              placeholder="Digite o nome do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={patientData?.cpf || ''}
              onChange={(e) => onPatientChange(patientData ? {...patientData, cpf: e.target.value} : null)}
              placeholder="Digite o CPF do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Data de Nascimento</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={patientData?.date_of_birth ? patientData.date_of_birth.split('T')[0] : (patientData?.birth_date ? patientData.birth_date.split('T')[0] : '')}
              onChange={(e) => onPatientChange(patientData ? {...patientData, date_of_birth: e.target.value} : null)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="biological_sex">Sexo Biológico</Label>
            <Select
              value={patientData?.biological_sex || ''}
              onValueChange={(value) => onPatientChange(patientData ? {...patientData, biological_sex: value as "Masculino" | "Feminino" | "Intersexo" | "Não Informado"} : null)}
            >
              <SelectTrigger id="biological_sex">
                <SelectValue placeholder="Selecione o sexo biológico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Intersexo">Intersexo</SelectItem>
                <SelectItem value="Não Informado">Não Informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender_identity">Identidade de Gênero</Label>
            <Select
              value={patientData?.gender_identity || ''}
              onValueChange={(value) => onPatientChange(patientData ? {...patientData, gender_identity: value as "Não Informado" | "Homem" | "Mulher" | "Não-Binário" | "Outro"} : null)}
            >
              <SelectTrigger id="gender_identity">
                <SelectValue placeholder="Selecione a identidade de gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Homem">Homem</SelectItem>
                <SelectItem value="Mulher">Mulher</SelectItem>
                <SelectItem value="Não-Binário">Não-Binário</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
                <SelectItem value="Não Informado">Não Informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={patientData?.email || ''}
              onChange={(e) => onPatientChange(patientData ? {...patientData, email: e.target.value} : null)}
              placeholder="Digite o email do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={patientData?.phone || ''}
              onChange={(e) => onPatientChange(patientData ? {...patientData, phone: e.target.value} : null)}
              placeholder="Digite o telefone do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={patientData?.address || ''}
              onChange={(e) => onPatientChange(patientData ? {...patientData, address: e.target.value} : null)}
              placeholder="Digite o endereço do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              value={patientData?.notes || ''}
              onChange={(e) => onPatientChange(patientData ? {...patientData, notes: e.target.value} : null)}
              placeholder="Informações adicionais sobre o paciente"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => patientData && onUpdate(patientData)}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
