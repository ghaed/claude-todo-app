"use client";

import { useState, useEffect, useRef } from "react";
import type { Todo } from "@/lib/es";
import AddTodoForm from "./AddTodoForm";
import TodoItem from "./TodoItem";

export default function SearchableTodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function refetch(q: string) {
    const url = q ? `/api/todos?q=${encodeURIComponent(q)}` : "/api/todos";
    const res = await fetch(url);
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      refetch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search todos..."
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />
      <AddTodoForm onAdd={() => refetch(query)} />
      {todos.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          {query ? `No results for "${query}"` : "No todos yet. Add one above!"}
        </p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => refetch(query)}
              onDelete={() => refetch(query)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
