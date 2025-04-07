
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckIcon, Loader2, PlusIcon, TrashIcon } from "lucide-react";

const policiesFormSchema = z.object({
  // Pagamentos
  acceptedPaymentMethods: z.array(z.string()).min(1, "Adicione pelo menos um método de pagamento"),
  
  // Planos de saúde
  acceptedInsurancePlans: z.array(z.string()),
  acceptsPrivatePatients: z.boolean().default(true),
  
  // Regras de agendamento
  cancellationPolicy: z.string().min(1, "Digite a política de cancelamento"),
  reschedulePolicy: z.string().min(1, "Digite a política de reagendamento"),
  appointmentDuration: z.string().min(1, "Digite a duração padrão das consultas"),
  
  // Sobre o médico
  doctorSpecialty: z.string().min(1, "Digite a especialidade"),
  yearsOfExperience: z.string().min(1, "Digite o tempo de experiência"),
  focusAreas: z.array(z.string()),
  professionalRegistration: z.string().min(1, "Digite o registro profissional (CRM)"),
  
  // Sobre o consultório
  officeAddress: z.string().min(1, "Digite o endereço do consultório"),
  hasParking: z.boolean().default(false),
  parkingDetails: z.string().optional(),
  hasAccessibility: z.boolean().default(false),
  accessibilityDetails: z.string().optional(),
  additionalFacilities: z.array(z.string()),
});

type PoliciesFormValues = z.infer<typeof policiesFormSchema>;

// Mock data for demonstration
const defaultValues: Partial<PoliciesFormValues> = {
  acceptedPaymentMethods: ["Dinheiro", "Cartão de crédito", "Cartão de débito", "PIX"],
  acceptedInsurancePlans: ["Unimed", "Bradesco Saúde", "Amil"],
  acceptsPrivatePatients: true,
  cancellationPolicy: "Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência para reembolso integral.",
  reschedulePolicy: "Reagendamentos são permitidos uma vez, desde que solicitados com pelo menos 12 horas de antecedência.",
  appointmentDuration: "50 minutos",
  doctorSpecialty: "Cardiologia",
  yearsOfExperience: "15 anos",
  focusAreas: ["Prevenção cardiovascular", "Hipertensão", "Arritmias"],
  professionalRegistration: "CRM 12345 SP",
  officeAddress: "Rua Exemplo, 123 - Jardim Modelo, São Paulo - SP, 01234-567",
  hasParking: true,
  parkingDetails: "Estacionamento disponível no prédio com manobrista (R$ 20 por hora)",
  hasAccessibility: true,
  accessibilityDetails: "Rampa de acesso, elevador e banheiro adaptado",
  additionalFacilities: ["Wi-Fi gratuito", "Café e água", "Ar-condicionado"]
};

