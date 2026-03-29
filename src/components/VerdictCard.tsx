import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type VerdictLevel = 'Safe' | 'Risky' | 'Dangerous';

const VERDICT_STYLES: Record<VerdictLevel, { bg: string; text: string; border: string; glow: string }> = {
  Safe: { bg: "bg-[rgba(65,200,133,0.08)]", text: "text-[#41c885]", border: "border-[rgba(65,200,133,0.3)]", glow: "shadow-[0_0_30px_rgba(65,200,133,0.15)]" },
  Risky: { bg: "bg-[rgba(196,149,8,0.08)]", text: "text-[#c49508]", border: "border-[rgba(196,149,8,0.3)]", glow: "shadow-[0_0_30px_rgba(196,149,8,0.15)]" },
  Dangerous: { bg: "bg-[rgba(242,58,58,0.08)]", text: "text-[#f23a3a]", border: "border-[rgba(242,58,58,0.3)]", glow: "shadow-[0_0_30px_rgba(242,58,58,0.15)]" },
};

interface VerdictCardProps {
  verdict: VerdictLevel;
  score: number;
  summary: string;
}

export function VerdictCard({ verdict, score, summary }: VerdictCardProps) {
  const style = VERDICT_STYLES[verdict] ?? VERDICT_STYLES.Risky;

  return (
    <div className={`og-glass-card border-2 ${style.border} ${style.bg} ${style.glow} p-6 rounded-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-4xl font-bold ${style.text}`}>{verdict.toUpperCase()}</h2>
        <div className="text-right">
          <p className="text-sm text-[#999999]">Risk Score</p>
          <p className={`text-4xl font-bold ${style.text}`}>{score}</p>
          <p className="text-xs text-[#666666]">/ 100</p>
        </div>
      </div>
      <div className="og-progress-track h-3 rounded-full">
        <div
          className="og-progress-fill h-full"
          style={{ width: `${score}%` }}
        />
      </div>
      {summary && <p className="mt-4 text-sm text-[#cccccc]">{summary}</p>}
    </div>
  );
}
