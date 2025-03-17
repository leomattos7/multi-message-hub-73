
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { DoctorProfile } from "./types";

interface BioFieldProps {
  form: UseFormReturn<DoctorProfile>;
}

export function BioField({ form }: BioFieldProps) {
  return (
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
  );
}
