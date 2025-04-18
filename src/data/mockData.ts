export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read' | 'pending' | 'failed';
}

export interface Conversation {
  id: string;
  contact: {
    id: string;
    name: string;
    avatar?: string;
  };
  channel: ChannelType;
  messages: Message[];
  unread: number;
  lastActivity: Date;
  requiresHumanIntervention?: boolean;
}

const generateRandomTime = (hoursBack: number) => {
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * hoursBack));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

export const mockConversations: Conversation[] = [
  {
    id: '1',
    contact: {
      id: '101',
      name: 'Maria Silva',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    channel: 'whatsapp',
    unread: 2,
    lastActivity: generateRandomTime(1),
    messages: [
      {
        id: '1001',
        content: 'Bom dia, gostaria de marcar uma consulta com o Dr. Ricardo para amanhã às 14h, é possível?',
        timestamp: generateRandomTime(3),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '1002',
        content: 'Bom dia, Maria! Deixe-me verificar a agenda do Dr. Ricardo.',
        timestamp: generateRandomTime(2),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '1003',
        content: 'Temos uma vaga às 15h. Serve para você?',
        timestamp: generateRandomTime(2),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '1004',
        content: 'Sim, 15h está perfeito. Obrigada!',
        timestamp: generateRandomTime(1),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '1005',
        content: 'Preciso levar algum documento específico?',
        timestamp: generateRandomTime(1),
        isOutgoing: false,
        status: 'read',
      },
    ],
  },
  {
    id: '6',
    contact: {
      id: '106',
      name: 'Roberto Almeida',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    channel: 'whatsapp',
    unread: 1,
    lastActivity: generateRandomTime(0.5),
    messages: [
      {
        id: '6001',
        content: 'Olá, preciso remarcar minha consulta de hoje para semana que vem.',
        timestamp: generateRandomTime(3),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '6002',
        content: 'Olá Roberto, sem problemas. Para qual dia gostaria de remarcar?',
        timestamp: generateRandomTime(2.5),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '6003',
        content: 'Quarta-feira às 14h seria possível?',
        timestamp: generateRandomTime(2),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '6004',
        content: 'Sim, temos disponibilidade. Vou fazer a remarcação agora.',
        timestamp: generateRandomTime(1.5),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '6005',
        content: 'Perfeito! O pagamento será da mesma forma que o anterior?',
        timestamp: generateRandomTime(0.5),
        isOutgoing: false,
        status: 'delivered',
      },
    ],
  },
  {
    id: '7',
    contact: {
      id: '107',
      name: 'Paula Martins',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    channel: 'whatsapp',
    unread: 3,
    lastActivity: generateRandomTime(0.2),
    messages: [
      {
        id: '7001',
        content: 'Boa tarde, tenho os resultados dos exames solicitados. Como posso enviá-los?',
        timestamp: generateRandomTime(4),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '7002',
        content: 'Boa tarde, Paula! Você pode enviar por WhatsApp mesmo ou trazer impresso na próxima consulta.',
        timestamp: generateRandomTime(3.5),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '7003',
        content: 'Vou enviar por aqui mesmo então. Quando posso marcar a próxima consulta para análise?',
        timestamp: generateRandomTime(0.3),
        isOutgoing: false,
        status: 'delivered',
      },
      {
        id: '7004',
        content: 'Após confirmar o recebimento dos exames, o médico analisará e entraremos em contato para agendar.',
        timestamp: generateRandomTime(0.2),
        isOutgoing: false,
        status: 'delivered',
      },
      {
        id: '7005',
        content: 'Quero agendar o mais rápido possível, como está a agenda para os próximos dias?',
        timestamp: generateRandomTime(0.1),
        isOutgoing: false,
        status: 'delivered',
      },
    ],
  },
  {
    id: '2',
    contact: {
      id: '102',
      name: 'João Oliveira',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    channel: 'facebook',
    unread: 0,
    lastActivity: generateRandomTime(5),
    requiresHumanIntervention: true,
    messages: [
      {
        id: '2001',
        content: 'Olá, preciso remarcar minha consulta de hoje à tarde para a próxima semana.',
        timestamp: generateRandomTime(6),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '2002',
        content: 'Olá João, sem problemas. Qual dia da próxima semana seria melhor para você?',
        timestamp: generateRandomTime(5),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '2003',
        content: 'Preciso de mais detalhes sobre sua disponibilidade. Esta questão requer intervenção humana.',
        timestamp: generateRandomTime(4),
        isOutgoing: true,
        status: 'read',
      },
    ],
  },
  {
    id: '3',
    contact: {
      id: '103',
      name: 'Ana Beatriz',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    channel: 'instagram',
    unread: 1,
    lastActivity: generateRandomTime(2),
    messages: [
      {
        id: '3001',
        content: 'O Dr. Ricardo atende planos de saúde?',
        timestamp: generateRandomTime(3),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '3002',
        content: 'Olá Ana! Sim, o Dr. Ricardo atende diversos planos de saúde. Qual o seu convênio?',
        timestamp: generateRandomTime(3),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '3003',
        content: 'Tenho o plano Saúde Total. Ele está na lista de credenciados?',
        timestamp: generateRandomTime(2),
        isOutgoing: false,
        status: 'delivered',
      },
    ],
  },
  {
    id: '4',
    contact: {
      id: '104',
      name: 'Carlos Mendes',
      avatar: 'https://i.pravatar.cc/150?img=11',
    },
    channel: 'email',
    unread: 0,
    lastActivity: generateRandomTime(8),
    requiresHumanIntervention: true,
    messages: [
      {
        id: '4001',
        content: 'Prezada secretária, gostaria de solicitar uma cópia do meu prontuário médico para apresentar a um especialista. Como devo proceder? Atenciosamente, Carlos Mendes',
        timestamp: generateRandomTime(10),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '4002',
        content: 'Prezado Carlos, para solicitar a cópia do seu prontuário, precisamos que você preencha um formulário de autorização em nosso consultório. Podemos enviar o documento por email para você imprimir e trazer assinado, ou você pode vir pessoalmente preencher conosco. Qual opção prefere? Atenciosamente, Secretaria Dr. Ricardo',
        timestamp: generateRandomTime(8),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '4003',
        content: 'Este caso exige validação adicional de documentos. Solicitando intervenção humana para orientação específica sobre o caso.',
        timestamp: generateRandomTime(7),
        isOutgoing: true,
        status: 'read',
      },
    ],
  },
  {
    id: '5',
    contact: {
      id: '105',
      name: 'Luísa Ferreira',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    channel: 'whatsapp',
    unread: 3,
    lastActivity: generateRandomTime(1),
    messages: [
      {
        id: '5001',
        content: 'Boa tarde! Estou com febre há dois dias. O Dr. Ricardo tem horários disponíveis amanhã?',
        timestamp: generateRandomTime(24),
        isOutgoing: false,
        status: 'read',
      },
      {
        id: '5002',
        content: 'Olá Luísa, para amanhã temos horário disponível às 9h ou às 16h. Qual prefere?',
        timestamp: generateRandomTime(23),
        isOutgoing: true,
        status: 'read',
      },
      {
        id: '5003',
        content: 'Prefiro o horário das 9h, por favor.',
        timestamp: generateRandomTime(1),
        isOutgoing: false,
        status: 'delivered',
      },
      {
        id: '5004',
        content: 'A febre continua alta, devo tomar algum medicamento enquanto aguardo a consulta?',
        timestamp: generateRandomTime(1),
        isOutgoing: false,
        status: 'delivered',
      },
      {
        id: '5005',
        content: 'É minha primeira vez no consultório. Qual o endereço completo?',
        timestamp: generateRandomTime(0.5),
        isOutgoing: false,
        status: 'delivered',
      },
    ],
  },
];

// Function to sort conversations by lastActivity
export const sortedConversations = () => {
  return [...mockConversations].sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
  );
};

// Function to filter conversations by channel
export const filterByChannel = (channel: ChannelType | 'all') => {
  if (channel === 'all') return sortedConversations();
  return sortedConversations().filter((convo) => convo.channel === channel);
};

// Function to search conversations
export const searchConversations = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  return sortedConversations().filter(
    (convo) =>
      convo.contact.name.toLowerCase().includes(normalizedQuery) ||
      convo.messages.some((msg) => msg.content.toLowerCase().includes(normalizedQuery))
  );
};

// Function to filter conversations that require human intervention
export const filterRequiresIntervention = () => {
  return sortedConversations().filter((convo) => convo.requiresHumanIntervention === true);
};
