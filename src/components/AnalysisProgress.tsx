"use client";

type AnalysisStep = "idle" | "fetching" | "analyzing" | "done" | "error";

const STEPS = [
  { key: "fetching", label: "Fetching repo data" },
  { key: "analyzing", label: "Analyzing with AI" },
  { key: "done", label: "Complete" },
] as const;

interface AnalysisProgressProps {
  step: AnalysisStep;
  errorMessage?: string;
}

export function AnalysisProgress({ step, errorMessage }: AnalysisProgressProps) {
  const stepIndex = step === "fetching" ? 0 : step === "analyzing" ? 1 : step === "done" ? 2 : -1;

  if (step === "error") {
    return (
      <div className="og-glass-card rounded-xl border-[rgba(242,58,58,0.3)] bg-[rgba(242,58,58,0.06)] p-4 text-sm text-[#f23a3a]">
        <p className="font-semibold">Analysis failed</p>
        <p className="mt-1 text-[#cccccc]">{errorMessage ?? "An unexpected error occurred. Please try again."}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {STEPS.map((s, i) => {
        const isComplete = i < stepIndex || step === "done";
        const isActive = i === stepIndex && step !== "done";
        return (
          <div key={s.key} className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                isComplete
                  ? "bg-[#41c885] border-[#41c885] text-white"
                  : isActive
                  ? "border-[#24bce3] text-[#24bce3] animate-pulse shadow-[0_0_12px_rgba(36,188,227,0.3)]"
                  : "border-[#1d2c4b] text-[#666666]"
              }`}
            >
              {isComplete ? "✓" : i + 1}
            </div>
            <span
              className={`text-sm ${
                isActive ? "font-medium text-[#24bce3]" : isComplete ? "text-[#41c885]" : "text-[#666666]"
              }`}
            >
              {s.label}
              {isActive && "..."}
            </span>
          </div>
        );
      })}
    </div>
  );
}
