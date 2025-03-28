
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  onUpdate: () => void;
}

export const EditPatientDialog = ({
  isOpen,
  onOpenChange,
  editingPatient,
  setEditingPatient,
  onUpdate
}: EditPatientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Contato</DialogTitle>
          <DialogDescription>
            Atualize os dados do contato. Os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nome completo *</Label>
            <Input
              id="edit-name"
              value={editingPatient.name}
              onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-cpf">CPF</Label>
            <Input
              id="edit-cpf"
              value={editingPatient.cpf}
              onChange={(e) => setEditingPatient({...editingPatient, cpf: e.target.value})}
              placeholder="Digite o CPF do paciente"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-birth_date">Data de Nascimento</Label>
            <Input
              id="edit-birth_date"
              type="date"
              value={editingPatient.birth_date ? editingPatient.birth_date.split('T')[0] : ''}
              onChange={(e) => setEditingPatient({...editingPatient, birth_date: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-biological_sex">Sexo Biológico</Label>
            <Select
              value={editingPatient.biological_sex || ''}
              onValueChange={(value) => setEditingPatient({...editingPatient, biological_sex: value})}
            >
              <SelectTrigger id="edit-biological_sex">
                <SelectValue placeholder="Selecione o sexo biológico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="intersex">Intersexo</SelectItem>
                <SelectItem value="not_informed">Não Informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-gender_identity">Identidade de Gênero</Label>
            <Select
              value={editingPatient.gender_identity || ''}
              onValueChange={(value) => setEditingPatient({...editingPatient, gender_identity: value})}
            >
              <SelectTrigger id="edit-gender_identity">
                <SelectValue placeholder="Selecione a identidade de gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="man">Homem</SelectItem>
                <SelectItem value="woman">Mulher</SelectItem>
                <SelectItem value="non_binary">Não-Binário</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
                <SelectItem value="not_informed">Não Informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editingPatient.email}
              onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Telefone</Label>
            <Input
              id="edit-phone"
              value={editingPatient.phone}
              onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-address">Endereço</Label>
            <Input
              id="edit-address"
              value={editingPatient.address}
              onChange={(e) => setEditingPatient({...editingPatient, address: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Forma de Pagamento</Label>
            <RadioGroup 
              value={editingPatient.payment_method} 
              onValueChange={(value) => setEditingPatient({...editingPatient, payment_method: value})}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="particular" id="edit-particular" />
                <Label htmlFor="edit-particular">Particular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="convenio" id="edit-convenio" />
                <Label htmlFor="edit-convenio">Convênio</Label>
              </div>
            </RadioGroup>
          </div>
          
          {editingPatient.payment_method === "convenio" && (
            <div className="grid gap-2">
              <Label htmlFor="edit-insurance_name">Nome do Convênio</Label>
              <Input
                id="edit-insurance_name"
                value={editingPatient.insurance_name}
                onChange={(e) => setEditingPatient({...editingPatient, insurance_name: e.target.value})}
                placeholder="Digite o nome do convênio"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Anotações</Label>
            <Textarea
              id="edit-notes"
              value={editingPatient.notes}
              onChange={(e) => setEditingPatient({...editingPatient, notes: e.target.value})}
              placeholder="Informações adicionais sobre o contato..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onUpdate}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
