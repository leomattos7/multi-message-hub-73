
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Policies() {
  // Initial state for the policies
  const [policies, setPolicies] = useState({
    payment: {
      acceptedMethods: "",
      insurancePlans: "",
    },
    scheduling: {
      reschedulePolicy: "",
      cancellationPolicy: "",
    },
    doctor: {
      specialty: "",
      experience: "",
      focusAreas: "",
    },
    office: {
      address: "",
      parking: "",
      accessibility: "",
    },
  });

  // Handle input changes
  const handleChange = (section: string, field: string, value: string) => {
    setPolicies({
      ...policies,
      [section]: {
        ...policies[section as keyof typeof policies],
        [field]: value,
      },
    });
  };

  // Handle form submission
  const handleSave = () => {
    // In a real app, this would save to the database
    // For now, we'll just show a toast
    toast.success("Políticas salvas com sucesso!");
    console.log("Policies saved:", policies);
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Políticas do Consultório</h1>
      
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="payment">Métodos de Pagamento</TabsTrigger>
          <TabsTrigger value="scheduling">Regras de Agendamento</TabsTrigger>
          <TabsTrigger value="doctor">Informações do Médico</TabsTrigger>
          <TabsTrigger value="office">Dados do Consultório</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento e Planos</CardTitle>
              <CardDescription>
                Configure os métodos de pagamento aceitos e planos de saúde cobertos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="acceptedMethods">Métodos de Pagamento Aceitos</Label>
                <Textarea
                  id="acceptedMethods"
                  placeholder="Ex: Dinheiro, Cartão de Crédito, Cartão de Débito, Pix, etc."
                  value={policies.payment.acceptedMethods}
                  onChange={(e) => handleChange("payment", "acceptedMethods", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurancePlans">Planos de Saúde Aceitos</Label>
                <Textarea
                  id="insurancePlans"
                  placeholder="Liste todos os planos de saúde aceitos"
                  value={policies.payment.insurancePlans}
                  onChange={(e) => handleChange("payment", "insurancePlans", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Agendamento</CardTitle>
              <CardDescription>
                Defina políticas para reagendamento e cancelamento de consultas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reschedulePolicy">Política de Reagendamento</Label>
                <Textarea
                  id="reschedulePolicy"
                  placeholder="Ex: O reagendamento deve ser feito com pelo menos 24 horas de antecedência..."
                  value={policies.scheduling.reschedulePolicy}
                  onChange={(e) => handleChange("scheduling", "reschedulePolicy", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Política de Cancelamento</Label>
                <Textarea
                  id="cancellationPolicy"
                  placeholder="Ex: Cancelamentos com menos de 24 horas de antecedência estão sujeitos a cobrança..."
                  value={policies.scheduling.cancellationPolicy}
                  onChange={(e) => handleChange("scheduling", "cancellationPolicy", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="doctor">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Médico</CardTitle>
              <CardDescription>
                Detalhes sobre especialidade e experiência do médico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  placeholder="Ex: Cardiologia, Dermatologia, etc."
                  value={policies.doctor.specialty}
                  onChange={(e) => handleChange("doctor", "specialty", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Tempo de Atuação</Label>
                <Input
                  id="experience"
                  placeholder="Ex: 15 anos de experiência"
                  value={policies.doctor.experience}
                  onChange={(e) => handleChange("doctor", "experience", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="focusAreas">Áreas de Foco</Label>
                <Textarea
                  id="focusAreas"
                  placeholder="Ex: Tratamento de hipertensão, diabetes, etc."
                  value={policies.doctor.focusAreas}
                  onChange={(e) => handleChange("doctor", "focusAreas", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="office">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Consultório</CardTitle>
              <CardDescription>
                Informações sobre a localização e facilidades do consultório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Textarea
                  id="address"
                  placeholder="Endereço completo do consultório"
                  value={policies.office.address}
                  onChange={(e) => handleChange("office", "address", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parking">Estacionamento</Label>
                <Input
                  id="parking"
                  placeholder="Ex: Estacionamento próprio, convênio com estacionamento próximo, etc."
                  value={policies.office.parking}
                  onChange={(e) => handleChange("office", "parking", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessibility">Acessibilidade</Label>
                <Textarea
                  id="accessibility"
                  placeholder="Detalhes sobre acessibilidade para pessoas com mobilidade reduzida"
                  value={policies.office.accessibility}
                  onChange={(e) => handleChange("office", "accessibility", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>Salvar Políticas</Button>
      </div>
    </div>
  );
}
