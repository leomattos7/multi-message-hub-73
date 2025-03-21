
import { useState } from "react";
import { MessageCircle, Inbox, AlertCircle } from "lucide-react";
import { ConversationList } from "@/components/ConversationList";
import { ConversationView } from "@/components/ConversationView";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockConversations } from "@/data/mockData";

export default function Index() {
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(!isMobile);

  // Use mock data instead of fetching from API
  const conversations = mockConversations;
  const isLoading = false;
  const error = null;

  const selectedConversation = selectedConversationId 
    ? conversations.find(c => c.id === selectedConversationId) || null
    : null;

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversationId(conversation.id);
    setShowConversation(true);
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Loading conversations...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center">Error loading conversations</div>;
  }

  // Count of conversations requiring human intervention
  const interventionCount = conversations.filter(c => c.requiresHumanIntervention).length;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || !showConversation) && (
          <div className="w-full md:w-1/3 border-r flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center">
                <Inbox className="mr-2 h-5 w-5" />
                Mensagens
                {interventionCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {interventionCount}
                  </span>
                )}
              </h2>
            </div>
            <ConversationList 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
              className="flex-1"
              useMockData={true}
            />
          </div>
        )}
        
        {(!isMobile || showConversation) && (
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <ConversationView 
                conversation={selectedConversation}
                onBackClick={isMobile ? handleBackToList : undefined}
                useMockData={true}
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
    </div>
  );
}
