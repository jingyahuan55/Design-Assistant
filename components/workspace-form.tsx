"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalyzeResponse, CreateTaskResponse, UploadAssetResponse } from "../lib/mvp-schema";

type SubmitState = {
  error: string | null;
  isSubmitting: boolean;
};

type ApiError = {
  error: string;
};

function readApiError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return fallback;
}

export function WorkspaceForm() {
  const router = useRouter();
  const [title, setTitle] = useState("Singapore Hawker App");
  const [themeText, setThemeText] = useState("Singapore hawker culture");
  const [descriptionText, setDescriptionText] = useState("A polished demo for a community-first food discovery experience.");
  const [styleKeywords, setStyleKeywords] = useState("warm, urban, friendly");
  const [toneKeywords, setToneKeywords] = useState("inclusive, vibrant");
  const [file, setFile] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({
    error: null,
    isSubmitting: false
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ error: null, isSubmitting: true });

    try {
      const taskResponse = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          inputMode: file ? "mixed" : "text",
          themeText,
          descriptionText,
          styleKeywords,
          toneKeywords
        })
      });

      const taskPayload = (await taskResponse.json()) as CreateTaskResponse | ApiError;
      if (!taskResponse.ok || !("taskId" in taskPayload)) {
        throw new Error(readApiError(taskPayload, "Unable to create the analysis task."));
      }

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const assetResponse = await fetch(`/api/tasks/${taskPayload.taskId}/assets`, {
          method: "POST",
          body: formData
        });

        const assetPayload = (await assetResponse.json()) as UploadAssetResponse | ApiError;
        if (!assetResponse.ok || !("asset" in assetPayload)) {
          throw new Error(readApiError(assetPayload, "Unable to upload the selected image."));
        }
      }

      const analyzeResponse = await fetch(`/api/tasks/${taskPayload.taskId}/analyze`, {
        method: "POST"
      });

      const analyzePayload = (await analyzeResponse.json()) as AnalyzeResponse | ApiError;
      if (!analyzeResponse.ok || !("result" in analyzePayload)) {
        throw new Error(readApiError(analyzePayload, "The analyze request failed."));
      }

      sessionStorage.setItem(`mvp-task:${taskPayload.taskId}`, JSON.stringify(analyzePayload.result));

      startTransition(() => {
        router.push(`/result?taskId=${taskPayload.taskId}`);
      });
    } catch (error) {
      setSubmitState({
        error: error instanceof Error ? error.message : "An unexpected error happened.",
        isSubmitting: false
      });
      return;
    }

    setSubmitState({ error: null, isSubmitting: false });
  }

  return (
    <form className="glass-panel rounded-[32px] p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Task title</span>
          <input
            className="w-full rounded-2xl border border-stone-300/70 bg-white/80 px-4 py-3 outline-none transition focus:border-stone-500"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Style keywords</span>
          <input
            className="w-full rounded-2xl border border-stone-300/70 bg-white/80 px-4 py-3 outline-none transition focus:border-stone-500"
            onChange={(event) => setStyleKeywords(event.target.value)}
            value={styleKeywords}
          />
        </label>
      </div>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-medium text-stone-700">Theme description</span>
        <textarea
          className="min-h-32 w-full rounded-[24px] border border-stone-300/70 bg-white/80 px-4 py-3 outline-none transition focus:border-stone-500"
          onChange={(event) => setThemeText(event.target.value)}
          value={themeText}
        />
      </label>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-medium text-stone-700">Project context</span>
        <textarea
          className="min-h-28 w-full rounded-[24px] border border-stone-300/70 bg-white/80 px-4 py-3 outline-none transition focus:border-stone-500"
          onChange={(event) => setDescriptionText(event.target.value)}
          value={descriptionText}
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_260px]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Tone keywords</span>
          <input
            className="w-full rounded-2xl border border-stone-300/70 bg-white/80 px-4 py-3 outline-none transition focus:border-stone-500"
            onChange={(event) => setToneKeywords(event.target.value)}
            value={toneKeywords}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-700">Single reference image</span>
          <input
            accept="image/*"
            className="block w-full rounded-2xl border border-dashed border-stone-400/70 bg-white/80 px-4 py-[0.85rem] text-sm"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
          <p className="text-xs text-stone-500">{file ? `Attached: ${file.name}` : "Optional, but useful for image adaptation guidance."}</p>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-stone-600">
          Step 4 quality pass: keep the same schema, add stronger rule signals, and make the result page resilient on refresh.
        </p>
        <button
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitState.isSubmitting || !themeText.trim()}
          type="submit"
        >
          {submitState.isSubmitting ? "Running rule checks..." : "Generate design language"}
        </button>
      </div>

      {submitState.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitState.error}</p>
      ) : null}
    </form>
  );
}
