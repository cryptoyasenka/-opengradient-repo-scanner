import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Analysis Result | OpenGradient Security Checker',
  description: 'AI-powered security verdict, verified on-chain via OpenGradient TEE.',
  openGraph: {
    title: 'Security Analysis Result | OpenGradient',
    description: 'AI-powered security verdict for a GitHub repository, verified on-chain via TEE.',
  },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
