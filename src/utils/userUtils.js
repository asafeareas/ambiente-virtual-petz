/**
 * Utilitários para buscar informações de usuários
 */
import { getStorage } from "./storage"

const USERS_KEY = "conectapetz_users"

/**
 * Busca um usuário pelo email e retorna suas informações
 */
export const getUserByEmail = (email) => {
  if (!email) return null
  const users = getStorage(USERS_KEY) || []
  return users.find((u) => u.email === email) || null
}

/**
 * Busca o avatar de um usuário pelo email
 */
export const getUserAvatar = (email) => {
  const user = getUserByEmail(email)
  return user?.avatar || null
}
