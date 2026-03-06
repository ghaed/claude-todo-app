import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAllTodos } from "@/lib/es";
import SearchableTodoList from "./components/SearchableTodoList";
import UserHeader from "./components/UserHeader";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/signin");

  const todos = await getAllTodos(session.user.email);

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-6">
        <UserHeader />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Todos</h1>
        <SearchableTodoList initialTodos={todos} />
      </div>
    </main>
  );
}
