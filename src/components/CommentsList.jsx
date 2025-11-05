import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, MoreVertical, Edit2, Trash2 } from "lucide-react"
import Input from "./Input"
import Button from "./Button"
import Avatar from "./Avatar"

/**
 * Componente de lista de comentários com expand/collapse
 */
export default function CommentsList({ comments = [], postId, onAddComment, onEditComment, onDeleteComment, currentUserEmail }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState("")
  const [showMenuId, setShowMenuId] = useState(null)
  
  // Garantir que comments é sempre um array
  const safeComments = Array.isArray(comments) ? comments : []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      onAddComment(postId, commentText.trim())
      setCommentText("")
    }
  }

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id)
    setEditText(comment.text)
    setShowMenuId(null)
  }

  const handleSaveEdit = (commentId) => {
    if (editText.trim()) {
      onEditComment(postId, commentId, editText.trim())
      setEditingCommentId(null)
      setEditText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditText("")
  }

  const handleDelete = (commentId) => {
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      onDeleteComment(postId, commentId)
    }
    setShowMenuId(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{safeComments.length} comentário{safeComments.length !== 1 ? "s" : ""}</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            {safeComments.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {safeComments.map((comment, index) => {
                  const isOwner = currentUserEmail && comment.authorEmail === currentUserEmail
                  const isEditing = editingCommentId === comment.id
                  
                  return (
                    <motion.div
                      key={comment.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10 relative"
                    >
                      <Avatar name={comment.author} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{comment.author}</span>
                          <span className="text-xs text-white/40">{formatDate(comment.date)}</span>
                        </div>
                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none"
                              rows="2"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(comment.id)}
                                className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition text-xs"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-xs"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-white/80 mt-1">{comment.text}</p>
                        )}
                      </div>
                      {isOwner && !isEditing && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowMenuId(showMenuId === comment.id ? null : comment.id)
                            }}
                            className="p-1 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showMenuId === comment.id && (
                            <div className="absolute right-0 top-8 bg-slate-800 border border-white/20 rounded-lg shadow-lg z-10 min-w-[120px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStartEdit(comment)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 transition rounded-t-lg"
                              >
                                <Edit2 className="w-3 h-3" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(comment.id)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition rounded-b-lg"
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" className="w-auto">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Comentar</span>
                </div>
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

