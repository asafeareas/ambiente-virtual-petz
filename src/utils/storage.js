/**
 * Utilitários para gerenciar localStorage
 */

export function getStorage(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error)
    return null
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error)
    return false
  }
}

export function initStorageIfEmpty(key, defaultValue) {
  const existing = getStorage(key)
  if (existing === null) {
    setStorage(key, defaultValue)
    return defaultValue
  }
  return existing
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Erro ao remover ${key} do localStorage:`, error)
    return false
  }
}

// Chaves convencionais para posts e reações
export const POSTS_KEY = "conectapetz_posts"
export const USER_REACTIONS_KEY = "conectapetz_userReactions"
export const KANBAN_DATA_KEY = "conectapetz_kanbanData"

