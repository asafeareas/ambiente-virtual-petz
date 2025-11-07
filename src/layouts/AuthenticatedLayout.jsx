import { useMemo, useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

export default function AuthenticatedLayout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  const sidebarOffset = useMemo(
    () => (isSidebarExpanded ? "16rem" : "5rem"),
    [isSidebarExpanded]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1e] to-[#020409] text-white">
      <Sidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded((prev) => !prev)}
      />

      <Header sidebarOffset={sidebarOffset} />

      <main
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarOffset }}
      >
        <div className="pt-28 px-6 pb-12">{children}</div>
      </main>
    </div>
  )
}


