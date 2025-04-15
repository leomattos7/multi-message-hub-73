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
import { UserPlus, Trash2, Mail, UserCircle, Pencil, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.string().min(1, { message: "Cargo é obrigatório" }),
});

const editEmployeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  role: z.string().min(1, { message: "Cargo é obrigatório" }),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
type EditEmployeeFormValues = z.infer<typeof editEmployeeFormSchema>;

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
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
    },
  });

  const editForm = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching employees...");
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching employees:", error);
        setError("Erro ao carregar funcionários: " + error.message);
        throw error;
      }

      console.log("Fetched employees:", data);

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
      setError("Erro ao carregar funcionários");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddEmployee = async (data: EmployeeFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Adding employee:", data);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role === "admin" ? "admin" : "employee"
          }
        }
      });

      if (authError) {
        console.error("Error creating Supabase auth user:", authError);
        setError("Erro ao criar usuário autenticado: " + authError.message);
        throw authError;
      }

      console.log("Created auth user:", authData);
      
      if (!authData.user) {
        setError("Erro ao criar usuário: Nenhum usuário retornado");
        throw new Error("No user returned from Auth signUp");
      }

      const { data: newEmployee, error: insertError } = await supabase
        .from("employees")
        .insert([
          {
            id: authData.user.id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error adding employee to database:", insertError);
        setError("Erro ao adicionar funcionário ao banco de dados: " + insertError.message);
        throw insertError;
      }

      console.log("New employee added:", newEmployee);

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
    } catch (error: any) {
      console.error("Error adding employee:", error);
      toast.error(error.message || "Erro ao adicionar funcionário");
    } finally {
      setIsLoading(false);
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

  const onEditEmployee = async (data: EditEmployeeFormValues) => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    setError(null);
    try {
      console.log("Updating employee:", selectedEmployee.id, data);
      
      const { error } = await supabase
        .from("employees")
        .update({
          name: data.name,
          email: data.email,
          role: data.role,
        })
        .eq('id', selectedEmployee.id);

      if (error) {
        console.error("Error updating employee:", error);
        setError("Erro ao atualizar funcionário: " + error.message);
        throw error;
      }

      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, name: data.name, email: data.email, role: data.role }
          : emp
      ));

      toast.success(`${data.name} atualizado(a) com sucesso`);
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast.error(error.message || "Erro ao atualizar funcionário");
    } finally {
      setIsLoading(false);
    }
  };

  const openRemoveDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsRemoveDialogOpen(true);
  };

  const removeEmployee = async () => {
    if (selectedEmployee) {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Removing employee:", selectedEmployee.id);
        
        const { error } = await supabase
          .from("employees")
          .delete()
          .eq('id', selectedEmployee.id);

        if (error) {
          console.error("Error removing employee:", error);
          setError("Erro ao remover funcionário: " + error.message);
          throw error;
        }

        setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
        toast.success(`${selectedEmployee.name} removido(a) com sucesso`);
        setIsRemoveDialogOpen(false);
      } catch (error: any) {
        console.error("Error removing employee:", error);
        toast.error(error.message || "Erro ao remover funcionário");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const checkAuth = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    checkAuth();
  }, []);

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

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              Adicione um novo funcionário ao sistema. Isso criará uma conta de usuário.
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
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
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="employee">Funcionário</SelectItem>
                        <SelectItem value="doctor">Médico</SelectItem>
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adicionando..." : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="employee">Funcionário</SelectItem>
                        <SelectItem value="doctor">Médico</SelectItem>
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
              disabled={isLoading}
            >
              {isLoading ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
