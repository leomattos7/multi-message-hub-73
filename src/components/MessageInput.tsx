
import { useState, useRef } from "react";
import { Send, Paperclip, Smile, Tag as TagIcon, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChannelType } from "@/data/mockData";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  channel: ChannelType;
  className?: string;
  onTagClick?: () => void;
  showTagButton?: boolean;
  aiEnabled?: boolean;
  onAiToggle?: (enabled: boolean) => void;
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  channel,
  className,
  onTagClick,
  showTagButton = false,
  aiEnabled = true,
  onAiToggle
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const channelLabel = {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    email: "Email",
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage("");
    
    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAttachment = () => {
    toast({
      title: "Anexo",
      description: "Funcionalidade de anexo será implementada em breve.",
    });
  };

  const handleAiToggle = (checked: boolean) => {
    if (onAiToggle) {
      onAiToggle(checked);
      toast({
        title: checked ? "IA Ativada" : "IA Desativada",
        description: checked 
          ? "Respostas automáticas de IA estão habilitadas" 
          : "Respostas automáticas de IA estão desabilitadas",
      });
    }
  };

  return (
    <div className={cn(
      "border-t border-border p-4 bg-background",
      className
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Respondendo via {channelLabel[channel as keyof typeof channelLabel]}
        </span>
        
        {onAiToggle && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Respostas IA
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Switch 
                    checked={aiEnabled}
                    onCheckedChange={handleAiToggle}
                    id="ai-mode"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {aiEnabled ? "Desativar respostas automáticas" : "Ativar respostas automáticas"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-2">
        {showTagButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onTagClick}
                disabled={disabled}
                className="flex-shrink-0"
              >
                <TagIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gerenciar tags</TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleAttachment}
              disabled={disabled}
              className="flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Anexar arquivo</TooltipContent>
        </Tooltip>
        
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Digite uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="min-h-[80px] max-h-[200px] resize-none pr-12 bg-secondary/50"
          />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-2 bottom-2"
                onClick={handleSubmit}
                disabled={disabled || !message.trim()}
              >
                <Send className={cn(
                  "h-5 w-5 transition-colors",
                  message.trim() 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mensagem</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
