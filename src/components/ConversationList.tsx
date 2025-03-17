
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Avatar } from "./Avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChannelBadge } from "./ChannelBadge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChannelType, Conversation, filterByChannel, searchConversations, sortedConversations } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
  className?: string;
}

export function ConversationList({ 
  onSelectConversation, 
  selectedConversationId,
  className 
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>(sortedConversations());
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">("all");

  useEffect(() => {
    if (searchQuery) {
      setConversations(searchConversations(searchQuery));
    } else if (channelFilter !== "all") {
      setConversations(filterByChannel(channelFilter));
    } else {
      setConversations(sortedConversations());
    }
  }, [searchQuery, channelFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChannel = (channel: ChannelType | "all") => {
    setChannelFilter(channel);
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  // Extract the first part of the first message for preview
  const getPreviewMessage = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return "";
    return lastMessage.content.length > 35 
      ? lastMessage.content.substring(0, 35) + "..."
      : lastMessage.content;
  };

  return (
    <div className={cn("flex flex-col h-full border-r border-border overflow-hidden", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar conversas..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterChannel("all")}>
                Todos os canais
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChannel("whatsapp")}>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChannel("instagram")}>
                Instagram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChannel("facebook")}>
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChannel("email")}>
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversationId;
          return (
            <div
              key={conversation.id}
              className={cn(
                "p-3 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors",
                isSelected && "bg-secondary"
              )}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar
                  src={conversation.contact.avatar}
                  name={conversation.contact.name}
                  showStatus
                  status={conversation.unread > 0 ? "online" : "offline"}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">
                      {conversation.contact.name}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <ChannelBadge channel={conversation.channel} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatLastActivity(conversation.lastActivity)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {getPreviewMessage(conversation)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
