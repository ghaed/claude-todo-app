import { NextRequest, NextResponse } from "next/server";
import { getAllTodos, createTodo } from "@/lib/es";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const todos = await getAllTodos(q);
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.text || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const todo = await createTodo(body.text.trim());
  return NextResponse.json(todo, { status: 201 });
}
