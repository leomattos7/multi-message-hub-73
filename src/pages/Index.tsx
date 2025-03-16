
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ConversationView } from "@/components/ConversationView";
import { Conversation, mockConversations } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const Index = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Select first conversation by default on desktop
  useEffect(() => {
    if (!isMobile && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [isMobile, selectedConversation, conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    // Encontrar a conversa atualizada no array de conversas
    const updatedConversation = conversations.find(c => c.id === conversation.id) || conversation;
    setSelectedConversation(updatedConversation);
    if (isMobile) {
      setShowConversation(true);
    }
  };

  const handleBackClick = () => {
    if (isMobile) {
      setShowConversation(false);
    }
  };

  const handleTagsUpdate = (conversationId: string, tags: string[]) => {
    // Atualizar as tags na conversa específica
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId ? { ...conv, tags } : conv
    );
    setConversations(updatedConversations);
    
    // Atualizar a conversa selecionada se for a mesma
    if (selectedConversation && selectedConversation.id === conversationId) {
      setSelectedConversation({ ...selectedConversation, tags });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background animate-fade-in">
      <Sidebar className="flex-shrink-0" />
      
      <div className="flex-1 flex relative overflow-hidden">
        {(!isMobile || !showConversation) && (
          <ConversationList 
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
            className={isMobile ? "w-full" : "w-1/3 flex-shrink-0"}
          />
        )}
        
        {(!isMobile || showConversation) && selectedConversation && (
          <ConversationView 
            conversation={selectedConversation} 
            onBackClick={handleBackClick}
            className={isMobile ? "w-full" : "w-2/3 flex-shrink-0"}
          />
        )}
        
        {!selectedConversation && !isMobile && (
          <div className="flex-1 flex items-center justify-center bg-secondary/30">
            <div className="text-center max-w-md p-8 glassmorphism rounded-xl animate-fade-up">
              <h2 className="text-2xl font-medium mb-2">Atendimento Multicanal</h2>
              <p className="text-muted-foreground mb-6">
                Selecione uma conversa para iniciar o atendimento.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 flex items-center justify-center bg-channel-whatsapp/10 text-channel-whatsapp rounded-full mb-2">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 flex items-center justify-center bg-channel-instagram/10 text-channel-instagram rounded-full mb-2">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 flex items-center justify-center bg-channel-facebook/10 text-channel-facebook rounded-full mb-2">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 flex items-center justify-center bg-channel-email/10 text-channel-email rounded-full mb-2">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Email</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate("/agendamentos")}
                className="w-full mt-4"
                variant="default"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Agendar Consulta
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Todos os seus canais de comunicação em um só lugar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;

import { MessageSquare, Mail, Facebook, Instagram } from "lucide-react";
