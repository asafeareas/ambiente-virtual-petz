import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, LogOut } from "lucide-react"
import PostCard from "./PostCard"
import PostCreateModal from "./PostCreateModal"
import { getStorage, setStorage, initStorageIfEmpty, POSTS_KEY } from "../utils/storage"
import { mockPosts } from "../data/mockPosts"
import { getCurrentUser, logoutUser } from "../utils/auth"
import { toggleReaction } from "../utils/reactions"

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
    const storedPosts = initStorageIfEmpty(POSTS_KEY, mockPosts)
    // Garantir que todos os posts tenham arrays de comentários
    const normalizedPosts = storedPosts.map(post => ({
      ...post,
      comments: post.comments || [],
      reactions: post.reactions || { like: [], love: [], question: [] }
    }))
    setPosts(normalizedPosts)
    console.log("✅ FeedPage renderizada com sucesso. Posts carregados:", normalizedPosts.length)
  }, [])

  // Função para recarregar posts do localStorage
  const refreshPostsFromStorage = () => {
    const latest = getStorage(POSTS_KEY) || []
    setPosts(latest)
  }

  // Salvar posts no localStorage sempre que mudarem
  useEffect(() => {
    if (posts.length > 0) {
      setStorage(POSTS_KEY, posts)
    }
  }, [posts])

  const handleCreatePost = (formData) => {
    const user = getCurrentUser()
    const newPost = {
      id: `post-${Date.now()}`,
      title: formData.title,
      summary: formData.summary,
      body: formData.body,
      author: { name: user?.name || "Usuário", email: user?.email },
      date: new Date().toISOString(),
      reactions: { like: [], love: [], question: [] },
      comments: [],
      image: formData.image || null,
      file: formData.file || null,
      fileType: formData.fileType || null,
    }

    setPosts((prev) => [newPost, ...prev])
  }

  const handleReaction = (postId, reactionType) => {
    const user = getCurrentUser()
    if (!user || !user.email) {
      alert("Faça login para reagir.")
      return
    }

    // Usar toggleReaction que gerencia o estado e persistência
    const { posts: updatedPosts } = toggleReaction(postId, user.email, reactionType)
    
    // Atualizar o estado local com os posts atualizados
    setPosts(updatedPosts)
  }

  const handleAddComment = (postId, commentText) => {
    const user = getCurrentUser()
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: user?.name || "Usuário",
      authorEmail: user?.email,
      text: commentText,
      date: new Date().toISOString(),
      reactions: { like: [], love: [], question: [] },
    }
    
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
          }
        }
        return post
      })
    )
  }

  const handleEditPost = (postId, updatedData) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, ...updatedData }
        }
        return post
      })
    )
  }

  const handleDeletePost = (postId) => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    }
  }

  const handleEditComment = (postId, commentId, updatedText) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: (post.comments || []).map((comment) =>
              comment.id === commentId
                ? { ...comment, text: updatedText }
                : comment
            ),
          }
        }
        return post
      })
    )
  }

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: (post.comments || []).filter((comment) => comment.id !== commentId),
            }
          }
          return post
        })
      )
    }
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
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
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

