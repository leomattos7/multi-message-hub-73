
import { useState, useEffect } from "react";
import { Search, Filter, Inbox as InboxIcon, Tags } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar } from "./Avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChannelBadge } from "./ChannelBadge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelType, sortedConversations, filterByChannel, searchConversations, mockConversations } from "@/data/mockData";
import { conversationService, supabase, tagService } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TagManager } from "./TagManager";
import { ConversationTagSelector } from "./ConversationTagSelector";
import { Tag } from "./Tag";

interface ConversationListProps {
  onSelectConversation: (conversation: any) => void;
  selectedConversationId?: string | null;
  className?: string;
  useMockData?: boolean;
}

// Define a unified conversation type for both mock and real data
type UnifiedConversation = {
  id: string;
  channel: string;
  unread?: number;
  lastActivity?: Date;
  last_activity?: string;
  contact?: {
    id: string;
    name: string;
    avatar?: string;
  };
  patient?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  };
  messages?: any[];
  patient_id?: string;
  tags?: any[];
};

export function ConversationList({ 
  onSelectConversation, 
  selectedConversationId,
  className,
  useMockData = false
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all available tags
  const { data: allTags = [] } = useQuery({
    queryKey: ['conversation-tags'],
    queryFn: tagService.getTags,
    enabled: !useMockData
  });

  // Use mock data if indicated, otherwise fetch from Supabase
  const { data: conversations = [], isLoading, error } = useMockData 
    ? { data: mockConversations as UnifiedConversation[], isLoading: false, error: null }
    : useQuery({
        queryKey: ['conversations'],
        queryFn: () => conversationService.getConversations(),
      });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChannel = (channel: ChannelType | "all") => {
    setChannelFilter(channel);
  };

  const handleFilterTag = (tagId: string | null) => {
    setTagFilter(tagId);
  };

  // Function to safely cast channel string to ChannelType
  const getChannelType = (channelString: string): ChannelType => {
    const validChannels: ChannelType[] = ['whatsapp', 'instagram', 'facebook', 'email'];
    return validChannels.includes(channelString as ChannelType) 
      ? channelString as ChannelType 
      : 'whatsapp'; // Default fallback
  };

  // Filter conversations based on search, channel filter, and tag filter
  const filteredConversations = (conversations as UnifiedConversation[]).filter(conversation => {
    // Filter by channel if needed
    if (channelFilter !== "all" && conversation.channel !== channelFilter) {
      return false;
    }
    
    // Filter by tag if selected
    if (tagFilter !== null) {
      const conversationTags = conversation.tags || [];
      if (!conversationTags.some(tag => tag.id === tagFilter)) {
        return false;
      }
    }
    
    // Filter by search query if present
    const name = useMockData 
      ? conversation.contact?.name
      : conversation.patient?.name;

    if (searchQuery && name && !name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const formatLastActivity = (date: string | Date) => {
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

  // Get preview message from the last message in conversation
  const getPreviewMessage = (conversation: UnifiedConversation) => {
    if (conversation.messages && conversation.messages.length > 0) {
      // Get the last message content
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '');
    }
    // Fallback
    return "Click to view conversation...";
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading conversations...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full">Error loading conversations</div>;
  }

  return (
    <div className={cn("flex flex-col h-full border-r border-border overflow-hidden", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
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
        
        {!useMockData && (
          <div className="flex justify-between items-center mb-3">
            <div className="flex overflow-x-auto gap-1 py-1 flex-1">
              {tagFilter !== null && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => handleFilterTag(null)}
                >
                  Limpar filtro
                </Button>
              )}
              
              {allTags.map((tag: any) => (
                <button
                  key={tag.id}
                  onClick={() => handleFilterTag(tag.id === tagFilter ? null : tag.id)}
                  className={cn(
                    "rounded-full px-2 py-1 text-xs transition-colors",
                    tagFilter === tag.id ? "opacity-100" : "opacity-70 hover:opacity-100"
                  )}
                  style={{ 
                    backgroundColor: tagFilter === tag.id ? `${tag.color}33` : 'transparent',
                    borderColor: tagFilter === tag.id ? `${tag.color}66` : 'transparent',
                    color: tag.color
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            
            <TagManager />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <InboxIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No conversations found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Try another search term" : "Your inbox is empty"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;
            
            // Get name and avatar based on the data source
            const name = useMockData 
              ? conversation.contact?.name 
              : conversation.patient?.name || "Unknown";
              
            const avatar = useMockData 
              ? conversation.contact?.avatar 
              : conversation.patient?.avatar_url;
              
            const unread = conversation.unread || 0;
            
            // For channel badge, ensure we have a valid ChannelType
            const channelType = getChannelType(conversation.channel);
            
            // Get the last activity time from either source
            const lastActivityTime = useMockData
              ? conversation.lastActivity
              : conversation.last_activity;
            
            // Get tags for this conversation
            const conversationTags = conversation.tags || [];
            
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
                    src={avatar}
                    name={name}
                    showStatus
                    status={unread > 0 ? "online" : "offline"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {name}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <ChannelBadge channel={channelType} size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {lastActivityTime && formatLastActivity(lastActivityTime)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {getPreviewMessage(conversation)}
                    </p>
                    
                    {!useMockData && conversationTags.length > 0 && (
                      <div className="flex flex-wrap mt-1 gap-1">
                        {conversationTags.map((tag: any) => (
                          <Tag 
                            key={tag.id}
                            id={tag.id}
                            name={tag.name}
                            color={tag.color}
                            size="sm"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
