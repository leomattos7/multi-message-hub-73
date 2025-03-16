
import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Plus, Calendar, UserCog } from "lucide-react";
import { ConversationList } from "@/components/ConversationList";
import { ConversationView } from "@/components/ConversationView";
import { Sidebar } from "@/components/Sidebar";
import { mockConversations } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Index() {
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(!isMobile);

  const selectedConversation = selectedConversationId 
    ? mockConversations.find(c => c.id === selectedConversationId) || null
    : null;

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setShowConversation(true);
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex overflow-hidden">
        {(!isMobile || !showConversation) && (
          <div className="w-full md:w-80 border-r flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Mensagens</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to="/agendamentos">
                    <Calendar className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link to="/secretaria">
                    <UserCog className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ConversationList 
              conversations={mockConversations} 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
            />
          </div>
        )}
        
        {(!isMobile || showConversation) && (
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <ConversationView 
                conversation={selectedConversation}
                onBack={isMobile ? handleBackToList : undefined}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">Nenhuma conversa selecionada</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Selecione uma conversa da lista para ver as mensagens ou inicie uma nova conversa.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
