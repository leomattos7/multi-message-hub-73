
export interface Tag {
  id: string;
  name: string;
  color: string;
  type: 'status' | 'topic';
}

// Status tags para indicar a situação do atendimento
export const statusTags: Tag[] = [
  { id: 'pending', name: 'Pendente', color: 'bg-yellow-500', type: 'status' },
  { id: 'scheduled', name: 'Agendado', color: 'bg-green-500', type: 'status' },
  { id: 'urgent', name: 'Urgente', color: 'bg-red-500', type: 'status' },
  { id: 'completed', name: 'Concluído', color: 'bg-blue-500', type: 'status' },
  { id: 'follow-up', name: 'Retorno', color: 'bg-purple-500', type: 'status' },
];

// Topic tags para categorizar o assunto da conversa
export const topicTags: Tag[] = [
  { id: 'appointment', name: 'Consulta', color: 'bg-indigo-500', type: 'topic' },
  { id: 'exam', name: 'Exame', color: 'bg-pink-500', type: 'topic' },
  { id: 'payment', name: 'Pagamento', color: 'bg-emerald-500', type: 'topic' },
  { id: 'information', name: 'Informação', color: 'bg-amber-500', type: 'topic' },
  { id: 'prescription', name: 'Receita', color: 'bg-cyan-500', type: 'topic' },
];

// Todos as tags disponíveis
export const allTags = [...statusTags, ...topicTags];

// Função para buscar uma tag pelo ID
export const getTagById = (tagId: string): Tag | undefined => {
  return allTags.find(tag => tag.id === tagId);
};