export default function ClinicPolicies() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("payment");
  
  // Input array state management
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newInsurancePlan, setNewInsurancePlan] = useState("");
  const [newFocusArea, setNewFocusArea] = useState("");
  const [newFacility, setNewFacility] = useState("");
  
  const form = useForm<PoliciesFormValues>({
    resolver: zodResolver(policiesFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const { control, handleSubmit, watch, setValue, formState } = form;
  
  const watchedPaymentMethods = watch("acceptedPaymentMethods");
  const watchedInsurancePlans = watch("acceptedInsurancePlans");
  const watchedFocusAreas = watch("focusAreas");
  const watchedFacilities = watch("additionalFacilities");
  const watchedHasParking = watch("hasParking");
  const watchedHasAccessibility = watch("hasAccessibility");
  
  // Helper functions for array fields
  const addItem = (field: keyof PoliciesFormValues, newValue: string, setNewValue: React.Dispatch<React.SetStateAction<string>>) => {
    if (!newValue.trim()) return;
    
    const currentItems = watch(field) as string[];
    if (!currentItems.includes(newValue)) {
      setValue(field, [...currentItems, newValue] as any);
      setNewValue("");
    } else {
      toast({
        variant: "destructive",
        title: "Item já existe",
        description: `${newValue} já está na lista.`,
      });
    }
  };
  
  const removeItem = (field: keyof PoliciesFormValues, itemToRemove: string) => {
    const currentItems = watch(field) as string[];
    setValue(field, currentItems.filter(item => item !== itemToRemove) as any);
  };
  
  // Submit handler
  const onSubmit = async (data: PoliciesFormValues) => {
    setIsSaving(true);
    try {
      // In a real application, save data to the backend here
      console.log("Form data:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Políticas atualizadas",
        description: "As políticas do consultório foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving policies:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as políticas. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Políticas do Consultório</h1>
          <p className="text-muted-foreground">
            Configure as informações e políticas essenciais do seu consultório médico.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="payment">Pagamentos</TabsTrigger>
                <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
                <TabsTrigger value="doctor">Médico</TabsTrigger>
                <TabsTrigger value="office">Consultório</TabsTrigger>
                <TabsTrigger value="facilities">Facilidades</TabsTrigger>
              </TabsList>
              
              {/* Pagamentos Tab */}
              <TabsContent value="payment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>
                      Configure quais métodos de pagamento são aceitos no consultório.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Lista de métodos de pagamento */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {watchedPaymentMethods.map(method => (
                          <div key={method} className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                            <span className="text-sm">{method}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1 text-gray-500 hover:text-red-500"
                              onClick={() => removeItem("acceptedPaymentMethods", method)}
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Adicionar método de pagamento"
                          value={newPaymentMethod}
                          onChange={(e) => setNewPaymentMethod(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("acceptedPaymentMethods", newPaymentMethod, setNewPaymentMethod)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                    
                    {/* Planos de saúde */}
                    <div className="pt-6 border-t">
                      <FormLabel className="text-base font-semibold">Planos de Saúde</FormLabel>
                      <FormDescription className="mt-1 mb-4">
                        Configure quais planos de saúde são aceitos no consultório.
                      </FormDescription>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {watchedInsurancePlans.map(plan => (
                          <div key={plan} className="flex items-center bg-blue-100 rounded-full px-3 py-1">
                            <span className="text-sm text-blue-800">{plan}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1 text-gray-500 hover:text-red-500"
                              onClick={() => removeItem("acceptedInsurancePlans", plan)}
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Adicionar plano de saúde"
                          value={newInsurancePlan}
                          onChange={(e) => setNewInsurancePlan(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("acceptedInsurancePlans", newInsurancePlan, setNewInsurancePlan)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                      
                      <FormField
                        control={control}
                        name="acceptsPrivatePatients"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
                            <div className="space-y-0.5">
                              <FormLabel>Aceita pacientes particulares</FormLabel>
                              <FormDescription>
                                Pacientes que pagam diretamente, sem plano de saúde
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Agendamento Tab */}
              <TabsContent value="scheduling" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Regras de Agendamento</CardTitle>
                    <CardDescription>
                      Configure as políticas de agendamento, cancelamento e reagendamento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={control}
                      name="appointmentDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração padrão das consultas</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 50 minutos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="cancellationPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Política de cancelamento</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva a política de cancelamento..." 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Explique as regras para cancelamento de consultas e possíveis taxas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="reschedulePolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Política de reagendamento</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva a política de reagendamento..." 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Explique as regras para reagendamento de consultas e possíveis restrições.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Médico Tab */}
              <TabsContent value="doctor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Médico</CardTitle>
                    <CardDescription>
                      Configure informações profissionais como especialidade e áreas de atuação.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={control}
                      name="doctorSpecialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Cardiologia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="professionalRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registro profissional</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: CRM 12345 SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo de experiência</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 15 anos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <FormLabel className="block mb-2">Áreas de foco/interesse</FormLabel>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {watchedFocusAreas.map(area => (
                          <div key={area} className="flex items-center bg-green-100 rounded-full px-3 py-1">
                            <span className="text-sm text-green-800">{area}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1 text-gray-500 hover:text-red-500"
                              onClick={() => removeItem("focusAreas", area)}
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Adicionar área de foco"
                          value={newFocusArea}
                          onChange={(e) => setNewFocusArea(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("focusAreas", newFocusArea, setNewFocusArea)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Consultório Tab */}
              <TabsContent value="office" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados do Consultório</CardTitle>
                    <CardDescription>
                      Configure o endereço e informações de acesso ao consultório.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={control}
                      name="officeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço completo</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Endereço completo do consultório..." 
                              className="min-h-[60px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="hasParking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Estacionamento disponível</FormLabel>
                            <FormDescription>
                              O consultório possui estacionamento para pacientes?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {watchedHasParking && (
                      <FormField
                        control={control}
                        name="parkingDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detalhes do estacionamento</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Informações sobre o estacionamento..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Forneça informações como preço, manobrista, etc.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={control}
                      name="hasAccessibility"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Acessibilidade</FormLabel>
                            <FormDescription>
                              O consultório possui acessibilidade para pessoas com mobilidade reduzida?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {watchedHasAccessibility && (
                      <FormField
                        control={control}
                        name="accessibilityDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detalhes da acessibilidade</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Informações sobre acessibilidade..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Forneça informações como rampas, elevador, banheiro adaptado, etc.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Facilidades Tab */}
              <TabsContent value="facilities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Facilidades Adicionais</CardTitle>
                    <CardDescription>
                      Configure facilidades e comodidades adicionais do consultório.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel className="block mb-2">Facilidades disponíveis</FormLabel>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {watchedFacilities.map(facility => (
                          <div key={facility} className="flex items-center bg-purple-100 rounded-full px-3 py-1">
                            <span className="text-sm text-purple-800">{facility}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1 text-gray-500 hover:text-red-500"
                              onClick={() => removeItem("additionalFacilities", facility)}
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Adicionar facilidade"
                          value={newFacility}
                          onChange={(e) => setNewFacility(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("additionalFacilities", newFacility, setNewFacility)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                      
                      <FormDescription className="mt-2">
                        Exemplos: Wi-Fi gratuito, Café, Água, Ar-condicionado, Recepcionista
                      </FormDescription>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Button type="submit" disabled={isSaving || !formState.isValid} className="w-full md:w-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Salvar Políticas
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
