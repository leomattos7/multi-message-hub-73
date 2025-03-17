import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthGuard';
import { doctorProfileService } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar } from '@/components/Avatar';
import { LinksManager } from './LinksManager';
import { DoctorProfile, ProfileTheme, ThemeOption } from './types';
import { Loader2, LinkIcon, Palette, User, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const themeOptions: ThemeOption[] = [
  { value: 'default', label: 'Padrão', previewClass: 'bg-primary text-primary-foreground' },
  { value: 'dark', label: 'Escuro', previewClass: 'bg-gray-800 text-white' },
  { value: 'light', label: 'Claro', previewClass: 'bg-gray-100 text-gray-900' },
  { value: 'blue', label: 'Azul', previewClass: 'bg-blue-600 text-white' },
  { value: 'green', label: 'Verde', previewClass: 'bg-green-600 text-white' },
  { value: 'purple', label: 'Roxo', previewClass: 'bg-purple-600 text-white' },
];

export const ProfileManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bio: '',
    specialty: '',
    public_url_slug: '',
    theme: 'default' as ProfileTheme,
    name: '',
    profile_image_url: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const hasProfile = !!profile;
  const publicUrl = profile ? `${window.location.origin}/d/${profile.public_url_slug}` : '';

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading profile for user ID:", user.id);
      const profileData = await doctorProfileService.getProfileByDoctorId(user.id);
      console.log("Profile data received:", profileData);
      setProfile(profileData);
      
      if (profileData) {
        setFormData({
          bio: profileData.bio || '',
          specialty: profileData.specialty || '',
          public_url_slug: profileData.public_url_slug,
          theme: profileData.theme as ProfileTheme,
          name: profileData.name || '',
          profile_image_url: profileData.profile_image_url || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      setError(`Erro ao carregar perfil: ${error.message || "Ocorreu um erro desconhecido"}`);
      // No profile exists yet, that's okay
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThemeChange = (value: string) => {
    setFormData({ ...formData, theme: value as ProfileTheme });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Required validation
      if (!formData.public_url_slug) {
        toast({
          variant: "destructive",
          title: "Campo obrigatório",
          description: "O nome da URL é obrigatório para criar seu perfil.",
        });
        setSaving(false);
        return;
      }
      
      if (!hasProfile) {
        // Create new profile
        console.log("Creating new profile with user ID:", user.id);
        const newProfile = await doctorProfileService.createProfile(user.id, formData);
        console.log("New profile created:", newProfile);
        setProfile(newProfile);
        toast({
          title: "Perfil criado com sucesso!",
          description: "Agora você pode adicionar links para compartilhar com seus pacientes.",
        });
        
        // Automatically switch to links tab if profile was just created
        setActiveTab('links');
      } else {
        // Update existing profile
        const updatedProfile = await doctorProfileService.updateProfile(user.id, formData);
        setProfile(updatedProfile);
        toast({
          title: "Perfil atualizado com sucesso!",
          description: "As alterações foram salvas.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      setError(`Erro ao salvar: ${error.message || "Ocorreu um erro ao salvar o perfil."}`);
      sonnerToast.error(`Erro ao salvar: ${error.message || "Ocorreu um erro ao salvar o perfil."}`);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o perfil.",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "URL copiada!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Página do Médico</h1>
          <p className="text-muted-foreground">
            Crie sua página de perfil com links importantes para compartilhar com seus pacientes.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasProfile && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Seu link público:</span>
                  <a 
                    href={publicUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {publicUrl}
                  </a>
                </div>
                <Button size="sm" variant="outline" onClick={copyPublicUrl}>
                  Copiar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="links" disabled={!hasProfile}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Configure as informações básicas do seu perfil público.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Dr. Nome Sobrenome"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    placeholder="Ex: Cardiologia, Pediatria, etc."
                    value={formData.specialty}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Fale um pouco sobre você e sua experiência profissional..."
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_image_url">URL da Foto de Perfil</Label>
                  <Input
                    id="profile_image_url"
                    name="profile_image_url"
                    placeholder="https://exemplo.com/sua-foto.jpg"
                    value={formData.profile_image_url}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira a URL de uma imagem para usar como foto de perfil.
                  </p>
                </div>
                
                <div className="pt-2 pb-1">
                  <h3 className="font-medium text-sm mb-2">Informações de Contato</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="h-3.5 w-3.5 inline-block mr-1 mb-0.5" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="seu.email@exemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="h-3.5 w-3.5 inline-block mr-1 mb-0.5" />
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        <MapPin className="h-3.5 w-3.5 inline-block mr-1 mb-0.5" />
                        Endereço
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Av. Principal, 123, Cidade - UF"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="public_url_slug">Nome da URL</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{window.location.origin}/d/</span>
                    <Input
                      id="public_url_slug"
                      name="public_url_slug"
                      placeholder="seu-nome"
                      value={formData.public_url_slug}
                      onChange={handleChange}
                      disabled={hasProfile}
                      className="flex-1"
                    />
                  </div>
                  {!hasProfile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Este nome não poderá ser alterado depois de criado.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme">Tema</Label>
                    <Palette className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select value={formData.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {themeOptions.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${theme.previewClass}`} />
                            {theme.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {hasProfile ? 'Salvar alterações' : 'Criar perfil'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4 pt-4">
            {profile && <LinksManager doctorId={user.id} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
