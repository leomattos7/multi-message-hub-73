
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { doctorProfileService } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DoctorLink } from './types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, ExternalLink, Grip, Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LinksManagerProps {
  doctorId: string;
}

const iconOptions = [
  { value: 'calendar', label: 'Agenda' },
  { value: 'phone', label: 'Telefone' },
  { value: 'mail', label: 'Email' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'link', label: 'Link' },
  { value: 'map-pin', label: 'Localização' },
];

export const LinksManager: React.FC<LinksManagerProps> = ({ doctorId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<DoctorLink[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'link',
    is_active: true,
  });

  useEffect(() => {
    if (doctorId) {
      loadLinks();
    }
  }, [doctorId]);

  const loadLinks = async () => {
    if (!doctorId) return;
    
    try {
      setLoading(true);
      console.log("Loading links for doctor ID:", doctorId);
      const linksData = await doctorProfileService.getLinksByDoctorId(doctorId);
      console.log("Links data loaded:", linksData);
      setLinks(linksData);
    } catch (error) {
      console.error('Erro ao carregar links:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar links',
        description: 'Não foi possível carregar seus links. Tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, icon: value });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      icon: 'link',
      is_active: true,
    });
  };

  const handleAddLink = async () => {
    if (!formData.title || !formData.url) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Preencha o título e a URL do link.',
      });
      return;
    }

    try {
      setSaving(true);
      
      // Add http:// prefix if missing
      let url = formData.url;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      console.log("Creating link with doctor ID:", doctorId);
      
      await doctorProfileService.createLink({
        doctor_id: doctorId,
        title: formData.title,
        url,
        icon: formData.icon,
        is_active: formData.is_active,
        display_order: links.length + 1, // Add display_order property
      });

      toast({
        title: 'Link adicionado',
        description: 'O link foi adicionado com sucesso.',
      });

      resetForm();
      setIsAddDialogOpen(false);
      loadLinks();
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar link',
        description: 'Ocorreu um erro ao adicionar o link. Tente novamente.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (link: DoctorLink) => {
    try {
      await doctorProfileService.updateLink(link.id, {
        is_active: !link.is_active,
      });
      
      // Update local state
      setLinks(links.map(l => 
        l.id === link.id ? { ...l, is_active: !l.is_active } : l
      ));
      
      toast({
        title: link.is_active ? 'Link desativado' : 'Link ativado',
        description: link.is_active 
          ? 'O link foi desativado e não aparecerá na sua página.' 
          : 'O link foi ativado e aparecerá na sua página.',
      });
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar link',
        description: 'Ocorreu um erro ao atualizar o status do link.',
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await doctorProfileService.deleteLink(linkId);
      
      // Update local state
      setLinks(links.filter(l => l.id !== linkId));
      
      toast({
        title: 'Link removido',
        description: 'O link foi removido com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao remover link:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover link',
        description: 'Ocorreu um erro ao remover o link.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Links</CardTitle>
            <CardDescription>
              Adicione links para compartilhar com seus pacientes.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar novo link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do link</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Agende sua consulta"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    placeholder="Ex: https://exemplo.com"
                    value={formData.url}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select value={formData.icon} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddLink} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Você ainda não adicionou nenhum link.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique em "Adicionar Link" para começar.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div 
                  key={link.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md",
                    link.is_active ? "bg-card" : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Grip className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[200px]">{link.url}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(link)}
                      title={link.is_active ? "Desativar link" : "Ativar link"}
                    >
                      <Check className={cn(
                        "h-4 w-4",
                        link.is_active ? "text-green-500" : "text-muted-foreground/50"
                      )} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          title="Excluir link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir link</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o link "{link.title}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteLink(link.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
