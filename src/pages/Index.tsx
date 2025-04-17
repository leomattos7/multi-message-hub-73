import { useState, useEffect } from "react";
import { Inbox, Share2 } from "lucide-react";
import { ConversationList } from "@/components/ConversationList";
import { ConversationView } from "@/components/ConversationView";
import { useIsMobile } from "@/hooks/use-mobile";
import { SocialConnectionsDialog } from "@/components/SocialConnectionsDialog";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api-service";
import { toast } from "sonner";

interface Message {
  id: string;
  conversation_id: string;
  content: string;
  is_outgoing: string;
}

interface Conversation {
  id: string;
  doctor_id: string;
  name: string;
  phone: string;
  patient_id: string;
  messages?: Message[];
  channel: string;
  unread: number;
  last_activity: string;
  patient: {
    id: string;
    name: string;
    phone: string;
    avatar_url?: string;
  };
}

export default function Index() {
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(!isMobile);
  const [showConnectionsDialog, setShowConnectionsDialog] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error('Usuário não autenticado');
        }
        const user = JSON.parse(userStr);

        // Fetch conversations
        const conversationsResponse = await apiService.get<Conversation[]>('/conversations', user.id);
        
        // Fetch messages for each conversation
        const conversationsWithMessages = await Promise.all(
          conversationsResponse.map(async (conversation) => {
            const messagesResponse = await apiService.get<Message[]>(`/messages?conversation_id=${conversation.id}`, user.id);

            return {
              ...conversation,
              messages: messagesResponse || [],
              channel: 'whatsapp',
              unread: 0,
              last_activity: new Date().toISOString(),
              patient: {
                id: conversation.patient_id,
                name: conversation.name,
                phone: conversation.phone,
                avatar_url: undefined
              }
            };
          })
        );

        setConversations(conversationsWithMessages);
        setError(null);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Erro ao carregar conversas');
        toast.error('Erro ao carregar conversas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const selectedConversation = selectedConversationId 
    ? conversations.find((c) => c.id === selectedConversationId) || null
    : null;

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setShowConversation(true);
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Carregando conversas...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || !showConversation) && (
          <div className="w-full md:w-1/3 border-r flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center">
                <Inbox className="mr-2 h-5 w-5" />
                Mensagens
              </h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 text-xs"
                  onClick={() => setShowConnectionsDialog(true)}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Conectar canais
                </Button>
              </div>
            </div>
            <ConversationList 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
              className="flex-1"
              useMockData={false}
            />
          </div>
        )}
        
        {(!isMobile || showConversation) && (
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <ConversationView 
                conversation={selectedConversation}
                onBackClick={isMobile ? handleBackToList : undefined}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <Inbox className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">Nenhuma conversa selecionada</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Selecione uma conversa da lista para ver as mensagens ou inicie uma nova conversa.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <SocialConnectionsDialog 
        isOpen={showConnectionsDialog} 
        onOpenChange={setShowConnectionsDialog} 
      />
    </div>
  );
}
