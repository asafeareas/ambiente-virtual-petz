import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Input from "../components/Input"
import Button from "../components/Button"
import { registerUser, isLoggedIn } from "../utils/auth"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/feed")
    }
  }, [navigate])

  const handleRegister = (e) => {
    e.preventDefault()
    setError("")

    try {
      registerUser(name, email, password)
      navigate("/feed")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Criar conta</h1>
          <p className="text-white/60 mt-2">Preencha seus dados</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit">Cadastrar</Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-white/60">Já possui conta? </span>
          <Link to="/login" className="text-sky-400 hover:text-sky-300 transition font-medium">Entrar</Link>
        </div>
      </motion.div>
    </div>
  )
}


