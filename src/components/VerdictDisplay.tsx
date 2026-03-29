"use client";

import { CategoryAccordion } from "@/components/CategoryAccordion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { VerdictResult, VerdictLevel } from "@/types/verdict";

const VERDICT_STYLES: Record<VerdictLevel, { bg: string; text: string; border: string; label: string; glow: string }> = {
  Safe: {
    bg: "bg-[rgba(65,200,133,0.08)]",
    text: "text-[#41c885]",
    border: "border-[rgba(65,200,133,0.3)]",
    label: "SAFE",
    glow: "shadow-[0_0_30px_rgba(65,200,133,0.15)]",
  },
  Risky: {
    bg: "bg-[rgba(196,149,8,0.08)]",
    text: "text-[#c49508]",
    border: "border-[rgba(196,149,8,0.3)]",
    label: "RISKY",
    glow: "shadow-[0_0_30px_rgba(196,149,8,0.15)]",
  },
  Dangerous: {
    bg: "bg-[rgba(242,58,58,0.08)]",
    text: "text-[#f23a3a]",
    border: "border-[rgba(242,58,58,0.3)]",
    label: "DANGEROUS",
    glow: "shadow-[0_0_30px_rgba(242,58,58,0.15)]",
  },
};

interface VerdictDisplayProps {
  result: VerdictResult;
  repoFullName: string;
}

export function VerdictDisplay({ result, repoFullName }: VerdictDisplayProps) {
  const style = VERDICT_STYLES[result.verdict];

  return (
    <div className="space-y-6">
      {/* Verdict banner */}
      <div className={`og-glass-card border-2 ${style.border} ${style.bg} ${style.glow} p-6 rounded-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#999999] font-mono">{repoFullName}</p>
            <h2 className={`text-4xl font-bold mt-1 ${style.text}`}>{style.label}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#999999]">Risk Score</p>
            <p className={`text-4xl font-bold ${style.text}`}>{result.overall_score}</p>
            <p className="text-xs text-[#666666]">/ 100</p>
          </div>
        </div>
        <div className="og-progress-track h-3 rounded-full">
          <div
            className="og-progress-fill h-full"
            style={{ width: `${result.overall_score}%` }}
          />
        </div>
        <p className="mt-4 text-sm text-[#cccccc]">{result.reasoning}</p>
        <p className="mt-2 text-xs text-[#666666]">
          Analyzed by {result.modelUsed} · {new Date(result.analyzedAt).toLocaleString()}
        </p>
      </div>

      {/* Top findings */}
      <div className="og-glass-card p-6 rounded-xl">
        <h3 className="font-semibold text-[#e6e6e6] mb-3">Key Findings</h3>
        <ul className="space-y-2">
          {result.top_findings.map((finding, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-0.5 text-[#24bce3] shrink-0">&#x25B8;</span>
              <span className="text-[#cccccc]">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Category breakdown */}
      <div className="og-glass-card p-6 rounded-xl">
        <h3 className="font-semibold text-[#e6e6e6] mb-3">Security Signal Breakdown</h3>
        <CategoryAccordion categories={result.categories} />
      </div>

      {/* Legal disclaimer */}
      <div className="rounded-xl border border-dashed border-[rgba(36,188,227,0.15)] p-4 text-xs text-[#666666] space-y-1">
        <p>
          <strong className="text-[#999999]">Disclaimer:</strong> This analysis is AI-generated and may contain errors.
          It is provided for informational purposes only and should not be the sole basis
          for security decisions. Always conduct your own due diligence before installing
          third-party dependencies.
        </p>
        <p>
          <a
            href={`mailto:security-report@example.com?subject=Incorrect verdict: ${repoFullName}`}
            className="underline hover:text-[#24bce3] transition-colors"
          >
            Report incorrect verdict
          </a>
        </p>
      </div>
    </div>
  );
}
