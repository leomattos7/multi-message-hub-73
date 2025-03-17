
import { useRef, useEffect, useState } from "react";
import { 
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";
import { MessageInput } from "./MessageInput";
import { Conversation, Message } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConversationViewProps {
  conversation: Conversation;
  onBackClick?: () => void;
  className?: string;
}

export function ConversationView({ 
  conversation: initialConversation, 
  onBackClick,
  className 
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation>(initialConversation);
  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Update messages when conversation changes
  useEffect(() => {
    setConversation(initialConversation);
    setMessages(initialConversation.messages);
  }, [initialConversation]);

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (date: Date) => {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      content,
      timestamp: new Date(),
      isOutgoing: true,
      status: 'pending',
    };

    setMessages([...messages, newMessage]);
    
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 1000);
    
    toast({
      description: "Mensagem enviada com sucesso",
    });
  };

  const shouldRenderDate = (index: number) => {
    if (index === 0) return true;
    
    const prevDate = new Date(messages[index - 1].timestamp);
    const currDate = new Date(messages[index].timestamp);
    
    return (
      prevDate.getDate() !== currDate.getDate() ||
      prevDate.getMonth() !== currDate.getMonth() ||
      prevDate.getFullYear() !== currDate.getFullYear()
    );
  };

  const renderMessageStatus = (message: Message) => {
    if (!message.isOutgoing) return null;
    
    switch (message.status) {
      case 'pending':
        return <span className="text-muted-foreground animate-pulse">Enviando...</span>;
      case 'sent':
        return <span className="text-muted-foreground">Enviado</span>;
      case 'delivered':
        return <span className="text-muted-foreground">Entregue</span>;
      case 'read':
        return <span className="text-primary">Lido</span>;
      case 'failed':
        return <span className="text-destructive">Falha no envio</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background overflow-hidden", 
      isMobile && "fixed inset-0 z-50",
      className
    )}>
      <div className="flex items-center gap-3 p-4 border-b border-border">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-1">
            <ChevronLeft />
          </Button>
        )}
        
        <Avatar 
          src={conversation.contact.avatar} 
          name={conversation.contact.name}
          showStatus
          status="online"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h2 className="font-medium truncate">{conversation.contact.name}</h2>
            <ChannelBadge 
              channel={conversation.channel} 
              size="sm" 
              className="ml-2 flex-shrink-0"
            />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            via {conversation.channel}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div key={message.id} className="flex flex-col">
              {shouldRenderDate(index) && (
                <div className="flex justify-center my-4">
                  <div className="bg-secondary/80 text-secondary-foreground text-xs font-medium py-1 px-3 rounded-full">
                    {formatMessageDate(message.timestamp)}
                  </div>
                </div>
              )}
              
              <div className={cn(
                "flex flex-col",
                message.isOutgoing ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "max-w-[80%]",
                  message.isOutgoing 
                    ? "message-bubble-outgoing" 
                    : "message-bubble-incoming"
                )}>
                  {message.content}
                </div>
                
                <div className="flex items-center mt-1 text-xs">
                  <span className="text-muted-foreground mr-1">
                    {formatMessageTime(message.timestamp)}
                  </span>
                  {renderMessageStatus(message)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        channel={conversation.channel}
      />
    </div>
  );
}
