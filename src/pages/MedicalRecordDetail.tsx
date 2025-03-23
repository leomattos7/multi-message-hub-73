
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, X, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedicalRecord } from "@/hooks/use-medical-record";
import { PatientInfoCard } from "@/components/medical-record/PatientInfoCard";
import { PatientInfoHoverCard } from "@/components/medical-record/PatientInfoHoverCard";
import { RecordContentCard } from "@/components/medical-record/RecordContentCard";
import { DeleteRecordDialog } from "@/components/medical-record/DeleteRecordDialog";

export default function MedicalRecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Add useNavigate hook
  const {
    record,
    isLoading,
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    summaryItems,
    handleDragEnd,
    handleBackNavigation,
    handleSave,
    handleDelete,
  } = useMedicalRecord(id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <p>Carregando prontuário...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/prontuarios")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">Prontuário não encontrado</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBackNavigation} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          {/* Título com nome do paciente e ícone de informações */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-2">{record.patient?.name}</h1>
            <PatientInfoHoverCard patient={record.patient} />
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => {
                setIsEditing(false);
                setEditedContent(record.content);
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              
              <DeleteRecordDialog 
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PatientInfoCard 
            record={record} 
            summaryItems={summaryItems}
            onDragEnd={handleDragEnd}
          />
        </div>
        
        <div className="md:col-span-2">
          <RecordContentCard 
            content={record.content}
            isEditing={isEditing}
            editedContent={editedContent}
            onContentChange={setEditedContent}
          />
        </div>
      </div>
    </div>
  );
}
