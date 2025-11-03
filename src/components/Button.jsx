import { motion } from "framer-motion"

export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(56, 189, 248, 0.25)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      type={type}
      onClick={onClick}
      className={`w-full rounded-xl bg-sky-500 text-white font-medium px-4 py-3 hover:bg-sky-400 focus:ring-2 focus:ring-sky-400 focus:outline-none transition ${className}`}
    >
      {children}
    </motion.button>
  )
}


