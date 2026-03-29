"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RepoInputProps {
  onSubmit: (repo: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function RepoInput({ onSubmit, isLoading, disabled }: RepoInputProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit() {
    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError("Please enter a GitHub repository URL");
      return;
    }
    setValidationError("");
    onSubmit(trimmed);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://github.com/owner/repo"
        className="flex-1 bg-[#141e32] border-[rgba(36,188,227,0.15)] text-[#e6e6e6] placeholder:text-[#666666] focus:border-[#24bce3] focus:ring-[rgba(36,188,227,0.3)] h-11"
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled}
        className="h-11 px-6 rounded-lg font-medium text-sm text-white bg-[#24bce3] hover:bg-[#50c9e9] hover:shadow-[0_0_30px_rgba(36,188,227,0.4)] transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
      >
        {isLoading ? "Checking..." : "Check Repository"}
      </button>
      {validationError && (
        <p className="w-full text-sm text-[#f23a3a]">{validationError}</p>
      )}
    </form>
  );
}
