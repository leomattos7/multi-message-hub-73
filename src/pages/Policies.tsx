
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Clock, Video, DollarSign, Info } from "lucide-react";

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
    consultationTypes: [
      {
        id: "1",
        name: "Consulta Inicial",
        duration: 60,
        inPerson: true,
        telehealth: false,
        price: 300,
        notes: "Avaliação completa para novos pacientes."
      },
      {
        id: "2",
        name: "Retorno",
        duration: 30,
        inPerson: true,
        telehealth: true,
        price: 150,
        notes: "Gratuito em caso de retorno em 30 dias."
      }
    ]
  });

  // State for new consultation type
  const [newConsultationType, setNewConsultationType] = useState({
    name: "",
    duration: 30,
    inPerson: true,
    telehealth: false,
    price: 0,
    notes: ""
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

  // Handle new consultation type input changes
  const handleConsultationTypeChange = (field: string, value: any) => {
    setNewConsultationType({
      ...newConsultationType,
      [field]: value,
    });
  };

  // Add new consultation type
  const handleAddConsultationType = () => {
    if (!newConsultationType.name) {
      toast.error("O nome do tipo de consulta é obrigatório");
      return;
    }

    const newType = {
      ...newConsultationType,
      id: Date.now().toString(), // Generate a simple ID
    };

    setPolicies({
      ...policies,
      consultationTypes: [...policies.consultationTypes, newType]
    });

    // Reset form
    setNewConsultationType({
      name: "",
      duration: 30,
      inPerson: true,
      telehealth: false,
      price: 0,
      notes: ""
    });

    toast.success("Tipo de consulta adicionado com sucesso!");
  };

  // Remove consultation type
  const handleRemoveConsultationType = (id: string) => {
    setPolicies({
      ...policies,
      consultationTypes: policies.consultationTypes.filter(type => type.id !== id)
    });
    
    toast.success("Tipo de consulta removido com sucesso!");
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
          <TabsTrigger value="consultationType">Tipos de Consulta</TabsTrigger>
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

        <TabsContent value="consultationType">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Consulta</CardTitle>
              <CardDescription>
                Configure os tipos de consulta disponíveis, duração, modalidade e preço
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Lista de tipos de consulta já configurados */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Tipos de Consulta Configurados</h3>
                {policies.consultationTypes.length === 0 ? (
                  <p className="text-gray-500 italic">Nenhum tipo de consulta configurado.</p>
                ) : (
                  <div className="space-y-4">
                    {policies.consultationTypes.map((type) => (
                      <div key={type.id} className="border rounded-lg p-4 relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveConsultationType(type.id)}
                        >
                          Remover
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="font-medium text-lg">{type.name}</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-gray-600 text-sm">{type.duration} minutos</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-gray-600 text-sm">
                                R$ {type.price.toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {type.inPerson && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Presencial
                                </span>
                              )}
                              {type.telehealth && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Teleatendimento
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {type.notes && (
                          <div className="mt-2 bg-gray-50 p-2 rounded-md">
                            <div className="flex items-start">
                              <Info className="h-4 w-4 mr-1 text-gray-500 mt-0.5" />
                              <p className="text-sm text-gray-600">{type.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Formulário para adicionar novo tipo de consulta */}
              <div>
                <h3 className="text-lg font-medium mb-4">Adicionar Novo Tipo de Consulta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="consultationName">Nome do Tipo de Consulta</Label>
                    <Input
                      id="consultationName"
                      placeholder="Ex: Consulta Inicial, Retorno, etc."
                      value={newConsultationType.name}
                      onChange={(e) => handleConsultationTypeChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="consultationDuration">Duração (minutos)</Label>
                    <Input
                      id="consultationDuration"
                      type="number"
                      placeholder="60"
                      min="10"
                      step="5"
                      value={newConsultationType.duration}
                      onChange={(e) => handleConsultationTypeChange("duration", parseInt(e.target.value) || 30)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="consultationPrice">Preço (R$)</Label>
                    <Input
                      id="consultationPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newConsultationType.price}
                      onChange={(e) => handleConsultationTypeChange("price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="block mb-2">Modalidade</Label>
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inPerson"
                          checked={newConsultationType.inPerson}
                          onCheckedChange={(checked) => handleConsultationTypeChange("inPerson", checked)}
                        />
                        <Label htmlFor="inPerson" className="cursor-pointer">Presencial</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="telehealth"
                          checked={newConsultationType.telehealth}
                          onCheckedChange={(checked) => handleConsultationTypeChange("telehealth", checked)}
                        />
                        <Label htmlFor="telehealth" className="cursor-pointer">Teleatendimento</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="consultationNotes">Observações</Label>
                    <Textarea
                      id="consultationNotes"
                      placeholder="Ex: Consulta gratuita em caso de retorno em 30 dias..."
                      value={newConsultationType.notes}
                      onChange={(e) => handleConsultationTypeChange("notes", e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Button 
                      type="button"
                      onClick={handleAddConsultationType}
                      className="mt-2"
                    >
                      Adicionar Tipo de Consulta
                    </Button>
                  </div>
                </div>
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
