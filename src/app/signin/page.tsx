import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInButton from "./SignInButton";

export const metadata = {
  title: "Sign in — Todo App",
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8 text-center">
        <div className="mb-6">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your personal to-do list</p>
        </div>
        <SignInButton />
      </div>
    </main>
  );
}
