import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  const { taskId } = await params;
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  return NextResponse.json({
    taskId,
    asset: {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    }
  });
}

