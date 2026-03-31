"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fallbackResult, type AnalysisResult, type TaskDetailResponse } from "../lib/mvp-schema";
import { SectionCard } from "./section-card";

type ViewStatus = "loading" | "ready" | "error";
type ResultSource = "live" | "preview" | "fallback";

function statusChipClass(status: "pass" | "watch" | "safe") {
  return status === "pass" || status === "safe" ? "status-chip status-chip-pass" : "status-chip status-chip-watch";
}

function buildTalkTrack(result: AnalysisResult) {
  return [
    {
      step: "01",
      title: "Frame the concept",
      body: result.summary.themeSummary
    },
    {
      step: "02",
      title: "Point to the UI moves",
      body: `Lead with ${result.colorSystem[0]?.label.toLowerCase() ?? "the primary token"}, support it with ${result.colorSystem[1]?.label.toLowerCase() ?? "a secondary token"}, and apply the image guidance to ${result.imageAdaptation.placementRecommendation.toLowerCase()}`
    },
    {
      step: "03",
      title: "Close with handoff confidence",
      body: `${result.accessibility.contrastAlert} The export block is already formatted for quick code or token handoff.`
    }
  ];
}

export function ResultView() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const [result, setResult] = useState<AnalysisResult>(fallbackResult);
  const [status, setStatus] = useState<ViewStatus>("loading");
  const [source, setSource] = useState<ResultSource>("preview");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<"css" | "tailwind" | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResult() {
      if (!taskId) {
        if (!cancelled) {
          setResult(fallbackResult);
          setSource("preview");
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
            setSource("live");
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
          throw new Error(
            payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
              ? payload.error
              : "Unable to load this analysis result."
          );
        }

        sessionStorage.setItem(`mvp-task:${taskId}`, JSON.stringify(payload.result));

        if (!cancelled) {
          setResult(payload.result);
          setSource("live");
          setErrorMessage(null);
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setResult(fallbackResult);
          setSource("fallback");
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

  const talkTrack = buildTalkTrack(result);
  const heroInsight = [
    {
      eyebrow: "Opening line",
      title: "Why this direction works",
      body: result.summary.visualStrategy
    },
    {
      eyebrow: "Best application",
      title: "Where to show it in the demo",
      body: result.imageAdaptation.placementRecommendation
    },
    {
      eyebrow: "Guardrail",
      title: "What to check before handoff",
      body: result.accessibility.readabilityAlert
    }
  ];

  if (status === "loading") {
    return (
      <div className="glass-panel rounded-[34px] p-8">
        <p className="text-sm text-[var(--foreground-soft)]">Loading the structured analysis board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {source !== "live" ? (
        <section className="panel-soft rounded-[30px] px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="field-label">{source === "preview" ? "Preview Mode" : "Fallback Preview"}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">
                {source === "preview"
                  ? "You opened the result board without a live task, so this screen is showing the stable demo preset. Start a new run to generate your own structured output."
                  : `${errorMessage} You are seeing the stable fallback board so the demo can keep moving.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="cta-primary border-0" href="/workspace">
                Start a new run
              </Link>
              <Link className="cta-secondary px-4 py-2 text-sm" href="/">
                Back to landing
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="glass-panel overflow-hidden rounded-[40px] px-6 py-7 md:px-8 md:py-8">
        <div className="hero-orb h-44 w-44 bg-[rgba(31,109,99,0.12)] right-[6%] top-[6%]" />
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="eyebrow-chip">Result Board</span>
            <h1 className="display-title mt-5 max-w-4xl text-4xl leading-[0.95] text-stone-900 md:text-6xl">
              {result.summary.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--foreground-soft)]">{result.summary.themeSummary}</p>
            <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/70 px-5 py-4 text-sm leading-7 text-[var(--foreground-soft)]">
              {result.summary.visualStrategy}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {result.summary.keywords.map((keyword) => (
                <span className="board-chip" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="cta-primary border-0" href="/workspace">
                Generate another run
              </Link>
              <a className="cta-secondary px-4 py-2 text-sm" href="#demo-talk-track">
                Jump to talk track
              </a>
            </div>
          </div>

          <div className="board-grid">
            <article className="board-card">
              <p className="field-label">System Snapshot</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={statusChipClass(result.accessibility.contrastStatus)}>
                  Contrast {result.accessibility.contrastStatus === "pass" ? "Pass" : "Watch"}
                </span>
                <span className={statusChipClass(result.accessibility.readabilityStatus)}>
                  Image {result.accessibility.readabilityStatus === "safe" ? "Safe" : "Watch"}
                </span>
                <span className="status-chip status-chip-pass">{result.imageAdaptation.hasImage ? "Image attached" : "Theme only"}</span>
                <span className="status-chip status-chip-pass">{source === "live" ? "Live run" : "Demo preview"}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {result.colorSystem.slice(0, 4).map((token) => (
                  <div className="preview-swatch" key={token.tokenName} style={{ backgroundColor: token.hex }} title={token.hex} />
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="metric-pill">
                  <span className="metric-label">Contrast ratio</span>
                  <span className="metric-value">{result.accessibility.contrastRatio}:1</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-label">Overlay range</span>
                  <span className="metric-value text-base">{result.imageAdaptation.overlayOpacity}</span>
                </div>
              </div>
            </article>

            <article className="panel-soft rounded-[28px] p-5">
              <p className="field-label">Mood prompt</p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">{result.moodboard.moodPrompt}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {heroInsight.map((item) => (
          <article className="glass-panel rounded-[30px] p-5 md:p-6" key={item.title}>
            <p className="field-label">{item.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">{item.body}</p>
          </article>
        ))}
      </section>

      <SectionCard className="overflow-hidden" eyebrow="Demo Flow" title="A stronger talk track for presenting this result board">
        <div className="demo-track-grid" id="demo-talk-track">
          {talkTrack.map((item) => (
            <article className="demo-track-card" key={item.step}>
              <span className="demo-track-step">{item.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">{item.body}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard eyebrow="Moodboard" title="Direction board">
          <div className="grid gap-3 sm:grid-cols-2">
            {result.moodboard.styleTags.map((tag) => (
              <div className="rounded-[22px] border border-[var(--line)] bg-white/72 px-4 py-3" key={tag}>
                <p className="text-sm font-medium text-stone-800">{tag}</p>
              </div>
            ))}
          </div>
          <p>
            <strong>Icon direction:</strong> {result.moodboard.iconDirection}
          </p>
          <p>
            <strong>Texture direction:</strong> {result.moodboard.textureDirection}
          </p>
        </SectionCard>

        <SectionCard eyebrow="Image Adaptation" title="How the image should behave">
          {result.imageAdaptation.hasImage ? (
            <>
              <p>{result.imageAdaptation.assetSummary}</p>
              <div className="flex flex-wrap gap-2">
                {result.imageAdaptation.palette.map((swatch) => (
                  <span
                    aria-label={swatch}
                    className="preview-swatch"
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
            <div className="rounded-[24px] border border-dashed border-[var(--line-strong)] bg-white/60 px-4 py-4 text-sm text-[var(--foreground-soft)]">
              No reference image was uploaded. This section is showing safe defaults based on theme-only analysis.
            </div>
          )}
          <p>
            <strong>Border treatment:</strong> {result.imageAdaptation.borderRecommendation}
          </p>
          <p>
            <strong>Best placement:</strong> {result.imageAdaptation.placementRecommendation}
          </p>
          <p>
            <strong>Safe text region:</strong> {result.imageAdaptation.safeTextRegion}
          </p>
          <p>
            <strong>Caution zone:</strong> {result.imageAdaptation.cautionZone}
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <SectionCard eyebrow="Accessibility" title="Minimum quality guardrails">
          <p>
            <strong>Contrast:</strong> {result.accessibility.contrastAlert}
          </p>
          <p>
            <strong>Readable imagery:</strong> {result.accessibility.readabilityAlert}
          </p>
          <p>
            <strong>State guidance:</strong> {result.accessibility.stateGuidance}
          </p>
        </SectionCard>

        <SectionCard eyebrow="Color System" title="Core tokens">
          <div className="grid gap-3 md:grid-cols-2">
            {result.colorSystem.map((token) => (
              <div className="rounded-[24px] border border-[var(--line)] bg-white/72 p-4" key={token.tokenName}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-stone-900">{token.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{token.tokenName}</p>
                  </div>
                  <div className="preview-swatch" style={{ backgroundColor: token.hex }} title={token.hex} />
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--foreground-soft)]">{token.usage}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard eyebrow="Export" title="CSS variables">
          <pre className="code-panel text-xs leading-6">{result.exportSnippets.cssVariables}</pre>
          <button className="cta-secondary px-4 py-2 text-sm" onClick={() => handleCopy("css", result.exportSnippets.cssVariables)} type="button">
            {copied === "css" ? "Copied" : "Copy CSS variables"}
          </button>
        </SectionCard>

        <SectionCard eyebrow="Export" title="Tailwind theme snippet">
          <pre className="code-panel text-xs leading-6">{result.exportSnippets.tailwindSnippet}</pre>
          <button className="cta-secondary px-4 py-2 text-sm" onClick={() => handleCopy("tailwind", result.exportSnippets.tailwindSnippet)} type="button">
            {copied === "tailwind" ? "Copied" : "Copy Tailwind snippet"}
          </button>
        </SectionCard>
      </div>
    </div>
  );
}