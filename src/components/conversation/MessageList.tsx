
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ConversationTagSelector } from "@/components/ConversationTagSelector";

interface MessageListProps {
  messages: any[];
  useMockData: boolean;
  conversation: any;
  formatMessageTime: (date: string | Date) => string;
  formatMessageDate: (date: string | Date) => string;
  renderMessageStatus: (message: any) => React.ReactNode;
  shouldRenderDate: (index: number, messages: any[]) => boolean;
}

export function MessageList({
  messages,
  useMockData,
  conversation,
  formatMessageTime,
  formatMessageDate,
  renderMessageStatus,
  shouldRenderDate
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {!useMockData && conversation.tags && conversation.tags.length > 0 && (
        <div className="mb-2">
          <ConversationTagSelector 
            conversationId={conversation.id} 
            initialTags={conversation.tags} 
          />
        </div>
      )}
      
      {messages.map((message: any, index: number) => (
        <div key={message.id} className="flex flex-col">
          {shouldRenderDate(index, messages) && (
            <div className="flex justify-center my-4">
              <div className="bg-secondary/80 text-secondary-foreground text-xs font-medium py-1 px-3 rounded-full">
                {formatMessageDate(message.timestamp)}
              </div>
            </div>
          )}
          
          <div className={cn(
            "flex flex-col",
            (useMockData ? message.isOutgoing : message.is_outgoing) ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg",
              (useMockData ? message.isOutgoing : message.is_outgoing) 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "bg-muted rounded-bl-none"
            )}>
              {message.content}
            </div>
            
            <div className="flex items-center mt-1 text-xs">
              <span className="text-muted-foreground mr-1">
                {formatMessageTime(message.timestamp)}
              </span>
              {renderMessageStatus(message)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
