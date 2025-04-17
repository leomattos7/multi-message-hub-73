import { Message } from "@/types/conversation";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  // Sort messages by timestamp in ascending order
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = new Date(a.timestamp || "").getTime();
    const timeB = new Date(b.timestamp || "").getTime();
    return timeA - timeB;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {sortedMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.is_outgoing === "true" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[70%] rounded-lg px-4 py-2",
              message.is_outgoing === "true"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp || "").toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 