
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewPatient {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  payment_form: string;
  insurance_name: string;
  date_of_birth: string;
  biological_sex: string;
  gender_identity: string;
  cpf: string;
}

interface AddPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (patientId: string) => void;
  onRefetch: () => void;
}

export const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  onRefetch
}) => {
  const [newPatient, setNewPatient] = useState<NewPatient>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    payment_form: "Particular",
    insurance_name: "",
    date_of_birth: "",
    biological_sex: "",
    gender_identity: "",
    cpf: ""
  });

  const handleAddPatient = async () => {
    if (!newPatient.full_name) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do paciente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patients")
        .insert({
          full_name: newPatient.full_name,
          email: newPatient.email || null,
          phone: newPatient.phone || null,
          address: newPatient.address || null,
          notes: newPatient.notes || null,
          payment_form: newPatient.payment_form as "Particular" | "Convênio" || "Particular",
          cpf: newPatient.cpf || null,
          date_of_birth: newPatient.date_of_birth || null,
          biological_sex: newPatient.biological_sex as "Masculino" | "Feminino" | "Intersexo" | "Não Informado" || null,
          gender_identity: newPatient.gender_identity as "Não Informado" | "Homem" | "Mulher" | "Não-Binário" | "Outro" || null
        })
        .select();

      if (error) throw error;

      toast({
        title: "Paciente adicionado",
        description: "O paciente foi adicionado com sucesso.",
      });

      setNewPatient({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        payment_form: "Particular",
        insurance_name: "",
        date_of_birth: "",
        biological_sex: "",
        gender_identity: "",
        cpf: ""
      });
      
      onOpenChange(false);
      onRefetch();
      
      if (data && data.length > 0) {
        onSuccess(data[0].id);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Erro ao adicionar paciente",
        description: "Houve um erro ao adicionar o paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha as informações do paciente para criar um novo prontuário.
          </DialogDescription>
        </DialogHeader>
      
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo*</Label>
            <Input
              id="full_name"
              value={newPatient.full_name}
              onChange={(e) => setNewPatient({...newPatient, full_name: e.target.value})}
              placeholder="Digite o nome do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={newPatient.cpf || ''}
              onChange={(e) => setNewPatient({...newPatient, cpf: e.target.value})}
              placeholder="Digite o CPF do paciente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Data de Nascimento</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={newPatient.date_of_birth}
              onChange={(e) => setNewPatient({...newPatient, date_of_birth: e.target.value})}
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
              placeholder="Digite o email do paciente"
            />
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              placeholder="Digite o telefone do paciente"
            />
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={newPatient.address}
              onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
              placeholder="Digite o endereço do paciente"
            />
          </div>
        
          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <RadioGroup 
              value={newPatient.payment_form} 
              onValueChange={(value) => setNewPatient({...newPatient, payment_form: value})}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Particular" id="particular" />
                <Label htmlFor="particular">Particular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Convênio" id="convenio" />
                <Label htmlFor="convenio">Convênio</Label>
              </div>
            </RadioGroup>
          </div>
        
          {newPatient.payment_form === "Convênio" && (
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
              placeholder="Informações adicionais sobre o paciente"
            />
          </div>
        </div>
      
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddPatient}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
