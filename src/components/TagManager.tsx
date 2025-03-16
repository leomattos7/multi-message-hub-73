
import { useState } from "react";
import { Tag as TagComponent } from "./Tag";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tag, statusTags, topicTags, getTagById } from "@/data/tagsData";
import { Conversation } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tags, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TagManagerProps {
  conversation: Conversation;
  onTagsUpdate: (tags: string[]) => void;
  className?: string;
}

export function TagManager({ conversation, onTagsUpdate, className }: TagManagerProps) {
  const [tags, setTags] = useState<string[]>(conversation.tags || []);
  const { toast } = useToast();

  const addTag = (tagId: string) => {
    if (!tags.includes(tagId)) {
      const newTags = [...tags, tagId];
      setTags(newTags);
      onTagsUpdate(newTags);
      toast({
        description: "Tag adicionada com sucesso",
      });
    }
  };

  const removeTag = (tagId: string) => {
    const newTags = tags.filter(id => id !== tagId);
    setTags(newTags);
    onTagsUpdate(newTags);
    toast({
      description: "Tag removida",
    });
  };

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map(tagId => {
        const tag = getTagById(tagId);
        if (!tag) return null;
        
        return (
          <div key={tagId} className="flex items-center bg-secondary rounded-full pr-1">
            <TagComponent tag={tag} size="sm" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1 rounded-full"
              onClick={() => removeTag(tagId)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 gap-1 rounded-full">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="text-xs">Tag</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Adicionar Tag</DropdownMenuLabel>
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
              Status
            </DropdownMenuLabel>
            {statusTags.map(tag => (
              <DropdownMenuItem 
                key={tag.id}
                disabled={tags.includes(tag.id)}
                onClick={() => addTag(tag.id)}
              >
                <TagComponent tag={tag} className="w-full" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2">
              Temática
            </DropdownMenuLabel>
            {topicTags.map(tag => (
              <DropdownMenuItem 
                key={tag.id}
                disabled={tags.includes(tag.id)}
                onClick={() => addTag(tag.id)}
              >
                <TagComponent tag={tag} className="w-full" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
