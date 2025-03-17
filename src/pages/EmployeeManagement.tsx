
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sidebar } from "@/components/Sidebar";
import { UserPlus, Trash2, Mail, UserCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

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
  dateAdded: string;
}

// Mock initial employee data
const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Amanda Costa",
    email: "amanda.costa@exemplo.com",
    role: "Secretária",
    status: "active",
    dateAdded: "2023-10-15",
  },
];

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Secretária",
    },
  });

  const onAddEmployee = (data: EmployeeFormValues) => {
    const newEmployee: Employee = {
      id: "emp-" + Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      status: "active",
      dateAdded: new Date().toISOString().split('T')[0],
    };
    
    setEmployees([...employees, newEmployee]);
    toast.success(`${data.name} adicionado(a) como ${data.role}`);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const openRemoveDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsRemoveDialogOpen(true);
  };

  const removeEmployee = () => {
    if (selectedEmployee) {
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      toast.success(`${selectedEmployee.name} removido(a) com sucesso`);
      setIsRemoveDialogOpen(false);
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
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
              {employees.length === 0 ? (
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

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
                    <FormControl>
                      <Input placeholder="Secretária" {...field} />
                    </FormControl>
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
