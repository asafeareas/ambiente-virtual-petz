import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, User } from "lucide-react"
import Input from "./Input"
import Button from "./Button"
import { updateUser } from "../utils/auth"
import { getStorage, setStorage, POSTS_KEY } from "../utils/storage"

/**
 * Modal para editar perfil do usuário
 */
export default function EditProfileModal({ isOpen, onClose, onUpdate, currentUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        password: "",
        avatar: currentUser.avatar || null,
      })
      setAvatarPreview(currentUser.avatar || null)
      setError("")
    }
  }, [isOpen, currentUser])

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setError("")
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione uma imagem válida.")
      return
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB.")
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setAvatarPreview(imageUrl)
    setFormData((prev) => ({
      ...prev,
      avatar: imageUrl,
    }))
    setError("")
  }

  const handleRemoveAvatar = () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarPreview(null)
    setFormData((prev) => ({ ...prev, avatar: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validar campos obrigatórios
      if (!formData.name.trim() || !formData.email.trim()) {
        setError("Nome e e-mail são obrigatórios.")
        setLoading(false)
        return
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Por favor, insira um e-mail válido.")
        setLoading(false)
        return
      }

      // Atualizar usuário
      const updatedUser = updateUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || undefined, // Só atualiza senha se fornecida
        avatar: formData.avatar || null,
      })

      // Se o email mudou, atualizar também nos posts
      if (formData.email !== currentUser.email) {
        const posts = getStorage(POSTS_KEY) || []
        
        // Atualizar email nos posts e comentários do usuário
        const updatedPosts = posts.map(post => {
          const updatedPost = { ...post }
          
          // Atualizar email do autor do post
          if (post.author?.email === currentUser.email) {
            updatedPost.author = {
              ...post.author,
              email: formData.email.trim(),
            }
          }
          
          // Atualizar email nos comentários
          if (post.comments && Array.isArray(post.comments)) {
            updatedPost.comments = post.comments.map(comment => {
              if (comment.authorEmail === currentUser.email) {
                return {
                  ...comment,
                  authorEmail: formData.email.trim(),
                }
              }
              return comment
            })
          }
          
          return updatedPost
        })
        
        setStorage(POSTS_KEY, updatedPosts)
      }

      onUpdate()
    } catch (err) {
      setError(err.message || "Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Limpar preview se for blob URL
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Editar Perfil</h2>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="relative">
                    {avatarPreview ? (
                      <div className="relative">
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-2 border-white/30"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                        <User className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition cursor-pointer text-white/80 text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {avatarPreview ? "Trocar foto" : "Adicionar foto"}
                    </label>
                  </div>
                </div>

                {/* Nome */}
                <Input
                  label="Nome"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />

                {/* Email */}
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />

                {/* Senha */}
                <Input
                  label="Nova senha (deixe em branco para manter a atual)"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange("password")}
                />

                {/* Erro */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-3 font-medium transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

