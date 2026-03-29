import Link from 'next/link';
import { VerdictCard } from '@/components/VerdictCard';
import { ProofBadge } from '@/components/ProofBadge';
import { ShareButton } from '@/components/ShareButton';
import { AlertTriangle } from 'lucide-react';

interface ResultPageProps {
  searchParams: Promise<{
    repo?: string;
    verdict?: string;
    score?: string;
    tx?: string;
    summary?: string;
    date?: string;
  }>;
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const { repo, verdict, score, tx, summary, date } = params;

  if (!verdict || !repo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8" style={{ background: 'linear-gradient(135deg, #0a0f19 0%, #141e32 40%, #0e4b5b 100%)' }}>
        <AlertTriangle className="h-12 w-12 text-[#c49508]" />
        <h1 className="text-xl font-semibold text-[#e6e6e6]">No result found</h1>
        <p className="text-sm text-[#999999] text-center max-w-sm">
          This link does not contain a valid security result. Results are encoded in the URL — the link may be incomplete or expired.
        </p>
        <Link href="/" className="text-sm text-[#24bce3] underline underline-offset-4 hover:text-[#50c9e9] transition-colors">
          Check a repository
        </Link>
      </main>
    );
  }

  const numericScore = parseInt(score ?? '0', 10);
  const verdictLevel = (verdict === 'Safe' || verdict === 'Risky' || verdict === 'Dangerous')
    ? verdict
    : 'Risky';

  return (
    <main className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0a0f19 0%, #141e32 40%, #0e4b5b 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(36, 188, 227, 0.08) 0%, transparent 60%)' }} />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-4">
            <div data-og-logo="wordmark" className="h-6" />
          </div>
          <p className="text-sm text-[#999999]">Security analysis result</p>
          <h1 className="text-lg font-semibold text-[#e6e6e6] break-all">{repo}</h1>
          {date && <p className="text-xs text-[#666666]">Analyzed on {date}</p>}
        </div>

        <VerdictCard
          verdict={verdictLevel}
          score={numericScore}
          summary={summary ?? ''}
        />

        {tx && <ProofBadge txHash={tx} analyzedAt={date ?? new Date().toISOString()} />}

        <div className="rounded-xl border border-dashed border-[rgba(36,188,227,0.15)] p-3 text-xs text-[#666666]">
          This is an AI-assisted surface analysis, not a professional security audit.
          Results may be inaccurate. Always verify critical dependencies independently.
          The operator of this tool accepts no liability for decisions made based on these results.
        </div>

        <div className="flex items-center gap-3">
          <ShareButton />
          <Link href="/" className="text-sm text-[#24bce3] underline underline-offset-4 hover:text-[#50c9e9] transition-colors">
            Check another repository
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(36,188,227,0.1)] text-center">
          <p className="text-xs text-[#666666]">
            Powered by <span className="text-[#24bce3]">OpenGradient</span> TEE
          </p>
        </div>
      </div>
    </main>
  );
}
