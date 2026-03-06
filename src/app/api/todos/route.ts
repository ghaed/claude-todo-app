import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllTodos, createTodo } from "@/lib/es";

async function getUserEmail(req: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function GET(req: NextRequest) {
  const email = await getUserEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const todos = await getAllTodos(email, q);
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const email = await getUserEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.text || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const todo = await createTodo(email, body.text.trim());
  return NextResponse.json(todo, { status: 201 });
}
