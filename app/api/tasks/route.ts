import { NextResponse } from "next/server";
import { createTaskRecord } from "../../../lib/mvp-store";
import { getInputModeFromInput, normalizeTaskInput, type CreateTaskResponse, type InputMode, type RawTaskInput } from "../../../lib/mvp-schema";

export async function POST(request: Request) {
  const body = (await request.json()) as RawTaskInput & { inputMode?: InputMode };
  const input = normalizeTaskInput(body);

  if (!input.themeText) {
    return NextResponse.json({ error: "Theme text is required." }, { status: 400 });
  }

  const inputMode = body.inputMode ?? getInputModeFromInput(input, false);
  const record = createTaskRecord({
    title: input.title,
    inputMode,
    input
  });

  const response: CreateTaskResponse = {
    taskId: record.taskId,
    status: record.status,
    inputMode: record.inputMode,
    task: {
      title: record.title,
      createdAt: record.createdAt
    }
  };

  return NextResponse.json(response);
}
