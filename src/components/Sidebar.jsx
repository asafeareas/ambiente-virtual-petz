import { Menu, X, Megaphone, Columns } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const navItems = [
  {
    id: "feed",
    label: "Comunicados",
    icon: Megaphone,
    to: "/feed",
  },
  {
    id: "kanban",
    label: "Kanban",
    icon: Columns,
    to: "/kanban",
  },
]

export default function Sidebar({ isExpanded, onToggle }) {
  const location = useLocation()

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full p-4 transition-all duration-300 backdrop-blur-md bg-white/5 border-r border-white/10 shadow-xl flex flex-col ${isExpanded ? "w-64" : "w-20"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="text-white/90 hover:text-white transition mb-8 flex items-center justify-center rounded-xl hover:bg-white/10 p-2"
        aria-label={isExpanded ? "Recolher menu" : "Expandir menu"}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.to)

          return (
            <Link
              key={item.id}
              to={item.to}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-cyan-400"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              } ${!isExpanded ? "justify-center" : ""}`}
              title={!isExpanded ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-cyan-400" : "text-white"}`}
              />
              {isExpanded && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}


