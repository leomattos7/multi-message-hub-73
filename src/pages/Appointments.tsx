
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, startOfDay, isBefore } from "date-fns";
import { Calendar as CalendarIcon, Clock, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Available times for appointments
const AVAILABLE_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

// Types of appointments
const APPOINTMENT_TYPES = [
  { id: "routine", name: "Consulta de Rotina" },
  { id: "followup", name: "Retorno" },
  { id: "emergency", name: "Urgência" },
  { id: "exam", name: "Resultado de Exame" }
];

// Define form schema with zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  date: z.date({ required_error: "Selecione uma data para a consulta" }),
  time: z.string({ required_error: "Selecione um horário" }),
  type: z.string({ required_error: "Selecione o tipo de atendimento" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Appointments() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"calendar" | "form">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  // Function to handle date selection and move to form step
  const handleDateSelection = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("date", date);
      setStep("form");
    }
  };

  // Function to handle form submission
  const onSubmit = (data: FormValues) => {
    // Here you would normally send this data to your backend
    console.log("Appointment data:", data);
    
    // Show success message
    toast.success("Consulta agendada com sucesso!", {
      description: `${format(data.date, "dd/MM/yyyy")} às ${data.time}`,
    });
    
    // Reset form and go back to calendar
    form.reset();
    setStep("calendar");
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button onClick={() => navigate("/")} variant="ghost" className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Agendamento de Consultas</h1>
      </div>

      {step === "calendar" ? (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Selecione uma data para sua consulta</CardTitle>
              <CardDescription>
                Escolha um dia disponível no calendário abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelection}
                disabled={(date) => 
                  isBefore(date, startOfDay(new Date())) || // No past dates
                  date.getDay() === 0 || date.getDay() === 6 // No weekends
                }
                initialFocus
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                className="p-0 mr-2 h-8 w-8" 
                onClick={() => setStep("calendar")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Complete seu agendamento</CardTitle>
            </div>
            <CardDescription>
              Agendando para {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy")}
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
                          <Input placeholder="Digite seu nome" {...field} />
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
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AVAILABLE_TIMES.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de consulta</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {APPOINTMENT_TYPES.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data selecionada</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecionar data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => 
                                isBefore(date, startOfDay(new Date())) || // No past dates
                                date.getDay() === 0 || date.getDay() === 6 // No weekends
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações ou sintomas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva brevemente o motivo da consulta ou qualquer informação importante"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full md:w-auto">
                  <Check className="mr-2 h-4 w-4" /> Confirmar Agendamento
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
