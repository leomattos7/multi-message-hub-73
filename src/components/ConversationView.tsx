
import { useRef, useEffect, useState } from "react";
import { 
  ChevronLeft,
  MoreVertical
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";
import { MessageInput } from "./MessageInput";
import { Conversation, Message } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { conversationService } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationViewProps {
  conversation: any;
  onBackClick?: () => void;
  className?: string;
  useMockData?: boolean;
}

export function ConversationView({ 
  conversation: initialConversation, 
  onBackClick,
  className,
  useMockData = false
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // For mock data, we'll use the conversation directly
  // For real data, we'll fetch from Supabase
  const { data: conversation, isLoading, error } = useMockData
    ? { data: initialConversation, isLoading: false, error: null }
    : useQuery({
        queryKey: ['conversation', initialConversation.id],
        queryFn: () => conversationService.getConversation(initialConversation.id),
        initialData: initialConversation,
      });

  // Mock mutation for sending messages
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  
  useEffect(() => {
    if (useMockData && conversation) {
      // Initialize local messages with the conversation messages
      setLocalMessages(conversation.messages || []);
    }
  }, [useMockData, conversation]);

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (useMockData) {
        // For mock data, create a new message locally
        const newMessage = {
          id: `local-${Date.now()}`,
          content,
          timestamp: new Date(),
          isOutgoing: true,
          status: 'delivered', 
        };
        
        setLocalMessages(prev => [...prev, newMessage]);
        return Promise.resolve({ success: true });
      }
      // For real data, call the API and return result with success property
      return conversationService.sendMessage(conversation.id, content).then(result => {
        return { success: true, ...result };
      });
    },
    onSuccess: () => {
      if (!useMockData) {
        queryClient.invalidateQueries({ queryKey: ['conversation', conversation.id] });
      }
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        description: "Failed to send message",
      });
    }
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages, localMessages]);

  const formatMessageTime = (date: string | Date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (date: string | Date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const shouldRenderDate = (index: number, messages: any[]) => {
    if (index === 0) return true;
    
    const prevDate = new Date(messages[index - 1].timestamp);
    const currDate = new Date(messages[index].timestamp);
    
    return (
      prevDate.getDate() !== currDate.getDate() ||
      prevDate.getMonth() !== currDate.getMonth() ||
      prevDate.getFullYear() !== currDate.getFullYear()
    );
  };

  const renderMessageStatus = (message: any) => {
    // For mock data
    if (useMockData && message.isOutgoing) {
      return <span className="text-muted-foreground">{message.status}</span>;
    }
    
    // For real data
    if (!message.is_outgoing) return null;
    
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading conversation...</div>;
  }

  if (error || !conversation) {
    return <div className="flex items-center justify-center h-full">Error loading conversation</div>;
  }

  // Determine which messages to display
  const messages = useMockData 
    ? (localMessages.length > 0 ? localMessages : conversation.messages || [])
    : (conversation.messages || []);
  
  // Handle different data structures between mock and real data
  const channelLabel = {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    email: "Email",
  };
  
  const patientName = useMockData ? conversation.contact.name : (conversation.patient?.name || "Unknown");
  const patientAvatar = useMockData ? conversation.contact.avatar : conversation.patient?.avatar_url;
  const channel = useMockData ? conversation.channel : conversation.channel;

  return (
    <div className={cn(
      "flex flex-col h-full bg-background overflow-hidden", 
      isMobile && "fixed inset-0 z-50",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-1">
              <ChevronLeft />
            </Button>
          )}
          
          <Avatar 
            src={patientAvatar} 
            name={patientName}
            showStatus
            status="online"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h2 className="font-medium truncate">{patientName}</h2>
              <ChannelBadge 
                channel={channel as any} 
                size="sm" 
                className="ml-2 flex-shrink-0"
              />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              via {channelLabel[channel as keyof typeof channelLabel]}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Menu options can be added here if needed in the future */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
        <div className="flex flex-col space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message: any, index: number) => (
              <div key={message.id} className="flex flex-col">
                {shouldRenderDate(index, messages) && (
                  <div className="flex justify-center my-4">
                    <div className="bg-secondary/80 text-secondary-foreground text-xs font-medium py-1 px-3 rounded-full">
                      {formatMessageDate(message.timestamp)}
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "flex flex-col",
                  (useMockData ? message.isOutgoing : message.is_outgoing) ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    (useMockData ? message.isOutgoing : message.is_outgoing) 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-muted rounded-bl-none"
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
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        channel={channel}
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}
