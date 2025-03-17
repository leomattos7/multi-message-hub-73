
import { useState, useRef } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChannelType } from "@/data/mockData";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  channel: ChannelType;
  className?: string;
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  channel,
  className 
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

  return (
    <div className={cn(
      "border-t border-border p-4 bg-background",
      className
    )}>
      <div className="mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Respondendo via {channelLabel[channel as keyof typeof channelLabel]}
        </span>
      </div>
      
      <div className="flex items-end gap-2">
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
