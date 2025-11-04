import { motion } from "framer-motion"
import { Heart, HeartHandshake, HelpCircle } from "lucide-react"

/**
 * Componente de reações com animações
 */
export default function Reactions({ reactions, onReaction, postId }) {
  const reactionTypes = [
    { key: "like", icon: Heart, label: "Curtir", emoji: "❤️", color: "text-red-400" },
    { key: "love", icon: HeartHandshake, label: "Amar", emoji: "💙", color: "text-blue-400" },
    { key: "question", icon: HelpCircle, label: "Questionar", emoji: "❓", color: "text-yellow-400" },
  ]

  return (
    <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
      {reactionTypes.map(({ key, icon: Icon, label, emoji, color }) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onReaction(postId, key)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all ${color}`}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{reactions[key] || 0}</span>
        </motion.button>
      ))}
    </div>
  )
}

