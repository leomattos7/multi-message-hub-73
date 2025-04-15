import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LucideStethoscope, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { apiService } from "@/services/api-service";

interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Confirme sua senha" }),
  organization_name: z.string().min(2, { message: "Nome da organização deve ter pelo menos 2 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      organization_name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone || "",
            role: "admin"
          }
        }
      });
      
      if (authError) {
        console.error("Registration error:", authError);
        setError("Erro ao criar conta: " + authError.message);
        return;
      }
      
      if (!authData.user) {
        setError("Erro ao criar conta: Nenhum usuário retornado");
        return;
      }

      // Create organization in DynamoDB via API
      const organizationData = {
        id: crypto.randomUUID(),
        name: data.organization_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const organizationResponse = await apiService.post<Organization>('/organizations', organizationData, authData.user.id);
      
      if (!organizationResponse || !organizationResponse.id) {
        throw new Error("Erro ao criar organização");
      }

      // Create profile in DynamoDB via API
      const profileData = {
        id: authData.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        role: "admin",
        organization_id: organizationResponse.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const profileResponse = await apiService.post<Profile>('/profiles', profileData, authData.user.id);
      
      if (!profileResponse) {
        throw new Error("Erro ao criar perfil");
      }
      
      // Auto sign-in the user after registration
      if (authData.session) {
        // Store user in localStorage
        const userData = {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || "Usuário",
          email: authData.user.email || "",
          role: authData.user.user_metadata?.role || "admin",
          phone: authData.user.user_metadata?.phone,
          organization_id: organizationResponse.id
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Initialize collections if they don't exist
        if (!localStorage.getItem("patients")) {
          localStorage.setItem("patients", "[]");
        }
        
        if (!localStorage.getItem("appointments")) {
          localStorage.setItem("appointments", "[]");
        }
        
        if (!localStorage.getItem("conversations")) {
          localStorage.setItem("conversations", "[]");
        }
      
        toast.success("Conta criada com sucesso!");
        // Navigate directly to home page after signup
        navigate("/");
      } else {
        // If no session is returned (e.g., if email confirmation is required)
        toast.success("Conta criada com sucesso! Por favor, faça login.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError("Erro ao criar conta: " + error.message);
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
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Criar conta</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para criar sua conta
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
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="organization_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da organização</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da sua clínica/hospital" {...field} />
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
                          <Input type="email" placeholder="seu@email.com" {...field} />
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
                        <FormLabel>Telefone (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
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
