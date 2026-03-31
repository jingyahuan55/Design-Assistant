"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fallbackResult, type AnalysisResult, type TaskDetailResponse } from "../lib/mvp-schema";
import { SectionCard } from "./section-card";

type ViewStatus = "loading" | "ready" | "error";

function statusChipTone(status: "pass" | "watch" | "safe") {
  if (status === "pass" || status === "safe") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-800";
}

export function ResultView() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const [result, setResult] = useState<AnalysisResult>(fallbackResult);
  const [status, setStatus] = useState<ViewStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<"css" | "tailwind" | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResult() {
      if (!taskId) {
        if (!cancelled) {
          setResult(fallbackResult);
          setErrorMessage(null);
          setStatus("ready");
        }
        return;
      }

      const stored = sessionStorage.getItem(`mvp-task:${taskId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AnalysisResult;
          if (!cancelled) {
            setResult(parsed);
            setErrorMessage(null);
            setStatus("ready");
          }
          return;
        } catch {
          sessionStorage.removeItem(`mvp-task:${taskId}`);
        }
      }

      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          cache: "no-store"
        });
        const payload = (await response.json()) as TaskDetailResponse | { error?: string };

        if (!response.ok || !("result" in payload)) {
          throw new Error((payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") ? payload.error : "Unable to load this analysis result.");
        }

        sessionStorage.setItem(`mvp-task:${taskId}`, JSON.stringify(payload.result));

        if (!cancelled) {
          setResult(payload.result);
          setErrorMessage(null);
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setResult(fallbackResult);
          setErrorMessage(error instanceof Error ? error.message : "Unable to load this analysis result.");
          setStatus("error");
        }
      }
    }

    setStatus("loading");
    loadResult();

    return () => {
      cancelled = true;
    };
  }, [taskId]);

  async function handleCopy(kind: "css" | "tailwind", text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }

  if (status === "loading") {
    return (
      <div className="glass-panel rounded-[32px] p-8">
        <p className="text-sm text-stone-600">Loading the structured analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {errorMessage} Showing the fallback preview result instead.
        </div>
      ) : null}

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
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusChipTone(result.accessibility.contrastStatus)}`}>
              Contrast {result.accessibility.contrastStatus === "pass" ? "Pass" : "Watch"}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusChipTone(result.accessibility.readabilityStatus)}`}>
              Image readability {result.accessibility.readabilityStatus === "safe" ? "Safe" : "Watch"}
            </span>
          </div>
          <p>
            <strong>Contrast:</strong> {result.accessibility.contrastAlert}
          </p>
          <p>
            <strong>Readable imagery:</strong> {result.accessibility.readabilityAlert}
          </p>
          <p>
            <strong>State guidance:</strong> {result.accessibility.stateGuidance}
          </p>
          <p>
            <strong>Measured ratio:</strong> {result.accessibility.contrastRatio}:1
          </p>
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
          {result.imageAdaptation.hasImage ? (
            <>
              <p>{result.imageAdaptation.assetSummary}</p>
              <div className="flex flex-wrap gap-2">
                {result.imageAdaptation.palette.map((swatch) => (
                  <span
                    aria-label={swatch}
                    className="h-10 w-10 rounded-2xl border border-black/10"
                    key={swatch}
                    style={{ backgroundColor: swatch }}
                    title={swatch}
                  />
                ))}
              </div>
              <p>
                <strong>Overlay:</strong> {result.imageAdaptation.overlayRecommendation}
              </p>
              <p>
                <strong>Suggested opacity:</strong> {result.imageAdaptation.overlayOpacity}
              </p>
              <p>
                <strong>Text on image:</strong> {result.imageAdaptation.textOnImageRecommendation}
              </p>
              <p>
                <strong>Recommended text color:</strong> {result.imageAdaptation.recommendedTextColor}
              </p>
            </>
          ) : (
            <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50/70 p-4 text-sm text-stone-600">
              No reference image was uploaded. This section is showing safe defaults based on theme-only analysis.
            </div>
          )}
          <p>{result.imageAdaptation.borderRecommendation}</p>
          <p>{result.imageAdaptation.placementRecommendation}</p>
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
