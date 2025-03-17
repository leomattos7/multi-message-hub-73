
import { useState, useEffect } from "react";
import { Search, Filter, Inbox as InboxIcon, UserPlus } from "lucide-react";
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
import { conversationService, supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
};

export function ConversationList({ 
  onSelectConversation, 
  selectedConversationId,
  className,
  useMockData = false
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use mock data if indicated, otherwise fetch from Supabase
  const { data: conversations = [], isLoading, error } = useMockData 
    ? { data: mockConversations as UnifiedConversation[], isLoading: false, error: null }
    : useQuery({
        queryKey: ['conversations'],
        queryFn: () => conversationService.getConversations(),
      });

  // Mutation for adding to patients
  const addToPatientsMutation = useMutation({
    mutationFn: (conversation: UnifiedConversation) => {
      if (useMockData) {
        // Just return a mock success response
        return Promise.resolve({ success: true });
      }
      return conversationService.addPatientFromConversation(conversation).then(result => {
        return { success: true };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        description: "Contact added to patients successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding contact to patients:', error);
      toast({
        variant: "destructive",
        description: "Failed to add contact to patients",
      });
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChannel = (channel: ChannelType | "all") => {
    setChannelFilter(channel);
  };

  const handleAddToPatients = (conversation: UnifiedConversation) => {
    addToPatientsMutation.mutate(conversation);
  };

  // Function to safely cast channel string to ChannelType
  const getChannelType = (channelString: string): ChannelType => {
    const validChannels: ChannelType[] = ['whatsapp', 'instagram', 'facebook', 'email'];
    return validChannels.includes(channelString as ChannelType) 
      ? channelString as ChannelType 
      : 'whatsapp'; // Default fallback
  };

  // Filter conversations based on search, channel filter
  const filteredConversations = (conversations as UnifiedConversation[]).filter(conversation => {
    // Filter by channel if needed
    if (channelFilter !== "all" && conversation.channel !== channelFilter) {
      return false;
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
