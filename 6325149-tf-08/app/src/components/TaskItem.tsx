import type { Task } from "../types"

type Props = {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const handleToggle = () => {
    onToggle(task.id)
  }

  const handleDelete = () => {
    onDelete(task.id)
  }

  return (
    <li>
      <span
        onClick={handleToggle}
        style={{
          cursor: "pointer",
          textDecoration: task.isDone ? "line-through" : "none",
        }}
      >
        {task.name}
      </span>
      <button onClick={handleDelete}>Excluir</button>
    </li>
  )
}
