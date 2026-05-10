import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepo } from '@/lib/opengradient';
import { fetchRepoData, parseOwnerRepo } from '@/lib/github';
import { checkOrigin, checkRateLimit } from '@/lib/rate-limit';
import type { FetchRepoError } from '@/types/github';
import type { AnalyzeError } from '@/types/verdict';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const origin = checkOrigin(req);
  if (!origin.ok) {
    return NextResponse.json<AnalyzeError>(
      { error: origin.reason, code: 'INVALID_INPUT' },
      { status: 403 }
    );
  }

  const rate = checkRateLimit(req, 'analyze', 10, 60_000);
  if (!rate.ok) {
    return NextResponse.json<AnalyzeError>(
      { error: `Rate limit exceeded. Retry in ${rate.retryAfterSeconds}s.`, code: 'INVALID_INPUT' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    );
  }

  let body: { repo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<AnalyzeError>(
      { error: 'Request body must be JSON with a "repo" field', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  const repoInput = body.repo?.trim();
  if (!repoInput) {
    return NextResponse.json<AnalyzeError>(
      { error: 'Missing required field: repo', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  const parsed = parseOwnerRepo(repoInput);
  if (!parsed) {
    return NextResponse.json<AnalyzeError>(
      { error: 'Invalid GitHub repository URL. Expected format: github.com/owner/repo or owner/repo', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  let repoData;
  try {
    repoData = await fetchRepoData(parsed.owner, parsed.repo);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err) {
      const typedErr = err as FetchRepoError;
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        RATE_LIMITED: 429,
        PRIVATE_REPO: 403,
        API_ERROR: 502,
        INVALID_URL: 400,
      };
      const status = statusMap[typedErr.code] ?? 500;
      return NextResponse.json(typedErr, { status });
    }
    console.error('[analyze] fetch-repo error:', err);
    return NextResponse.json<AnalyzeError>(
      { error: 'Internal server error while fetching repository data', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }

  try {
    const verdict = await analyzeRepo(repoData);
    return NextResponse.json(verdict, { status: 200 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err) {
      const typedErr = err as { code: string; message: string };
      const statusMap: Record<string, number> = {
        INVALID_INPUT: 400,
        AI_PARSE_ERROR: 502,
        AI_API_ERROR: 502,
        TIMEOUT: 504,
        SERVER_ERROR: 500,
      };
      const status = statusMap[typedErr.code] ?? 500;
      return NextResponse.json<AnalyzeError>(
        { error: typedErr.message, code: typedErr.code as AnalyzeError['code'] },
        { status }
      );
    }

    console.error('[analyze] Unexpected error:', err);
    return NextResponse.json<AnalyzeError>(
      { error: 'Internal server error during analysis', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
