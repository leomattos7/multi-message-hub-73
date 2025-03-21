
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus, Trash2, Mail, UserCircle, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  role: z.string().min(1, { message: "Cargo é obrigatório" }),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  date_added: string;
}

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Funcionário",
    },
  });

  const editForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      // Convert database format to our Employee interface
      const fetchedEmployees = data.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        status: emp.status as "active" | "inactive",
        date_added: new Date(emp.date_added).toISOString().split('T')[0],
      }));

      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Erro ao carregar funcionários");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddEmployee = async (data: EmployeeFormValues) => {
    try {
      // Insert new employee to Supabase
      const { data: newEmployee, error } = await supabase
        .from("employees")
        .insert([
          {
            name: data.name,
            email: data.email,
            role: data.role,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Format for our UI
      const formattedEmployee: Employee = {
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        status: newEmployee.status as "active" | "inactive",
        date_added: new Date(newEmployee.date_added).toISOString().split('T')[0],
      };

      setEmployees([...employees, formattedEmployee]);
      toast.success(`${data.name} adicionado(a) como ${data.role}`);
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Erro ao adicionar funcionário");
    }
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    editForm.reset({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    setIsEditDialogOpen(true);
  };

  const onEditEmployee = async (data: EmployeeFormValues) => {
    if (!selectedEmployee) return;

    try {
      // Update employee in Supabase
      const { error } = await supabase
        .from("employees")
        .update({
          name: data.name,
          email: data.email,
          role: data.role,
        })
        .eq('id', selectedEmployee.id);

      if (error) {
        throw error;
      }

      // Update local state
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, name: data.name, email: data.email, role: data.role }
          : emp
      ));

      toast.success(`${data.name} atualizado(a) com sucesso`);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erro ao atualizar funcionário");
    }
  };

  const openRemoveDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsRemoveDialogOpen(true);
  };

  const removeEmployee = async () => {
    if (selectedEmployee) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from("employees")
          .delete()
          .eq('id', selectedEmployee.id);

        if (error) {
          throw error;
        }

        // Update local state
        setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
        toast.success(`${selectedEmployee.name} removido(a) com sucesso`);
        setIsRemoveDialogOpen(false);
      } catch (error) {
        console.error("Error removing employee:", error);
        toast.error("Erro ao remover funcionário");
      }
    }
  };

  // Check if user is logged in
  const checkAuth = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  // Call checkAuth when component mounts
  useState(() => {
    checkAuth();
  });

  return (
    <div className="w-full p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Funcionários</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Funcionário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando funcionários...
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum funcionário adicionado ainda
              </div>
            ) : (
              <div className="divide-y">
                {employees.map((employee) => (
                  <div key={employee.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <UserCircle className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-1 h-3 w-3" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                        {employee.role}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(employee)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRemoveDialog(employee)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              Adicione um novo funcionário ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddEmployee)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do funcionário" {...field} />
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
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Funcionário">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditEmployee)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do funcionário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Funcionário">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Funcionário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {selectedEmployee?.name}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={removeEmployee}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
