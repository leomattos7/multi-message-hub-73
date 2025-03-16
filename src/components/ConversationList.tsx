
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";
import { 
  Conversation, 
  ChannelType, 
  sortedConversations, 
  filterByChannel,
  searchConversations 
} from "@/data/mockData";

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
  const [activeFilter, setActiveFilter] = useState<ChannelType | "all">("all");

  useEffect(() => {
    let filtered = sortedConversations();
    
    if (searchQuery) {
      filtered = searchConversations(searchQuery);
    } else if (activeFilter !== "all") {
      filtered = filterByChannel(activeFilter);
    }
    
    setConversations(filtered);
  }, [searchQuery, activeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (channel: ChannelType | "all") => {
    setActiveFilter(channel);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  const getLastMessage = (conv: Conversation) => {
    return conv.messages[conv.messages.length - 1];
  };

  return (
    <div className={cn("flex flex-col h-full border-r border-border", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 bg-secondary/50"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                Todos os canais
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("whatsapp")}>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("instagram")}>
                Instagram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("facebook")}>
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("email")}>
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {activeFilter !== "all" && (
          <div className="mt-2 flex">
            <Badge 
              variant="outline" 
              className="flex gap-1 items-center"
              onClick={() => handleFilterChange("all")}
            >
              {activeFilter === "whatsapp" && "WhatsApp"}
              {activeFilter === "instagram" && "Instagram"}
              {activeFilter === "facebook" && "Facebook"}
              {activeFilter === "email" && "Email"}
              <X className="h-3 w-3" />
            </Badge>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <SearchX className="h-12 w-12 mb-2 opacity-20" />
            <p>Nenhuma conversa encontrada</p>
            <p className="text-sm">Tente outro termo de busca ou filtro</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {conversations.map((conversation) => {
              const lastMessage = getLastMessage(conversation);
              const isSelected = selectedConversationId === conversation.id;
              
              return (
                <li 
                  key={conversation.id} 
                  className={cn(
                    "p-4 hover:bg-secondary/50 cursor-pointer transition-colors",
                    isSelected && "bg-secondary"
                  )}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex gap-3">
                    <Avatar 
                      src={conversation.contact.avatar} 
                      name={conversation.contact.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.contact.name}</h3>
                        <div className="flex items-center gap-1">
                          <ChannelBadge channel={conversation.channel} size="sm" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(conversation.lastActivity)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {lastMessage.isOutgoing && "Você: "}
                        {lastMessage.content}
                      </p>
                      {conversation.unread > 0 && (
                        <div className="mt-1 flex justify-between items-center">
                          <Badge variant="default" className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                            {conversation.unread} nova{conversation.unread > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

import { X, SearchX } from "lucide-react";
