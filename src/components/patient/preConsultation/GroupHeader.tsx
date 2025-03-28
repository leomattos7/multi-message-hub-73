
import React from "react";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GroupHeaderProps {
  groupId: string;
  groupName: string;
  isEditing: boolean;
  editingName: string;
  onEditName: (id: string, name: string) => void;
  onSaveName: (id: string) => void;
  onCancelEdit: () => void;
  onEditingNameChange: (name: string) => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
  groupId,
  groupName,
  isEditing,
  editingName,
  onEditName,
  onSaveName,
  onCancelEdit,
  onEditingNameChange
}) => {
  return (
    <div className="flex justify-between items-center px-4">
      <AccordionTrigger className="py-3">
        {isEditing ? (
          <Input
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[300px]"
          />
        ) : (
          <span>{groupName}</span>
        )}
      </AccordionTrigger>
      <div className="flex space-x-1">
        {isEditing ? (
          <>
            <Button
              size="sm" 
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onSaveName(groupId);
              }}
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onCancelEdit();
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEditName(groupId, groupName);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
