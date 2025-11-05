/**
 * Utilitários para gerenciar reações dos posts
 * Implementa toggle por usuário: um usuário pode ter apenas uma reação por post
 * Usa email do usuário como chave
 */
import { getStorage, setStorage, POSTS_KEY } from "./storage"

/**
 * Alterna a reação de um usuário em um post
 * - Se o usuário já tem a mesma reação, remove
 * - Se o usuário tem outra reação, troca
 * - Se o usuário não tem reação, adiciona
 * @param {string} postId - ID do post
 * @param {string} userEmail - Email do usuário
 * @param {string} reactionType - Tipo de reação (like, love, question)
 */
export const toggleReaction = (postId, userEmail, reactionType) => {
  const posts = getStorage(POSTS_KEY) || []

  // Encontrar o post
  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex === -1) {
    return { posts }
  }

  const post = posts[postIndex]
  
  // Garantir que os arrays de reação existem
  if (!post.reactions) {
    post.reactions = { like: [], love: [], question: [] }
  } else {
    // Migrar estrutura antiga (contadores) para nova (arrays)
    if (typeof post.reactions.like === 'number') {
      post.reactions = {
        like: [],
        love: [],
        question: []
      }
    }
  }

  // Encontrar qual reação o usuário já tem (se houver)
  let currentReaction = null
  if (post.reactions.like.includes(userEmail)) {
    currentReaction = 'like'
  } else if (post.reactions.love.includes(userEmail)) {
    currentReaction = 'love'
  } else if (post.reactions.question.includes(userEmail)) {
    currentReaction = 'question'
  }

  if (currentReaction === reactionType) {
    // Remover reação: usuário clicou na mesma reação que já tinha
    post.reactions[reactionType] = post.reactions[reactionType].filter(email => email !== userEmail)
  } else {
    // Se o usuário tinha uma reação diferente, remover ela
    if (currentReaction) {
      post.reactions[currentReaction] = post.reactions[currentReaction].filter(email => email !== userEmail)
    }
    
    // Adicionar nova reação
    if (!post.reactions[reactionType].includes(userEmail)) {
      post.reactions[reactionType].push(userEmail)
    }
  }

  // Atualizar post
  posts[postIndex] = post

  // Salvar no localStorage
  setStorage(POSTS_KEY, posts)

  return { posts }
}

/**
 * Obtém a reação atual de um usuário em um post
 * @param {string} postId - ID do post
 * @param {string} userEmail - Email do usuário
 * @returns {string|null} - Tipo de reação ou null
 */
export const getUserReaction = (postId, userEmail) => {
  const posts = getStorage(POSTS_KEY) || []
  const post = posts.find((p) => p.id === postId)
  
  if (!post || !post.reactions) {
    return null
  }

  // Verificar se o usuário tem reação em algum tipo
  if (post.reactions.like && post.reactions.like.includes(userEmail)) {
    return 'like'
  }
  if (post.reactions.love && post.reactions.love.includes(userEmail)) {
    return 'love'
  }
  if (post.reactions.question && post.reactions.question.includes(userEmail)) {
    return 'question'
  }

  return null
}

/**
 * Obtém a contagem de reações para um post (para exibição)
 * @param {object} reactions - Objeto de reações do post
 * @returns {object} - Objeto com contagens
 */
export const getReactionCounts = (reactions) => {
  if (!reactions) {
    return { like: 0, love: 0, question: 0 }
  }

  // Se for array (nova estrutura), retornar tamanho
  if (Array.isArray(reactions.like)) {
    return {
      like: reactions.like.length,
      love: reactions.love?.length || 0,
      question: reactions.question?.length || 0
    }
  }

  // Se for número (estrutura antiga), retornar como está (compatibilidade)
  return {
    like: reactions.like || 0,
    love: reactions.love || 0,
    question: reactions.question || 0
  }
}

