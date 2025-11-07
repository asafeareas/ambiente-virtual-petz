import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function KanbanCard({ card, columnId }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      cardId: card.id,
      columnId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg text-white text-sm space-y-2 cursor-grab active:cursor-grabbing transition-transform"
      {...attributes}
      {...listeners}
    >
      <p className="leading-relaxed text-white/90">{card.content}</p>
    </div>
  )
}

export function KanbanCardPreview({ card }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg text-white text-sm space-y-2">
      <p className="leading-relaxed text-white/90">{card.content}</p>
    </div>
  )
}


