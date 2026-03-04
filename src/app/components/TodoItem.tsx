"use client";

import type { Todo } from "@/lib/es";

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}) {
  async function handleToggle() {
    await fetch(`/api/todos/${todo.id}`, { method: "PUT" });
    onToggle();
  }

  async function handleDelete() {
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    onDelete();
  }

  return (
    <li className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="w-4 h-4 cursor-pointer"
      />
      <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : ""}`}>
        {todo.text}
      </span>
      <button
        onClick={handleDelete}
        className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50"
      >
        Delete
      </button>
    </li>
  );
}
