import { Suspense } from "react";
import { ResultView } from "../../components/result-view";

export default function ResultPage() {
  return (
    <main className="space-y-6">
      <Suspense
        fallback={
          <div className="glass-panel rounded-[32px] p-8">
            <p className="text-sm text-stone-600">Loading the skeleton result...</p>
          </div>
        }
      >
        <ResultView />
      </Suspense>
    </main>
  );
}
