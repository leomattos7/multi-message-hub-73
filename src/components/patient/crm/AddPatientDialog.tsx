
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAdd: (patient: any) => void;
  isProcessing?: boolean;
}

export const AddPatientDialog = ({
  isOpen,
  onOpenChange,
  onAdd,
  isProcessing = false
}: AddPatientDialogProps) => {
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    payment_method: 'particular',
    insurance_name: '',
    cpf: '',
    birth_date: '',
    biological_sex: 'Não Informado',
    gender_identity: 'Não Informado'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newPatient);
  };

  const resetForm = () => {
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      payment_method: 'particular',
      insurance_name: '',
      cpf: '',
      birth_date: '',
      biological_sex: 'Não Informado',
      gender_identity: 'Não Informado'
    });
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contato</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo contato.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome*</Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                placeholder="Digite o nome do contato"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={newPatient.cpf}
                onChange={(e) => setNewPatient({...newPatient, cpf: e.target.value})}
                placeholder="Digite o CPF"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                value={newPatient.birth_date}
                onChange={(e) => setNewPatient({...newPatient, birth_date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="biological_sex">Sexo Biológico</Label>
              <Select
                value={newPatient.biological_sex}
                onValueChange={(value) => setNewPatient({...newPatient, biological_sex: value})}
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
                value={newPatient.gender_identity}
                onValueChange={(value) => setNewPatient({...newPatient, gender_identity: value})}
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
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                placeholder="Digite o email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                placeholder="Digite o telefone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                placeholder="Digite o endereço"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_method">Forma de Pagamento</Label>
              <Select
                value={newPatient.payment_method}
                onValueChange={(value) => setNewPatient({...newPatient, payment_method: value})}
              >
                <SelectTrigger id="payment_method">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="convenio">Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newPatient.payment_method === 'convenio' && (
              <div className="space-y-2">
                <Label htmlFor="insurance_name">Nome do Convênio</Label>
                <Input
                  id="insurance_name"
                  value={newPatient.insurance_name}
                  onChange={(e) => setNewPatient({...newPatient, insurance_name: e.target.value})}
                  placeholder="Digite o nome do convênio"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Anotações</Label>
              <Textarea
                id="notes"
                value={newPatient.notes}
                onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                placeholder="Informações adicionais sobre o contato"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
