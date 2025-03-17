
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { DoctorProfile } from "./types";

// Doctor profile schema
const doctorProfileSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  specialty: z.string().min(2, { message: "Especialidade é obrigatória" }),
  bio: z.string().min(10, { message: "Biografia deve ter pelo menos 10 caracteres" }),
  profile_image_url: z.string().optional(),
  address: z.string().min(5, { message: "Endereço é obrigatório" }),
  phone: z.string().min(8, { message: "Telefone é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  consultationDuration: z.string().min(1, { message: "Duração da consulta é obrigatória" }),
  followUpDuration: z.string().min(1, { message: "Duração da consulta de retorno é obrigatória" }),
  urgentDuration: z.string().min(1, { message: "Duração da consulta de encaixe é obrigatória" }),
});

export type ProfileFormData = z.infer<typeof doctorProfileSchema>;

interface UseProfileFormProps {
  doctorId: string;
  initialProfile: DoctorProfile;
  onProfileUpdate: (profile: DoctorProfile) => void;
}

export function useProfileForm({ doctorId, initialProfile, onProfileUpdate }: UseProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Set default consultation durations if they don't exist
  const defaultValues = {
    ...initialProfile,
    consultationDuration: initialProfile.consultationDuration || "30",
    followUpDuration: initialProfile.followUpDuration || "20",
    urgentDuration: initialProfile.urgentDuration || "15"
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

  return {
    form,
    isLoading,
    onSubmit,
  };
}
