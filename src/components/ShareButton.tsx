"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center h-8 px-3 rounded-lg text-sm font-medium border border-[rgba(36,188,227,0.3)] bg-transparent text-[#bdebf7] hover:bg-[rgba(36,188,227,0.1)] hover:border-[rgba(36,188,227,0.5)] transition-all duration-300 ${className ?? ''}`}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4 text-[#41c885]" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Share result
        </>
      )}
    </button>
  );
}
