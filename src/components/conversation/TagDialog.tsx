
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConversationTagSelector } from "@/components/ConversationTagSelector";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  tags: any[];
}

export function TagDialog({ open, onOpenChange, conversationId, tags }: TagDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar tags</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <ConversationTagSelector 
            conversationId={conversationId} 
            initialTags={tags}
            inDialog={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
