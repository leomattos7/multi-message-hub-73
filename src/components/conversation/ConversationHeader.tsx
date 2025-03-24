
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { ChannelBadge } from "@/components/ChannelBadge";

interface ConversationHeaderProps {
  patientName: string;
  patientAvatar?: string;
  channel: string;
  onBackClick?: () => void;
  isMobile: boolean;
}

export function ConversationHeader({
  patientName,
  patientAvatar,
  channel,
  onBackClick,
  isMobile
}: ConversationHeaderProps) {
  const channelLabel = {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    email: "Email",
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-1">
            <ChevronLeft />
          </Button>
        )}
        
        <Avatar 
          src={patientAvatar} 
          name={patientName}
          showStatus
          status="online"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h2 className="font-medium truncate">{patientName}</h2>
            <ChannelBadge 
              channel={channel as any} 
              size="sm" 
              className="ml-2 flex-shrink-0"
            />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            via {channelLabel[channel as keyof typeof channelLabel]}
          </p>
        </div>
      </div>
    </div>
  );
}
