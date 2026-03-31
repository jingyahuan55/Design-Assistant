import { NextResponse } from "next/server";
import { buildMockResult, type TaskInput } from "../../../../../lib/mvp-schema";

type Params = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  const { taskId } = await params;
  const body = (await request.json()) as TaskInput;

  return NextResponse.json({
    taskId,
    status: "completed",
    result: buildMockResult(body)
  });
}

