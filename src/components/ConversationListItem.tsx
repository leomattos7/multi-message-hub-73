import { cn } from "@/lib/utils";
import { Conversation, Message } from "@/types/conversation";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";
import { AlertCircle } from "lucide-react";

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

// Utility function to get the most recent message
export const getLastMessage = (messages: Message[] | undefined): Message | null => {
  if (!messages?.length) return null;
  
  return [...messages].sort((a, b) => {
    const timeA = new Date(a.timestamp || "").getTime();
    const timeB = new Date(b.timestamp || "").getTime();
    return timeB - timeA; // Sort in descending order (newest first)
  })[0];
};

export function ConversationListItem({
  conversation,
  isSelected,
  onClick
}: ConversationListItemProps) {
  const lastMessage = getLastMessage(conversation.messages);
  
  // Format the preview message with sender indicator
  const getPreviewMessage = () => {
    if (!lastMessage) return "Nenhuma mensagem";
    const prefix = lastMessage.is_outgoing === "true" ? "Você: " : `${conversation.patient?.name?.split(' ')[0] || 'Unknown'}: `;
    const content = lastMessage.content.substring(0, 40) + (lastMessage.content.length > 40 ? '...' : '');
    return prefix + content;
  };

  // Format the time for the last message
  const formatMessageTime = (date: string) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Ontem';
    }
    
    return messageDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div
      className={cn(
        "p-3 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors",
        isSelected && "bg-secondary",
        conversation.requiresHumanIntervention && "border-l-4 border-l-red-500"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar
          src={conversation.patient?.avatar_url}
          name={conversation.patient?.name || "Unknown"}
          showStatus
          status={conversation.unread > 0 ? "online" : "offline"}
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate flex items-center">
              {conversation.patient?.name || "Unknown"}
              {conversation.requiresHumanIntervention && (
                <AlertCircle className="h-4 w-4 text-red-500 ml-1 flex-shrink-0" />
              )}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ChannelBadge channel={conversation.channel} size="sm" />
              <span className="text-xs text-muted-foreground">
                {lastMessage?.timestamp && formatMessageTime(lastMessage.timestamp)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {getPreviewMessage()}
          </p>
          
          {conversation.requiresHumanIntervention && (
            <div className="mt-1">
              <span className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5 inline-flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Intervenção solicitada
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 