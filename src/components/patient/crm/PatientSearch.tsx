
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface PatientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onFilterClick: () => void;
}

export const PatientSearch = ({
  searchTerm,
  onSearchChange,
  hasActiveFilters,
  onFilterClick
}: PatientSearchProps) => {
  return (
    <div className="p-4 border-b bg-white">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar contatos por nome, email ou telefone"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button 
          variant="outline"
          onClick={onFilterClick}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros {hasActiveFilters && 
            <span className="ml-1 bg-blue-500 text-white rounded-full w-2 h-2" />}
        </Button>
      </div>
    </div>
  );
};
