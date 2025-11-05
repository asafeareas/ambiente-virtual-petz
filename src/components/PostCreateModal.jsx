import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Input from "./Input"
import Button from "./Button"

/**
 * Modal para criar novo post
 */
export default function PostCreateModal({ isOpen, onClose, onCreatePost }) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    image: null,
    file: null,
    fileType: null,
  })
  const [imagePreview, setImagePreview] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim() && formData.body.trim()) {
      onCreatePost(formData)
      setFormData({ title: "", summary: "", body: "", image: null, file: null, fileType: null })
      setImagePreview(null)
      onClose()
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileType = file.type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf'
    ]

    if (!allowedTypes.includes(fileType)) {
      alert('Tipo de arquivo não permitido. Use: .jpg, .jpeg, .png, .gif ou .pdf')
      return
    }

    if (fileType.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
        file: imageUrl,
        fileType: fileType,
      }))
    } else {
      const fileUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        file: fileUrl,
        fileType: fileType,
        image: null,
      }))
      setImagePreview(null)
    }
  }

  const handleRemoveFile = () => {
    if (formData.image) {
      URL.revokeObjectURL(formData.image)
    }
    if (formData.file) {
      URL.revokeObjectURL(formData.file)
    }
    setFormData((prev) => ({ ...prev, image: null, file: null, fileType: null }))
    setImagePreview(null)
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Criar Novo Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Título"
                  placeholder="Digite o título do post"
                  value={formData.title}
                  onChange={handleChange("title")}
                  required
                />

                <Input
                  label="Resumo (opcional)"
                  placeholder="Um resumo curto do post"
                  value={formData.summary}
                  onChange={handleChange("summary")}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/80">Corpo do Post</label>
                  <textarea
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400/60 transition min-h-[150px] resize-none"
                    placeholder="Conteúdo completo do post..."
                    value={formData.body}
                    onChange={handleChange("body")}
                    required
                  />
                </div>

                {/* Upload de arquivo */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/80">Anexar arquivo (opcional)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white/80 hover:bg-white/20 transition cursor-pointer text-center text-sm"
                    >
                      {formData.file ? "Trocar arquivo" : "Selecionar arquivo (.jpg, .png, .gif, .pdf)"}
                    </label>
                    {formData.file && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 transition text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-48 object-contain bg-white/5"
                      />
                    </div>
                  )}
                  {formData.file && !imagePreview && (
                    <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white/80 text-sm">Arquivo selecionado: {formData.fileType || "Documento"}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit">Publicar</Button>
                  <button
                    type="button"
                    onClick={onClose}
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

