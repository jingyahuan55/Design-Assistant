import { WorkspaceForm } from "../../components/workspace-form";

export default function WorkspacePage() {
  return (
    <main className="space-y-6">
      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">Workspace</p>
        <h1 className="mt-4 text-3xl font-semibold text-stone-900 md:text-5xl">Collect the minimum input and trigger structured analysis.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
          This page now matches the Step 3 flow: collect the theme, optional context, optional tone cues, one image,
          and send everything through a fixed result contract.
        </p>
      </section>
      <WorkspaceForm />
    </main>
  );
}
