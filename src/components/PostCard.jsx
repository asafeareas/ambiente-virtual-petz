import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MoreVertical, Edit2, Trash2, FileText, Image as ImageIcon } from "lucide-react"
import Avatar from "./Avatar"
import Reactions from "./Reactions"
import CommentsList from "./CommentsList"
import { getCurrentUser } from "../utils/auth"

/**
 * Card de post individual
 */
export default function PostCard({ post, onReaction, onAddComment, onEditPost, onDeletePost, onEditComment, onDeleteComment }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editSummary, setEditSummary] = useState(post.summary || "")
  const [editBody, setEditBody] = useState(post.body)
  const [showMenu, setShowMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Carregar usuário atual de forma segura
  useEffect(() => {
    try {
      const user = getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error)
      setCurrentUser(null)
    }
  }, [])
  
  const isOwner = currentUser && post.author?.email === currentUser.email

  // Atualizar estados quando o post mudar
  useEffect(() => {
    setEditTitle(post.title)
    setEditSummary(post.summary || "")
    setEditBody(post.body)
    setIsEditing(false)
  }, [post.title, post.summary, post.body])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getPreviewText = (text) => {
    if (!text || typeof text !== 'string') return ""
    // Pegar primeiro parágrafo ou primeiros 200 caracteres
    const firstParagraph = text.split('\n')[0]
    if (firstParagraph.length <= 200) {
      return firstParagraph.length < text.length ? firstParagraph : text
    }
    return text.slice(0, 200)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim() && editBody.trim()) {
      onEditPost(post.id, {
        title: editTitle.trim(),
        summary: editSummary.trim(),
        body: editBody.trim(),
      })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(post.title)
    setEditSummary(post.summary || "")
    setEditBody(post.body)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      onDeletePost(post.id)
    }
    setShowMenu(false)
  }

  const isImage = (fileType) => {
    return fileType && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(fileType)
  }

  const isPdf = (fileType) => {
    return fileType === 'application/pdf'
  }

  // Fechar menu ao clicar fora
  const handleClickOutside = () => {
    if (showMenu) {
      setShowMenu(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md hover:scale-[1.01] transition-all duration-200"
      onClick={handleClickOutside}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar name={post.author?.name || "Usuário"} size="md" />
        <div className="flex-1">
          <h3 className="text-white font-semibold">{post.author?.name || "Usuário"}</h3>
          <p className="text-sm text-white/50">{formatDate(post.date)}</p>
        </div>
        {isOwner && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-slate-800 border border-white/20 rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 transition rounded-t-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Título"
            />
            <input
              type="text"
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Resumo (opcional)"
            />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-400 min-h-[150px] resize-none"
              placeholder="Corpo do post"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
              >
                Salvar
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">{post.title || "Sem título"}</h2>
            {post.summary && <p className="text-white/70 text-sm mb-2">{post.summary}</p>}
            <div className="text-white/60 text-sm leading-relaxed">
              {isExpanded ? (
                <>
                  <p className="whitespace-pre-wrap">{post.body || ""}</p>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-sky-400 hover:text-sky-300 mt-2 font-medium"
                  >
                    Ver menos
                  </button>
                </>
              ) : (
                <>
                  <p>{getPreviewText(post.body)}</p>
                  {post.body && typeof post.body === 'string' && post.body.length > getPreviewText(post.body).length && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-sky-400 hover:text-sky-300 mt-2 font-medium"
                    >
                      Ver mais
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Imagem ou Documento */}
            {post.image && isImage(post.fileType) && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt="Post attachment"
                  className="w-full max-h-96 object-contain bg-white/5"
                />
              </div>
            )}
            {post.file && !isImage(post.fileType) && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPdf(post.fileType) ? (
                    <FileText className="w-8 h-8 text-red-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-blue-400" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">Documento anexado</p>
                    <p className="text-white/60 text-xs">{post.fileType || "Arquivo"}</p>
                  </div>
                </div>
                <a
                  href={post.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition text-sm"
                >
                  Abrir documento
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reactions */}
      <Reactions reactions={post.reactions} onReaction={onReaction} postId={post.id} />

      {/* Comments */}
      <CommentsList
        comments={Array.isArray(post.comments) ? post.comments : []}
        postId={post.id}
        onAddComment={onAddComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
        currentUserEmail={currentUser?.email}
      />
    </motion.div>
  )
}

