import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion as Motion } from "framer-motion"
import { Bell, MessageCircle, UserCircle, Edit2, LogOut } from "lucide-react"
import { getCurrentUser, logoutUser } from "../utils/auth"
import EditProfileModal from "./EditProfileModal"

/**
 * Header fixa com glassmorphism
 */
export default function Header({ sidebarOffset = "0px" }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  // Atualizar usuário quando o modal fechar (após edição)
  const handleProfileUpdate = () => {
    const updatedUser = getCurrentUser()
    setCurrentUser(updatedUser)
    setShowEditModal(false)
    // Forçar atualização do componente pai se necessário
    window.dispatchEvent(new Event('userUpdated'))
  }

  // Escutar atualizações de usuário
  useEffect(() => {
    const handleUserUpdate = () => {
      const user = getCurrentUser()
      setCurrentUser(user)
    }
    window.addEventListener('userUpdated', handleUserUpdate)
    return () => window.removeEventListener('userUpdated', handleUserUpdate)
  }, [])

  const handleLogout = () => {
    logoutUser()
    setShowProfileMenu(false)
    navigate("/login")
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
    setShowProfileMenu(false)
  }

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileMenu && !e.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showProfileMenu])

  if (!currentUser) {
    return null
  }

  return (
    <>
      <header
        className="fixed top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg transition-all duration-300"
        style={{ left: sidebarOffset, right: 0 }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Esquerda - Título */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide drop-shadow-lg">
              CONECTAPETZ
            </h1>
            <p className="text-xs text-white/60 hidden sm:block">
              Comunidade de amantes de pets
            </p>
          </div>

          {/* Direita - Ícones */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <Motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
            </Motion.button>

            {/* Chat */}
            <Motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
              title="Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </Motion.button>

            {/* Perfil com dropdown */}
            <div className="relative profile-menu-container">
              <Motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-1 rounded-full hover:bg-white/10 transition"
                title="Perfil"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <UserCircle className="w-8 h-8 text-white/70 hover:text-white" />
                )}
              </Motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl min-w-[180px] overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 mb-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{currentUser.name}</p>
                        <p className="text-xs text-white/60 truncate">{currentUser.email}</p>
                      </div>
                      
                      <button
                        onClick={handleEditProfile}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 transition rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar perfil
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition rounded-lg mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleProfileUpdate}
        currentUser={currentUser}
      />
    </>
  )
}

