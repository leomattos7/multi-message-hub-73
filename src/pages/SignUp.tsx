
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-col justify-center items-center w-full py-8">
        <div className="w-full max-w-md px-4">
          <AuthHeader 
            title="Med Attend" 
            subtitle="Crie sua conta e gerencie seus pacientes" 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Médico</CardTitle>
              <CardDescription>
                Crie sua conta para começar a usar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm />
            </CardContent>
            <CardFooter className="flex justify-center border-t px-6 py-4">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Faça login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
