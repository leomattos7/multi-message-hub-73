
import { useRef, useEffect, useState } from "react";
import { 
  ChevronLeft,
  MoreVertical,
  UserPlus,
  Archive,
  Trash2
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConversationViewProps {
  conversation: any;
  onBackClick?: () => void;
  className?: string;
}

export function ConversationView({ 
  conversation: initialConversation, 
  onBackClick,
  className 
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch full conversation with messages
  const { data: conversation, isLoading, error } = useQuery({
    queryKey: ['conversation', initialConversation.id],
    queryFn: () => conversationService.getConversation(initialConversation.id),
    initialData: initialConversation,
  });

  // Archive/unarchive mutation
  const archiveMutation = useMutation({
    mutationFn: (archive: boolean) => {
      if (archive) {
        return conversationService.archiveConversation(conversation.id);
      } else {
        return conversationService.unarchiveConversation(conversation.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', conversation.id] });
      toast({
        description: "Conversation updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating conversation:', error);
      toast({
        variant: "destructive",
        description: "Failed to update conversation",
      });
    }
  });

  // Add to patients mutation
  const addToPatientsMutation = useMutation({
    mutationFn: () => conversationService.addPatientFromConversation(conversation),
    onSuccess: () => {
      toast({
        description: "Contact added to patients successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding contact to patients:', error);
      toast({
        variant: "destructive",
        description: "Failed to add contact to patients",
      });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => conversationService.sendMessage(conversation.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversation.id] });
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
  }, [conversation?.messages]);

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

  const handleArchive = (archive: boolean) => {
    archiveMutation.mutate(archive);
  };

  const handleAddToPatients = () => {
    addToPatientsMutation.mutate();
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

  const messages = conversation.messages || [];
  const channelLabel = {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    email: "Email",
  };

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
            src={conversation.patient?.avatar_url} 
            name={conversation.patient?.name || "Unknown"}
            showStatus
            status="online"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h2 className="font-medium truncate">{conversation.patient?.name || "Unknown"}</h2>
              <ChannelBadge 
                channel={conversation.channel} 
                size="sm" 
                className="ml-2 flex-shrink-0"
              />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              via {channelLabel[conversation.channel as keyof typeof channelLabel]}
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
            <DropdownMenuItem onClick={handleAddToPatients}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add to Patients
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Archive className="h-4 w-4 mr-2" />
                  {conversation.is_archived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {conversation.is_archived ? "Unarchive Conversation" : "Archive Conversation"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {conversation.is_archived 
                      ? "Are you sure you want to unarchive this conversation? It will be moved back to your inbox."
                      : "Are you sure you want to archive this conversation? It will be moved to the archived tab."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleArchive(!conversation.is_archived)}>
                    {conversation.is_archived ? "Unarchive" : "Archive"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                  message.is_outgoing ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.is_outgoing 
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
        channel={conversation.channel}
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}
