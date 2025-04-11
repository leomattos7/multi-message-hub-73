
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  name: string;
  phone: string;
  address: string;
  notes: string;
  payment_method: string;
  insurance_name: string;
  birth_date: string;
  biological_sex: string;
  gender_identity: string;
  cpf: string;
  has_mobility_impairment: string;
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
    name: "",
    phone: "",
    address: "",
    notes: "",
    payment_method: "particular",
    insurance_name: "",
    birth_date: "",
    biological_sex: "",
    gender_identity: "",
    cpf: "",
    has_mobility_impairment: "no"
  });

  const handleAddPatient = async () => {
    if (!newPatient.name) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do paciente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add email field for backend compatibility
      const patientWithEmail = {
        ...newPatient,
        email: null
      };

      const { data, error } = await supabase
        .from("patients")
        .insert({
          name: patientWithEmail.name,
          email: patientWithEmail.email,
          phone: patientWithEmail.phone || null,
          address: patientWithEmail.address ? JSON.stringify({ full_address: patientWithEmail.address }) : null,
          notes: patientWithEmail.notes || null,
          payment_method: patientWithEmail.payment_method || "particular",
          insurance_name: patientWithEmail.payment_method === "convenio" ? patientWithEmail.insurance_name || null : null,
          birth_date: patientWithEmail.birth_date || null,
          biological_sex: patientWithEmail.biological_sex || null,
          gender_identity: patientWithEmail.gender_identity || null,
          cpf: patientWithEmail.cpf || null,
          // has_mobility_impairment will be stored in the frontend only for now
        })
        .select();

      if (error) throw error;

      toast({
        title: "Paciente adicionado",
        description: "O paciente foi adicionado com sucesso.",
      });

      setNewPatient({
        name: "",
        phone: "",
        address: "",
        notes: "",
        payment_method: "particular",
        insurance_name: "",
        birth_date: "",
        biological_sex: "",
        gender_identity: "",
        cpf: "",
        has_mobility_impairment: "no"
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
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha as informações do paciente para criar um novo prontuário.
          </DialogDescription>
        </DialogHeader>
      
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo*</Label>
              <Input
                id="name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
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
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="intersex">Intersexo</SelectItem>
                  <SelectItem value="not_informed">Não Informado</SelectItem>
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
                  <SelectItem value="man">Homem</SelectItem>
                  <SelectItem value="woman">Mulher</SelectItem>
                  <SelectItem value="non_binary">Não-Binário</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                  <SelectItem value="not_informed">Não Informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="has_mobility_impairment">É PCD ou tem mobilidade reduzida?</Label>
              <RadioGroup 
                value={newPatient.has_mobility_impairment} 
                onValueChange={(value) => setNewPatient({...newPatient, has_mobility_impairment: value})}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="mobility-yes" />
                  <Label htmlFor="mobility-yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="mobility-no" />
                  <Label htmlFor="mobility-no">Não</Label>
                </div>
              </RadioGroup>
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
