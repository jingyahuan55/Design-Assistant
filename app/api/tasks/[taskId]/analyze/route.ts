import { NextResponse } from "next/server";
import { getTaskRecord, markTaskStatus, saveTaskAnalysis } from "../../../../../lib/mvp-store";
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
  const completedRecord = saveTaskAnalysis(taskId, result);

  if (!completedRecord) {
    return NextResponse.json({ error: "Unable to complete analysis." }, { status: 500 });
  }

  const generatedAt = completedRecord.generatedAt ?? completedRecord.updatedAt;
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
    generatedAt
  };

  return NextResponse.json(response);
}

export async function GET(_request: Request, { params }: Params) {
  const { taskId } = await params;
  const record = getTaskRecord(taskId);

  if (!record) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!record.result || !record.generatedAt) {
    return NextResponse.json({ error: "Analysis not ready yet." }, { status: 409 });
  }

  const response: AnalyzeResponse = {
    taskId,
    status: record.status,
    task: {
      title: record.title,
      inputMode: record.inputMode,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    },
    input: record.input,
    asset: record.asset,
    result: record.result,
    generatedAt: record.generatedAt
  };

  return NextResponse.json(response);
}
