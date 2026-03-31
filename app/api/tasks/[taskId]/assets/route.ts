import { NextResponse } from "next/server";
import { attachAssetToTask, getTaskRecord } from "../../../../../lib/mvp-store";
import { buildAssetRecord, type UploadAssetResponse } from "../../../../../lib/mvp-schema";

type Params = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  const { taskId } = await params;
  const record = getTaskRecord(taskId);

  if (!record) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const asset = buildAssetRecord(file);
  const updated = attachAssetToTask(taskId, asset);

  if (!updated) {
    return NextResponse.json({ error: "Unable to attach image to task." }, { status: 500 });
  }

  const response: UploadAssetResponse = {
    taskId,
    status: updated.status,
    asset
  };

  return NextResponse.json(response);
}
