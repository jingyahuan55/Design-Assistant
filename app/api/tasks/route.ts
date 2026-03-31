import { NextResponse } from "next/server";
import { createTaskRecord } from "../../../lib/mvp-store";
import { getInputModeFromInput, normalizeTaskInput, type CreateTaskResponse, type RawTaskInput } from "../../../lib/mvp-schema";

export async function POST(request: Request) {
  const body = (await request.json()) as RawTaskInput & { hasImage?: boolean };
  const input = normalizeTaskInput(body);
  const hasImage = Boolean(body.hasImage);
  const record = createTaskRecord({
    title: input.title,
    inputMode: getInputModeFromInput(input, hasImage),
    input,
    hasImage
  });

  const response: CreateTaskResponse = {
    taskId: record.taskId,
    status: record.status,
    inputMode: record.inputMode,
    task: {
      title: record.title,
      createdAt: record.createdAt,
      isAutoNamed: record.isAutoNamed
    }
  };

  return NextResponse.json(response);
}
