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

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (authError) {
        console.error("Login error:", authError);
        setError("Erro ao fazer login: " + authError.message);
        return;
      }
      
      if (!authData.user) {
        setError("Usuário não encontrado");
        return;
      }
      
      // Get the user's metadata/role from the auth data - ensure it uses the standardized roles
      let userRole = authData.user.user_metadata?.role;
      
      // Convert legacy roles if needed
      if (userRole === "doctor") userRole = "admin";
      if (userRole === "secretary") userRole = "employee";
      
      const userData = {
        id: authData.user.id,
        email: authData.user.email || "",
        role: userRole || "admin",
        name: authData.user.user_metadata?.name || "Usuário"
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Erro ao fazer login: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <LucideStethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Med Attend</h1>
            <p className="text-sm text-slate-500 mt-1">
              Faça login para acessar sua conta
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
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Entre com seu e-mail e senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t px-6 py-4">
              <p className="text-sm text-slate-600">
                Não tem uma conta?{" "}
                <Link
                  to="/cadastro"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
