import { cn } from "@/lib/utils";
import { Conversation } from "@/types/conversation";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";
import { AlertCircle } from "lucide-react";

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationListItem({
  conversation,
  isSelected,
  onClick
}: ConversationListItemProps) {
  const lastMessage = conversation.messages?.[conversation.messages.length - 1];
  const previewMessage = lastMessage 
    ? lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '')
    : "Click to view conversation...";

  const formatLastActivity = (date: string) => {
    const activityDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
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
                {conversation.last_activity && formatLastActivity(conversation.last_activity)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {previewMessage}
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