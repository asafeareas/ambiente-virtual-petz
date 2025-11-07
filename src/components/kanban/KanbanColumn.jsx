import { useCallback } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, GripVertical } from "lucide-react"
import KanbanCard from "./KanbanCard"

export default function KanbanColumn({
  column,
  onAddCard,
  onTitleChange,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `${column.id}-dropzone`,
    data: {
      type: "column-dropzone",
      columnId: column.id,
    },
  })

  const combinedRef = useCallback(
    (node) => {
      setNodeRef(node)
    },
    [setNodeRef]
  )

  const cardsContainerRef = useCallback(
    (node) => {
      setDropRef(node)
    },
    [setDropRef]
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={combinedRef}
      style={style}
      className="w-72 shrink-0 flex flex-col gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-lg transition-all"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-white/40 hover:text-white/70 transition"
          {...attributes}
          {...listeners}
          aria-label="Reordenar coluna"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <input
          value={column.title}
          onChange={(event) => onTitleChange(column.id, event.target.value)}
          className="flex-1 bg-transparent text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded-lg px-2 py-1"
        />
      </div>

      <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={cardsContainerRef}
          className={`space-y-3 min-h-[80px] transition-colors ${
            isOver ? "bg-white/5 rounded-xl p-3" : ""
          }`}
        >
          {column.cards.length === 0 ? (
            <p className="text-white/40 text-sm text-center border border-dashed border-white/20 rounded-xl py-6">
              Nenhum card ainda
            </p>
          ) : (
            column.cards.map((card) => (
              <KanbanCard key={card.id} card={card} columnId={column.id} />
            ))
          )}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => onAddCard(column.id)}
        className="flex items-center gap-2 justify-center border border-white/10 rounded-xl py-2 text-sm text-white/80 hover:text-white hover:border-white/30 transition"
      >
        <Plus className="w-4 h-4" />
        Novo Card
      </button>
    </div>
  )
}

export function KanbanColumnPreview({ column }) {
  return (
    <div className="w-72 shrink-0 flex flex-col gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-white/60" />
        <span className="flex-1 bg-transparent text-white font-semibold text-lg">
          {column.title}
        </span>
      </div>
      <div className="space-y-3">
        {column.cards.map((card) => (
          <div
            key={card.id}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white/80 text-sm"
          >
            {card.content}
          </div>
        ))}
      </div>
    </div>
  )
}


