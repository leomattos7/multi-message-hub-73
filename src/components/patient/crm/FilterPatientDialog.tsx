
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactFilters } from "@/components/ContactFilters";
import { PatientFilters } from "@/components/ContactFilters";

interface FilterPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  onResetFilters: () => void;
}

export const FilterPatientDialog = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  onResetFilters
}: FilterPatientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar Contatos</DialogTitle>
          <DialogDescription>
            Defina os critérios para filtrar a lista de contatos.
          </DialogDescription>
        </DialogHeader>
        
        <ContactFilters 
          open={isOpen}
          onOpenChange={onOpenChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onApplyFilters={() => onOpenChange(false)}
          onResetFilters={onResetFilters}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onResetFilters}>Limpar Filtros</Button>
          <Button onClick={() => onOpenChange(false)}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
