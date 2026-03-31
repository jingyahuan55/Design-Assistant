import { NextResponse } from "next/server";
import { getTaskRecord, markTaskStatus } from "../../../../../lib/mvp-store";
import { buildAnalysisResult, type AnalyzeResponse } from "../../../../../lib/mvp-schema";

type Params = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(_request: Request, { params }: Params) {
  const { taskId } = await params;
  const processingRecord = markTaskStatus(taskId, "processing");

  if (!processingRecord) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const result = buildAnalysisResult(processingRecord.input, processingRecord.asset);
  const completedRecord = markTaskStatus(taskId, "completed");

  if (!completedRecord) {
    return NextResponse.json({ error: "Unable to complete analysis." }, { status: 500 });
  }

  const response: AnalyzeResponse = {
    taskId,
    status: completedRecord.status,
    task: {
      title: completedRecord.title,
      inputMode: completedRecord.inputMode,
      createdAt: completedRecord.createdAt,
      updatedAt: completedRecord.updatedAt
    },
    input: completedRecord.input,
    asset: completedRecord.asset,
    result,
    generatedAt: new Date().toISOString()
  };

  return NextResponse.json(response);
}
