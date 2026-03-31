"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fallbackResult, type AnalysisResult } from "../lib/mvp-schema";
import { SectionCard } from "./section-card";

export function ResultView() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const [result, setResult] = useState<AnalysisResult>(fallbackResult);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [copied, setCopied] = useState<"css" | "tailwind" | null>(null);

  useEffect(() => {
    if (!taskId) {
      setStatus("ready");
      return;
    }

    const stored = sessionStorage.getItem(`mvp-task:${taskId}`);
    if (stored) {
      setResult(JSON.parse(stored) as AnalysisResult);
    }
    setStatus("ready");
  }, [taskId]);

  async function handleCopy(kind: "css" | "tailwind", text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }

  if (status === "loading") {
    return (
      <div className="glass-panel rounded-[32px] p-8">
        <p className="text-sm text-stone-600">Loading the skeleton result...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Top Summary</p>
        <h1 className="max-w-3xl text-3xl font-semibold text-stone-900 md:text-5xl">{result.summary.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">{result.summary.themeSummary}</p>
        <p className="mt-4 max-w-3xl rounded-2xl bg-white/70 px-4 py-3 text-sm text-stone-700">
          {result.summary.visualStrategy}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {result.summary.keywords.map((keyword) => (
            <span
              className="rounded-full border border-stone-300/80 bg-white/80 px-3 py-1 text-xs font-medium text-stone-700"
              key={keyword}
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard eyebrow="Moodboard" title="Direction board">
          <div className="grid gap-3 md:grid-cols-2">
            {result.moodboard.styleTags.map((tag) => (
              <div className="rounded-3xl border border-stone-300/70 bg-white/70 p-4" key={tag}>
                <p className="text-sm font-medium text-stone-800">{tag}</p>
              </div>
            ))}
          </div>
          <p>{result.moodboard.iconDirection}</p>
          <p>{result.moodboard.textureDirection}</p>
          <p>{result.moodboard.moodPrompt}</p>
        </SectionCard>

        <SectionCard eyebrow="Accessibility" title="Minimum quality guardrails">
          <p>{result.accessibility.contrastAlert}</p>
          <p>{result.accessibility.readabilityAlert}</p>
          <p>{result.accessibility.stateGuidance}</p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <SectionCard eyebrow="Color System" title="Core tokens">
          <div className="grid gap-3">
            {result.colorSystem.map((token) => (
              <div className="rounded-[24px] border border-stone-300/80 bg-white/70 p-4" key={token.tokenName}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-stone-900">{token.label}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{token.tokenName}</p>
                  </div>
                  <div
                    aria-label={token.hex}
                    className="h-12 w-12 rounded-2xl border border-black/10"
                    style={{ backgroundColor: token.hex }}
                  />
                </div>
                <p className="mt-3 text-sm text-stone-700">{token.usage}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Image Adaptation" title="How the image should behave">
          <p>{result.imageAdaptation.overlayRecommendation}</p>
          <p>{result.imageAdaptation.textOnImageRecommendation}</p>
          <p>{result.imageAdaptation.borderRecommendation}</p>
          <p>
            <strong>Safe text region:</strong> {result.imageAdaptation.safeTextRegion}
          </p>
          <p>
            <strong>Caution zone:</strong> {result.imageAdaptation.cautionZone}
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard eyebrow="Export Snippets" title="CSS variables">
          <pre className="overflow-x-auto rounded-[24px] bg-stone-950 p-4 text-xs leading-6 text-stone-100">
            {result.exportSnippets.cssVariables}
          </pre>
          <button
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-700"
            onClick={() => handleCopy("css", result.exportSnippets.cssVariables)}
            type="button"
          >
            {copied === "css" ? "Copied" : "Copy CSS variables"}
          </button>
        </SectionCard>

        <SectionCard eyebrow="Export Snippets" title="Tailwind theme">
          <pre className="overflow-x-auto rounded-[24px] bg-stone-950 p-4 text-xs leading-6 text-stone-100">
            {result.exportSnippets.tailwindSnippet}
          </pre>
          <button
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-700"
            onClick={() => handleCopy("tailwind", result.exportSnippets.tailwindSnippet)}
            type="button"
          >
            {copied === "tailwind" ? "Copied" : "Copy Tailwind snippet"}
          </button>
        </SectionCard>
      </div>
    </div>
  );
}

