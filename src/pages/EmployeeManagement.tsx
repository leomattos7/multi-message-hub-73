
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
import { UserPlus, Trash2, Mail, UserCircle, Pencil, Shield, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/components/AuthGuard";

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  role: z.string().min(1, { message: "Cargo é obrigatório" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).optional(),
});

const employeeEditFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  role: z.string().min(1, { message: "Cargo é obrigatório" }),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
type EmployeeEditFormValues = z.infer<typeof employeeEditFormSchema>;

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar se o usuário logado tem permissão (admin ou owner)
  const hasPermission = profile && ['owner', 'admin'].includes(profile.role);
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "staff",
      password: "",
    },
  });

  const editForm = useForm<EmployeeEditFormValues>({
    resolver: zodResolver(employeeEditFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  // Carregar funcionários ao montar o componente
  useEffect(() => {
    if (profile) {
      fetchEmployees();
    }
  }, [profile]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      if (!profile?.organization_id) {
        console.log("Perfil do usuário:", profile);
        console.log("ID do usuário:", user?.id);
        toast.error("ID da organização não encontrado. Verifique se seu perfil está corretamente configurado.");
        setIsLoading(false);
        return;
      }

      console.log("Buscando funcionários da organização:", profile.organization_id);

      // Buscar perfis da organização do usuário logado
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .order("name");

      if (error) {
        throw error;
      }

      console.log("Funcionários encontrados:", data);

      // Converter o formato do banco para nossa interface
      const fetchedEmployees = data.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email || "",
        role: emp.role,
        created_at: new Date(emp.created_at).toLocaleDateString(),
      }));

      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      toast.error("Erro ao carregar funcionários");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddEmployee = async (data: EmployeeFormValues) => {
    try {
      if (!profile?.organization_id) {
        toast.error("ID da organização não encontrado");
        return;
      }

      setIsLoading(true);
      
      // 1. Criar um novo usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || generateRandomPassword(),
        options: {
          data: {
            name: data.name,
            role: data.role,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // 2. Atualizar o perfil para pertencer à mesma organização do usuário logado
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          organization_id: profile.organization_id,
          role: data.role
        })
        .eq("id", authData.user.id);

      if (profileError) {
        throw profileError;
      }

      toast.success(`${data.name} adicionado(a) como ${data.role === 'admin' ? 'Administrador' : 'Funcionário'}`);
      setIsAddDialogOpen(false);
      form.reset();
      fetchEmployees();
    } catch (error: any) {
      console.error("Erro ao adicionar funcionário:", error);
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

  const onEditEmployee = async (data: EmployeeEditFormValues) => {
    if (!selectedEmployee) return;

    try {
      setIsLoading(true);
      
      // Atualizar o perfil do usuário
      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          email: data.email,
          role: data.role,
        })
        .eq('id', selectedEmployee.id);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, name: data.name, email: data.email, role: data.role }
          : emp
      ));

      toast.success(`${data.name} atualizado(a) com sucesso`);
      setIsEditDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      toast.error("Erro ao atualizar funcionário");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const deleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setIsLoading(true);
      
      // Remover usuário do Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedEmployee.id
      );

      if (authError) {
        // Se não conseguir remover com o admin API, tentamos desabilitar o usuário
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "disabled" })
          .eq("id", selectedEmployee.id);
          
        if (updateError) throw updateError;
      }

      // Atualizar estado local
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      toast.success(`${selectedEmployee.name} removido(a) com sucesso`);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao remover funcionário:", error);
      toast.error("Erro ao remover funcionário");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para gerar senha aleatória
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Obter o rótulo do cargo
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'staff': return 'Funcionário';
      case 'owner': return 'Proprietário';
      case 'doctor': return 'Médico';
      default: return role;
    }
  };

  // Obter o ícone do cargo
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 mr-1 text-blue-600" />;
      case 'owner': return <Shield className="h-4 w-4 mr-1 text-purple-600" />;
      case 'doctor': return <UserCircle className="h-4 w-4 mr-1 text-green-600" />;
      default: return <User className="h-4 w-4 mr-1 text-gray-600" />;
    }
  };

  return (
    <div className="w-full p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          {hasPermission && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando usuários...
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Cadastro</TableHead>
                      {hasPermission && <TableHead className="text-right">Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getRoleIcon(employee.role)}
                            <span>{getRoleLabel(employee.role)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{employee.created_at}</TableCell>
                        {hasPermission && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(employee)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                disabled={employee.role === 'owner' && profile?.role !== 'owner'}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(employee)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={employee.role === 'owner' || employee.id === profile?.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Adicionar Usuário */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário ao sistema. Uma conta será criada e o usuário receberá um e-mail com instruções para acessar.
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
                      <Input placeholder="Nome do usuário" {...field} />
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
                    <FormLabel>Senha (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Deixe em branco para gerar uma senha automática" 
                        {...field} 
                      />
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
                        {profile?.role === 'owner' && (
                          <SelectItem value="admin">Administrador</SelectItem>
                        )}
                        <SelectItem value="staff">Funcionário</SelectItem>
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

      {/* Dialog de Editar Usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
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
                      <Input placeholder="Nome do usuário" {...field} />
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
                        {profile?.role === 'owner' && (
                          <SelectItem value="admin">Administrador</SelectItem>
                        )}
                        <SelectItem value="doctor">Médico</SelectItem>
                        <SelectItem value="staff">Funcionário</SelectItem>
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

      {/* Dialog de Confirmar Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {selectedEmployee?.name}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEmployee}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
