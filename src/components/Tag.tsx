
import { cn } from "@/lib/utils";
import { Tag as TagType } from "@/data/tagsData";

interface TagProps {
  tag: TagType;
  className?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}

export function Tag({ tag, className, size = "md", onClick }: TagProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tag.color, 
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {tag.name}
    </div>
  );
}
