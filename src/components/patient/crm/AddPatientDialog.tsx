
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (patient: any) => void;
}

export const AddPatientDialog = ({
  isOpen,
  onOpenChange,
  onAdd
}: AddPatientDialogProps) => {
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    payment_method: "particular",
    insurance_name: "",
    cpf: "",
    birth_date: ""
  });

  const handleSubmit = () => {
    onAdd(newPatient);
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      payment_method: "particular",
      insurance_name: "",
      cpf: "",
      birth_date: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Contato</DialogTitle>
          <DialogDescription>
            Preencha os dados básicos do contato. Os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input
              id="name"
              value={newPatient.name}
              onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={newPatient.cpf}
              onChange={(e) => setNewPatient({...newPatient, cpf: e.target.value})}
              placeholder="Digite o CPF do paciente"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <Input
              id="birth_date"
              type="date"
              value={newPatient.birth_date}
              onChange={(e) => setNewPatient({...newPatient, birth_date: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={newPatient.address}
              onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Forma de Pagamento</Label>
            <RadioGroup 
              value={newPatient.payment_method} 
              onValueChange={(value) => setNewPatient({...newPatient, payment_method: value})}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="particular" id="particular" />
                <Label htmlFor="particular">Particular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="convenio" id="convenio" />
                <Label htmlFor="convenio">Convênio</Label>
              </div>
            </RadioGroup>
          </div>
          
          {newPatient.payment_method === "convenio" && (
            <div className="grid gap-2">
              <Label htmlFor="insurance_name">Nome do Convênio</Label>
              <Input
                id="insurance_name"
                value={newPatient.insurance_name}
                onChange={(e) => setNewPatient({...newPatient, insurance_name: e.target.value})}
                placeholder="Digite o nome do convênio"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              value={newPatient.notes}
              onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
              placeholder="Informações adicionais sobre o contato..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
