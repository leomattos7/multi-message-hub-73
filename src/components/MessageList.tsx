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

  // Function to format date for the separator
  const formatDateSeparator = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  // Function to check if we should show date separator
  const shouldShowDateSeparator = (currentIndex: number) => {
    if (currentIndex === 0) return true;

    const currentDate = new Date(sortedMessages[currentIndex].timestamp || "");
    const previousDate = new Date(sortedMessages[currentIndex - 1].timestamp || "");

    return currentDate.toDateString() !== previousDate.toDateString();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {sortedMessages.map((message, index) => (
        <div key={message.id} className="flex flex-col">
          {shouldShowDateSeparator(index) && (
            <div className="flex justify-center my-4">
              <div className="bg-secondary/50 text-secondary-foreground text-xs font-medium py-1.5 px-3 rounded-full">
                {formatDateSeparator(new Date(message.timestamp || ""))}
              </div>
            </div>
          )}
          <div
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
                {new Date(message.timestamp || "").toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 