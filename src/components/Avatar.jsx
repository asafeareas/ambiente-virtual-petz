/**
 * Componente de Avatar circular com iniciais ou foto de perfil
 */
export default function Avatar({ name, size = "md", avatar = null }) {
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  // Se houver avatar, mostrar imagem
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || "Avatar"}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white/30 shadow-md`}
      />
    )
  }

  // Caso contrário, mostrar iniciais
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md`}
    >
      {getInitials(name)}
    </div>
  )
}

