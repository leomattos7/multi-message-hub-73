
import React, { useState } from 'react';
import { ProfileManager } from '@/components/DoctorProfile/ProfileManager';
import { useAuth } from '@/components/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DoctorLinkTree: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading for smooth UX
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Você precisa estar logado para acessar esta página.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <ProfileManager />;
};

export default DoctorLinkTree;
