import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, HeartHandshake, HelpCircle } from "lucide-react"
import { getCurrentUser } from "../utils/auth"
import { getUserReaction, getReactionCounts } from "../utils/reactions"

/**
 * Componente de reações com animações
 * Mostra visualmente qual reação o usuário atual deu
 */
export default function Reactions({ reactions, onReaction, postId }) {
  const [user, setUser] = useState(null)
  const [userReaction, setUserReaction] = useState(null)
  const counts = getReactionCounts(reactions)
  
  // Carregar usuário atual de forma segura
  useEffect(() => {
    try {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      if (currentUser && currentUser.email) {
        const reaction = getUserReaction(postId, currentUser.email)
        setUserReaction(reaction)
      }
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error)
      setUser(null)
      setUserReaction(null)
    }
  }, [postId])

  const reactionTypes = [
    { key: "like", icon: Heart, label: "Curtir", emoji: "❤️", color: "text-red-400" },
    { key: "love", icon: HeartHandshake, label: "Amar", emoji: "💙", color: "text-blue-400" },
    { key: "question", icon: HelpCircle, label: "Questionar", emoji: "❓", color: "text-yellow-400" },
  ]

  return (
    <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
      {reactionTypes.map(({ key, icon: Icon, label, emoji, color }) => {
        const isActive = userReaction === key
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReaction(postId, key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${color} ${
              isActive 
                ? "bg-white/20 border border-white/30" 
                : "bg-white/5 hover:bg-white/10"
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{counts[key] || 0}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

