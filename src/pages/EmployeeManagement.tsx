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
import { apiService } from "@/services/api-service";
import { AuthGuard } from "@/components/AuthGuard";
import { v4 as uuidv4 } from 'uuid';

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.string().min(1, { message: "Cargo é obrigatório" }),
  specialization: z.string().optional(),
  crm: z.string().optional(),
  phone: z.string().optional(),
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
  created_at: string;
  updated_at: string;
  organization_id: string;
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
  const [user, setUser] = useState<any>(null);
  
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
    const fetchEmployeesData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          navigate('/login');
          return;
        }

        const profileResponse = await apiService.get('/profiles', authUser.id);

        if (!profileResponse || !profileResponse[0]?.organization_id) {
          setError("Usuário não está vinculado a uma organização");
          setIsLoading(false);
          return;
        }

        const userProfile = profileResponse[0];
        setUser(userProfile);
        
        // Fetch employees with the same organization_id
        await fetchEmployees(userProfile.organization_id);
      } catch (error: any) {
        console.error("Error in auth check:", error);
        setError(error.message || "Erro ao verificar autenticação");
        setIsLoading(false);
      }
    };

    fetchEmployeesData();
  }, []);

  const fetchEmployees = async (organizationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching employees for organization:", organizationId);
      
      const filters = [{
        attribute: 'organization_id',
        operator: '=',
        value: organizationId
      }];

      // Get the current user ID from Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error("Usuário não autenticado");
      }

      const response = await apiService.get<Employee[]>('/profiles', authUser.id);

      if (!response) {
        throw new Error("Nenhum funcionário encontrado");
      }

      const fetchedEmployees = response.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        status: emp.status as "active" | "inactive",
        date_added: emp.created_at ? new Date(emp.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        created_at: emp.created_at,
        updated_at: emp.updated_at,
        organization_id: emp.organization_id
      }));

      setEmployees(fetchedEmployees);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      setError(error.message || "Erro ao carregar funcionários");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddEmployee = async (data: EmployeeFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Adding employee:", data);
      
      // Get the current admin user from localStorage
      const userStr = localStorage.getItem("user");
      console.log("User from localStorage:", userStr);
      
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      
      const currentUser = JSON.parse(userStr);
      console.log("Parsed user:", currentUser);

      // Get user profile from API
      const userProfile = await apiService.get('/profiles', currentUser.id);
      console.log("User profile from API:", userProfile);

      if (!userProfile || !userProfile[0]?.organization_id) {
        throw new Error('Usuário não está vinculado a uma organização');
      }

      const organization_id = userProfile[0].organization_id;

      // Gerar um novo ID para o usuário já que não estamos mais usando o ID do Supabase
      const newUserId = uuidv4();

      // 2. Create profile in API with the same organization_id
      const newProfile = {
        id: newUserId,
        organization_id: organization_id,
        role: data.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
      };

      // Make the POST request using the admin user's ID for authentication
      console.log("Creating profile with data:", newProfile);
      console.log("Admin user ID:", currentUser.id);
      await apiService.post('/profiles', newProfile, currentUser.id);

      // 3. If the user is a doctor, create a doctor_profile
      if (data.role === 'doctor') {
        try {
          const doctorProfile = {
            id: newUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            name: data.name,
            email: data.email,
            phone: data.phone || ""
          };

          console.log("Creating doctor profile with data:", doctorProfile);
          await apiService.post('/doctor_profiles', doctorProfile, currentUser.id);
        } catch (doctorError: any) {
          console.error("Error creating doctor profile:", doctorError);
          toast.warning("Perfil de médico criado, mas alguns detalhes adicionais não puderam ser salvos");
        }
      }

      // 4. Create employee record
      const employeeData = {
        id: newUserId,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        role: data.role,
        organization_id: organization_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active"
      };

      const { error: employeeError } = await supabase
        .from("employees")
        .insert([employeeData]);

      fetchEmployees(organization_id);
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
      
      // Get current user from Supabase (only for auth)
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // 1. Update profile in DynamoDB
      const updatedProfile = {
        name: data.name,
        email: data.email,
        role: data.role,
        updated_at: new Date().toISOString()
      };

      await apiService.put(`/profiles/${selectedEmployee.id}`, updatedProfile, currentUser.id);

      // 2. If role changed to/from doctor, handle doctor profile
      if (selectedEmployee.role !== data.role) {
        if (data.role === 'doctor') {
          // Create doctor profile if role changed to doctor
          const doctorProfile = {
            id: selectedEmployee.id,
            name: data.name,
            email: data.email,
            bio: '',
            specialty: '',
            profile_image_url: '',
            public_url_slug: data.name.toLowerCase().replace(/\s+/g, '-'),
            theme: 'default',
            phone: '',
            address: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          await apiService.post('/doctor_profiles', doctorProfile, currentUser.id);
        } else if (selectedEmployee.role === 'doctor') {
          // Delete doctor profile if role changed from doctor
          try {
            await apiService.delete(`/doctor_profiles/${selectedEmployee.id}`, currentUser.id);
          } catch (doctorError: any) {
            console.error("Error deleting doctor profile:", doctorError);
            // Continue even if doctor profile deletion fails
          }
        }
      }

      // 3. Update local state
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { 
              ...emp, 
              name: data.name, 
              email: data.email, 
              role: data.role,
              updated_at: new Date().toISOString()
            }
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
        
        // Get current user from Supabase (only for auth)
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // 1. Delete employee profile from DynamoDB
        await apiService.delete(`/profiles/${selectedEmployee.id}`, currentUser.id);

        // 2. If the employee is a doctor, also delete their doctor profile
        if (selectedEmployee.role === 'doctor') {
          try {
            await apiService.delete(`/doctor_profiles/${selectedEmployee.id}`, currentUser.id);
          } catch (doctorError: any) {
            console.error("Error deleting doctor profile:", doctorError);
            // Continue even if doctor profile deletion fails
          }
        }

        // 3. Delete user from Supabase Auth
        const { error: authError } = await supabase.auth.admin.deleteUser(selectedEmployee.id);
        if (authError) {
          console.error("Error deleting Supabase auth user:", authError);
          // Continue even if Supabase deletion fails
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
    <AuthGuard requiredRole="admin">
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
    </AuthGuard>
  );
}
