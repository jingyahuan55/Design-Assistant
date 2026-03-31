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

const examples = ["Singapore hawker culture", "Inclusive community health service", "Night transit information system"];
const outputs = ["Direction board", "Color tokens", "Image overlay guidance", "Accessibility signals"];

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
    <form className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]" onSubmit={handleSubmit}>
      <section className="glass-panel rounded-[34px] p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="field-label">Task title</span>
            <input className="field-input" onChange={(event) => setTitle(event.target.value)} value={title} />
          </label>

          <label className="space-y-2">
            <span className="field-label">Style keywords</span>
            <input className="field-input" onChange={(event) => setStyleKeywords(event.target.value)} value={styleKeywords} />
          </label>
        </div>

        <label className="mt-5 block space-y-2">
          <span className="field-label">Theme</span>
          <textarea
            className="field-input field-textarea"
            onChange={(event) => setThemeText(event.target.value)}
            value={themeText}
          />
        </label>

        <label className="mt-5 block space-y-2">
          <span className="field-label">Project context</span>
          <textarea
            className="field-input min-h-28"
            onChange={(event) => setDescriptionText(event.target.value)}
            value={descriptionText}
          />
        </label>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_260px]">
          <label className="space-y-2">
            <span className="field-label">Tone keywords</span>
            <input className="field-input" onChange={(event) => setToneKeywords(event.target.value)} value={toneKeywords} />
          </label>

          <label className="space-y-2">
            <span className="field-label">Reference image</span>
            <input
              accept="image/*"
              className="field-input block cursor-pointer border-dashed py-[0.88rem] text-sm"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
            <p className="text-xs text-[var(--muted)]">{file ? `Attached: ${file.name}` : "Optional, but useful for overlay and readability guidance."}</p>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[var(--line)] bg-white/65 px-4 py-4">
          <p className="max-w-xl text-sm leading-6 text-[var(--foreground-soft)]">
            This run keeps the Step 4 contract intact and adds stronger rule feedback so the result board feels closer to a
            real design review surface.
          </p>
          <button className="cta-primary border-0 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitState.isSubmitting || !themeText.trim()} type="submit">
            {submitState.isSubmitting ? "Running analysis..." : "Generate design language"}
          </button>
        </div>

        {submitState.error ? (
          <p className="mt-4 rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitState.error}</p>
        ) : null}
      </section>

      <div className="space-y-5">
        <section className="glass-panel rounded-[32px] p-6">
          <p className="field-label">Prompt seeds</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                className="board-chip border-0 text-left"
                key={example}
                onClick={() => setThemeText(example)}
                type="button"
              >
                {example}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--foreground-soft)]">
            Use the examples to stress-test whether the system can shift between food, care, and transit style directions.
          </p>
        </section>

        <section className="glass-panel rounded-[32px] p-6">
          <p className="field-label">What comes back</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {outputs.map((item) => (
              <div className="metric-pill" key={item}>
                <span className="metric-value text-base">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </form>
  );
}
