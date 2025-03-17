
import React, { useEffect, useState } from 'react';
import { ProfileManager } from '@/components/DoctorProfile/ProfileManager';
import { useAuth } from '@/components/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DoctorLinkTree: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth to be ready
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  if (!isReady || isLoading) {
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

  return <ProfileManager doctorId={user.id} />;
};

export default DoctorLinkTree;
