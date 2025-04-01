
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { conversationService } from "@/integrations/supabase/client";

export function useConversation(initialConversation: any, useMockData = false) {
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversation, isLoading, error } = useMockData
    ? { data: initialConversation, isLoading: false, error: null }
    : useQuery({
        queryKey: ['conversation', initialConversation.id],
        queryFn: () => conversationService.getConversation(initialConversation.id),
        initialData: initialConversation,
      });

  useEffect(() => {
    if (useMockData && conversation) {
      setLocalMessages(conversation.messages || []);
    }
  }, [useMockData, conversation]);

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (useMockData) {
        const newMessage = {
          id: `local-${Date.now()}`,
          content,
          timestamp: new Date(),
          isOutgoing: true,
          status: 'delivered', 
        };
        
        setLocalMessages(prev => [...prev, newMessage]);
        
        if (aiEnabled) {
          setTimeout(() => {
            const aiResponse = {
              id: `local-ai-${Date.now()}`,
              content: "Esta é uma resposta automatizada da IA. O assistente respondeu com base nos dados disponíveis.",
              timestamp: new Date(),
              isOutgoing: false,
              status: 'delivered',
            };
            setLocalMessages(prev => [...prev, aiResponse]);
          }, 1500);
        }
        
        return Promise.resolve({ success: true });
      }
      
      try {
        return conversationService.sendMessage(conversation.id, content).then(result => {
          return { success: true, ...result };
        });
      } catch (error) {
        console.error("Error sending message:", error);
        return Promise.reject(error);
      }
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

  const handleAiToggle = (enabled: boolean) => {
    setAiEnabled(enabled);
    console.log("AI automated responses:", enabled ? "enabled" : "disabled");
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
    if (useMockData && message.isOutgoing) {
      return <span className="text-muted-foreground">{message.status}</span>;
    }
    
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

  const messages = useMockData 
    ? (localMessages.length > 0 ? localMessages : conversation.messages || [])
    : (conversation?.messages || []);

  return {
    conversation,
    messages,
    isLoading,
    error,
    tagDialogOpen,
    setTagDialogOpen,
    aiEnabled,
    handleAiToggle,
    handleSendMessage,
    formatMessageTime,
    formatMessageDate,
    shouldRenderDate,
    renderMessageStatus,
    sendMessageMutation
  };
}
