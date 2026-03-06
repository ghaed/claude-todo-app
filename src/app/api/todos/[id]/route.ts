import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTodo, toggleTodo, deleteTodo } from "@/lib/es";

async function authorizeAndGetId(
  req: NextRequest,
  params: Promise<{ id: string }>
): Promise<{ id: string; email: string } | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const todo = await getTodo(id);
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (todo.user_id !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { id, email: session.user.email };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await authorizeAndGetId(req, params);
  if (result instanceof NextResponse) return result;
  const todo = await toggleTodo(result.id);
  return NextResponse.json(todo);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await authorizeAndGetId(req, params);
  if (result instanceof NextResponse) return result;
  await deleteTodo(result.id);
  return new NextResponse(null, { status: 204 });
}
