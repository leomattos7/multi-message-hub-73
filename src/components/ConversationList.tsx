import { useState, useEffect } from "react";
import { Search, Filter, Inbox as InboxIcon, Tags, SlidersHorizontal, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
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
import { apiService } from "@/services/api-service";
import { Conversation } from "@/types/conversation";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId: string | null;
  className?: string;
  useMockData?: boolean;
}

// Define conversation status types
type ConversationStatus = 'all' | 'unread' | 'read' | 'recent' | 'archived' | 'intervention';

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
  requiresHumanIntervention?: boolean;
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
  const { data: conversations = [], isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      const user = JSON.parse(userStr);
      
      // Fetch conversations
      const conversationsResponse = await apiService.get<Conversation[]>('/conversations', user.id);
      
      // Fetch messages for each conversation
      const conversationsWithMessages = await Promise.all(
        conversationsResponse.map(async (conversation) => {
          const messagesResponse = await apiService.get<Message[]>(`/messages?conversation_id=${conversation.id}`, user.id);

          return {
            ...conversation,
            messages: messagesResponse || [],
            channel: 'whatsapp',
            unread: 0,
            last_activity: new Date().toISOString(),
            patient: {
              id: conversation.patient_id,
              name: conversation.name,
              phone: conversation.phone,
              avatar_url: undefined
            }
          };
        })
      );

      return conversationsWithMessages;
    }
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
      
      // Check for conversations requiring human intervention
      if (statusFilter === "intervention" && !conversation.requiresHumanIntervention) {
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
    return (
      <div className={cn("flex-1 overflow-y-auto p-4", className)}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex-1 overflow-y-auto p-4", className)}>
        <div className="text-center text-red-500">
          Erro ao carregar conversas
        </div>
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className={cn("flex-1 overflow-y-auto p-4", className)}>
        <div className="text-center text-gray-500">
          Nenhuma conversa encontrada
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      <div className="divide-y">
        {filteredConversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            onClick={() => onSelectConversation(conversation as Conversation)}
          />
        ))}
      </div>
    </div>
  );
}
