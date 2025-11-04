import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, LogOut } from "lucide-react"
import PostCard from "./PostCard"
import PostCreateModal from "./PostCreateModal"
import { getStorage, setStorage, initStorageIfEmpty } from "../utils/storage"
import { mockPosts } from "../data/mockPosts"
import { getCurrentUser, logoutUser } from "../utils/auth"

const STORAGE_KEY = "conectapetz_posts"

/**
 * Componente principal do Feed
 */
export default function Feed() {
  const [posts, setPosts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  // Carregar usuário atual
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate("/login")
      return
    }
    setCurrentUser(user)
  }, [navigate])

  // Carregar posts do localStorage
  useEffect(() => {
    const storedPosts = initStorageIfEmpty(STORAGE_KEY, mockPosts)
    setPosts(storedPosts)
  }, [])

  // Salvar posts no localStorage sempre que mudarem
  useEffect(() => {
    if (posts.length > 0) {
      setStorage(STORAGE_KEY, posts)
    }
  }, [posts])

  const handleCreatePost = (formData) => {
    const user = getCurrentUser()
    const newPost = {
      id: `post-${Date.now()}`,
      title: formData.title,
      summary: formData.summary,
      body: formData.body,
      author: { name: user?.name || "Usuário" },
      date: new Date().toISOString(),
      reactions: { like: 0, love: 0, question: 0 },
      comments: [],
    }

    setPosts((prev) => [newPost, ...prev])
  }

  const handleReaction = (postId, reactionType) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: (post.reactions[reactionType] || 0) + 1,
            },
          }
        }
        return post
      })
    )
  }

  const handleAddComment = (postId, commentText) => {
    const user = getCurrentUser()
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                author: user?.name || "Usuário",
                text: commentText,
                date: new Date().toISOString(),
              },
            ],
          }
        }
        return post
      })
    )
  }

  const handleLogout = () => {
    logoutUser()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1e] to-[#020409] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">ConectaPetz</h1>
              <p className="text-white/60">Comunidade de amantes de pets</p>
            </div>
            {currentUser && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 transition-all"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sair</span>
              </motion.button>
            )}
          </div>
          {currentUser && (
            <div className="text-center">
              <p className="text-white/80 text-sm">
                Olá, <span className="font-semibold text-white">{currentUser.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Botão flutuante criar post */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 z-30 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/50 transition-all"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* Lista de posts */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center"
          >
            <p className="text-white/60 text-lg mb-4">Nenhum post ainda</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-blue-500/20"
            >
              Criar Primeiro Post
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onReaction={handleReaction}
                  onAddComment={handleAddComment}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        <PostCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
      </div>
    </div>
  )
}

