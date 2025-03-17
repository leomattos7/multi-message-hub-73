
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, LucideStethoscope } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "E-mail inválido" }).optional().or(z.literal("")),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Confirme sua senha" }),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

// Create example data to be added when a doctor signs up
const createExampleData = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Example patient for contacts and inbox
  const examplePatient = {
    id: "example-patient-1",
    name: "Maria Oliveira (Exemplo)",
    email: "maria.exemplo@email.com",
    phone: "(11) 99999-8888",
    avatar: "https://i.pravatar.cc/150?img=5"
  };
  
  // Example appointment
  const exampleAppointment = {
    id: "example-appointment-1",
    patientId: examplePatient.id,
    patientName: examplePatient.name,
    time: "14:30",
    type: "consulta",
    status: "aguardando",
    date: tomorrow.toISOString().split('T')[0],
    notes: "Primeira consulta - PACIENTE DE EXEMPLO"
  };
  
  // Example conversation
  const exampleConversation = {
    id: "example-conversation-1",
    contact: {
      id: examplePatient.id,
      name: examplePatient.name,
      avatar: examplePatient.avatar,
    },
    channel: "whatsapp",
    unread: 1,
    lastActivity: new Date(),
    messages: [
      {
        id: "msg-1",
        content: "Olá, gostaria de confirmar minha consulta para amanhã às 14:30. (MENSAGEM DE EXEMPLO)",
        timestamp: new Date(),
        isOutgoing: false,
        status: "delivered",
      }
    ]
  };
  
  return {
    patient: examplePatient,
    appointment: exampleAppointment,
    conversation: exampleConversation
  };
};

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Create example data for the new doctor
      const exampleData = createExampleData();
      
      // Store user in localStorage
      const user = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email: data.email || "",
        role: "doctor",
        name: data.name,
        phone: data.phone || "",
        address: {
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
        },
        notes: data.notes || "",
      };
      
      localStorage.setItem("user", JSON.stringify(user));
      
      // Store example data in localStorage
      const existingPatients = JSON.parse(localStorage.getItem("patients") || "[]");
      existingPatients.push(exampleData.patient);
      localStorage.setItem("patients", JSON.stringify(existingPatients));
      
      const existingAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
      existingAppointments.push(exampleData.appointment);
      localStorage.setItem("appointments", JSON.stringify(existingAppointments));
      
      const existingConversations = JSON.parse(localStorage.getItem("conversations") || "[]");
      existingConversations.push(exampleData.conversation);
      localStorage.setItem("conversations", JSON.stringify(existingConversations));
      
      toast.success("Conta criada com sucesso! Um paciente de exemplo foi adicionado para demonstração.");
      navigate("/secretaria");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-col justify-center items-center w-full py-8">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <LucideStethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Med Attend</h1>
            <p className="text-sm text-slate-500 mt-1">
              Crie sua conta e gerencie seus pacientes
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Médico</CardTitle>
              <CardDescription>
                Crie sua conta para começar a usar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. João Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Endereço</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rua/Avenida</FormLabel>
                            <FormControl>
                              <Input placeholder="Av. Paulista, 1000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input placeholder="São Paulo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <FormControl>
                                <Input placeholder="SP" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="01311-000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anotações</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Informações adicionais..." 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t px-6 py-4">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Faça login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
