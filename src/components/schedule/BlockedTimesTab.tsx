
import React from "react";
import { DateTimeBlockSelector, TimeBlock } from "@/components/DateTimeBlockSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlockedTimesTabProps {
  blockedTimes: TimeBlock[];
  setBlockedTimes: React.Dispatch<React.SetStateAction<TimeBlock[]>>;
  doctorId: string;
}

const BlockedTimesTab: React.FC<BlockedTimesTabProps> = ({
  blockedTimes,
  setBlockedTimes,
  doctorId
}) => {
  const handleBlocksChange = async (blocks: TimeBlock[]) => {
    setBlockedTimes(blocks);
    
    try {
      const { data: existingBlocks, error: fetchError } = await supabase
        .from('calendar_events')
        .select('id')
        .eq('doctor_id', doctorId)
        .eq('event_type', 'block');
        
      if (fetchError) {
        console.error("Error fetching existing blocks:", fetchError);
        toast.error("Erro ao sincronizar bloqueios");
        return;
      }
      
      const currentBlockIds = blocks.map(block => block.id).filter(Boolean) as string[];
      const blocksToDelete = existingBlocks
        .filter(block => !currentBlockIds.includes(block.id))
        .map(block => block.id);
        
      if (blocksToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('calendar_events')
          .delete()
          .in('id', blocksToDelete);
          
        if (deleteError) {
          console.error("Error deleting blocks:", deleteError);
        }
      }
      
      const blocksToUpsert = blocks.map(block => ({
        id: block.id,
        doctor_id: doctorId,
        date: block.date.toISOString().split('T')[0],
        start_time: block.startTime,
        end_time: block.endTime,
        event_type: 'block',
        title: 'Agenda bloqueada',
        description: 'Período indisponível para agendamentos'
      }));
      
      if (blocksToUpsert.length > 0) {
        const { error: upsertError } = await supabase
          .from('calendar_events')
          .upsert(blocksToUpsert);
          
        if (upsertError) {
          console.error("Error upserting blocks:", upsertError);
          toast.error("Erro ao salvar bloqueios");
          return;
        }
      }
      
      toast.success("Bloqueios de agenda atualizados com sucesso");
    } catch (error) {
      console.error("Error updating blocks:", error);
      toast.error("Erro ao atualizar bloqueios");
    }
  };

  return (
    <DateTimeBlockSelector 
      blocks={blockedTimes}
      onChange={handleBlocksChange}
      mode="block"
    />
  );
};

export default BlockedTimesTab;
