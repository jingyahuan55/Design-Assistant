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

type DemoPreset = {
  name: string;
  title: string;
  themeText: string;
  descriptionText: string;
  styleKeywords: string;
  toneKeywords: string;
};

const presets: DemoPreset[] = [
  {
    name: "Singapore Hawker",
    title: "Singapore Hawker App",
    themeText: "Singapore hawker culture",
    descriptionText: "A polished demo for a community-first food discovery experience with warmth, modular cards, and city texture.",
    styleKeywords: "warm, urban, friendly",
    toneKeywords: "inclusive, vibrant"
  },
  {
    name: "Inclusive Care",
    title: "Community Health Service",
    themeText: "Inclusive community health service",
    descriptionText: "A calm service experience for booking, guidance, and support, with emphasis on trust, accessibility, and reassurance.",
    styleKeywords: "calm, trustworthy, clear",
    toneKeywords: "accessible, supportive"
  },
  {
    name: "Night Transit",
    title: "Night Transit Information Screen",
    themeText: "Urban night transit information system",
    descriptionText: "A high-contrast wayfinding surface that helps commuters read timing, route changes, and alerts at a glance.",
    styleKeywords: "high-contrast, urban, compact",
    toneKeywords: "alert, legible"
  }
];

const outputs = ["Direction board", "Color tokens", "Image overlay guidance", "Accessibility signals"];
const demoFlow = [
  "Pick one stable preset so the story starts strong before you improvise.",
  "Attach an image only when you want to demonstrate overlay, text color, and readability rules.",
  "Present the result top-down: summary, design moves, accessibility checks, then code exports."
];

function readApiError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return fallback;
}

export function WorkspaceForm() {
  const router = useRouter();
  const [title, setTitle] = useState(presets[0].title);
  const [themeText, setThemeText] = useState(presets[0].themeText);
  const [descriptionText, setDescriptionText] = useState(presets[0].descriptionText);
  const [styleKeywords, setStyleKeywords] = useState(presets[0].styleKeywords);
  const [toneKeywords, setToneKeywords] = useState(presets[0].toneKeywords);
  const [file, setFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(presets[0].name);
  const [submitState, setSubmitState] = useState<SubmitState>({
    error: null,
    isSubmitting: false
  });

  function applyPreset(preset: DemoPreset) {
    setSelectedPreset(preset.name);
    setTitle(preset.title);
    setThemeText(preset.themeText);
    setDescriptionText(preset.descriptionText);
    setStyleKeywords(preset.styleKeywords);
    setToneKeywords(preset.toneKeywords);
  }

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
            This run keeps the Step 4 contract intact and now returns a presenter-friendly board with key highlights, talk track,
            and export-ready snippets.
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
          <div className="flex items-center justify-between gap-3">
            <p className="field-label">Demo presets</p>
            <span className="text-xs text-[var(--muted)]">Selected: {selectedPreset}</span>
          </div>

          <div className="mt-4 space-y-3">
            {presets.map((preset) => {
              const isSelected = selectedPreset === preset.name;
              return (
                <button
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-[rgba(200,106,47,0.35)] bg-[rgba(242,207,182,0.42)]"
                      : "border-[var(--line)] bg-white/70 hover:bg-white/88"
                  }`}
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-stone-900">{preset.name}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">{preset.descriptionText}</p>
                    </div>
                    <span className="board-chip border-0">Use</span>
                  </div>
                </button>
              );
            })}
          </div>
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

        <section className="glass-panel rounded-[32px] p-6">
          <p className="field-label">Best demo flow</p>
          <div className="mt-4 space-y-3">
            {demoFlow.map((item, index) => (
              <div className="rounded-[22px] border border-[var(--line)] bg-white/72 px-4 py-4" key={item}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Step 0{index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </form>
  );
}