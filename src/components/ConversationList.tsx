
import { useState, useEffect } from "react";
import { Search, Filter, Archive, Inbox as InboxIcon, MoreVertical, UserPlus } from "lucide-react";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelType, sortedConversations, filterByChannel, searchConversations } from "@/data/mockData";
import { conversationService, supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ConversationListProps {
  onSelectConversation: (conversation: any) => void;
  selectedConversationId?: string;
  className?: string;
}

export function ConversationList({ 
  onSelectConversation, 
  selectedConversationId,
  className 
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">("all");
  const [activeTab, setActiveTab] = useState<"inbox" | "archived">("inbox");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [], isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationService.getConversations(),
  });

  // Archive/unarchive mutation
  const archiveMutation = useMutation({
    mutationFn: async ({ id, archive }: { id: string; archive: boolean }) => {
      if (archive) {
        return conversationService.archiveConversation(id);
      } else {
        return conversationService.unarchiveConversation(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        description: "Conversation updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating conversation:', error);
      toast({
        variant: "destructive",
        description: "Failed to update conversation",
      });
    }
  });

  // Add to patients mutation
  const addToPatientsMutation = useMutation({
    mutationFn: (conversation: any) => conversationService.addPatientFromConversation(conversation),
    onSuccess: () => {
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

  const handleArchive = (id: string, archive: boolean) => {
    archiveMutation.mutate({ id, archive });
  };

  const handleAddToPatients = (conversation: any) => {
    addToPatientsMutation.mutate(conversation);
  };

  // Filter conversations based on search, channel filter, and active tab
  const filteredConversations = conversations.filter(conversation => {
    // First filter by tab (archived status)
    if ((activeTab === "archived") !== (conversation.is_archived || false)) {
      return false;
    }
    
    // Then filter by channel if needed
    if (channelFilter !== "all" && conversation.channel !== channelFilter) {
      return false;
    }
    
    // Then filter by search query if present
    if (searchQuery && !conversation.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
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
  const getPreviewMessage = (conversation: any) => {
    // For now, using a placeholder. In a real implementation, you'd fetch the last message
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
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "inbox" | "archived")} className="w-full">
        <div className="p-4 border-b border-border">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="inbox" className="flex-1">
              <InboxIcon className="w-4 h-4 mr-2" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">
              <Archive className="w-4 h-4 mr-2" />
              Archived
            </TabsTrigger>
          </TabsList>
          
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

        <TabsContent value="inbox" className="flex-1 overflow-y-auto m-0 p-0">
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
              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "p-3 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors",
                    isSelected && "bg-secondary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div onClick={() => onSelectConversation(conversation)} className="flex-grow flex items-start gap-3">
                      <Avatar
                        src={conversation.patient?.avatar_url}
                        name={conversation.patient?.name || "Unknown"}
                        showStatus
                        status={conversation.unread > 0 ? "online" : "offline"}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">
                            {conversation.patient?.name || "Unknown"}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <ChannelBadge channel={conversation.channel} size="sm" />
                            <span className="text-xs text-muted-foreground">
                              {formatLastActivity(conversation.last_activity)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {getPreviewMessage(conversation)}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddToPatients(conversation)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add to Patients
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Archive Conversation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to archive this conversation? It will be moved to the archived tab.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleArchive(conversation.id, true)}>
                                Archive
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="archived" className="flex-1 overflow-y-auto m-0 p-0">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Archive className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No archived conversations</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Try another search term" : "Your archived folder is empty"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;
              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "p-3 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors",
                    isSelected && "bg-secondary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div onClick={() => onSelectConversation(conversation)} className="flex-grow flex items-start gap-3">
                      <Avatar
                        src={conversation.patient?.avatar_url}
                        name={conversation.patient?.name || "Unknown"}
                        showStatus
                        status="offline"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">
                            {conversation.patient?.name || "Unknown"}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <ChannelBadge channel={conversation.channel} size="sm" />
                            <span className="text-xs text-muted-foreground">
                              {formatLastActivity(conversation.last_activity)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {getPreviewMessage(conversation)}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleArchive(conversation.id, false)}
                    >
                      <InboxIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
