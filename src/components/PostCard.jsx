import { motion } from "framer-motion"
import Avatar from "./Avatar"
import Reactions from "./Reactions"
import CommentsList from "./CommentsList"

/**
 * Card de post individual
 */
export default function PostCard({ post, onReaction, onAddComment }) {
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md hover:scale-[1.01] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar name={post.author.name} size="md" />
        <div className="flex-1">
          <h3 className="text-white font-semibold">{post.author.name}</h3>
          <p className="text-sm text-white/50">{formatDate(post.date)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
        <p className="text-white/70 text-sm mb-2">{post.summary}</p>
        <p className="text-white/60 text-sm leading-relaxed">{truncateText(post.body)}</p>
      </div>

      {/* Reactions */}
      <Reactions reactions={post.reactions} onReaction={onReaction} postId={post.id} />

      {/* Comments */}
      <CommentsList
        comments={post.comments}
        postId={post.id}
        onAddComment={onAddComment}
      />
    </motion.div>
  )
}

