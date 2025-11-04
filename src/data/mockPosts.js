/**
 * Posts mockados para inicialização do feed
 */

export const mockPosts = [
  {
    id: 'post-1',
    title: 'Bem-vindo ao ConectaPetz!',
    summary: 'Plataforma de conexão para amantes de pets',
    body: 'O ConectaPetz é uma plataforma criada para conectar pessoas que amam animais. Aqui você pode compartilhar experiências, dicas, fotos e muito mais sobre seus pets. Vamos criar uma comunidade incrível juntos! 🐾',
    author: { name: 'Equipe ConectaPetz' },
    date: new Date('2025-11-03T10:00:00.000Z').toISOString(),
    reactions: { like: 0, love: 0, question: 0 },
    comments: []
  },
  {
    id: 'post-2',
    title: 'Dicas de alimentação saudável',
    summary: 'Como escolher a melhor ração para seu pet',
    body: 'A alimentação é fundamental para a saúde do seu pet. Sempre consulte um veterinário para escolher a ração adequada, considere a idade, tamanho e necessidades específicas do animal. Uma alimentação balanceada garante mais energia e qualidade de vida! 🐕',
    author: { name: 'Dr. PetCare' },
    date: new Date('2025-11-02T14:30:00.000Z').toISOString(),
    reactions: { like: 0, love: 0, question: 0 },
    comments: []
  },
  {
    id: 'post-3',
    title: 'Evento: Caminhada Solidária',
    summary: 'Participe da nossa caminhada beneficente',
    body: 'No próximo domingo, vamos realizar uma caminhada solidária para arrecadar ração e materiais para animais em situação de abandono. Todos estão convidados! O ponto de encontro será no Parque Central às 8h. Traga seu pet e venha fazer parte dessa ação! 🚶‍♀️🐾',
    author: { name: 'Organização Pet Amigo' },
    date: new Date('2025-11-01T09:15:00.000Z').toISOString(),
    reactions: { like: 0, love: 0, question: 0 },
    comments: []
  },
  {
    id: 'post-4',
    title: 'Adoção responsável',
    summary: 'Reflita antes de adotar um pet',
    body: 'Adotar um pet é uma decisão que requer responsabilidade e compromisso. Antes de adotar, pense se você tem tempo, espaço, recursos financeiros e dedicação para cuidar de um animal por muitos anos. A adoção é para a vida toda! 💙',
    author: { name: 'ONG PetResgate' },
    date: new Date('2025-10-31T16:45:00.000Z').toISOString(),
    reactions: { like: 0, love: 0, question: 0 },
    comments: []
  },
  {
    id: 'post-5',
    title: 'Curiosidades sobre gatos',
    summary: 'Você sabia que gatos têm 32 músculos em cada orelha?',
    body: 'Os gatos são animais fascinantes! Eles têm 32 músculos em cada orelha, o que permite que movam as orelhas de forma independente. Além disso, gatos passam cerca de 2/3 do dia dormindo. Que tal compartilhar uma curiosidade sobre seu pet? 🐱',
    author: { name: 'Amante dos Gatos' },
    date: new Date('2025-10-30T11:20:00.000Z').toISOString(),
    reactions: { like: 0, love: 0, question: 0 },
    comments: []
  }
]

