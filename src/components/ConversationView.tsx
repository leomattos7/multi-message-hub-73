import { useState, useEffect } from "react";
import { Conversation } from "@/types/conversation";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { apiService } from "@/services/api-service";
import { toast } from "sonner";

interface ConversationViewProps {
  conversation: Conversation;
  onBackClick?: () => void;
}

export function ConversationView({ conversation, onBackClick }: ConversationViewProps) {
  const [messages, setMessages] = useState(conversation.messages || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error('Usuário não autenticado');
        }
        const user = JSON.parse(userStr);

        const messagesResponse = await apiService.get<Message[]>(`/messages?conversation_id=${conversation.id}`, user.id);
        setMessages(messagesResponse || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Erro ao carregar mensagens');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversation.id]);

  const handleSendMessage = async (content: string) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      const user = JSON.parse(userStr);

      const newMessage = {
        conversation_id: conversation.id,
        content,
        is_outgoing: "true",
        timestamp: new Date().toISOString()
      };

      const response = await apiService.post<Message>('/messages', newMessage, user.id);
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-4">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{conversation.patient.name}</h2>
          <p className="text-sm text-gray-500">{conversation.patient.phone}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      <div className="p-4 border-t">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
