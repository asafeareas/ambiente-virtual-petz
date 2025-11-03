import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Input from "../components/Input"
import Button from "../components/Button"

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Bem-vindo</h1>
          <p className="text-white/60 mt-2">Acesse sua conta</p>
        </div>

        <form className="flex flex-col gap-5">
          <Input label="E-mail" type="email" placeholder="seu@email.com" autoComplete="email" />
          <Input label="Senha" type="password" placeholder="••••••••" autoComplete="current-password" />
          <Button type="submit">Entrar</Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-white/60">Não tem conta? </span>
          <Link to="/register" className="text-sky-400 hover:text-sky-300 transition font-medium">Criar conta</Link>
        </div>
      </motion.div>
    </div>
  )
}


