
import { 
  MessageSquare, 
  Mail, 
  Facebook, 
  Instagram 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChannelType } from "@/data/mockData";

interface ChannelBadgeProps {
  channel: ChannelType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ChannelBadge({ 
  channel, 
  size = "md", 
  showLabel = false,
  className
}: ChannelBadgeProps) {
  const channelConfig = {
    whatsapp: {
      icon: MessageSquare,
      label: "WhatsApp",
      color: "bg-channel-whatsapp/10 text-channel-whatsapp border border-channel-whatsapp/20",
    },
    instagram: {
      icon: Instagram,
      label: "Instagram",
      color: "bg-channel-instagram/10 text-channel-instagram border border-channel-instagram/20",
    },
    facebook: {
      icon: Facebook,
      label: "Facebook",
      color: "bg-channel-facebook/10 text-channel-facebook border border-channel-facebook/20",
    },
    email: {
      icon: Mail,
      label: "Email",
      color: "bg-channel-email/10 text-channel-email border border-channel-email/20",
    },
  };

  const config = channelConfig[channel];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <span className={cn("channel-pill", config.color, className)}>
      <Icon className={sizeClasses[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
