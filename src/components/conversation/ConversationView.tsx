
import React from "react";
import { cn } from "@/lib/utils";
import { MessageInput } from "../MessageInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationHeader } from "./ConversationHeader";
import { MessageList } from "./MessageList";
import { TagDialog } from "./TagDialog";
import { useConversation } from "./useConversation";

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
  const isMobile = useIsMobile();
  
  const {
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
  } = useConversation(initialConversation, useMockData);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading conversation...</div>;
  }

  if (error || !conversation) {
    return <div className="flex items-center justify-center h-full">Error loading conversation</div>;
  }
  
  const patientName = useMockData ? conversation.contact.name : (conversation.patient?.name || "Unknown");
  const patientAvatar = useMockData ? conversation.contact.avatar : conversation.patient?.avatar_url;
  const channel = useMockData ? conversation.channel : conversation.channel;

  const handleTagClick = () => {
    setTagDialogOpen(true);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background overflow-hidden", 
      isMobile && "fixed inset-0 z-50",
      className
    )}>
      <ConversationHeader
        patientName={patientName}
        patientAvatar={patientAvatar}
        channel={channel}
        onBackClick={onBackClick}
        isMobile={isMobile}
      />
      
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
        <MessageList
          messages={messages}
          useMockData={useMockData}
          conversation={conversation}
          formatMessageTime={formatMessageTime}
          formatMessageDate={formatMessageDate}
          renderMessageStatus={renderMessageStatus}
          shouldRenderDate={shouldRenderDate}
        />
      </div>
      
      {!useMockData && (
        <TagDialog
          open={tagDialogOpen}
          onOpenChange={setTagDialogOpen}
          conversationId={conversation.id}
          tags={conversation.tags || []}
        />
      )}
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        channel={channel}
        disabled={sendMessageMutation.isPending}
        onTagClick={handleTagClick}
        showTagButton={!useMockData}
        aiEnabled={aiEnabled}
        onAiToggle={handleAiToggle}
      />
    </div>
  );
}
