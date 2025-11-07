import { useMemo, useState, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { Plus } from "lucide-react"
import KanbanColumn, { KanbanColumnPreview } from "../components/kanban/KanbanColumn"
import { KanbanCardPreview } from "../components/kanban/KanbanCard"
import { getStorage, setStorage, KANBAN_DATA_KEY } from "../utils/storage"

const initialColumns = [
  {
    id: "col-1",
    title: "A Fazer",
    cards: [
      { id: "card-1", content: "Implementar tela de login" },
      { id: "card-2", content: "Ajustar layout do feed" },
    ],
  },
  {
    id: "col-2",
    title: "Em Progresso",
    cards: [{ id: "card-3", content: "Configurar autenticação" }],
  },
  {
    id: "col-3",
    title: "Concluído",
    cards: [{ id: "card-4", content: "Criar componentes base" }],
  },
]

export default function KanbanPage() {
  const [columns, setColumns] = useState(() => {
    const saved = getStorage(KANBAN_DATA_KEY)
    return saved || initialColumns
  })

  // Salvar alterações no localStorage sempre que columns mudar
  useEffect(() => {
    setStorage(KANBAN_DATA_KEY, columns)
  }, [columns])
  const [activeColumn, setActiveColumn] = useState(null)
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const columnIds = useMemo(() => columns.map((column) => column.id), [columns])

  const handleAddColumn = () => {
    const title = window.prompt("Nome da nova coluna:", "Novo Tópico")
    if (!title) {
      return
    }
    setColumns((prev) => [
      ...prev,
      {
        id: `col-${Date.now()}`,
        title,
        cards: [],
      },
    ])
  }

  const handleTitleChange = (columnId, newTitle) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              title: newTitle,
            }
          : column
      )
    )
  }

  const handleAddCard = (columnId) => {
    const content = window.prompt("Descrição do novo card:")
    if (!content) {
      return
    }

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: [
                ...column.cards,
                {
                  id: `card-${Date.now()}`,
                  content,
                },
              ],
            }
          : column
      )
    )
  }

  const findColumnByCardId = (cardId) =>
    columns.find((column) => column.cards.some((card) => card.id === cardId))

  const handleDragStart = (event) => {
    const { active } = event
    const activeType = active.data.current?.type

    if (activeType === "column") {
      const column = columns.find((item) => item.id === active.id)
      setActiveColumn(column || null)
    }

    if (activeType === "card") {
      const sourceColumn = columns.find(
        (column) => column.id === active.data.current?.columnId
      )
      const card = sourceColumn?.cards.find((item) => item.id === active.id)
      setActiveCard(card || null)
    }
  }

  const handleDragCancel = () => {
    setActiveCard(null)
    setActiveColumn(null)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) {
      handleDragCancel()
      return
    }

    const activeType = active.data.current?.type

    if (activeType === "column") {
      if (active.id !== over.id) {
        setColumns((prev) => {
          const oldIndex = prev.findIndex((column) => column.id === active.id)
          const newIndex = prev.findIndex((column) => column.id === over.id)
          return arrayMove(prev, oldIndex, newIndex)
        })
      }
      handleDragCancel()
      return
    }

    if (activeType === "card") {
      const activeColumnId = active.data.current?.columnId
      let overColumnId = over.data.current?.columnId

      if (!overColumnId) {
        const overCardColumn = findColumnByCardId(over.id)
        overColumnId = overCardColumn?.id
      }

      if (!overColumnId) {
        handleDragCancel()
        return
      }

      const sourceColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      )
      const targetColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      )

      if (sourceColumnIndex === -1 || targetColumnIndex === -1) {
        handleDragCancel()
        return
      }

      const sourceColumn = columns[sourceColumnIndex]
      const targetColumn = columns[targetColumnIndex]

      const activeCardIndex = sourceColumn.cards.findIndex(
        (card) => card.id === active.id
      )

      const isOverCard = over.data.current?.type === "card"

      if (activeColumnId === overColumnId) {
        const targetCardIndex = isOverCard
          ? targetColumn.cards.findIndex((card) => card.id === over.id)
          : targetColumn.cards.length - 1

        if (
          targetCardIndex >= 0 &&
          targetCardIndex !== activeCardIndex &&
          targetCardIndex < targetColumn.cards.length
        ) {
          setColumns((prev) =>
            prev.map((column) =>
              column.id === activeColumnId
                ? {
                    ...column,
                    cards: arrayMove(
                      column.cards,
                      activeCardIndex,
                      targetCardIndex
                    ),
                  }
                : column
            )
          )
        }
      } else {
        const movedCard = sourceColumn.cards[activeCardIndex]
        setColumns((prev) =>
          prev.map((column) => {
            if (column.id === activeColumnId) {
              return {
                ...column,
                cards: column.cards.filter((card) => card.id !== active.id),
              }
            }

            if (column.id === overColumnId) {
              const updatedCards = [...column.cards]
              const targetCardIndex = isOverCard
                ? updatedCards.findIndex((card) => card.id === over.id)
                : updatedCards.length
              const insertIndex =
                targetCardIndex === -1 ? updatedCards.length : targetCardIndex
              updatedCards.splice(insertIndex, 0, movedCard)
              return {
                ...column,
                cards: updatedCards,
              }
            }

            return column
          })
        )
      }
    }

    handleDragCancel()
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-extrabold mb-8 text-center uppercase tracking-wider">
        Kanban de Projetos
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={columnIds}>
          <div className="flex gap-4 overflow-x-auto pb-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddCard={handleAddCard}
                onTitleChange={handleTitleChange}
              />
            ))}

            <button
              type="button"
              onClick={handleAddColumn}
              className="flex flex-col items-center justify-center w-60 h-32 border border-dashed border-white/30 rounded-xl hover:bg-white/5 transition"
            >
              <Plus size={32} />
              <span>Nova Coluna</span>
            </button>
          </div>
        </SortableContext>

        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeColumn ? (
              <KanbanColumnPreview column={activeColumn} />
            ) : null}
            {activeCard ? <KanbanCardPreview card={activeCard} /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}


