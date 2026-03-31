import { NextResponse } from "next/server";
import { getTaskRecord } from "../../../../lib/mvp-store";
import type { TaskDetailResponse } from "../../../../lib/mvp-schema";

type Params = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { taskId } = await params;
  const record = getTaskRecord(taskId);

  if (!record) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!record.result || !record.generatedAt) {
    return NextResponse.json({ error: "Analysis not ready yet." }, { status: 409 });
  }

  const response: TaskDetailResponse = {
    taskId,
    status: record.status,
    task: {
      title: record.title,
      inputMode: record.inputMode,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isAutoNamed: record.isAutoNamed
    },
    input: record.input,
    asset: record.asset,
    result: record.result,
    generatedAt: record.generatedAt
  };

  return NextResponse.json(response);
}
