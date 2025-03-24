
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PatientSearchBar: React.FC<PatientSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="mb-6 flex">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar pacientes por nome, email ou telefone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
