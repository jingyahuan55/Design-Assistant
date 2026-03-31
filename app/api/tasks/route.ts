import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const taskId = crypto.randomUUID();

  return NextResponse.json({
    taskId,
    status: "draft",
    inputMode: body.inputMode ?? "text"
  });
}

