
import { useState } from "react";
import { MessageCircle, Inbox, Share2 } from "lucide-react";
import { ConversationList } from "@/components/ConversationList";
import { ConversationView } from "@/components/ConversationView";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockConversations } from "@/data/mockData";
import { SocialConnectionsDialog } from "@/components/SocialConnectionsDialog";
import { Button } from "@/components/ui/button";

export default function Index() {
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(!isMobile);
  const [useMockData, setUseMockData] = useState(true); // Enable mock data by default
  const [showConnectionsDialog, setShowConnectionsDialog] = useState(false);

  // Get conversations from localStorage or use mock data
  const conversations = useMockData 
    ? mockConversations 
    : JSON.parse(localStorage.getItem("conversations") || "[]");
    
  const isLoading = false;
  const error = null;

  const selectedConversation = selectedConversationId 
    ? conversations.find((c: any) => c.id === selectedConversationId) || null
    : null;

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversationId(conversation.id);
    setShowConversation(true);
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  const toggleMockData = () => {
    setUseMockData(!useMockData);
    // Reset selection when toggling data source
    setSelectedConversationId(null);
  };

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Loading conversations...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center">Error loading conversations</div>;
  }

  // Count of conversations requiring human intervention
  const interventionCount = conversations.filter((c: any) => c.requiresHumanIntervention).length;

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
                <button 
                  onClick={toggleMockData} 
                  className="text-xs bg-secondary px-2 py-1 rounded"
                >
                  {useMockData ? "Usar dados reais" : "Usar dados de exemplo"}
                </button>
              </div>
            </div>
            <ConversationList 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
              className="flex-1"
              useMockData={useMockData}
            />
          </div>
        )}
        
        {(!isMobile || showConversation) && (
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <ConversationView 
                conversation={selectedConversation}
                onBackClick={isMobile ? handleBackToList : undefined}
                useMockData={useMockData}
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
