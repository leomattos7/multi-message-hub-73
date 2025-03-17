
export interface Tag {
  id: string;
  name: string;
  color: string;
  type: 'status' | 'topic';
}

// Status tags para indicar a situação do atendimento
export const statusTags: Tag[] = [
  { id: 'pending', name: 'Pendente', color: 'bg-amber-100 text-amber-800', type: 'status' },
  { id: 'scheduled', name: 'Agendado', color: 'bg-green-100 text-green-800', type: 'status' },
  { id: 'urgent', name: 'Urgente', color: 'bg-red-100 text-red-800', type: 'status' },
  { id: 'completed', name: 'Concluído', color: 'bg-blue-100 text-blue-800', type: 'status' },
  { id: 'follow-up', name: 'Retorno', color: 'bg-purple-100 text-purple-800', type: 'status' },
];

// Topic tags para categorizar o assunto da conversa
export const topicTags: Tag[] = [
  { id: 'appointment', name: 'Consulta', color: 'bg-indigo-100 text-indigo-800', type: 'topic' },
  { id: 'exam', name: 'Exame', color: 'bg-pink-100 text-pink-800', type: 'topic' },
  { id: 'payment', name: 'Pagamento', color: 'bg-emerald-100 text-emerald-800', type: 'topic' },
  { id: 'information', name: 'Informação', color: 'bg-amber-100 text-amber-800', type: 'topic' },
  { id: 'prescription', name: 'Receita', color: 'bg-cyan-100 text-cyan-800', type: 'topic' },
];

// Todos as tags disponíveis
export const allTags = [...statusTags, ...topicTags];

// Função para buscar uma tag pelo ID
export const getTagById = (tagId: string): Tag | undefined => {
  return allTags.find(tag => tag.id === tagId);
};
