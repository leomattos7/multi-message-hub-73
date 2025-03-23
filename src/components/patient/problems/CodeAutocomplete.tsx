
import React, { useState, useRef, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeOption } from "@/types/problem";

interface CodeAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: CodeOption[] | undefined;
}

export const CodeAutocomplete = ({
  placeholder,
  value = "", // Ensure value is never undefined
  onChange,
  options = [], // Provide a default empty array when options is undefined
}: CodeAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure options is always an array of valid CodeOption objects
  const safeOptions = Array.isArray(options) 
    ? options.filter(option => option && typeof option === 'object' && 'code' in option && 'description' in option)
    : [];

  // Filter options based on search query
  const filteredOptions = safeOptions
    .filter((option) =>
      option.code.toLowerCase().includes(search.toLowerCase()) ||
      option.description.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 results

  // Set search when value changes
  useEffect(() => {
    if (value !== undefined) {
      setSearch(value);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            ref={inputRef}
            value={value || ""}
            onChange={(e) => {
              onChange(e.target.value);
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }}
            placeholder={placeholder}
            className="w-full"
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandInput 
            placeholder="Pesquisar..." 
            value={search} 
            onValueChange={(value) => setSearch(value || "")}
            className="h-9"
          />
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.code}
                value={option.code}
                onSelect={(currentValue) => {
                  onChange(currentValue || "");
                  setOpen(false);
                }}
                className="flex items-center"
              >
                <span className="font-medium">{option.code}</span>
                <span className="ml-2 text-xs text-gray-500 truncate">
                  {option.description}
                </span>
                {value === option.code && (
                  <Check className="ml-auto h-4 w-4 text-green-500" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
