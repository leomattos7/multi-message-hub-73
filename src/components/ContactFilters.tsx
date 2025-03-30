
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export interface PatientFilters {
  name: string;
  email: string;
  phone: string;
  hasAppointment: boolean | null;
  hasMessages: boolean | null;
  sortBy: "name" | "lastAppointment" | "lastMessage";
  sortOrder: "asc" | "desc";
  address: string;
  notes: string;
  biologicalSex: string;
  genderIdentity: string;
  paymentMethod: string;
  insuranceName: string;
  cpf: string;
  birthDate: string;
}

export function ContactFilters({ 
  open, 
  onOpenChange, 
  filters, 
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}: ContactFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFiltersChange({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (field: "hasAppointment" | "hasMessages", value: boolean) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSelectChange = (field: "sortBy" | "sortOrder" | "biologicalSex" | "genderIdentity" | "paymentMethod", value: string) => {
    onFiltersChange({ 
      ...filters, 
      [field]: value 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filtrar Contatos</DialogTitle>
          <DialogDescription>
            Aplique filtros para encontrar contatos específicos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Filtrar por nome" 
                value={filters.name} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                placeholder="Filtrar por email" 
                value={filters.email} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone"
                name="phone"
                placeholder="Filtrar por telefone" 
                value={filters.phone} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address"
                name="address"
                placeholder="Filtrar por endereço" 
                value={filters.address || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input 
                id="cpf"
                name="cpf"
                placeholder="Filtrar por CPF" 
                value={filters.cpf || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input 
                id="birthDate"
                name="birthDate"
                placeholder="AAAA-MM-DD" 
                value={filters.birthDate || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Anotações</Label>
              <Input 
                id="notes"
                name="notes"
                placeholder="Filtrar por anotações" 
                value={filters.notes || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biologicalSex">Sexo Biológico</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("biologicalSex", value)}
                value={filters.biologicalSex || ""}
              >
                <SelectTrigger id="biologicalSex">
                  <SelectValue placeholder="Selecione o sexo biológico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="intersex">Intersexo</SelectItem>
                  <SelectItem value="not_informed">Não Informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genderIdentity">Identidade de Gênero</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("genderIdentity", value)}
                value={filters.genderIdentity || ""}
              >
                <SelectTrigger id="genderIdentity">
                  <SelectValue placeholder="Selecione a identidade de gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="man">Homem</SelectItem>
                  <SelectItem value="woman">Mulher</SelectItem>
                  <SelectItem value="non_binary">Não-Binário</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                  <SelectItem value="not_informed">Não Informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                value={filters.paymentMethod || ""}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="convenio">Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filters.paymentMethod === "convenio" && (
              <div className="space-y-2">
                <Label htmlFor="insuranceName">Nome do Convênio</Label>
                <Input 
                  id="insuranceName"
                  name="insuranceName"
                  placeholder="Filtrar por convênio" 
                  value={filters.insuranceName || ""} 
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasAppointment" 
                checked={filters.hasAppointment === true}
                onCheckedChange={(checked) => {
                  handleCheckboxChange("hasAppointment", checked === true);
                }}
              />
              <Label htmlFor="hasAppointment">Tem consulta agendada</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasMessages" 
                checked={filters.hasMessages === true}
                onCheckedChange={(checked) => {
                  handleCheckboxChange("hasMessages", checked === true);
                }}
              />
              <Label htmlFor="hasMessages">Tem mensagens</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sortBy">Ordenar por</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("sortBy", value as "name" | "lastAppointment" | "lastMessage")}
                value={filters.sortBy}
              >
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="lastAppointment">Última Consulta</SelectItem>
                  <SelectItem value="lastMessage">Última Mensagem</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("sortOrder", value as "asc" | "desc")}
                value={filters.sortOrder}
              >
                <SelectTrigger id="sortOrder">
                  <SelectValue placeholder="Ordem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Crescente (A-Z, Antiga-Nova)</SelectItem>
                  <SelectItem value="desc">Decrescente (Z-A, Nova-Antiga)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="sm:w-full"
          >
            Redefinir Filtros
          </Button>
          <Button 
            type="button" 
            onClick={onApplyFilters}
            className="sm:w-full"
          >
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
