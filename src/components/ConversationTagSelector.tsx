
import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/integrations/supabase/client';
import { Tag as TagComponent } from './Tag';

interface ConversationTagSelectorProps {
  conversationId: string;
  initialTags?: any[];
}

export function ConversationTagSelector({ 
  conversationId, 
  initialTags = [] 
}: ConversationTagSelectorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all available tags
  const { data: allTags = [], isLoading } = useQuery({
    queryKey: ['conversation-tags'],
    queryFn: tagService.getTags,
  });

  // Set initial selected tags
  useEffect(() => {
    if (initialTags?.length) {
      setSelectedTags(initialTags.map(tag => tag.id));
    }
  }, [initialTags]);

  // Assign tag mutation
  const assignTagMutation = useMutation({
    mutationFn: (data: { conversationId: string, tagId: string }) => 
      tagService.assignTagToConversation(data.conversationId, data.tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
    onError: (error) => {
      console.error('Error assigning tag:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao adicionar tag à conversa',
      });
    }
  });

  // Remove tag mutation
  const removeTagMutation = useMutation({
    mutationFn: (data: { conversationId: string, tagId: string }) => 
      tagService.removeTagFromConversation(data.conversationId, data.tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
    onError: (error) => {
      console.error('Error removing tag:', error);
      toast({
        variant: 'destructive',
        description: 'Erro ao remover tag da conversa',
      });
    }
  });

  // Handle tag selection
  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      if (!selectedTags.includes(tagId)) {
        setSelectedTags(prev => [...prev, tagId]);
        assignTagMutation.mutate({ conversationId, tagId });
      }
    } else {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
      removeTagMutation.mutate({ conversationId, tagId });
    }
  };

  // Remove a tag directly from the conversation
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
    removeTagMutation.mutate({ conversationId, tagId });
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {initialTags?.map(tag => (
        <TagComponent 
          key={tag.id}
          id={tag.id}
          name={tag.name}
          color={tag.color}
          size="sm"
          onRemove={handleRemoveTag}
        />
      ))}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Tag className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-2">
            <p className="text-xs font-medium">Atribuir tags</p>
            
            {isLoading ? (
              <p className="text-xs text-muted-foreground">Carregando...</p>
            ) : allTags.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma tag criada</p>
            ) : (
              <div className="space-y-2">
                {allTags.map((tag: any) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={(checked) => 
                        handleTagChange(tag.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`tag-${tag.id}`}
                      className="flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.color }} 
                      />
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
