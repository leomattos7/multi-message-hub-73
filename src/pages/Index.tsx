
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ConversationView } from "@/components/ConversationView";
import { Conversation, mockConversations } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const isMobile = useIsMobile();

  // Select first conversation by default on desktop
  useEffect(() => {
    if (!isMobile && mockConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(mockConversations[0]);
    }
  }, [isMobile, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowConversation(true);
    }
  };

  const handleBackClick = () => {
    if (isMobile) {
      setShowConversation(false);
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
              <p className="text-sm text-muted-foreground">
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
