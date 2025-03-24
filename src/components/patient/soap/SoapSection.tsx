
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface SoapSectionProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export const SoapSection: React.FC<SoapSectionProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[80px]"
      />
    </div>
  );
};
