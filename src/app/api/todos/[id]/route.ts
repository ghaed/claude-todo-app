import { NextRequest, NextResponse } from "next/server";
import { toggleTodo, deleteTodo } from "@/lib/es";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const todo = await toggleTodo(id);
  return NextResponse.json(todo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteTodo(id);
  return new NextResponse(null, { status: 204 });
}
