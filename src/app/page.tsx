import { getAllTodos } from "@/lib/es";
import SearchableTodoList from "./components/SearchableTodoList";

export default async function Home() {
  const todos = await getAllTodos();

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Todo List</h1>
        <SearchableTodoList initialTodos={todos} />
      </div>
    </main>
  );
}
