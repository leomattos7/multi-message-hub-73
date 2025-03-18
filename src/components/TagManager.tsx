
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tags, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/integrations/supabase/client';
import { Tag } from './Tag';

const PRESET_COLORS = [
  '#F87171', // Red
  '#FB923C', // Orange
  '#FBBF24', // Amber
  '#A3E635', // Lime
  '#34D399', // Emerald
  '#22D3EE', // Cyan
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#A78BFA', // Violet
  '#E879F9', // Pink
];

export function TagManager() {
  const [open, setOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all tags
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['conversation-tags'],
    queryFn: tagService.getTags,
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) => 
      tagService.createTag(data.name, data.color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation-tags'] });
      resetForm();
      toast({
        description: 'Tag criada com sucesso',
      });
    },
    onError: (error) => {
      console.error('Error creating tag:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao criar tag',
      });
    }
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: (data: { id: string; updates: { name: string; color: string } }) => 
      tagService.updateTag(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation-tags'] });
      resetForm();
      toast({
        description: 'Tag atualizada com sucesso',
      });
    },
    onError: (error) => {
      console.error('Error updating tag:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao atualizar tag',
      });
    }
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation-tags'] });
      toast({
        description: 'Tag removida com sucesso',
      });
    },
    onError: (error) => {
      console.error('Error deleting tag:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao remover tag',
      });
    }
  });

  // Reset form
  const resetForm = () => {
    setTagName('');
    setSelectedColor(PRESET_COLORS[0]);
    setEditingTag(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tagName.trim() === '') {
      toast({
        variant: 'destructive',
        description: 'Nome da tag é obrigatório',
      });
      return;
    }

    if (editingTag) {
      updateTagMutation.mutate({
        id: editingTag.id,
        updates: { name: tagName, color: selectedColor }
      });
    } else {
      createTagMutation.mutate({ name: tagName, color: selectedColor });
    }
  };

  // Start editing a tag
  const startEditing = (tag: any) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setSelectedColor(tag.color);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    resetForm();
    setOpen(false);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Tags className="h-4 w-4" />
          Gerenciar Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
          <DialogDescription>
            Crie e edite tags para organizar suas conversas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome da tag"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              disabled={createTagMutation.isPending || updateTagMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={createTagMutation.isPending || updateTagMutation.isPending}
            >
              {editingTag ? 'Atualizar' : 'Criar'} Tag
            </Button>
          </div>
        </form>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Tags existentes</h4>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando tags...</p>
          ) : tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tag criada</p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag: any) => (
                <div key={tag.id} className="flex items-center justify-between">
                  <Tag id={tag.id} name={tag.name} color={tag.color} />
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => startEditing(tag)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteTagMutation.mutate(tag.id)}
                      disabled={deleteTagMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleDialogClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
