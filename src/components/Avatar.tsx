
import { cn } from "@/lib/utils";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showStatus?: boolean;
  status?: "online" | "offline" | "away";
}

export function Avatar({ 
  src, 
  name, 
  size = "md", 
  className,
  showStatus = false,
  status = "offline" 
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  };

  return (
    <div className="relative">
      <ShadcnAvatar className={cn(sizeClasses[size], "border-2 border-background", className)}>
        <AvatarImage 
          src={src} 
          alt={name}
          className="object-cover transition-opacity duration-300"
          loading="lazy"
        />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {initials}
        </AvatarFallback>
      </ShadcnAvatar>
      
      {showStatus && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-background", 
            statusColors[status],
            size === "sm" ? "h-2 w-2" : "h-3 w-3"
          )} 
        />
      )}
    </div>
  );
}
