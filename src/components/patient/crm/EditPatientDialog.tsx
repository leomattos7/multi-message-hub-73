
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

interface EditPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingPatient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    payment_method: string;
    insurance_name: string;
    cpf: string;
    birth_date: string;
    biological_sex: string;
    gender_identity: string;
  };
  setEditingPatient: (patient: any) => void;
  onUpdate: (patient: any) => void;
  isProcessing?: boolean;
}

export const EditPatientDialog = ({
  isOpen,
  onOpenChange,
  editingPatient,
  setEditingPatient,
  onUpdate,
  isProcessing = false
}: EditPatientDialogProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editingPatient);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contato conforme necessário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome*</Label>
              <Input
                id="edit-name"
                value={editingPatient.name}
                onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                placeholder="Digite o nome do contato"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF</Label>
              <Input
                id="edit-cpf"
                value={editingPatient.cpf}
                onChange={(e) => setEditingPatient({...editingPatient, cpf: e.target.value})}
                placeholder="Digite o CPF"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-birth_date">Data de Nascimento</Label>
              <Input
                id="edit-birth_date"
                type="date"
                value={editingPatient.birth_date}
                onChange={(e) => setEditingPatient({...editingPatient, birth_date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-biological_sex">Sexo Biológico</Label>
              <Select
                value={editingPatient.biological_sex}
                onValueChange={(value) => setEditingPatient({...editingPatient, biological_sex: value})}
              >
                <SelectTrigger id="edit-biological_sex">
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
              <Label htmlFor="edit-gender_identity">Identidade de Gênero</Label>
              <Select
                value={editingPatient.gender_identity}
                onValueChange={(value) => setEditingPatient({...editingPatient, gender_identity: value})}
              >
                <SelectTrigger id="edit-gender_identity">
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
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingPatient.email}
                onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
                placeholder="Digite o email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editingPatient.phone}
                onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})}
                placeholder="Digite o telefone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={editingPatient.address}
                onChange={(e) => setEditingPatient({...editingPatient, address: e.target.value})}
                placeholder="Digite o endereço"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-payment_method">Forma de Pagamento</Label>
              <Select
                value={editingPatient.payment_method}
                onValueChange={(value) => setEditingPatient({...editingPatient, payment_method: value})}
              >
                <SelectTrigger id="edit-payment_method">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="convenio">Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editingPatient.payment_method === 'convenio' && (
              <div className="space-y-2">
                <Label htmlFor="edit-insurance_name">Nome do Convênio</Label>
                <Input
                  id="edit-insurance_name"
                  value={editingPatient.insurance_name}
                  onChange={(e) => setEditingPatient({...editingPatient, insurance_name: e.target.value})}
                  placeholder="Digite o nome do convênio"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Anotações</Label>
              <Textarea
                id="edit-notes"
                value={editingPatient.notes}
                onChange={(e) => setEditingPatient({...editingPatient, notes: e.target.value})}
                placeholder="Informações adicionais sobre o contato"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
