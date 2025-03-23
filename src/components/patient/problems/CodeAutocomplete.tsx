
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";

interface CodeAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const CodeAutocomplete = ({
  placeholder,
  value = "", // Ensure value is never undefined
  onChange,
}: CodeAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};
