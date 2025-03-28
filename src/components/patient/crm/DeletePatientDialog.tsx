
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeletePatientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
  isProcessing?: boolean;
}

export const DeletePatientDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  isProcessing = false
}: DeletePatientDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este contato? Essa ação não pode ser desfeita 
            e removerá todas as consultas e mensagens associadas a este contato.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={onDelete} 
            disabled={isProcessing}
          >
            {isProcessing ? "Excluindo..." : "Excluir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
