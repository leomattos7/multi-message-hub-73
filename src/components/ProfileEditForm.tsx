
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Save, Clock } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Doctor profile schema
const doctorProfileSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  specialty: z.string().min(2, { message: "Especialidade é obrigatória" }),
  bio: z.string().min(10, { message: "Biografia deve ter pelo menos 10 caracteres" }),
  photo: z.string().optional(),
  address: z.string().min(5, { message: "Endereço é obrigatório" }),
  phone: z.string().min(8, { message: "Telefone é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  consultationDuration: z.string().min(1, { message: "Duração da consulta é obrigatória" }),
});

export type DoctorProfile = z.infer<typeof doctorProfileSchema>;

interface ProfileEditFormProps {
  doctorId: string;
  initialProfile: DoctorProfile;
  onProfileUpdate: (profile: DoctorProfile) => void;
}

export function ProfileEditForm({ doctorId, initialProfile, onProfileUpdate }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Set default consultation duration if it doesn't exist
  const defaultValues = {
    ...initialProfile,
    consultationDuration: initialProfile.consultationDuration || "30"
  };

  const form = useForm<DoctorProfile>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: DoctorProfile) => {
    setIsLoading(true);
    try {
      // In a real app, we would save to the doctor_profiles table in Supabase
      // For now, we'll save to localStorage as a demonstration
      localStorage.setItem('doctorProfile', JSON.stringify(data));
      
      // Call the callback function to update the parent component's state
      onProfileUpdate(data);
      
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Dados do Médico
        </CardTitle>
        <CardDescription>
          Atualize suas informações profissionais que serão exibidas aos pacientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Nome Sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Clínico Geral" {...field} />
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
                      <Input placeholder="seu.email@exemplo.com" {...field} />
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
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do consultório</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Principal, 123, Cidade - UF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Duração das consultas (minutos)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="20">20 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da foto (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/sua-foto.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia / Apresentação profissional</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva sua formação, experiência e abordagem profissional"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" /> 
              {isLoading ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
