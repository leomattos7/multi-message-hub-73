
import React from "react";
import { User, Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BasicInfoFields } from "@/components/DoctorProfile/BasicInfoFields";
import { ConsultationDurationFields } from "@/components/DoctorProfile/ConsultationDurationFields";
import { BioField } from "@/components/DoctorProfile/BioField";
import { useProfileForm } from "@/components/DoctorProfile/useProfileForm";
import { DoctorProfile } from "@/components/DoctorProfile/types";

// Re-export the DoctorProfile type
export type { DoctorProfile };

interface ProfileEditFormProps {
  doctorId: string;
  initialProfile: DoctorProfile;
  onProfileUpdate: (profile: DoctorProfile) => void;
}

export function ProfileEditForm({ doctorId, initialProfile, onProfileUpdate }: ProfileEditFormProps) {
  const { form, isLoading, onSubmit } = useProfileForm({
    doctorId,
    initialProfile,
    onProfileUpdate,
  });

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
            <BasicInfoFields form={form} />
            <ConsultationDurationFields form={form} />
            <BioField form={form} />

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
