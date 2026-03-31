import type { AnalysisResult, AssetRecord, InputMode, TaskInput, TaskStatus } from "./mvp-schema";

export type StoredTask = {
  taskId: string;
  title: string;
  status: TaskStatus;
  inputMode: InputMode;
  input: TaskInput;
  asset: AssetRecord | null;
  result: AnalysisResult | null;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const taskStore = new Map<string, StoredTask>();

export function createTaskRecord(input: { title?: string; inputMode: InputMode; input: TaskInput }) {
  const taskId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const record: StoredTask = {
    taskId,
    title: input.title?.trim() || input.input.themeText,
    status: "draft",
    inputMode: input.inputMode,
    input: input.input,
    asset: null,
    result: null,
    generatedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  taskStore.set(taskId, record);
  return record;
}

export function getTaskRecord(taskId: string) {
  return taskStore.get(taskId) ?? null;
}

export function attachAssetToTask(taskId: string, asset: AssetRecord) {
  const record = taskStore.get(taskId);
  if (!record) {
    return null;
  }

  const updated: StoredTask = {
    ...record,
    asset,
    inputMode: record.inputMode === "text" ? "mixed" : record.inputMode,
    updatedAt: new Date().toISOString()
  };

  taskStore.set(taskId, updated);
  return updated;
}

export function markTaskStatus(taskId: string, status: TaskStatus) {
  const record = taskStore.get(taskId);
  if (!record) {
    return null;
  }

  const updated: StoredTask = {
    ...record,
    status,
    updatedAt: new Date().toISOString()
  };

  taskStore.set(taskId, updated);
  return updated;
}

export function saveTaskAnalysis(taskId: string, result: AnalysisResult) {
  const record = taskStore.get(taskId);
  if (!record) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const updated: StoredTask = {
    ...record,
    status: "completed",
    result,
    generatedAt: timestamp,
    updatedAt: timestamp
  };

  taskStore.set(taskId, updated);
  return updated;
}
