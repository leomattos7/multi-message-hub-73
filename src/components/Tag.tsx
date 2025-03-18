
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagProps {
  id: string;
  name: string;
  color: string;
  onRemove?: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Tag({ id, name, color, onRemove, className, size = 'md' }: TagProps) {
  // Adjust opacity for the background color (20% opacity)
  const bgColor = `${color}33`;
  // Text color (full opacity)
  const textColor = color; 
  // Border color (40% opacity)
  const borderColor = `${color}66`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 max-w-[150px]",
        size === 'sm' ? "py-0 text-xs" : "py-0.5 text-sm",
        className
      )}
      style={{ 
        backgroundColor: bgColor, 
        borderColor: borderColor,
        color: textColor
      }}
    >
      <span className="truncate">{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="ml-1 flex-shrink-0 rounded-full hover:bg-background/20 p-0.5"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  );
}
