
import { useState, useEffect } from "react";
import { Search, Filter, Inbox as InboxIcon, Tags, SlidersHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
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
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelType, sortedConversations, filterByChannel, searchConversations, mockConversations } from "@/data/mockData";
import { conversationService, supabase, tagService } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TagManager } from "./TagManager";
import { ConversationTagSelector } from "./ConversationTagSelector";
import { Tag } from "./Tag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ConversationListProps {
  onSelectConversation: (conversation: any) => void;
  selectedConversationId?: string | null;
  className?: string;
  useMockData?: boolean;
}

// Define conversation status types
type ConversationStatus = 'all' | 'unread' | 'read' | 'recent' | 'archived';

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
  is_archived?: boolean;
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
  const [statusFilter, setStatusFilter] = useState<ConversationStatus>("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    defaultValues: {
      search: "",
      channel: "all",
      status: "all",
      tag: null,
    }
  });

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
    setIsFilterMenuOpen(false);
  };

  const handleFilterStatus = (status: ConversationStatus) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const handleFilterTag = (tagId: string | null) => {
    setTagFilter(tagId);
    setIsFilterMenuOpen(false);
  };
  
  const clearAllFilters = () => {
    setSearchQuery("");
    setChannelFilter("all");
    setStatusFilter("all");
    setTagFilter(null);
    setIsFilterMenuOpen(false);
  };

  // Function to safely cast channel string to ChannelType
  const getChannelType = (channelString: string): ChannelType => {
    const validChannels: ChannelType[] = ['whatsapp', 'instagram', 'facebook', 'email'];
    return validChannels.includes(channelString as ChannelType) 
      ? channelString as ChannelType 
      : 'whatsapp'; // Default fallback
  };
  
  // Determine if a conversation is "recent" (less than 24 hours old)
  const isRecentConversation = (conversation: UnifiedConversation) => {
    const lastActivity = useMockData
      ? conversation.lastActivity
      : conversation.last_activity ? new Date(conversation.last_activity) : null;
      
    if (!lastActivity) return false;
    
    const now = new Date();
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  // Filter conversations based on search, channel filter, and tag filter
  const filteredConversations = (conversations as UnifiedConversation[]).filter(conversation => {
    // Filter by channel if needed
    if (channelFilter !== "all" && conversation.channel !== channelFilter) {
      return false;
    }
    
    // Filter by status if selected
    if (statusFilter !== "all") {
      // Check for unread status
      if (statusFilter === "unread" && (conversation.unread === 0 || conversation.unread === undefined)) {
        return false;
      }
      
      // Check for read status
      if (statusFilter === "read" && conversation.unread && conversation.unread > 0) {
        return false;
      }
      
      // Check for recent conversations (in the last 24 hours)
      if (statusFilter === "recent" && !isRecentConversation(conversation)) {
        return false;
      }
      
      // Check for archived conversations
      if (statusFilter === "archived" && !conversation.is_archived) {
        return false;
      }
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
  
  // Count how many filters are active
  const activeFiltersCount = [
    channelFilter !== "all", 
    statusFilter !== "all", 
    tagFilter !== null
  ].filter(Boolean).length;

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
          <DropdownMenu open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className={activeFiltersCount > 0 ? "bg-primary/10" : ""}>
                <SlidersHorizontal className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Filtros</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Status Filters */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2 pb-1">Status</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => handleFilterStatus("all")}
                  className={statusFilter === "all" ? "bg-accent" : ""}
                >
                  <span className="w-4 h-4 mr-2"></span>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterStatus("unread")}
                  className={statusFilter === "unread" ? "bg-accent" : ""}
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Não lidas
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterStatus("read")}
                  className={statusFilter === "read" ? "bg-accent" : ""}
                >
                  <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                  Lidas
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterStatus("recent")}
                  className={statusFilter === "recent" ? "bg-accent" : ""}
                >
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  Recentes (24h)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterStatus("archived")}
                  className={statusFilter === "archived" ? "bg-accent" : ""}
                >
                  <InboxIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Arquivadas
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Channel Filters */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2 pb-1">Canal</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => handleFilterChannel("all")}
                  className={channelFilter === "all" ? "bg-accent" : ""}
                >
                  <span className="w-4 h-4 mr-2"></span>
                  Todos os canais
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterChannel("whatsapp")}
                  className={channelFilter === "whatsapp" ? "bg-accent" : ""}
                >
                  <ChannelBadge channel="whatsapp" size="sm" className="mr-2" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterChannel("instagram")}
                  className={channelFilter === "instagram" ? "bg-accent" : ""}
                >
                  <ChannelBadge channel="instagram" size="sm" className="mr-2" />
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterChannel("facebook")}
                  className={channelFilter === "facebook" ? "bg-accent" : ""}
                >
                  <ChannelBadge channel="facebook" size="sm" className="mr-2" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleFilterChannel("email")}
                  className={channelFilter === "email" ? "bg-accent" : ""}
                >
                  <ChannelBadge channel="email" size="sm" className="mr-2" />
                  Email
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              {!useMockData && allTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  
                  {/* Tag Filters */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pt-2 pb-1">Etiquetas</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => handleFilterTag(null)}
                      className={tagFilter === null ? "bg-accent" : ""}
                    >
                      <span className="w-4 h-4 mr-2"></span>
                      Todas
                    </DropdownMenuItem>
                    
                    {allTags.map((tag: any) => (
                      <DropdownMenuItem 
                        key={tag.id}
                        onClick={() => handleFilterTag(tag.id)}
                        className={tagFilter === tag.id ? "bg-accent" : ""}
                      >
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        ></div>
                        {tag.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <Button 
                  onClick={clearAllFilters} 
                  variant="outline" 
                  className="w-full text-sm h-8"
                >
                  Limpar todos os filtros
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!useMockData && (
            <TagManager />
          )}
        </div>
        
        {/* Active filters display */}
        {(channelFilter !== "all" || statusFilter !== "all" || tagFilter !== null) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {channelFilter !== "all" && (
              <div className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1 flex items-center">
                <span>Canal: {channelFilter}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => setChannelFilter("all")}
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {statusFilter !== "all" && (
              <div className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1 flex items-center">
                <span>Status: {
                  statusFilter === "unread" ? "Não lidas" :
                  statusFilter === "read" ? "Lidas" :
                  statusFilter === "recent" ? "Recentes" :
                  statusFilter === "archived" ? "Arquivadas" : ""
                }</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => setStatusFilter("all")}
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {tagFilter !== null && (
              <div 
                className="text-xs rounded-full px-2 py-1 flex items-center"
                style={{ 
                  backgroundColor: `${allTags.find((t: any) => t.id === tagFilter)?.color}22`,
                  color: allTags.find((t: any) => t.id === tagFilter)?.color
                }}
              >
                <span>Tag: {allTags.find((t: any) => t.id === tagFilter)?.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => setTagFilter(null)}
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <InboxIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma conversa encontrada</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || channelFilter !== "all" || statusFilter !== "all" || tagFilter !== null
                ? "Tente remover alguns filtros"
                : "Sua caixa de entrada está vazia"}
            </p>
            {(searchQuery || channelFilter !== "all" || statusFilter !== "all" || tagFilter !== null) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={clearAllFilters}
              >
                Limpar filtros
              </Button>
            )}
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
