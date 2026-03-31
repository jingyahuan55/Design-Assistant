import { WorkspaceForm } from "../../components/workspace-form";

const checkpoints = [
  "Theme and tone are enough to produce a direction.",
  "One optional image adds adaptation and overlay guidance.",
  "The result board stays structured so it can refresh safely."
];

export default function WorkspacePage() {
  return (
    <main className="space-y-8">
      <section className="glass-panel overflow-hidden rounded-[40px] px-6 py-8 md:px-10 md:py-10">
        <div className="hero-orb h-44 w-44 bg-[rgba(31,109,99,0.14)] right-[8%] top-[8%]" />
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div>
            <span className="eyebrow-chip">Workspace</span>
            <h1 className="display-title mt-5 text-4xl leading-[0.96] text-stone-900 md:text-6xl">
              Feed the tool just enough context to make the visual direction feel specific.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--foreground-soft)]">
              This stage is intentionally lightweight: one theme, one short context, optional tone cues, optional image.
              The goal is speed without losing the feeling of a considered design system.
            </p>
          </div>

          <aside className="panel-soft rounded-[32px] p-5 md:p-6">
            <p className="field-label">What this run will return</p>
            <div className="mt-4 space-y-3">
              {checkpoints.map((checkpoint) => (
                <div className="rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-[var(--foreground-soft)]" key={checkpoint}>
                  {checkpoint}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <WorkspaceForm />
    </main>
  );
}
