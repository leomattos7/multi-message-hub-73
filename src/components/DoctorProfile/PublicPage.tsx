
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doctorProfileService } from '@/integrations/supabase/client';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Calendar, Facebook, Instagram, Link, Loader2, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

export const PublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      loadProfile(slug);
    }
  }, [slug]);

  const loadProfile = async (profileSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorProfileService.getProfileBySlug(profileSlug);
      setProfile(data);
      setLinks(data?.doctor_links || []);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Perfil não encontrado. Verifique o link e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Get theme classes based on profile theme
  const getThemeClasses = () => {
    switch (profile?.theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          button: 'bg-gray-800 hover:bg-gray-700 text-white',
        };
      case 'light':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          button: 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200',
        };
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-900',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-900',
          button: 'bg-green-600 hover:bg-green-700 text-white',
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-900',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
        };
      default:
        return {
          bg: 'bg-background',
          text: 'text-foreground',
          button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
        };
    }
  };

  const getIconForLink = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="h-5 w-5" />;
      case 'phone': return <Phone className="h-5 w-5" />;
      case 'mail': return <Mail className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      case 'map-pin': return <MapPin className="h-5 w-5" />;
      default: return <Link className="h-5 w-5" />;
    }
  };

  const theme = getThemeClasses();

  if (loading) {
    return (
      <div className={cn("min-h-screen flex flex-col items-center py-12 px-4", theme.bg)}>
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="space-y-4 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild variant="outline">
            <a href="/">Voltar para a página inicial</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
          <p className="text-gray-600 mb-6">O perfil solicitado não existe ou foi removido.</p>
          <Button asChild variant="outline">
            <a href="/">Voltar para a página inicial</a>
          </Button>
        </div>
      </div>
    );
  }

  // Filter active links
  const activeLinks = links.filter(link => link.is_active);

  return (
    <div className={cn("min-h-screen flex flex-col items-center py-12 px-4", theme.bg)}>
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar 
            src={profile.profile_image_url} 
            name={profile.name || 'Dr.'} 
            size="lg"
            className="h-24 w-24"
          />
          <h1 className={cn("text-2xl font-bold", theme.text)}>
            {profile.name || 'Dr.'}
          </h1>
          {profile.specialty && (
            <p className={cn("text-sm font-medium", theme.text)}>
              {profile.specialty}
            </p>
          )}
          {profile.bio && (
            <p className={cn("text-sm", theme.text)}>
              {profile.bio}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-6">
          {activeLinks.length === 0 ? (
            <p className={cn("text-center text-sm", theme.text)}>
              Nenhum link disponível no momento.
            </p>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  className={cn(
                    "w-full justify-start gap-3 text-left font-normal py-6",
                    theme.button
                  )}
                >
                  <span className="flex-shrink-0">
                    {getIconForLink(link.icon)}
                  </span>
                  <span className="flex-grow truncate">{link.title}</span>
                </Button>
              </a>
            ))
          )}
        </div>

        <div className="pt-10 text-center">
          <p className={cn("text-xs opacity-70", theme.text)}>
            Powered by Linktree Médico
          </p>
        </div>
      </div>
    </div>
  );
};
