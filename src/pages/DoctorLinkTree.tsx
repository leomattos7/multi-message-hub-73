
import React, { useState, useEffect } from 'react';
import { ProfileManager } from '@/components/DoctorProfile/ProfileManager';
import { LinksManager } from '@/components/DoctorProfile/LinksManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DoctorLinkTree: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    // For now we're using a hardcoded doctor ID for testing
    // In a real app, this would come from authentication
    const mockDoctorId = "123e4567-e89b-12d3-a456-426614174000";
    setDoctorId(mockDoctorId);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Seu Minisite Pessoal</h1>
      
      <Tabs defaultValue="links" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="preview">Visualizar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileManager />
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4">
          {doctorId ? (
            <LinksManager doctorId={doctorId} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Erro</CardTitle>
                <CardDescription>
                  Não foi possível carregar suas informações. Tente novamente mais tarde.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prévia do Minisite</CardTitle>
              <CardDescription>
                Veja como seu minisite ficará para os visitantes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <iframe 
                src={doctorId ? `/d/preview-${doctorId}` : '/404'} 
                className="border rounded-lg w-full max-w-md h-[600px] shadow-md"
                title="Preview do Minisite"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorLinkTree;
