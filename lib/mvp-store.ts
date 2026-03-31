import {
  buildDraftTaskTitle,
  getInputModeFromInput,
  type AnalysisResult,
  type AssetRecord,
  type InputMode,
  type TaskInput,
  type TaskStatus
} from "./mvp-schema";

export type StoredTask = {
  taskId: string;
  title: string;
  isAutoNamed: boolean;
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

export function createTaskRecord(input: { title?: string; inputMode?: InputMode; input: TaskInput; hasImage?: boolean }) {
  const taskId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const titleMeta = buildDraftTaskTitle(input.input);
  const record: StoredTask = {
    taskId,
    title: titleMeta.title,
    isAutoNamed: titleMeta.isAutoNamed,
    status: "draft",
    inputMode: input.inputMode ?? getInputModeFromInput(input.input, Boolean(input.hasImage)),
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
    inputMode: getInputModeFromInput(record.input, true),
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
    title: result.summary.title,
    status: "completed",
    result,
    generatedAt: timestamp,
    updatedAt: timestamp
  };

  taskStore.set(taskId, updated);
  return updated;
}
