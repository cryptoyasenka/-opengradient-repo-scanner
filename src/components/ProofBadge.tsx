"use client";

import { BASESCAN_TX_URL } from "@/lib/web3/config";
import { ExternalLink, ShieldCheck } from "lucide-react";

interface ProofBadgeProps {
  txHash: string;
  analyzedAt: string;
}

function shortenHash(hash: string): string {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function ProofBadge({ txHash, analyzedAt }: ProofBadgeProps) {
  if (!txHash) return null;

  return (
    <div className="og-glass-card flex flex-col gap-2 rounded-xl border-[rgba(36,188,227,0.2)] bg-[rgba(36,188,227,0.04)] p-4 og-glow-pulse">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#24bce3]" />
        <span className="text-sm font-medium text-[#24bce3]">
          Verified by OpenGradient TEE
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#999999] flex-wrap">
        <span>On-chain proof:</span>
        <a
          href={BASESCAN_TX_URL(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-mono text-[#50c9e9] hover:text-[#24bce3] transition-colors"
        >
          {shortenHash(txHash)}
          <ExternalLink className="h-3 w-3" />
        </a>
        <span>·</span>
        <span>Base Sepolia</span>
        <span>·</span>
        <span>INDIVIDUAL_FULL</span>
      </div>

      <p className="text-xs text-[#666666]">
        This verdict was cryptographically recorded on-chain on{" "}
        {new Date(analyzedAt).toLocaleDateString()}. The input and output hashes
        are immutable — this result cannot be retroactively altered.
      </p>
    </div>
  );
}
