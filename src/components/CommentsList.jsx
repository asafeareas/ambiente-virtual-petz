import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send } from "lucide-react"
import Input from "./Input"
import Button from "./Button"
import Avatar from "./Avatar"

/**
 * Componente de lista de comentários com expand/collapse
 */
export default function CommentsList({ comments, postId, onAddComment }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [commentText, setCommentText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      onAddComment(postId, commentText.trim())
      setCommentText("")
    }
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
        <span>{comments.length} comentário{comments.length !== 1 ? "s" : ""}</span>
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
            {comments.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <Avatar name={comment.author} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{comment.author}</span>
                        <span className="text-xs text-white/40">{formatDate(comment.date)}</span>
                      </div>
                      <p className="text-sm text-white/80 mt-1">{comment.text}</p>
                    </div>
                  </motion.div>
                ))}
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

