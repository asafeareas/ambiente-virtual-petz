import { getStorage, setStorage, removeStorage } from "./storage"

const USERS_KEY = "conectapetz_users"
const CURRENT_USER_KEY = "conectapetz_currentUser"

/**
 * Inicializa lista de usuários se não existir
 */
export const initAuth = () => {
  if (!getStorage(USERS_KEY)) {
    setStorage(USERS_KEY, [])
  }
}

/**
 * Registra novo usuário — NÃO cria sessão automaticamente
 */
export const registerUser = (name, email, password) => {
  const users = getStorage(USERS_KEY) || []
  const userExists = users.some((u) => u.email === email)

  if (userExists) {
    throw new Error("E-mail já cadastrado.")
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
  }

  users.push(newUser)
  setStorage(USERS_KEY, users)
  
  // NÃO faz login automático — apenas retorna o novo usuário
  return newUser
}

/**
 * Faz login do usuário
 */
export const loginUser = (email, password) => {
  const users = getStorage(USERS_KEY) || []
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("E-mail ou senha incorretos.")
  }

  setStorage(CURRENT_USER_KEY, user)
  return user
}

/**
 * Faz logout do usuário
 */
export const logoutUser = () => {
  removeStorage(CURRENT_USER_KEY)
}

/**
 * Obtém o usuário logado atual
 */
export const getCurrentUser = () => {
  try {
    return getStorage(CURRENT_USER_KEY) || null
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return null
  }
}

/**
 * Verifica se há um usuário logado
 */
export const isLoggedIn = () => {
  return !!getStorage(CURRENT_USER_KEY)
}

/**
 * Atualiza os dados do usuário atual
 */
export const updateUser = (updatedData) => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error("Nenhum usuário logado.")
  }

  const users = getStorage(USERS_KEY) || []
  const userIndex = users.findIndex((u) => u.id === currentUser.id)

  if (userIndex === -1) {
    throw new Error("Usuário não encontrado.")
  }

  // Atualizar na lista de usuários
  const updatedUser = {
    ...users[userIndex],
    ...updatedData,
    id: currentUser.id, // Manter o ID original
  }

  // Se o email mudou, verificar se não existe outro usuário com esse email
  if (updatedData.email && updatedData.email !== currentUser.email) {
    const emailExists = users.some((u) => u.email === updatedData.email && u.id !== currentUser.id)
    if (emailExists) {
      throw new Error("E-mail já cadastrado por outro usuário.")
    }
  }

  // Atualizar senha apenas se fornecida
  if (!updatedData.password) {
    delete updatedUser.password
  }

  users[userIndex] = updatedUser
  setStorage(USERS_KEY, users)

  // Atualizar usuário atual no localStorage
  setStorage(CURRENT_USER_KEY, updatedUser)

  return updatedUser
}

